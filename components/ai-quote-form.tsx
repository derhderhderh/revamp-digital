"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fields = [
  ["name", "Name"],
  ["email", "Email"],
  ["businessType", "Business type"],
  ["currentWebsite", "Current website URL"],
  ["pagesNeeded", "Pages needed"],
  ["features", "Features needed"],
  ["brandingGoals", "Branding goals"],
  ["timeline", "Timeline"],
  ["maintenanceNeeds", "Maintenance needs"]
] as const;

export function AiQuoteForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setResult(null);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/ai/quote", { method: "POST", body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error || "Quote failed");
      return;
    }
    setResult(data);
    toast.success("AI quote generated and saved");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <form action={submit} className="glass grid gap-4 rounded-[2rem] p-5">
        {fields.map(([name, label]) => (
          <label key={name} className="grid gap-2 text-sm font-medium">
            {label}
            <input
              name={name}
              type={name === "email" ? "email" : "text"}
              required={!["currentWebsite"].includes(name)}
              placeholder={label}
              className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </label>
        ))}
        <Button disabled={loading}>
          <Sparkles size={18} />
          {loading ? "Generating..." : "Generate Free AI Quote"}
        </Button>
      </form>
      <div className="glass rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Quote Output</p>
        {result ? (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Range" value={result.priceRange} />
              <Metric label="Timeline" value={result.timeline} />
              <Metric label="Complexity" value={`${result.complexityScore}/100`} />
              <Metric label="Quote ID" value={result.id?.slice(0, 8) || "saved"} />
            </div>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {result.recommendedServices?.map((item: string) => <li key={item}>• {item}</li>)}
            </ul>
            <p className="rounded-2xl bg-slate-900 p-4 text-sm text-white dark:bg-white dark:text-ink">{result.summary}</p>
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
            Your AI-generated scope, price range, recommended services, timeline, and follow-up plan will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
