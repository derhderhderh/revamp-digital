import { NextRequest, NextResponse } from "next/server";
import { generateAI } from "@/lib/ai/gemini";
import { suggestionsSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  const parsed = suggestionsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const suggestions = await generateAI(
    `Give homepage structure, CTA, SEO keyword, design, conversion, branding, and mobile recommendations for: ${JSON.stringify(parsed.data)}`,
    "Recommended improvements: sharpen the hero offer, add trust proof near CTAs, create local SEO service pages, improve mobile spacing, and add a simple quote path."
  );
  return NextResponse.json({ suggestions });
}
