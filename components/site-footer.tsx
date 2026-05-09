import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 px-4 py-10 dark:border-white/10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-bold">Revamp Digital</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            Modern websites, AI insights, maintenance, and support for small businesses that are ready to look current and convert better.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <Link href="/services">Services</Link>
          <Link href="/maintenance-plans">Maintenance Plans</Link>
          <Link href="/portfolio">Before & After</Link>
          <Link href="/website-health">Website Health Checker</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <Link href="/contact">Contact</Link>
          <Link href="/live-support">Live Support</Link>
          <Link href="/client-portal">Client Portal</Link>
          <Link href="/admin">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
