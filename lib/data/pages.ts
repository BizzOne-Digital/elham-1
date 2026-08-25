import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import type { Section } from "@/models/shared";
import { getFallbackPage } from "@/lib/data/fallbacks";
import { serializeDoc, serializeDocs } from "@/lib/data/serialize";
import { resolveStockImage, STOCK_IMAGES } from "@/lib/stock-images";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";
import { PRICING_PROMO_HEADING, PRIMARY_CTA } from "@/lib/constants";

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

const HOME_GROWTH_SECTION_IDS = new Set(["home-cta", "home-lead"]);

function isRemovedHomeGrowthSection(section: Section): boolean {
  if (HOME_GROWTH_SECTION_IDS.has(section.id)) return true;
  if (section.type === "leadForm") return true;

  const data = section.data as Record<string, unknown>;
  const heading = String(data.heading ?? data.title ?? "").trim().toLowerCase();

  if (!heading) return false;

  return (
    heading.includes("practical growth plan") ||
    heading.includes("ready for a practical") ||
    (heading.includes("growth plan") && !heading.includes("custom website packages"))
  );
}

const HOME_PRICING_PROMO_DATA: Record<string, unknown> = {
  heading: PRICING_PROMO_HEADING,
  body: "Final price depends on scope and is confirmed after discovery.",
  cta: PRIMARY_CTA,
};

function normalizeHomeSections(sections: Section[]): Section[] {
  const withoutGrowthPlan = sections.filter((section) => !isRemovedHomeGrowthSection(section));
  const pricingSections = withoutGrowthPlan.filter((section) => section.id === "home-pricing");
  const otherSections = withoutGrowthPlan.filter((section) => section.id !== "home-pricing");
  const maxOrder = otherSections.reduce((max, section) => Math.max(max, section.order), 0);

  if (pricingSections.length === 0) {
    return [
      ...otherSections,
      {
        id: "home-pricing",
        type: "cta",
        order: maxOrder + 1,
        enabled: true,
        data: HOME_PRICING_PROMO_DATA,
      },
    ];
  }

  const pricingSection = pricingSections.sort((a, b) => b.order - a.order)[0];

  return [
    ...otherSections,
    {
      ...pricingSection,
      type: "cta",
      order: Math.max(pricingSection.order, maxOrder + 1),
      enabled: true,
      data: {
        ...(pricingSection.data as Record<string, unknown>),
        ...HOME_PRICING_PROMO_DATA,
      },
    },
  ];
}

function normalizeSections(sections: Section[], slug?: string): Section[] {
  const normalized = sections.map((section) => {
    const data = normalizeSectionData(section.data as Record<string, unknown>);

    if (section.id === "home-hero") {
      delete data.eyebrow;
    }

    if (section.id === "home-story") {
      delete data.image;
    }

    if (section.id === "home-pricing") {
      data.heading = PRICING_PROMO_HEADING;
    }

    return {
      ...section,
      data,
    };
  });

  return slug === "home" ? normalizeHomeSections(normalized) : normalized;
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
      return { ...data, sections: normalizeSections(data.sections ?? [], slug) };
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
    sections: normalizeSections(fallback.sections, slug),
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
