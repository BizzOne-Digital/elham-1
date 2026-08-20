import { connectDB } from "@/lib/db/connect";
import { GalleryProject } from "@/models/GalleryProject";
import { GalleryCategory } from "@/models/GalleryCategory";
import { serializeDoc, serializeDocs } from "@/lib/data/serialize";
import { SEED_IMAGES } from "@/lib/constants";
import { GALLERY_CATEGORY_IMAGES, resolveStockImage } from "@/lib/stock-images";

function categoryFallback(category?: string): string {
  if (!category) return SEED_IMAGES.webDesign;
  const key = category.toLowerCase().replace(/\s+/g, "-");
  if (key.includes("app") || key.includes("portal")) return GALLERY_CATEGORY_IMAGES["apps-and-portals"];
  if (key.includes("automation") || key.includes("ai")) return GALLERY_CATEGORY_IMAGES["ai-automations"];
  if (key.includes("social")) return GALLERY_CATEGORY_IMAGES["social-media"];
  if (key.includes("paid") || key.includes("campaign")) return GALLERY_CATEGORY_IMAGES["paid-campaigns"];
  if (key.includes("brand")) return GALLERY_CATEGORY_IMAGES["brand-systems"];
  return GALLERY_CATEGORY_IMAGES.websites;
}

function normalizeProject(project: GalleryProjectSummary): GalleryProjectSummary {
  const fallback = categoryFallback(project.category);
  return {
    ...project,
    coverImage: project.coverImage
      ? {
          ...project.coverImage,
          url: resolveStockImage(project.coverImage.url, fallback),
        }
      : { url: fallback, alt: project.title },
  };
}

function normalizeProjectDetail(project: GalleryProjectDetail): GalleryProjectDetail {
  const summary = normalizeProject(project);
  return {
    ...summary,
    images: project.images?.map((image, index) => ({
      ...image,
      url: resolveStockImage(
        image.url,
        [SEED_IMAGES.device, SEED_IMAGES.team, SEED_IMAGES.storefront, SEED_IMAGES.strategy][index] ??
          summary.coverImage?.url ??
          SEED_IMAGES.webDesign,
      ),
    })),
  };
}

export interface GalleryProjectSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { url: string; alt?: string };
  category?: string;
  isFeatured?: boolean;
  sortOrder: number;
}

export interface GalleryProjectDetail extends GalleryProjectSummary {
  description?: string;
  images?: { url: string; alt?: string }[];
  clientName?: string;
  tags?: string[];
}

export interface GalleryCategoryData {
  _id: string;
  name: string;
  slug: string;
}

const fallbackProjects: GalleryProjectSummary[] = [
  {
    _id: "1",
    slug: "concept-website-redline",
    title: "Concept — Local Service Website",
    excerpt: "Demo concept work. Replace with approved portfolio project.",
    coverImage: { url: SEED_IMAGES.webDesign, alt: "Concept website design" },
    category: "Websites",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    _id: "2",
    slug: "concept-booking-portal",
    title: "Concept — Booking Portal",
    excerpt: "Demo concept work for a client booking experience.",
    coverImage: { url: SEED_IMAGES.mobileApp, alt: "Concept booking portal" },
    category: "Apps and Portals",
    sortOrder: 2,
  },
  {
    _id: "3",
    slug: "concept-social-campaign",
    title: "Concept — Social Campaign Grid",
    excerpt: "Visual direction for a social content system.",
    coverImage: { url: SEED_IMAGES.social, alt: "Social campaign concept" },
    category: "Social Media",
    sortOrder: 3,
  },
  {
    _id: "4",
    slug: "concept-automation-flow",
    title: "Concept — Lead Automation Flow",
    excerpt: "Workflow diagram for lead handling automation.",
    coverImage: { url: SEED_IMAGES.automation, alt: "Automation flow concept" },
    category: "AI Automations",
    sortOrder: 4,
  },
];

export async function getPublishedProjects(): Promise<GalleryProjectSummary[]> {
  try {
    await connectDB();
    const projects = await GalleryProject.find({ status: "published" })
      .sort({ sortOrder: 1 })
      .populate("category", "name slug")
      .lean();

    if (projects.length) {
      return serializeDocs<GalleryProjectSummary>(
        projects.map((p) => ({
          ...p,
          category: (p.category as { name?: string })?.name,
        })),
      ).map(normalizeProject);
    }
  } catch {
    // fall through
  }
  return fallbackProjects.map(normalizeProject);
}

export async function getProjectBySlug(slug: string): Promise<GalleryProjectDetail | null> {
  try {
    await connectDB();
    const project = await GalleryProject.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .lean();
    if (project) {
      const data = serializeDoc(project) as GalleryProjectDetail & {
        category?: { name?: string };
      };
      return normalizeProjectDetail({ ...data, category: data.category?.name ?? undefined });
    }
  } catch {
    // fall through
  }

  const fallback = fallbackProjects.find((p) => p.slug === slug);
  if (!fallback) return null;

  return normalizeProjectDetail({
    ...fallback,
    description: fallback.excerpt,
    images: [
      fallback.coverImage!,
      { url: SEED_IMAGES.device, alt: "Device mockup" },
      { url: SEED_IMAGES.team, alt: "Team collaboration" },
      { url: SEED_IMAGES.storefront, alt: "Storefront detail" },
      { url: SEED_IMAGES.strategy, alt: "Strategy session" },
    ],
  });
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const projects = await GalleryProject.find({ status: "published" }).select("slug").lean();
    if (projects.length) return projects.map((p) => p.slug);
  } catch {
    // fall through
  }
  return fallbackProjects.map((p) => p.slug);
}

export async function getGalleryCategories(): Promise<GalleryCategoryData[]> {
  try {
    await connectDB();
    const categories = await GalleryCategory.find({ status: "published" })
      .sort({ sortOrder: 1 })
      .select("name slug")
      .lean();
    if (categories.length) return serializeDocs<GalleryCategoryData>(categories);
  } catch {
    // fall through
  }

  return [
    { _id: "1", name: "Websites", slug: "websites" },
    { _id: "2", name: "Apps and Portals", slug: "apps-and-portals" },
    { _id: "3", name: "AI Automations", slug: "ai-automations" },
    { _id: "4", name: "Social Media", slug: "social-media" },
  ];
}
