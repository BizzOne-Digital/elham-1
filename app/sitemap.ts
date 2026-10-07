import type { MetadataRoute } from "next";
import { buildFallbackSitemap, buildSitemapEntries } from "@/lib/seo/sitemap-entries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await buildSitemapEntries();
  } catch (error) {
    console.error("sitemap generation failed:", error);
    return buildFallbackSitemap();
  }
}
