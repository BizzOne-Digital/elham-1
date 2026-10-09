/** Canonical production hostname (www preferred for SEO). */
export const CANONICAL_SITE_HOST = "www.netbrandit.com";

/** Canonical public site origin (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const trimmed = raw.replace(/\/$/, "");

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "netbrandit.com" || parsed.hostname === CANONICAL_SITE_HOST) {
      parsed.protocol = "https:";
      parsed.hostname = CANONICAL_SITE_HOST;
      parsed.port = "";
      return parsed.origin;
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}

export function absoluteSiteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") {
    return base;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
