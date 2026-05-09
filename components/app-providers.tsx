"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { FloatingCta } from "@/components/floating-cta";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <FloatingCta />
      <CookieConsent />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
