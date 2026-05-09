import { portfolio } from "@/lib/data";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <Section>
      <Eyebrow>Before & After Revamps</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Outdated websites transformed into fast, credible, conversion-focused experiences.</h1>
      <div className="mt-10 grid gap-6">
        {portfolio.map((project) => (
          <article key={project.name} className="glass overflow-hidden rounded-[2rem]">
            <div className="grid min-h-[320px] lg:grid-cols-2">
              <div className="bg-slate-200 p-8 dark:bg-slate-800">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Before</p>
                <div className="mt-8 space-y-3 opacity-60">
                  <div className="h-10 w-2/3 rounded bg-slate-500/40" />
                  <div className="h-4 w-full rounded bg-slate-500/30" />
                  <div className="h-4 w-4/5 rounded bg-slate-500/30" />
                  <div className="h-32 rounded bg-slate-500/25" />
                </div>
                <p className="mt-6 text-sm">{project.before}</p>
              </div>
              <div className="mesh p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-200">After</p>
                <div className="mt-8 rounded-3xl bg-white/80 p-5 shadow-glow dark:bg-ink/80">
                  <div className="h-12 rounded-2xl bg-ink dark:bg-white" />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="h-24 rounded-2xl bg-cyan-500/30" />
                    <div className="h-24 rounded-2xl bg-emerald-500/30" />
                    <div className="h-24 rounded-2xl bg-blue-500/30" />
                  </div>
                </div>
                <p className="mt-6 text-sm">{project.after}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div><h2 className="text-xl font-bold">{project.name}</h2><p className="text-sm text-slate-500">{project.category}</p></div>
              <div className="flex flex-wrap gap-2">{project.stats.map((stat) => <span key={stat} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{stat}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
