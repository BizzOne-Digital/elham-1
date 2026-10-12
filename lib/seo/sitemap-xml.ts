import type { MetadataRoute } from "next";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastMod(lastModified: MetadataRoute.Sitemap[number]["lastModified"]): string | null {
  if (!lastModified) {
    return null;
  }
  const date = lastModified instanceof Date ? lastModified : new Date(lastModified);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export function serializeSitemapXml(entries: MetadataRoute.Sitemap): string {
  if (entries.length === 0) {
    throw new Error("sitemap must contain at least one URL");
  }

  const body = entries
    .map((entry) => {
      const loc = escapeXml(entry.url);
      const lastmod = formatLastMod(entry.lastModified);
      const parts = [`<loc>${loc}</loc>`];
      if (lastmod) {
        parts.push(`<lastmod>${lastmod}</lastmod>`);
      }
      if (entry.changeFrequency) {
        parts.push(`<changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`);
      }
      if (entry.priority != null) {
        parts.push(`<priority>${entry.priority}</priority>`);
      }
      return `<url>${parts.join("")}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
