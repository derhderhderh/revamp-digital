"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  async function submit(formData: FormData) {
    setLoading(true);
    const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(Object.fromEntries(formData.entries())) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error || "Could not send message");
      return;
    }
    toast.success("Message sent. You will receive a confirmation email.");
  }
  return (
    <form action={submit} className="glass grid gap-4 rounded-[2rem] p-5">
      <input name="name" required placeholder="Name" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
      <input name="email" required type="email" placeholder="Email" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
      <input name="website" type="url" placeholder="Website URL" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
      <textarea name="message" required rows={6} placeholder="What should we improve?" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
      <Button disabled={loading}><Send size={18} />{loading ? "Sending..." : "Send message"}</Button>
    </form>
  );
}
