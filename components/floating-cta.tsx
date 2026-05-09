import { Bot, MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingCta() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
      <Link href="/quote" aria-label="Get AI quote" className="grid size-12 place-items-center rounded-full bg-ink text-white shadow-glow transition hover:-translate-y-1 dark:bg-white dark:text-ink">
        <Bot size={20} />
      </Link>
      <Link href="/live-support" aria-label="Open live support" className="grid size-12 place-items-center rounded-full glass transition hover:-translate-y-1">
        <MessageCircle size={20} />
      </Link>
    </div>
  );
}
