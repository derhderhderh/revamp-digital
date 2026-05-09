"use client";

import { useState } from "react";
import { FileDown, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function WebsiteAnalyzer() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/ai/analyze", { method: "POST", body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error || "Analysis failed");
      return;
    }
    setReport(data);
    toast.success("Website health report generated");
  }

  function download() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revamp-digital-website-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass rounded-[2rem] p-5">
      <form action={submit} className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <input name="url" type="url" required placeholder="https://yourbusiness.com" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
        <input name="businessType" placeholder="Business type" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
        <Button disabled={loading}><ScanSearch size={18} />{loading ? "Scanning..." : "Analyze"}</Button>
      </form>
      {report ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
          <div className="rounded-[1.5rem] bg-ink p-6 text-white dark:bg-white dark:text-ink">
            <p className="text-sm uppercase tracking-[0.2em] opacity-70">Health Score</p>
            <p className="mt-4 text-6xl font-black">{report.score}</p>
            <p className="mt-2 text-sm opacity-80">{report.difficulty} revamp difficulty</p>
            <Button onClick={download} variant="secondary" className="mt-6 w-full"><FileDown size={17} />Download Report</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {report.categories?.map((item: any) => (
              <div key={item.name} className="rounded-3xl bg-white/70 p-5 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{item.name}</p>
                  <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{item.score}/100</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
