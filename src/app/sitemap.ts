import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { US_STATES } from "@/config/constants";
import { prisma } from "@/lib/prisma";

const STATIC_ROUTES = [
  "/",
  "/loan-calculator",
  "/credit-card-payoff-calculator",
  "/refinance-calculator",
  "/investment-return-calculator",
  "/salary-after-tax",
  "/blog",
  "/about",
  "/disclaimer",
  "/contact"
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((p) => ({
    url: new URL(p, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: p === "/" ? "daily" : "weekly",
    priority: p === "/" ? 1 : p.includes("calculator") ? 0.9 : 0.6
  }));

  const stateEntries: MetadataRoute.Sitemap = US_STATES.map((s) => ({
    url: new URL(`/salary-after-tax/${s.code.toLowerCase()}`, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const blogEntries: MetadataRoute.Sitemap = [];
  const canQueryDb = Boolean(process.env.DATABASE_URL);
  if (canQueryDb) {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, updatedAt: true, publishedAt: true }
      });
      for (const p of posts) {
        blogEntries.push({
          url: new URL(`/blog/${p.slug}`, siteConfig.url).toString(),
          lastModified: p.updatedAt ?? p.publishedAt ?? now,
          changeFrequency: "monthly",
          priority: 0.6
        });
      }
    } catch {
    }
  }

  return [...staticEntries, ...stateEntries, ...blogEntries];
}

