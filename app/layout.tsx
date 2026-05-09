import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AppProviders } from "@/components/app-providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Revamp Digital | Modern Websites That Actually Convert",
    template: "%s | Revamp Digital"
  },
  description:
    "Premium website redesigns, maintenance, optimization, AI website analysis, and ongoing support for small businesses.",
  keywords: [
    "website revamp",
    "small business website redesign",
    "website maintenance",
    "AI website analyzer",
    "local business web design"
  ],
  openGraph: {
    title: "Revamp Digital",
    description: "We bring old websites back to life with modern redesigns, AI insights, and ongoing care.",
    url: "/",
    siteName: "Revamp Digital",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Revamp Digital",
    description: "Modern Websites That Actually Convert"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fbff" },
    { media: "(prefers-color-scheme: dark)", color: "#07111f" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
