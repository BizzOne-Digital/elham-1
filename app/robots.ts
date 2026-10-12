import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";

const PUBLIC_CRAWL_RULES = {
  allow: ["/", "/api/uploads/"],
  disallow: ["/admin/", "/api/admin/", "/api/auth/", "/api/contact", "/api/leads", "/api/booking", "/api/upload"],
};

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      { userAgent: "*", ...PUBLIC_CRAWL_RULES },
      { userAgent: "Googlebot", ...PUBLIC_CRAWL_RULES },
      { userAgent: "Bingbot", ...PUBLIC_CRAWL_RULES },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
