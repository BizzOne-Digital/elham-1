import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import type { Section } from "@/models/shared";
import { getFallbackPage } from "@/lib/data/fallbacks";
import { serializeDoc, serializeDocs } from "@/lib/data/serialize";
import { resolveStockImage, STOCK_IMAGES } from "@/lib/stock-images";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

function normalizeSectionData(data: Record<string, unknown>): Record<string, unknown> {
  const next = { ...data };

  for (const key of ["image", "backgroundImage", "deviceImage"]) {
    if (typeof next[key] === "string") {
      const raw = next[key] as string;
      if (raw.startsWith("/images/")) {
        next[key] = raw;
      } else {
        next[key] = resolvePublicImageUrl(resolveStockImage(raw, STOCK_IMAGES.hero));
      }
    }
  }

  if (Array.isArray(next.images)) {
    next.images = (next.images as string[]).map((url, index) =>
      resolvePublicImageUrl(
        resolveStockImage(
          url,
          [STOCK_IMAGES.team, STOCK_IMAGES.storefront, STOCK_IMAGES.social][index] ?? STOCK_IMAGES.webDesign,
        ),
      ),
    );
  }

  return next;
}

function normalizeSections(sections: Section[]): Section[] {
  return sections.map((section) => ({
    ...section,
    data: normalizeSectionData(section.data as Record<string, unknown>),
  }));
}

export interface PageData {
  _id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  sections: Section[];
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
  };
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    await connectDB();
    const page = await Page.findOne({ slug, status: "published" }).lean();
    if (page) {
      const data = serializeDoc(page) as PageData;
      return { ...data, sections: normalizeSections(data.sections ?? []) };
    }
  } catch {
    // Database unavailable — use fallback content
  }

  const fallback = getFallbackPage(slug);
  if (!fallback) return null;

  return {
    slug,
    title: fallback.title,
    subtitle: fallback.subtitle,
    sections: normalizeSections(fallback.sections),
  };
}

export async function getPublishedPages(): Promise<PageData[]> {
  try {
    await connectDB();
    const pages = await Page.find({ status: "published" })
      .sort({ sortOrder: 1 })
      .lean();
    return serializeDocs<PageData>(pages);
  } catch {
    return [];
  }
}

export function sortSections(sections: Section[]): Section[] {
  return [...sections]
    .filter((s) => s.enabled !== false)
    .sort((a, b) => a.order - b.order);
}
