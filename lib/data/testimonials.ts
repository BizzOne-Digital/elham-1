import { connectDB } from "@/lib/db/connect";
import { Testimonial } from "@/models/Testimonial";
import { DEFAULT_TESTIMONIALS } from "@/lib/data/testimonial-content";
import { serializeDocs } from "@/lib/data/serialize";

export interface TestimonialItem {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: { url: string; alt?: string };
  isFeatured?: boolean;
  sortOrder: number;
}

export async function getPublishedTestimonials(limit?: number): Promise<TestimonialItem[]> {
  try {
    await connectDB();
    let query = Testimonial.find({ status: "published" }).sort({ sortOrder: 1 });
    if (limit) query = query.limit(limit);
    const items = await query.lean();
    if (items.length) return serializeDocs<TestimonialItem>(items);
  } catch {
    // fall through
  }

  const fallbacks = [...DEFAULT_TESTIMONIALS].sort((a, b) => a.sortOrder - b.sortOrder);
  return limit ? fallbacks.slice(0, limit) : fallbacks;
}
