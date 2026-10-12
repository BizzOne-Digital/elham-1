import { describe, expect, it } from "vitest";
import {
  isAllowedProductionSitemapUrl,
  isPreviewOrLocalHost,
} from "@/lib/seo/crawler";

describe("crawler SEO helpers", () => {
  it("detects Vercel preview hosts", () => {
    expect(isPreviewOrLocalHost("netbrandit.vercel.app")).toBe(true);
    expect(isPreviewOrLocalHost("www.netbrandit.com")).toBe(false);
  });

  it("allows only www production URLs in sitemap", () => {
    expect(isAllowedProductionSitemapUrl("https://www.netbrandit.com/about")).toBe(true);
    expect(isAllowedProductionSitemapUrl("https://netbrandit.vercel.app/")).toBe(false);
    expect(isAllowedProductionSitemapUrl("https://netbrandit.com/")).toBe(false);
  });
});
