import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`discord:${ip}`, 10).ok) return NextResponse.json({ error: "Too many webhook requests." }, { status: 429 });
  const { content } = await request.json();
  if (!process.env.DISCORD_WEBHOOK_URL) return NextResponse.json({ ok: true, dev: true });
  const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: content || "New Revamp Digital activity." })
  });
  return NextResponse.json({ ok: res.ok });
}
