import { BarChart3, Bot, Gauge, LifeBuoy, MonitorSmartphone, SearchCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";

export const services = [
  { icon: Sparkles, title: "Website Revamps", text: "Rebuild outdated sites into premium, conversion-focused experiences." },
  { icon: Wrench, title: "Monthly Care Plans", text: "Updates, backups, fixes, content edits, and proactive maintenance." },
  { icon: Gauge, title: "Speed Optimization", text: "Core Web Vitals tuning, image optimization, and lean delivery." },
  { icon: SearchCheck, title: "SEO Improvements", text: "Technical SEO, local landing pages, metadata, and content recommendations." },
  { icon: MonitorSmartphone, title: "Mobile Fixes", text: "Responsive repairs, mobile UX cleanup, and tap-friendly workflows." },
  { icon: Bot, title: "AI Automation", text: "Chatbots, AI reports, lead routing, and workflow automation for small teams." },
  { icon: LifeBuoy, title: "Ongoing Support", text: "Fast help desk support, live chat, reports, and client portal visibility." },
  { icon: ShieldCheck, title: "Monitoring", text: "Uptime, performance, update, and security checks with alerts." },
  { icon: BarChart3, title: "Analytics Snapshots", text: "Readable monthly metrics that turn site activity into decisions." }
];

export const portfolio = [
  {
    name: "BrightPath Dental",
    category: "Healthcare",
    before: "Legacy brochure site with slow pages and buried contact forms.",
    after: "Fast local SEO hub with booking CTAs, service pages, and mobile-first navigation.",
    stats: ["+41 speed score", "+63% booking clicks", "+28 SEO points"],
    palette: "cyan",
    oldSite: {
      headline: "Family Dental Care",
      subhead: "Serving the community since 1998",
      nav: ["Home", "About", "Services", "Contact"],
      cta: "Call Us",
      notes: ["Tiny phone number", "No online booking", "Slow image gallery"]
    },
    newSite: {
      headline: "Confident Smiles Start Here",
      subhead: "Modern family dentistry with same-week appointments.",
      nav: ["Services", "Insurance", "Reviews", "Book"],
      cta: "Book Visit",
      sections: ["Emergency care", "Cosmetic dentistry", "New patient offer"]
    }
  },
  {
    name: "Oak & Iron Contractors",
    category: "Home Services",
    before: "Outdated gallery, unclear trust signals, weak quote flow.",
    after: "Project showcase, review-rich landing pages, and AI-backed quote intake.",
    stats: ["2.3s faster load", "+52% form starts", "+34 mobile score"],
    palette: "emerald",
    oldSite: {
      headline: "Quality Construction",
      subhead: "Decks, kitchens, baths, basements",
      nav: ["Welcome", "Photos", "Info", "Email"],
      cta: "Submit",
      notes: ["Low-res gallery", "No reviews", "Quote form hidden"]
    },
    newSite: {
      headline: "Renovations Built Around Your Home",
      subhead: "Licensed contractors with transparent estimates and weekly updates.",
      nav: ["Projects", "Process", "Reviews", "Estimate"],
      cta: "Get Estimate",
      sections: ["Kitchen remodels", "Deck builds", "Bathroom upgrades"]
    }
  },
  {
    name: "Bloom Local Studio",
    category: "Retail",
    before: "Template site with inconsistent branding and low engagement.",
    after: "Premium editorial storefront with events, email capture, and care plan support.",
    stats: ["+47% retention", "+39 SEO points", "+22% repeat visits"],
    palette: "coral",
    oldSite: {
      headline: "Bloom Shop",
      subhead: "Plants gifts workshops more",
      nav: ["Shop", "Classes", "Blog", "Links"],
      cta: "More",
      notes: ["Mixed fonts", "No event flow", "Weak mobile layout"]
    },
    newSite: {
      headline: "Plants, Gifts, and Weekend Workshops",
      subhead: "A warm local shop experience built for browsing and repeat visits.",
      nav: ["Shop", "Workshops", "Events", "Visit"],
      cta: "See Events",
      sections: ["Gift bundles", "Workshop calendar", "Local delivery"]
    }
  }
];

export const testimonials = [
  { name: "Maya Chen", company: "Bloom Local Studio", quote: "Revamp Digital made our site feel like the business we were trying to become." },
  { name: "Evan Brooks", company: "Oak & Iron", quote: "The dashboard and weekly updates are the first web service that actually feels transparent." },
  { name: "Priya Shah", company: "BrightPath Dental", quote: "Our quote requests went up in the first month, and the site finally works beautifully on phones." }
];

export const plans = [
  { name: "Tune-Up", price: "$149/mo", text: "Best for simple sites that need updates and health checks.", features: ["Monthly updates", "Uptime checks", "Email support", "Basic report"] },
  { name: "Growth Care", price: "$349/mo", text: "For businesses that want proactive optimization and content help.", features: ["Everything in Tune-Up", "SEO improvements", "Chat support", "AI maintenance report"] },
  { name: "Scale Partner", price: "$749/mo", text: "For active teams needing priority care, automation, and ongoing campaigns.", features: ["Priority support", "Monthly strategy", "Automation setup", "Advanced reporting"] }
];

export const faqs = [
  { q: "Do I need a full rebuild?", a: "Not always. The AI analyzer and discovery process identify whether a focused revamp, optimization pass, or full redesign gives the best return." },
  { q: "Can you maintain my current website?", a: "Yes. Care plans support existing WordPress, Shopify, Webflow, static, and custom sites depending on access and risk level." },
  { q: "How does the AI quote work?", a: "Gemini reviews your goals, site condition, timeline, pages, and features, then produces a practical price range and recommended scope." },
  { q: "Is live support really live?", a: "When the single admin is online, messages sync through Firestore in real time. Offline conversations fall back to AI help and email transcripts." }
];
