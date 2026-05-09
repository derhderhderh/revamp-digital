import { WebsiteAnalyzer } from "@/components/website-analyzer";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Website Health Checker" };

export default function WebsiteHealthPage() {
  return (
    <Section>
      <Eyebrow>Website Health Checker</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">AI-powered design, speed, SEO, mobile, accessibility, and conversion diagnostics.</h1>
      <div className="mt-10"><WebsiteAnalyzer /></div>
    </Section>
  );
}
