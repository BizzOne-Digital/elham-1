import { connectDB } from "@/lib/db/connect";
import { PricingPackage } from "@/models/PricingPackage";
import { serializeDocs } from "@/lib/data/serialize";
import { SEED_IMAGES } from "@/lib/constants";

export interface PricingCardHeader {
  label: string;
  tagline: string;
  featured?: boolean;
}

const PRICING_CARD_HEADERS: Record<string, PricingCardHeader> = {
  "custom-website": {
    label: "WEB DESIGN",
    tagline: "Launch-ready sites from CAD 99",
    featured: true,
  },
  "apps-portals": {
    label: "MOBILE APP",
    tagline: "Apps, portals, and dashboards",
  },
  "apps-and-portals": {
    label: "MOBILE APP",
    tagline: "Apps, portals, and dashboards",
  },
  "ai-automation-pricing": {
    label: "AUTOMATION",
    tagline: "Workflows that save hours every week",
  },
  "ai-automation": {
    label: "AUTOMATION",
    tagline: "Workflows that save hours every week",
  },
  "advertising-seo": {
    label: "PAID ADS",
    tagline: "Google, Meta, and search growth",
  },
  "advertising-and-seo": {
    label: "PAID ADS",
    tagline: "Google, Meta, and search growth",
  },
  "social-media-management": {
    label: "SOCIAL MEDIA",
    tagline: "Content, cadence, and reporting",
  },
  "growth-strategy": {
    label: "GROWTH STRATEGY",
    tagline: "Roadmaps that connect every channel",
  },
};

const PRICING_HEADER_DEFAULTS: PricingCardHeader[] = [
  { label: "WEB DESIGN", tagline: "Built to convert visitors into leads", featured: true },
  { label: "MOBILE APP", tagline: "Apps, portals, and dashboards" },
  { label: "AUTOMATION", tagline: "Workflows that save hours every week" },
  { label: "PAID ADS", tagline: "Google, Meta, and search growth" },
];

export function getPricingCardHeader(pkg: PricingItem, index: number): PricingCardHeader {
  const mapped = PRICING_CARD_HEADERS[pkg.slug];
  if (mapped) {
    return { ...mapped, featured: mapped.featured ?? Boolean(pkg.isPopular) };
  }

  const fallback = PRICING_HEADER_DEFAULTS[index % PRICING_HEADER_DEFAULTS.length];
  return {
    label: pkg.name.toUpperCase(),
    tagline: pkg.description?.split(".")[0]?.trim() || fallback.tagline,
    featured: pkg.isPopular,
  };
}

export interface PricingItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  isPopular?: boolean;
  sortOrder: number;
  cta?: { label: string; href: string };
}

const fallbackPricing: PricingItem[] = [
  {
    _id: "1",
    name: "Custom Website",
    slug: "custom-website",
    description:
      "A tailored starting point for small businesses ready to establish or improve their online presence. Final scope, timeline, and price are confirmed after a discovery conversation.",
    price: 99,
    currency: "CAD",
    billingPeriod: "one_time",
    features: [
      "Discovery-led scope definition",
      "Responsive design direction",
      "Core pages and lead paths",
      "Final quote after discovery",
    ],
    isPopular: true,
    sortOrder: 1,
    cta: { label: "Request My Quote", href: "/contact?intent=quote" },
  },
  {
    _id: "2",
    name: "Apps and Portals",
    slug: "apps-portals",
    description: "Custom digital products, portals, and internal tools.",
    price: 0,
    currency: "CAD",
    billingPeriod: "custom",
    features: ["Scoped after discovery", "Custom quote", "Flexible timeline"],
    sortOrder: 2,
    cta: { label: "Request a Quote", href: "/contact?intent=quote" },
  },
  {
    _id: "3",
    name: "AI Automation",
    slug: "ai-automation-pricing",
    description: "Workflow review and practical automation recommendations.",
    price: 0,
    currency: "CAD",
    billingPeriod: "custom",
    features: ["Process mapping", "Tool integration", "Human oversight built in"],
    sortOrder: 3,
    cta: { label: "Request a Quote", href: "/contact?intent=quote" },
  },
  {
    _id: "4",
    name: "Advertising and SEO",
    slug: "advertising-seo",
    description: "Campaign setup, optimisation, and search visibility support.",
    price: 0,
    currency: "CAD",
    billingPeriod: "custom",
    features: ["Strategy-first setup", "Transparent reporting", "Ad spend separate"],
    sortOrder: 4,
    cta: { label: "Request a Quote", href: "/contact?intent=quote" },
  },
];

export function formatPrice(item: PricingItem): string {
  if (item.billingPeriod === "custom" || item.price === 0) {
    return "Custom quote";
  }
  if (item.billingPeriod === "one_time") {
    return `From ${item.currency} ${item.price}`;
  }
  return `${item.currency} ${item.price}/${item.billingPeriod.replace("_", " ")}`;
}

export async function getPublishedPricing(): Promise<PricingItem[]> {
  try {
    await connectDB();
    const items = await PricingPackage.find({ status: "published" })
      .sort({ sortOrder: 1 })
      .lean();
    if (items.length) return serializeDocs<PricingItem>(items);
  } catch {
    // fall through
  }
  return fallbackPricing;
}

export const PRICING_IMAGES = [
  SEED_IMAGES.webDesign,
  SEED_IMAGES.mobileApp,
  SEED_IMAGES.automation,
  SEED_IMAGES.ads,
  SEED_IMAGES.seo,
];
