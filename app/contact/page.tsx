import { ContactForm } from "@/components/contact-form";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section>
      <Eyebrow>Contact</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Tell us what feels outdated, broken, slow, or hard to manage.</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[.8fr_1fr]">
        <div className="glass rounded-[2rem] p-6">
          <p className="text-xl font-bold">What happens next</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>• You receive a confirmation email.</li>
            <li>• The admin receives a structured notification.</li>
            <li>• High-priority requests can trigger fast follow-up.</li>
            <li>• Your lead can be tracked in Firestore and the dashboard.</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
