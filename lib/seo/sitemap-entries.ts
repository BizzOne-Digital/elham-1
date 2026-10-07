import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/connect";
import { ROUTES } from "@/lib/constants";
import { absoluteSiteUrl } from "@/lib/seo/site-url";
import { BlogPost } from "@/models/BlogPost";
import { GalleryProject } from "@/models/GalleryProject";
import { Page } from "@/models/Page";
import { Service } from "@/models/Service";

const INDEXABLE_QUERY = { status: "published", "seo.noIndex": { $ne: true } };

/** Fallback when MongoDB is unavailable (local dev / build without DB). */
export const FALLBACK_SITEMAP_PATHS: string[] = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.services,
  ROUTES.pricing,
  ROUTES.gallery,
  ROUTES.testimonials,
  ROUTES.faqs,
  ROUTES.blog,
  ROUTES.booking,
  ROUTES.contact,
  ROUTES.privacy,
  ROUTES.terms,
];

function pagePathFromSlug(slug: string): string {
  if (slug === "home") {
    return ROUTES.home;
  }
  return `/${slug}`;
}

function entryForPath(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteSiteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const item of entries) {
    const existing = byUrl.get(item.url);
    if (!existing) {
      byUrl.set(item.url, item);
      continue;
    }
    const existingTime = existing.lastModified ? new Date(existing.lastModified).getTime() : 0;
    const itemTime = item.lastModified ? new Date(item.lastModified).getTime() : 0;
    if (itemTime >= existingTime) {
      byUrl.set(item.url, item);
    }
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export function buildFallbackSitemap(): MetadataRoute.Sitemap {
  return FALLBACK_SITEMAP_PATHS.map((path) =>
    entryForPath(path, new Date(), path === ROUTES.home ? 1 : 0.7, path === ROUTES.home ? "weekly" : "monthly"),
  );
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const [pages, services, projects, posts] = await Promise.all([
      Page.find(INDEXABLE_QUERY).select("slug updatedAt").lean(),
      Service.find(INDEXABLE_QUERY).select("slug updatedAt").lean(),
      GalleryProject.find(INDEXABLE_QUERY).select("slug updatedAt").lean(),
      BlogPost.find(INDEXABLE_QUERY).select("slug updatedAt publishedAt").lean(),
    ]);

    const entries: MetadataRoute.Sitemap = [];

    for (const page of pages) {
      const path = pagePathFromSlug(page.slug);
      entries.push(
        entryForPath(
          path,
          page.updatedAt ?? new Date(),
          page.slug === "home" ? 1 : 0.8,
          page.slug === "home" ? "weekly" : "monthly",
        ),
      );
    }

    for (const service of services) {
      entries.push(
        entryForPath(
          `/services/${service.slug}`,
          service.updatedAt ?? new Date(),
          0.8,
          "monthly",
        ),
      );
    }

    for (const project of projects) {
      entries.push(
        entryForPath(
          `/gallery/${project.slug}`,
          project.updatedAt ?? new Date(),
          0.6,
          "monthly",
        ),
      );
    }

    for (const post of posts) {
      entries.push(
        entryForPath(
          `/blog/${post.slug}`,
          post.updatedAt ?? post.publishedAt ?? new Date(),
          0.6,
          "monthly",
        ),
      );
    }

    if (entries.length === 0) {
      return buildFallbackSitemap();
    }

    return dedupeSitemap(entries);
  } catch {
    return buildFallbackSitemap();
  }
}
