import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { emailShell, sendEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  if (!(await requireAdmin()) && process.env.NODE_ENV === "production") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { to, subject, message } = await request.json();
  if (!to || !subject || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const result = await sendEmail({ to, subject, html: emailShell(subject, `<p>${message}</p>`) });
  return NextResponse.json({ ok: true, result });
}
