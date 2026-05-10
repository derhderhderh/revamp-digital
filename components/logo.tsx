import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)} aria-label="Revamp Digital">
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink shadow-glow dark:bg-white">
        <span className="absolute inset-0 mesh opacity-90" />
        <span className="absolute -right-3 -top-4 size-8 rounded-full bg-white/30 blur-md" />
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="relative z-10 size-8 text-white drop-shadow-sm dark:text-ink"
          fill="none"
        >
          <path
            d="M11 28V10h11.2c4.3 0 7.4 2.7 7.4 6.7 0 2.8-1.5 5-4 6.1L31 28h-6.8l-4.5-4.8h-3V28H11Z"
            fill="currentColor"
          />
          <path
            d="M16.7 18.8h5c1.6 0 2.6-.8 2.6-2.1s-1-2.1-2.6-2.1h-5v4.2Z"
            className="fill-ink dark:fill-white"
          />
          <path
            d="M9 31.5h22"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M27 8.5 32 4l2.5 6.2"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-base font-black text-ink dark:text-white">Revamp</span>
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            Digital
          </span>
        </span>
      ) : null}
    </span>
  );
}
