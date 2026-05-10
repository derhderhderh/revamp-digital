import { ArrowRight, CheckCircle2, Clock3, SearchCheck, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteMockup = {
  headline: string;
  subhead: string;
  nav: string[];
  cta: string;
  notes?: string[];
  sections?: string[];
};

type Project = {
  name: string;
  category: string;
  before: string;
  after: string;
  stats: string[];
  palette?: string;
  oldSite?: SiteMockup;
  newSite?: SiteMockup;
};

const accents: Record<string, string> = {
  cyan: "from-cyan-500 via-blue-500 to-emerald-400",
  emerald: "from-emerald-500 via-cyan-500 to-blue-500",
  coral: "from-orange-400 via-rose-400 to-cyan-500"
};

export function BeforeAfterShowcase({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <article className={cn("glass overflow-hidden rounded-[2rem]", compact && "rounded-3xl")}>
      <div className="grid lg:grid-cols-2">
        <BeforeSite project={project} compact={compact} />
        <AfterSite project={project} compact={compact} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
        <div>
          <h2 className={cn("font-bold", compact ? "text-lg" : "text-xl")}>{project.name}</h2>
          <p className="text-sm text-slate-500">{project.category}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stats.map((stat) => (
            <span key={stat} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {stat}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function BrowserChrome({ children, label, dated = false }: { children: React.ReactNode; label: string; dated?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-sm", dated ? "border-slate-400/40 bg-slate-100" : "border-white/30 bg-white/90 dark:bg-ink/90")}>
      <div className={cn("flex h-9 items-center gap-2 border-b px-3", dated ? "border-slate-300 bg-slate-300/60" : "border-slate-200/70 bg-white/80 dark:border-white/10 dark:bg-white/5")}>
        <span className="size-2.5 rounded-full bg-rose-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-emerald-400" />
        <span className={cn("ml-2 min-w-0 flex-1 truncate rounded px-3 py-1 text-[11px]", dated ? "bg-white/60 text-slate-500" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300")}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function BeforeSite({ project, compact }: { project: Project; compact: boolean }) {
  const site = project.oldSite;
  return (
    <div className="bg-slate-200 p-4 dark:bg-slate-800 sm:p-6">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Before</p>
      <BrowserChrome label={`old-${project.name.toLowerCase().replaceAll(" ", "-")}.com`} dated>
        <div className={cn("min-h-[310px] bg-[#eee7d5] p-4 text-slate-800", compact && "min-h-[250px]")}>
          <div className="mb-4 flex flex-wrap gap-2 border-b-4 border-double border-slate-500 pb-2 font-serif text-[11px] uppercase">
            {site?.nav.map((item) => <span key={item} className="bg-slate-300 px-2 py-1">{item}</span>)}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="font-serif text-3xl font-bold leading-none text-blue-900">{site?.headline}</p>
              <p className="mt-3 max-w-sm font-serif text-sm leading-5">{site?.subhead}</p>
              <button className="mt-4 border-2 border-slate-700 bg-red-700 px-4 py-2 text-xs font-bold uppercase text-white shadow">
                {site?.cta}
              </button>
              <div className="mt-5 space-y-2">
                {site?.notes?.map((note) => (
                  <div key={note} className="flex items-center gap-2 bg-white/50 p-2 text-xs">
                    <span className="size-2 bg-red-600" />
                    {note}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-28 border-4 border-white bg-slate-400/70" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 bg-slate-500/50" />
                <div className="h-16 bg-slate-500/40" />
              </div>
              <div className="h-3 w-5/6 bg-slate-500/50" />
              <div className="h-3 w-2/3 bg-slate-500/40" />
            </div>
          </div>
        </div>
      </BrowserChrome>
      {!compact ? <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{project.before}</p> : null}
    </div>
  );
}

function AfterSite({ project, compact }: { project: Project; compact: boolean }) {
  const site = project.newSite;
  const accent = accents[project.palette || "cyan"] || accents.cyan;
  return (
    <div className="mesh p-4 sm:p-6">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900 dark:text-emerald-100">After</p>
      <BrowserChrome label={`revamped-${project.name.toLowerCase().replaceAll(" ", "-")}.com`}>
        <div className={cn("min-h-[310px] bg-white p-4 text-ink dark:bg-ink dark:text-white", compact && "min-h-[250px]")}>
          <div className="flex items-center justify-between gap-3">
            <div className={cn("h-8 w-28 rounded-full bg-gradient-to-r", accent)} />
            <div className="hidden gap-2 sm:flex">
              {site?.nav.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold dark:bg-white/10">{item}</span>)}
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_.85fr]">
            <div>
              <p className="text-3xl font-black leading-none text-balance">{site?.headline}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{site?.subhead}</p>
              <button className={cn("mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 text-xs font-bold text-white shadow-glow", accent)}>
                {site?.cta} <ArrowRight size={14} />
              </button>
            </div>
            <div className="rounded-3xl bg-slate-100 p-3 dark:bg-white/10">
              <div className={cn("h-28 rounded-2xl bg-gradient-to-br", accent)} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[Smartphone, SearchCheck, Clock3].map((Icon, index) => (
                  <div key={index} className="grid h-14 place-items-center rounded-2xl bg-white dark:bg-ink">
                    <Icon size={17} className="text-cyan-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {(site?.sections || []).map((section) => (
              <div key={section} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
                <CheckCircle2 size={15} className="mb-2 text-emerald-500" />
                {section}
              </div>
            ))}
          </div>
        </div>
      </BrowserChrome>
      {!compact ? <p className="mt-4 text-sm text-slate-800 dark:text-slate-100">{project.after}</p> : null}
    </div>
  );
}
