import { NextRequest, NextResponse } from "next/server";
import { generateAI } from "@/lib/ai/gemini";
import { chatSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`chat:${ip}`, 20).ok) return NextResponse.json({ error: "Too many chat messages." }, { status: 429 });
  const parsed = chatSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const fallback = "I can help with website revamps, maintenance plans, speed, SEO, mobile fixes, AI chatbot setup, and quote requests. For the fastest next step, use the free AI quote tool and share your current website URL.";
  const reply = await generateAI(
    `Answer as Revamp Digital's helpful support assistant. Guide toward quote, maintenance, health checker, or human support when appropriate. History: ${JSON.stringify(parsed.data.history)}. User: ${parsed.data.message}`,
    fallback
  );
  return NextResponse.json({ reply });
}
