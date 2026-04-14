import type { MetadataRoute } from "next";
import { getAllEditions } from "@/lib/articles";
import { CATEGORIES, categorySlug } from "../../pipeline/categories";
import { brand } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.baseUrl.replace(/\/$/, "");
  const editions = getAllEditions();
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/archive`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const editionRoutes: MetadataRoute.Sitemap = editions.map((e) => ({
    url: `${base}/archive/${e.date}`,
    lastModified: e.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = editions.flatMap((e) =>
    e.articles
      .filter((a) => !a.needs_review)
      .map((a) => ({
        url: `${base}${a.href}`,
        lastModified: a.published_at,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  );

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${categorySlug(c)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...editionRoutes,
    ...articleRoutes,
    ...categoryRoutes,
  ];
}
