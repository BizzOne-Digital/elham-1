import { describe, expect, it } from "vitest";
import { ensureIndexableSitemap, sitemapLocUrl } from "@/lib/seo/sitemap-entries";
import { serializeSitemapXml } from "@/lib/seo/sitemap-xml";

describe("sitemap XML", () => {
  it("serializes valid urlset XML", () => {
    const xml = serializeSitemapXml([
      {
        url: "https://www.netbrandit.com/",
        lastModified: new Date("2026-01-15T12:00:00.000Z"),
        changeFrequency: "weekly",
        priority: 1,
      },
    ]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain("<loc>https://www.netbrandit.com/</loc>");
    expect(xml.trim().endsWith("</urlset>")).toBe(true);
    expect(xml.match(/<url>/g)?.length).toBe(1);
  });

  it("escapes special characters in loc", () => {
    const xml = serializeSitemapXml([
      {
        url: "https://www.netbrandit.com/foo?a=1&b=2",
        lastModified: new Date(),
      },
    ]);
    expect(xml).toContain("<loc>https://www.netbrandit.com/foo?a=1&amp;b=2</loc>");
  });

  it("uses trailing slash for homepage loc", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.netbrandit.com";
    expect(sitemapLocUrl("/")).toBe("https://www.netbrandit.com/");
  });

  it("falls back when production filter removes all entries", () => {
    process.env.VERCEL_ENV = "production";
    const result = ensureIndexableSitemap([
      { url: "https://netbrandit.vercel.app/", lastModified: new Date() },
    ]);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((e) => e.url.startsWith("https://www.netbrandit.com"))).toBe(true);
    delete process.env.VERCEL_ENV;
  });
});
