import { NextRequest, NextResponse } from "next/server";
import { generateAI, extractJson } from "@/lib/ai/gemini";
import { emailShell, sendEmail } from "@/lib/email/resend";
import { adminDb, Timestamp } from "@/lib/firebase/admin";
import { quoteSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`quote:${ip}`, 5).ok) return NextResponse.json({ error: "Too many quote requests." }, { status: 429 });

  const parsed = quoteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const fallback = {
    priceRange: "$2,500 - $7,500",
    timeline: "3-6 weeks",
    complexityScore: 64,
    recommendedServices: ["Website Revamp", "Speed Optimization", "SEO Improvements", "Monthly Care Plan"],
    summary: "A focused redesign with improved mobile UX, stronger calls to action, technical SEO cleanup, and post-launch support is recommended.",
    improvementSuggestions: ["Clarify homepage offer", "Add proof-driven service pages", "Shorten lead forms", "Improve page speed"]
  };

  const prompt = `Create a quote for Revamp Digital. Return strict JSON with priceRange, timeline, complexityScore number 1-100, recommendedServices array, summary, improvementSuggestions array.
Lead details: ${JSON.stringify(parsed.data)}`;
  const ai = await generateAI(prompt, JSON.stringify(fallback));
  const quote = extractJson(ai, fallback);

  const db = adminDb();
  let id = "dev-quote";
  if (db) {
    const doc = await db.collection("quotes").add({ ...parsed.data, ...quote, status: "new", createdAt: Timestamp.now() });
    id = doc.id;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New AI quote request from ${parsed.data.name}`,
      html: emailShell("New quote request", `<p>${quote.summary}</p><p><strong>Range:</strong> ${quote.priceRange}</p><p><strong>Email:</strong> ${parsed.data.email}</p>`),
      replyTo: parsed.data.email
    });
  }
  await sendEmail({
    to: parsed.data.email,
    subject: "Your Revamp Digital AI quote is ready",
    html: emailShell("Your AI quote is ready", `<p>${quote.summary}</p><p><strong>Estimated range:</strong> ${quote.priceRange}</p><p><strong>Estimated timeline:</strong> ${quote.timeline}</p>`)
  });

  return NextResponse.json({ id, ...quote });
}
