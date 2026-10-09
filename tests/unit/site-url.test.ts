import { afterEach, describe, expect, it } from "vitest";
import { absoluteSiteUrl, getSiteUrl } from "@/lib/seo/site-url";

describe("site URL canonicalization", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  it("normalizes apex Netbrandit URL to www", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://netbrandit.com";
    expect(getSiteUrl()).toBe("https://www.netbrandit.com");
    expect(absoluteSiteUrl("/contact")).toBe("https://www.netbrandit.com/contact");
  });

  it("keeps localhost unchanged", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
