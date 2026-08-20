import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { SEED_IMAGES } from "@/lib/constants";
import { serializeDoc, serializeDocs } from "@/lib/data/serialize";
import { resolveServiceImage, SERVICE_STOCK_IMAGES } from "@/lib/stock-images";

function normalizeServiceCard(service: ServiceCard): ServiceCard {
  const fallback = resolveServiceImage(service.slug, undefined, SEED_IMAGES.webDesign);
  return {
    ...service,
    featuredImage: service.featuredImage
      ? {
          ...service.featuredImage,
          url: resolveServiceImage(service.slug, service.featuredImage.url, fallback),
        }
      : { url: fallback, alt: service.title },
  };
}

function normalizeServiceDetail(service: ServiceDetail): ServiceDetail {
  const card = normalizeServiceCard(service);
  const heroImage = service.detailPage?.hero?.image;
  return {
    ...card,
    detailPage: {
      ...service.detailPage,
      hero: service.detailPage?.hero
        ? {
            ...service.detailPage.hero,
            image: heroImage
              ? {
                  ...heroImage,
                  url: resolveServiceImage(service.slug, heroImage.url, card.featuredImage?.url ?? SEED_IMAGES.webDesign),
                }
              : card.featuredImage,
          }
        : undefined,
    },
  };
}

export interface ServiceCard {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  icon?: string;
  featuredImage?: { url: string; alt?: string };
  highlights?: string[];
  isFeatured?: boolean;
  sortOrder: number;
}

export interface ServiceDetail extends ServiceCard {
  description?: string;
  detailPage: {
    hero?: {
      title?: string;
      subtitle?: string;
      image?: { url: string; alt?: string };
      cta?: { label: string; href: string };
    };
    sections?: Array<{
      id: string;
      type: string;
      order: number;
      enabled: boolean;
      data: Record<string, unknown>;
    }>;
    seo?: { title?: string; description?: string };
    cta?: { label: string; href: string };
    content?: string;
  };
}

const fallbackServices: ServiceCard[] = [
  {
    _id: "1",
    slug: "custom-web-design",
    title: "Custom Web Design",
    shortDescription: "Conversion-focused, responsive websites tailored to the business.",
    featuredImage: { url: SEED_IMAGES.webDesign, alt: "Custom web design concept" },
    isFeatured: true,
    sortOrder: 1,
  },
  {
    _id: "2",
    slug: "web-mobile-app-development",
    title: "Web and Mobile App Development",
    shortDescription: "Portals, tools, booking systems, dashboards, and custom digital products.",
    featuredImage: {
      url: SERVICE_STOCK_IMAGES["web-mobile-app-development"],
      alt: "Mobile app development",
    },
    sortOrder: 2,
  },
  {
    _id: "3",
    slug: "ai-automation",
    title: "AI Automation",
    shortDescription: "Connect tools, automate workflows, and improve operational efficiency.",
    featuredImage: { url: SEED_IMAGES.automation, alt: "AI automation workflow" },
    sortOrder: 3,
  },
  {
    _id: "4",
    slug: "social-media-management",
    title: "Social Media Management",
    shortDescription: "Content planning, creative direction, scheduling, and performance review.",
    featuredImage: {
      url: SERVICE_STOCK_IMAGES["social-media-management"],
      alt: "Social media content grid",
    },
    sortOrder: 4,
  },
  {
    _id: "5",
    slug: "competitor-analysis",
    title: "Competitor Analysis and Market Research",
    shortDescription: "Research positioning, messaging, content, search visibility, and advertising.",
    featuredImage: { url: SEED_IMAGES.strategy, alt: "Market research workspace" },
    sortOrder: 5,
  },
  {
    _id: "6",
    slug: "google-meta-advertising",
    title: "Google and Meta Advertising",
    shortDescription: "Campaign strategy, creative, targeting, tracking, and optimisation.",
    featuredImage: {
      url: SERVICE_STOCK_IMAGES["google-meta-advertising"],
      alt: "Paid advertising dashboard",
    },
    sortOrder: 6,
  },
  {
    _id: "7",
    slug: "search-engine-optimisation",
    title: "Search Engine Optimisation",
    shortDescription: "Technical foundations, keyword research, on-page SEO, and reporting.",
    featuredImage: { url: SEED_IMAGES.seo, alt: "SEO analytics concept" },
    sortOrder: 7,
  },
  {
    _id: "8",
    slug: "growth-marketing-strategy",
    title: "Growth Marketing Strategy",
    shortDescription: "Positioning, channel planning, campaigns, and an actionable growth roadmap.",
    featuredImage: {
      url: SERVICE_STOCK_IMAGES["growth-marketing-strategy"],
      alt: "Growth strategy planning",
    },
    sortOrder: 8,
  },
];

export async function getPublishedServices(): Promise<ServiceCard[]> {
  try {
    await connectDB();
    const services = await Service.find({ status: "published" })
      .sort({ sortOrder: 1 })
      .select("slug title shortDescription icon featuredImage highlights isFeatured sortOrder")
      .lean();
    if (services.length) {
      return serializeDocs<ServiceCard>(services).map(normalizeServiceCard);
    }
  } catch {
    // fall through
  }
  return fallbackServices.map(normalizeServiceCard);
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  try {
    await connectDB();
    const service = await Service.findOne({ slug, status: "published" }).lean();
    if (service) {
      return normalizeServiceDetail(serializeDoc(service) as ServiceDetail);
    }
  } catch {
    // fall through
  }

  const fallback = fallbackServices.find((s) => s.slug === slug);
  if (!fallback) return null;

  return normalizeServiceDetail({
    ...fallback,
    description: fallback.shortDescription,
    detailPage: {
      hero: {
        title: fallback.title,
        subtitle: fallback.shortDescription,
        image: normalizeServiceCard(fallback).featuredImage,
        cta: { label: "Get a Free Growth Plan", href: "/contact?intent=growth-plan" },
      },
      content: `<p>${fallback.shortDescription}</p>`,
      cta: { label: "Request a Quote", href: "/contact?intent=quote" },
    },
  });
}

export async function getServiceSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const services = await Service.find({ status: "published" }).select("slug").lean();
    if (services.length) {
      return services.map((s) => s.slug);
    }
  } catch {
    // fall through
  }
  return fallbackServices.map((s) => s.slug);
}
