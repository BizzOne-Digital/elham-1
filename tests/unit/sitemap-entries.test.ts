import { describe, expect, it } from "vitest";
import { buildFallbackSitemap, FALLBACK_SITEMAP_PATHS } from "@/lib/seo/sitemap-entries";
import { absoluteSiteUrl } from "@/lib/seo/site-url";

describe("sitemap entries", () => {
  it("includes core public routes in the fallback sitemap", () => {
    expect(FALLBACK_SITEMAP_PATHS).toContain("/");
    expect(FALLBACK_SITEMAP_PATHS).toContain("/services");
    expect(FALLBACK_SITEMAP_PATHS).toContain("/contact");
    expect(FALLBACK_SITEMAP_PATHS).toContain("/booking");
  });

  it("builds absolute URLs for fallback entries", () => {
    const entries = buildFallbackSitemap();
    expect(entries.some((e) => e.url === absoluteSiteUrl("/"))).toBe(true);
    expect(entries.every((e) => e.url.startsWith("http"))).toBe(true);
  });
});
