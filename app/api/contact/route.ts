import { NextRequest, NextResponse } from "next/server";
import { adminDb, Timestamp } from "@/lib/firebase/admin";
import { emailShell, sendEmail } from "@/lib/email/resend";
import { contactSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`contact:${ip}`, 5).ok) return NextResponse.json({ error: "Too many messages." }, { status: 429 });
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const db = adminDb();
  if (db) await db.collection("supportTickets").add({ ...parsed.data, status: "new", priority: "normal", createdAt: Timestamp.now() });
  if (process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Revamp Digital inquiry from ${parsed.data.name}`,
      replyTo: parsed.data.email,
      html: emailShell("New contact form inquiry", `<p>${parsed.data.message}</p><p><strong>Website:</strong> ${parsed.data.website || "Not provided"}</p>`)
    });
  }
  await sendEmail({
    to: parsed.data.email,
    subject: "We received your Revamp Digital message",
    html: emailShell("Thanks for reaching out", "<p>Your message is in the support queue. We will review your website details and follow up with the next best step.</p>")
  });
  return NextResponse.json({ ok: true });
}
