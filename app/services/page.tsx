import { services } from "@/lib/data";
import { Eyebrow, Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <Section>
      <Eyebrow>Services</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Website redesign, optimization, support, and automation under one roof.</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="glass rounded-3xl p-6">
            <service.icon className="text-cyan-600" />
            <h2 className="mt-5 text-xl font-bold">{service.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.text}</p>
            <Button href="/quote" variant="secondary" className="mt-5">Scope this service</Button>
          </article>
        ))}
      </div>
    </Section>
  );
}
