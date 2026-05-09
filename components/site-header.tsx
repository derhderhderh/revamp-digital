"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const nav = [
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["AI Quote", "/quote"],
  ["Health Checker", "/website-health"],
  ["Support", "/live-support"],
  ["Blog", "/blog"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-cloud/78 backdrop-blur-xl dark:border-white/10 dark:bg-ink/78">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="grid size-9 place-items-center rounded-2xl bg-ink text-white shadow-glow dark:bg-white dark:text-ink">R</span>
          <span>Revamp Digital</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10">
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <button aria-label="Toggle dark mode" onClick={toggleTheme} className="focus-ring grid size-11 place-items-center rounded-full glass">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button href="/login" variant="ghost">Log in</Button>
          <Button href="/quote">Get Free AI Quote</Button>
        </div>
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="focus-ring grid size-11 place-items-center rounded-full glass lg:hidden">
          <Menu size={20} />
        </button>
      </nav>
      {open ? (
        <div className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm lg:hidden">
          <div className="ml-auto h-full w-[min(88vw,360px)] bg-cloud p-5 shadow-2xl dark:bg-ink">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-bold">Revamp Digital</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full glass">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-2">
              {nav.map(([label, href]) => (
                <Link onClick={() => setOpen(false)} key={href} href={href} className="rounded-2xl px-4 py-3 font-medium hover:bg-slate-900/5 dark:hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <Button href="/quote" className="mt-4">Get Free AI Quote</Button>
              <Button href="/login" variant="secondary">Client Login</Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
