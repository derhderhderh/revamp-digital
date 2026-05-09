import { LiveChat } from "@/components/live-chat";
import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Live Support" };

export default function LiveSupportPage() {
  return (
    <Section>
      <Eyebrow>Live Support</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">Real-time support with AI fallback, uploads, typing indicators, and conversation history.</h1>
      <div className="mt-10"><LiveChat /></div>
    </Section>
  );
}
