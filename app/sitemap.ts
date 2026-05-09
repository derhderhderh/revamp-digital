import type { MetadataRoute } from "next";

const routes = [
  "",
  "/services",
  "/portfolio",
  "/quote",
  "/live-support",
  "/dashboard",
  "/about",
  "/contact",
  "/client-portal",
  "/admin",
  "/blog",
  "/maintenance-plans",
  "/website-health"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
