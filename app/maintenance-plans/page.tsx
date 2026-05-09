import { plans } from "@/lib/data";
import { Eyebrow, Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Maintenance Plans" };

export default function MaintenancePlansPage() {
  return (
    <Section>
      <Eyebrow>Monthly Care Plans</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Maintenance, monitoring, updates, support, and AI reporting after launch.</h1>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="glass rounded-[2rem] p-6">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-3 text-4xl font-black">{plan.price}</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{plan.text}</p>
            <ul className="mt-5 space-y-2 text-sm">{plan.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
            <Button href="/quote" className="mt-6 w-full">Request this plan</Button>
          </article>
        ))}
      </div>
    </Section>
  );
}
