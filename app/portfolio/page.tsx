import { portfolio } from "@/lib/data";
import { Eyebrow, Section } from "@/components/ui/section";
import { BeforeAfterShowcase } from "@/components/before-after-showcase";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <Section>
      <Eyebrow>Before & After Revamps</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Outdated websites transformed into fast, credible, conversion-focused experiences.</h1>
      <div className="mt-10 grid gap-6">
        {portfolio.map((project) => (
          <BeforeAfterShowcase key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
