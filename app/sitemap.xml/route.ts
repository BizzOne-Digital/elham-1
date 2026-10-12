import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";
import { serializeSitemapXml } from "@/lib/seo/sitemap-xml";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const entries = await buildSitemapEntries();
  const xml = serializeSitemapXml(entries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
