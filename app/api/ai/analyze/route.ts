import { NextRequest, NextResponse } from "next/server";
import { generateAI, extractJson } from "@/lib/ai/gemini";
import { adminDb, Timestamp } from "@/lib/firebase/admin";
import { analyzeSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`analyze:${ip}`, 6).ok) return NextResponse.json({ error: "Too many analysis requests." }, { status: 429 });

  const parsed = analyzeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const fallback = {
    score: 76,
    difficulty: "Moderate",
    categories: [
      { name: "Design quality", score: 72, recommendation: "Modernize visual hierarchy, spacing, typography, and trust signals above the fold." },
      { name: "Speed", score: 80, recommendation: "Compress hero media, lazy-load below-fold assets, and reduce third-party scripts." },
      { name: "SEO", score: 70, recommendation: "Add service-specific metadata, local schema, internal links, and intent-matched headings." },
      { name: "Mobile friendliness", score: 78, recommendation: "Improve tap target spacing, simplify navigation, and shorten mobile forms." },
      { name: "Accessibility", score: 74, recommendation: "Increase contrast, add labels, improve focus states, and validate heading order." },
      { name: "Conversion optimization", score: 82, recommendation: "Clarify CTA sequence, add social proof, and reduce friction around quote requests." }
    ],
    suggestions: ["Build a dedicated landing page for the highest-value service.", "Add a sticky CTA on mobile.", "Publish proof-oriented case studies."],
    screenshotPreview: `https://image.thum.io/get/width/1200/${parsed.data.url}`
  };

  const prompt = `Analyze this ${parsed.data.businessType} website for a Revamp Digital prospect: ${parsed.data.url}.
Return strict JSON with score number, difficulty string, categories array with name score recommendation, suggestions array, and screenshotPreview string.
Judge design quality, speed, SEO, mobile friendliness, branding consistency, accessibility, and conversion optimization.`;
  const ai = await generateAI(prompt, JSON.stringify(fallback));
  const report = extractJson(ai, fallback);

  const db = adminDb();
  let id = "dev-analysis";
  if (db) {
    const doc = await db.collection("websiteAnalyses").add({ ...report, ...parsed.data, createdAt: Timestamp.now(), source: "gemini" });
    id = doc.id;
  }
  return NextResponse.json({ id, ...report });
}
