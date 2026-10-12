import { CANONICAL_SITE_HOST } from "@/lib/seo/site-url";

export function getRequestHostname(hostHeader: string | null): string {
  return hostHeader?.split(":")[0]?.toLowerCase() ?? "";
}

export function isPreviewOrLocalHost(hostname: string): boolean {
  if (!hostname) return false;
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  return hostname.endsWith(".vercel.app");
}

export function isProductionSiteHost(hostname: string): boolean {
  return hostname === CANONICAL_SITE_HOST || hostname === "netbrandit.com";
}

export function isAllowedProductionSitemapUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === CANONICAL_SITE_HOST;
  } catch {
    return false;
  }
}
