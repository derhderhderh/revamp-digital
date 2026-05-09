import { ArrowRight, CheckCircle2, MousePointer2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animated";
import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/section";
import { faqs, plans, portfolio, services, testimonials } from "@/lib/data";
import { WebsiteAnalyzer } from "@/components/website-analyzer";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-grid bg-[size:48px_48px] opacity-70" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-800 dark:text-cyan-200">
              <Sparkles size={16} /> AI-powered website revamps for small businesses
            </div>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-black tracking-normal text-ink dark:text-white sm:text-6xl lg:text-7xl">
              Modern Websites That Actually Convert
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Revamp Digital redesigns outdated websites, improves speed and SEO, and keeps your business supported with AI insights, live care, and transparent dashboards.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/quote">Get Free AI Quote <ArrowRight size={18} /></Button>
              <Button href="/portfolio" variant="secondary">See Before & After</Button>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="relative">
            <div className="mesh animate-float rounded-[2.5rem] p-1 shadow-glow">
              <div className="glass rounded-[2.25rem] p-5">
                <div className="rounded-[1.75rem] bg-ink p-5 text-white dark:bg-white dark:text-ink">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Website Health</p>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200 dark:text-emerald-700">Live AI</span>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {["SEO", "Speed", "Mobile"].map((label, i) => (
                      <div key={label} className="rounded-2xl bg-white/10 p-4 dark:bg-slate-900/10">
                        <p className="text-xs opacity-70">{label}</p>
                        <p className="mt-2 text-2xl font-black">{[86, 94, 91][i]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    {["CTA placement improved", "Images compressed", "Local SEO schema added"].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 dark:bg-slate-900/10">
                        <CheckCircle2 size={18} className="text-emerald-300" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-2xl font-black">2.8x</p><p className="text-xs">Lead lift</p></div>
                  <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-2xl font-black">24/7</p><p className="text-xs">Monitoring</p></div>
                  <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-2xl font-black">98</p><p className="text-xs">Care score</p></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section id="services">
        <Reveal>
          <Eyebrow>Core Services</Eyebrow>
          <h2 className="max-w-3xl text-4xl font-black text-balance">Everything an outdated small-business website needs to become a modern growth system.</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.03}>
              <div className="glass h-full rounded-3xl p-6 transition hover:-translate-y-1">
                <service.icon className="text-cyan-600" size={24} />
                <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <Eyebrow>Free AI Website Analyzer</Eyebrow>
          <h2 className="max-w-3xl text-4xl font-black text-balance">Get a website health score, modernization plan, and downloadable report.</h2>
        </Reveal>
        <div className="mt-8"><WebsiteAnalyzer /></div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>Before & After</Eyebrow>
            <h2 className="text-4xl font-black text-balance">Visual revamps with measurable business improvements.</h2>
            <Button href="/portfolio" className="mt-6">Explore portfolio <MousePointer2 size={18} /></Button>
          </Reveal>
          <div className="grid gap-4">
            {portfolio.map((project, index) => (
              <Reveal key={project.name} delay={index * 0.06}>
                <div className="glass rounded-3xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-bold">{project.name}</p><p className="text-sm text-slate-500">{project.category}</p></div>
                    <div className="flex flex-wrap gap-2">{project.stats.map((stat) => <span key={stat} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{stat}</span>)}</div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <p className="rounded-2xl bg-rose-500/10 p-4 text-sm text-slate-700 dark:text-slate-200">{project.before}</p>
                    <p className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-slate-700 dark:text-slate-200">{project.after}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="glass rounded-[2rem] p-6">
              <p className="text-lg font-bold">{plan.name}</p>
              <p className="mt-3 text-4xl font-black">{plan.price}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{plan.text}</p>
              <ul className="mt-5 space-y-2 text-sm">{plan.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="text-4xl font-black">Trusted by practical small-business teams.</h2>
            <div className="mt-6 space-y-3">{testimonials.map((item) => <div key={item.name} className="glass rounded-3xl p-5"><p className="text-slate-700 dark:text-slate-200">"{item.quote}"</p><p className="mt-3 text-sm font-semibold">{item.name}, {item.company}</p></div>)}</div>
          </div>
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <div className="space-y-3">{faqs.map((faq) => <details key={faq.q} className="glass rounded-3xl p-5"><summary className="cursor-pointer font-bold">{faq.q}</summary><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{faq.a}</p></details>)}</div>
          </div>
        </div>
      </Section>
    </>
  );
}
