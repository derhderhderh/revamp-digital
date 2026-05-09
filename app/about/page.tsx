import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Section>
      <Eyebrow>About Revamp Digital</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Built for small businesses that need their website to stop feeling like technical debt.</h1>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {["Premium redesigns without enterprise bloat.", "AI insights that turn vague website problems into clear next steps.", "Ongoing care that keeps your site fast, current, and supported."].map((text) => (
          <div key={text} className="glass rounded-3xl p-6 text-lg font-semibold">{text}</div>
        ))}
      </div>
    </Section>
  );
}
