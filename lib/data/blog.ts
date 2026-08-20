import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/models/BlogPost";
import { serializeDoc, serializeDocs } from "@/lib/data/serialize";
import { SEED_IMAGES } from "@/lib/constants";
import { resolveStockImage } from "@/lib/stock-images";

const BLOG_IMAGE_FALLBACKS: Record<string, string> = {
  "small-business-website-leads": SEED_IMAGES.webDesign,
  "small-business-website-lead-generation": SEED_IMAGES.webDesign,
  "ai-automation-human-touch": SEED_IMAGES.automation,
  "ai-automation-without-losing-the-human-touch": SEED_IMAGES.automation,
  "seo-ads-or-social": SEED_IMAGES.seo,
  "seo-ads-or-social-where-to-start": SEED_IMAGES.seo,
};

function normalizePost(post: BlogPostSummary): BlogPostSummary {
  const fallback = BLOG_IMAGE_FALLBACKS[post.slug] ?? SEED_IMAGES.strategy;
  return {
    ...post,
    featuredImage: post.featuredImage
      ? {
          ...post.featuredImage,
          url: resolveStockImage(post.featuredImage.url, fallback),
        }
      : { url: fallback, alt: post.title },
  };
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: { url: string; alt?: string };
  publishedAt?: string;
  readingTimeMinutes?: number;
  categories?: string[];
  isFeatured?: boolean;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  tags?: string[];
  seo?: { title?: string; description?: string };
}

const fallbackPosts: BlogPostSummary[] = [
  {
    _id: "1",
    slug: "small-business-website-leads",
    title: "What a Small-Business Website Needs to Generate Leads",
    excerpt: "Essential pages, trust signals, and conversion paths for local businesses.",
    featuredImage: { url: SEED_IMAGES.webDesign, alt: "Website lead generation" },
    readingTimeMinutes: 6,
    categories: ["Websites"],
  },
  {
    _id: "2",
    slug: "ai-automation-human-touch",
    title: "Where AI Automation Can Save Time Without Losing the Human Touch",
    excerpt: "Practical workflows that support your team instead of replacing it.",
    featuredImage: { url: SEED_IMAGES.automation, alt: "AI automation workflow" },
    readingTimeMinutes: 7,
    categories: ["Automation"],
  },
  {
    _id: "3",
    slug: "seo-ads-or-social",
    title: "SEO, Ads, or Social: Which Channel Should You Start With?",
    excerpt: "A decision framework for small-business owners with limited budget.",
    featuredImage: { url: SEED_IMAGES.seo, alt: "Marketing channel strategy" },
    readingTimeMinutes: 5,
    categories: ["Strategy"],
  },
];

export async function getPublishedPosts(limit = 12): Promise<BlogPostSummary[]> {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select("title slug excerpt featuredImage publishedAt readingTimeMinutes categories isFeatured")
      .lean();
    if (posts.length) return serializeDocs<BlogPostSummary>(posts).map(normalizePost);
  } catch {
    // fall through
  }
  return fallbackPosts.map(normalizePost);
}

export async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (post) return normalizePost(serializeDoc(post) as BlogPostDetail) as BlogPostDetail;
  } catch {
    // fall through
  }

  const fallback = fallbackPosts.find((p) => p.slug === slug);
  if (!fallback) return null;

  return {
    ...normalizePost(fallback),
    content: `<p>${fallback.excerpt}</p><p>This is draft placeholder content. Replace with your published article from the admin portal.</p>`,
  };
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" }).select("slug").lean();
    if (posts.length) return posts.map((p) => p.slug);
  } catch {
    // fall through
  }
  return fallbackPosts.map((p) => p.slug);
}
