import { Dashboard } from "@/components/dashboard";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Section>
      <Eyebrow>Client Dashboard</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Track requests, reports, files, support messages, and project activity.</h1>
      <div className="mt-10"><Dashboard /></div>
    </Section>
  );
}
