import { z } from "zod";
import { emailSchema } from "@/lib/validation/common";

const publishStatus = z.enum(["draft", "published", "archived"]);
const trimmed = (min = 1, max = 500) => z.string().trim().min(min).max(max);

const sectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.string().trim().min(1),
  label: z.string().trim().max(200).optional(),
  order: z.coerce.number().int().min(0),
  enabled: z.boolean(),
  data: z.record(z.unknown()),
});

export const pageSchema = z.object({
  title: trimmed(1, 200),
  slug: trimmed(1, 120).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  subtitle: z.string().trim().max(300).optional(),
  status: publishStatus,
  sortOrder: z.coerce.number().int().min(0).default(0),
  sections: z.array(sectionSchema).optional(),
  seo: z
    .object({
      title: z.string().trim().max(200).optional(),
      description: z.string().trim().max(500).optional(),
      noIndex: z.boolean().optional(),
    })
    .optional(),
});

export const serviceSchema = z.object({
  title: trimmed(1, 200),
  slug: trimmed(1, 120).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  shortDescription: z.string().trim().max(500).optional(),
  description: z.string().optional(),
  icon: z.string().trim().max(100).optional(),
  highlights: z.array(z.string().trim()).optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatus,
});

export const serviceDetailSchema = z.object({
  detailPage: z.object({
    content: z.string().optional(),
    seo: z
      .object({
        title: z.string().trim().max(200).optional(),
        description: z.string().trim().max(500).optional(),
      })
      .optional(),
  }),
});

export const pricingSchema = z.object({
  name: trimmed(1, 200),
  slug: trimmed(1, 120).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().min(0),
  currency: z.string().trim().max(3).default("CAD"),
  billingPeriod: z.enum(["one_time", "monthly", "yearly", "custom"]).default("one_time"),
  features: z.array(z.string().trim()).optional(),
  isPopular: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatus,
});

export const galleryCategorySchema = z.object({
  name: trimmed(1, 200),
  slug: trimmed(1, 120).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  description: z.string().trim().max(1000).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatus,
});

export const galleryProjectSchema = z.object({
  title: trimmed(1, 200),
  slug: trimmed(1, 120).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  category: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid category ID"),
  description: z.string().optional(),
  excerpt: z.string().trim().max(500).optional(),
  clientName: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
  tags: z.array(z.string().trim()).optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatus,
});

export const testimonialSchema = z.object({
  name: trimmed(1, 200),
  role: z.string().trim().max(200).optional(),
  company: z.string().trim().max(200).optional(),
  content: trimmed(10, 5000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isFeatured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatus,
});

export const faqSchema = z.object({
  question: trimmed(5, 500),
  answer: trimmed(5, 10000),
  category: z.string().trim().max(100).default("general"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatus,
});

export const blogPostSchema = z.object({
  title: trimmed(1, 200),
  slug: trimmed(1, 120).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  excerpt: z.string().trim().max(500).optional(),
  content: trimmed(10, 100000),
  tags: z.array(z.string().trim()).optional(),
  categories: z.array(z.string().trim()).optional(),
  isFeatured: z.boolean().optional(),
  status: publishStatus,
});

export const leadUpdateSchema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
    "archived",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  note: z.string().trim().max(5000).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]),
  internalNotes: z.string().trim().max(5000).optional(),
  cancellationReason: z.string().trim().max(500).optional(),
});

export const profileSchema = z.object({
  name: trimmed(1, 120),
  email: emailSchema,
  currentPassword: z.string().min(8).max(128).optional(),
  newPassword: z.string().min(8).max(128).optional(),
});
