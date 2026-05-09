import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type MailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: MailPayload) {
  if (!resend) {
    console.info("[email:fallback]", { to, subject });
    return { id: "email_fallback_dev" };
  }

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Revamp Digital <onboarding@resend.dev>",
    to,
    subject,
    html,
    replyTo
  });

  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export function emailShell(title: string, body: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8fbff;padding:32px;color:#07111f">
      <div style="max-width:640px;margin:auto;background:#ffffff;border:1px solid #dbe7f3;border-radius:24px;padding:28px">
        <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#0e7490">Revamp Digital</p>
        <h1 style="font-size:28px;margin:0 0 16px">${title}</h1>
        <div style="line-height:1.65;color:#334155">${body}</div>
      </div>
    </div>
  `;
}
