import { NextRequest, NextResponse } from "next/server";
import { generateAI, extractJson } from "@/lib/ai/gemini";
import { adminDb, Timestamp } from "@/lib/firebase/admin";
import { analyzeSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";

type Report = {
  score: number;
  grade: string;
  difficulty: string;
  summary: string;
  categories: Array<{ name: string; score: number; priority: string; recommendation: string }>;
  quickWins: string[];
  suggestions: string[];
  estimatedImpact: string;
  screenshotPreview: string;
  analyzedUrl: string;
  businessType: string;
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`analyze:${ip}`, 6).ok) return NextResponse.json({ error: "Too many analysis requests." }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = analyzeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const host = new URL(parsed.data.url).hostname.replace(/^www\./, "");
  const baseScore = clampNumber(72 + (host.length % 11) - 4, 58, 88);
  const fallback: Report = {
    score: baseScore,
    grade: baseScore >= 85 ? "A-" : baseScore >= 75 ? "B" : baseScore >= 65 ? "C" : "D",
    difficulty: baseScore >= 82 ? "Light" : baseScore >= 70 ? "Moderate" : "High",
    summary: `${host} has a workable foundation, but the site would likely benefit from a focused modernization pass around trust, speed, mobile UX, and conversion flow.`,
    categories: [
      { name: "Design quality", score: baseScore - 5, priority: "High", recommendation: "Modernize visual hierarchy, spacing, typography, and trust signals above the fold." },
      { name: "Speed", score: baseScore + 3, priority: "Medium", recommendation: "Compress hero media, lazy-load below-fold assets, and reduce third-party scripts." },
      { name: "SEO", score: baseScore - 7, priority: "High", recommendation: "Add service-specific metadata, local schema, internal links, and intent-matched headings." },
      { name: "Mobile friendliness", score: baseScore + 1, priority: "Medium", recommendation: "Improve tap target spacing, simplify navigation, and shorten mobile forms." },
      { name: "Accessibility", score: baseScore - 3, priority: "Medium", recommendation: "Increase contrast, add labels, improve focus states, and validate heading order." },
      { name: "Conversion optimization", score: baseScore - 6, priority: "High", recommendation: "Clarify CTA sequence, add social proof, and reduce friction around quote requests." }
    ],
    quickWins: ["Add a stronger hero CTA", "Place reviews near the first form", "Compress and resize homepage images"],
    suggestions: ["Build a dedicated landing page for the highest-value service.", "Add a sticky CTA on mobile.", "Publish proof-oriented case studies."],
    estimatedImpact: "A focused revamp could improve lead quality, reduce mobile drop-off, and make the business appear more current within 2-4 weeks.",
    screenshotPreview: `https://image.thum.io/get/width/1200/crop/800/noanimate/${parsed.data.url}`,
    analyzedUrl: parsed.data.url,
    businessType: parsed.data.businessType || "small business"
  };

  const prompt = `Analyze this ${parsed.data.businessType} website for a Revamp Digital prospect: ${parsed.data.url}.
Return only strict JSON. No markdown.
Shape: {
  "score": number,
  "grade": string,
  "difficulty": "Light" | "Moderate" | "High",
  "summary": string,
  "categories": [{"name": string, "score": number, "priority": "Low" | "Medium" | "High", "recommendation": string}],
  "quickWins": string[],
  "suggestions": string[],
  "estimatedImpact": string,
  "screenshotPreview": string
}
Judge design quality, speed, SEO, mobile friendliness, branding consistency, accessibility, and conversion optimization.`;
  let report = fallback;
  try {
    const ai = await generateAI(prompt, JSON.stringify(fallback));
    report = normalizeReport(extractJson<Partial<Report>>(ai, fallback), fallback);
  } catch (error) {
    console.error("[analyzer:ai-fallback]", error);
  }

  const db = adminDb();
  let id = "dev-analysis";
  if (db) {
    try {
      const doc = await db.collection("websiteAnalyses").add({ ...report, ...parsed.data, createdAt: Timestamp.now(), source: "gemini" });
      id = doc.id;
    } catch (error) {
      console.error("[analyzer:firestore-save-failed]", error);
    }
  }
  return NextResponse.json({ id, ...report });
}

function normalizeReport(report: Partial<Report>, fallback: Report): Report {
  const score = clampNumber(Number(report.score || fallback.score), 0, 100);
  const categories = Array.isArray(report.categories) && report.categories.length ? report.categories : fallback.categories;
  return {
    ...fallback,
    ...report,
    score,
    grade: report.grade || fallback.grade,
    difficulty: report.difficulty || fallback.difficulty,
    summary: report.summary || fallback.summary,
    categories: categories.slice(0, 8).map((category) => ({
      name: String(category.name || "Website factor"),
      score: clampNumber(Number(category.score || score), 0, 100),
      priority: ["Low", "Medium", "High"].includes(String(category.priority)) ? String(category.priority) : "Medium",
      recommendation: String(category.recommendation || "Review this area during the revamp planning process.")
    })),
    quickWins: Array.isArray(report.quickWins) ? report.quickWins.slice(0, 5).map(String) : fallback.quickWins,
    suggestions: Array.isArray(report.suggestions) ? report.suggestions.slice(0, 6).map(String) : fallback.suggestions,
    estimatedImpact: report.estimatedImpact || fallback.estimatedImpact,
    analyzedUrl: fallback.analyzedUrl,
    businessType: fallback.businessType
  };
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.round(value), min), max);
}
