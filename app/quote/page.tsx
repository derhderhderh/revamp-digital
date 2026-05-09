import { AiQuoteForm } from "@/components/ai-quote-form";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Free AI Quote" };

export default function QuotePage() {
  return (
    <Section>
      <Eyebrow>AI Free Quote Tool</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Get a practical revamp scope, price range, timeline, and support plan in minutes.</h1>
      <p className="mt-5 max-w-2xl text-slate-600 dark:text-slate-300">Every quote request is saved to Firestore, emailed to the admin, and can be followed up from the dashboard.</p>
      <div className="mt-10"><AiQuoteForm /></div>
    </Section>
  );
}
