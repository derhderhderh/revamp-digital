"use client";

import { useState } from "react";
import { CheckCircle2, FileDown, Gauge, ScanSearch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Category = {
  name: string;
  score: number;
  priority?: "Low" | "Medium" | "High";
  recommendation: string;
};

type Report = {
  id: string;
  score: number;
  grade?: string;
  difficulty: string;
  summary?: string;
  analyzedUrl?: string;
  businessType?: string;
  estimatedImpact?: string;
  categories?: Category[];
  quickWins?: string[];
  suggestions?: string[];
  screenshotPreview?: string;
};

export function WebsiteAnalyzer() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Analysis failed");
        return;
      }
      setReport(data);
      toast.success("Website health report generated");
    } catch {
      toast.error("Could not reach the analyzer. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!report) return;
    const rows = report.categories
      ?.map(
        (item) =>
          `<tr><td>${escapeHtml(item.name)}</td><td>${item.score}/100</td><td>${escapeHtml(item.priority || "Medium")}</td><td>${escapeHtml(item.recommendation)}</td></tr>`
      )
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Revamp Digital Website Health Report</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#07111f}h1{font-size:32px}table{border-collapse:collapse;width:100%;margin-top:24px}td,th{border:1px solid #dbe3ef;padding:12px;text-align:left}.score{font-size:56px;font-weight:900}.pill{display:inline-block;background:#e6fffb;color:#0f766e;padding:6px 10px;border-radius:999px}</style></head><body><p class="pill">Revamp Digital</p><h1>Website Health Report</h1><p>${escapeHtml(report.analyzedUrl || "")}</p><div class="score">${report.score}/100 ${escapeHtml(report.grade || "")}</div><p><strong>Difficulty:</strong> ${escapeHtml(report.difficulty)}</p><p>${escapeHtml(report.summary || "")}</p><h2>Recommendations</h2><table><thead><tr><th>Area</th><th>Score</th><th>Priority</th><th>Recommendation</th></tr></thead><tbody>${rows}</tbody></table><h2>Quick Wins</h2><ul>${report.quickWins?.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || ""}</ul><h2>Estimated Impact</h2><p>${escapeHtml(report.estimatedImpact || "")}</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revamp-digital-website-health-report.html";
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

      {loading ? <AnalyzerSkeleton /> : null}

      {report && !loading ? (
        <div className="mt-6 grid gap-5 xl:grid-cols-[300px_1fr]">
          <div className="rounded-[1.5rem] bg-ink p-6 text-white dark:bg-white dark:text-ink">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.2em] opacity-70">Health Score</p>
              <Gauge size={22} className="text-cyan-300 dark:text-cyan-700" />
            </div>
            <div className="mt-5 flex items-end gap-3">
              <p className="text-7xl font-black">{report.score}</p>
              <p className="pb-3 text-2xl font-black opacity-70">/100</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold dark:bg-ink/10">Grade {report.grade || "B"}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold dark:bg-ink/10">{report.difficulty} revamp</span>
            </div>
            <p className="mt-5 text-sm leading-6 opacity-80">{report.summary}</p>
            <Button onClick={download} variant="secondary" className="mt-6 w-full"><FileDown size={17} />Download Report</Button>
          </div>

          <div className="space-y-4">
            {report.screenshotPreview ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={report.screenshotPreview} alt="Website screenshot preview" className="h-56 w-full object-cover object-top" />
              </div>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2">
              {report.categories?.map((item) => (
                <div key={item.name} className="rounded-3xl bg-white/70 p-5 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{item.name}</p>
                    <span className={scoreClass(item.score)}>{item.score}/100</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.priority || "Medium"} priority</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.recommendation}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ReportList title="Quick Wins" icon="check" items={report.quickWins || []} />
              <ReportList title="Modernization Plan" icon="spark" items={report.suggestions || []} />
            </div>
            {report.estimatedImpact ? (
              <div className="rounded-3xl bg-emerald-500/10 p-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <p className="mb-2 font-bold text-emerald-700 dark:text-emerald-300">Estimated Impact</p>
                {report.estimatedImpact}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AnalyzerSkeleton() {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr]">
      <div className="h-72 animate-pulse rounded-[1.5rem] bg-slate-200 dark:bg-white/10" />
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/10" />)}
      </div>
    </div>
  );
}

function ReportList({ title, items, icon }: { title: string; items: string[]; icon: "check" | "spark" }) {
  const Icon = icon === "check" ? CheckCircle2 : Sparkles;
  return (
    <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/5">
      <p className="font-bold">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Icon size={17} className="mt-0.5 shrink-0 text-cyan-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function scoreClass(score: number) {
  if (score >= 85) return "text-sm font-semibold text-emerald-700 dark:text-emerald-300";
  if (score >= 70) return "text-sm font-semibold text-cyan-700 dark:text-cyan-300";
  return "text-sm font-semibold text-amber-700 dark:text-amber-300";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return entities[character] || character;
  });
}
