import { Dashboard } from "@/components/dashboard";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Admin Portal" };

export default function AdminPage() {
  return (
    <Section>
      <Eyebrow>Single Admin Portal</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Manage quotes, live chats, client work, reports, notifications, and content.</h1>
      <div className="mt-10"><Dashboard admin /></div>
    </Section>
  );
}
