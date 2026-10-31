// F15, F17, F18: one canonical base URL, real lastmod, www host
// File: app/sitemap.ts  (and lib/site.ts)

// lib/site.ts: the single source of truth, also used by metadataBase,
// openGraph.url and the redirect rule in next.config.js
export const SITE_URL = "https://www.cynbit.in";

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // regenerate hourly instead of on every request

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, cases, jobs] = await Promise.all([
    getPosts(), getCaseStudies(), getJobs(), // placeholder data sources
  ]);

  const core = ["", "/story", "/team", "/services", "/products", "/contact",
                "/case-studies", "/careers", "/blog", "/bitelevate", "/diaries"]
    .map((p) => ({ url: `${SITE_URL}${p}` })); // omit lastmod if unknown

  const content = [
    ...posts.map((x) => ({ url: `${SITE_URL}/blog/${x.slug}`, lastModified: x.updatedAt })),
    ...cases.map((x) => ({ url: `${SITE_URL}/case-studies/${x.slug}`, lastModified: x.updatedAt })),
    ...jobs.map((x) => ({ url: `${SITE_URL}/careers/${x.slug}`, lastModified: x.updatedAt })),
  ];
  return [...core, ...content];
}
