import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { emailShell, sendEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  const { chatId, email } = await request.json();
  if (!chatId || !email) return NextResponse.json({ error: "chatId and email are required" }, { status: 400 });
  const db = adminDb();
  const messages = db
    ? (await db.collection("chats").doc(chatId).collection("messages").orderBy("createdAt", "asc").get()).docs.map((doc) => doc.data())
    : [];
  await sendEmail({
    to: email,
    subject: "Your Revamp Digital support transcript",
    html: emailShell("Support transcript", `<pre style="white-space:pre-wrap">${messages.map((m: any) => `${m.sender}: ${m.text}`).join("\n") || "No messages found in local fallback mode."}</pre>`)
  });
  return NextResponse.json({ ok: true });
}
