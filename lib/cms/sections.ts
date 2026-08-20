import { z } from "zod";

export const SECTION_TYPES = {
  hero: "hero",
  richText: "rich_text",
  features: "features",
  services: "services",
  testimonials: "testimonials",
  cta: "cta",
  gallery: "gallery",
  faq: "faq",
  contact: "contact",
  stats: "stats",
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];

const baseSectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    SECTION_TYPES.hero,
    SECTION_TYPES.richText,
    SECTION_TYPES.features,
    SECTION_TYPES.services,
    SECTION_TYPES.testimonials,
    SECTION_TYPES.cta,
    SECTION_TYPES.gallery,
    SECTION_TYPES.faq,
    SECTION_TYPES.contact,
    SECTION_TYPES.stats,
  ]),
  enabled: z.boolean().default(true),
});

export const heroSectionSchema = baseSectionSchema.extend({
  type: z.literal(SECTION_TYPES.hero),
  data: z.object({
    eyebrow: z.string().optional(),
    heading: z.string(),
    subheading: z.string().optional(),
    primaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
    secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
    image: z.string().optional(),
  }),
});

export const richTextSectionSchema = baseSectionSchema.extend({
  type: z.literal(SECTION_TYPES.richText),
  data: z.object({
    heading: z.string().optional(),
    content: z.string(),
  }),
});

export const featuresSectionSchema = baseSectionSchema.extend({
  type: z.literal(SECTION_TYPES.features),
  data: z.object({
    heading: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      }),
    ),
  }),
});

export const ctaSectionSchema = baseSectionSchema.extend({
  type: z.literal(SECTION_TYPES.cta),
  data: z.object({
    heading: z.string(),
    description: z.string().optional(),
    buttonLabel: z.string(),
    buttonHref: z.string(),
  }),
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  richTextSectionSchema,
  featuresSectionSchema,
  ctaSectionSchema,
]);

export type CmsSection = z.infer<typeof sectionSchema>;

export interface PageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  data: Record<string, unknown>;
}

export interface SectionDefinition {
  type: SectionType;
  label: string;
  description: string;
  defaultData: Record<string, unknown>;
}

export const SECTION_REGISTRY: Record<SectionType, SectionDefinition> = {
  [SECTION_TYPES.hero]: {
    type: SECTION_TYPES.hero,
    label: "Hero",
    description: "Primary headline with calls to action",
    defaultData: {
      eyebrow: "Welcome",
      heading: "Build a brand that stands out online",
      subheading: "Strategy, design, and development for growing businesses.",
      primaryCta: { label: "Book a call", href: "/book" },
      secondaryCta: { label: "View services", href: "/services" },
    },
  },
  [SECTION_TYPES.richText]: {
    type: SECTION_TYPES.richText,
    label: "Rich text",
    description: "Formatted content block",
    defaultData: {
      heading: "About this section",
      content: "<p>Add your content here.</p>",
    },
  },
  [SECTION_TYPES.features]: {
    type: SECTION_TYPES.features,
    label: "Features",
    description: "Grid of feature highlights",
    defaultData: {
      heading: "Why choose us",
      items: [
        {
          title: "Strategy first",
          description: "Every project starts with clear business goals.",
        },
        {
          title: "Design that converts",
          description: "Beautiful experiences built to drive action.",
        },
      ],
    },
  },
  [SECTION_TYPES.services]: {
    type: SECTION_TYPES.services,
    label: "Services",
    description: "Service cards with links",
    defaultData: {
      heading: "Services",
      items: [],
    },
  },
  [SECTION_TYPES.testimonials]: {
    type: SECTION_TYPES.testimonials,
    label: "Testimonials",
    description: "Customer quotes and ratings",
    defaultData: {
      heading: "What clients say",
      items: [],
    },
  },
  [SECTION_TYPES.cta]: {
    type: SECTION_TYPES.cta,
    label: "Call to action",
    description: "Conversion-focused banner",
    defaultData: {
      heading: "Ready to get started?",
      description: "Book a free consultation and tell us about your project.",
      buttonLabel: "Book now",
      buttonHref: "/book",
    },
  },
  [SECTION_TYPES.gallery]: {
    type: SECTION_TYPES.gallery,
    label: "Gallery",
    description: "Image gallery grid",
    defaultData: {
      heading: "Gallery",
      images: [],
    },
  },
  [SECTION_TYPES.faq]: {
    type: SECTION_TYPES.faq,
    label: "FAQ",
    description: "Accordion questions and answers",
    defaultData: {
      heading: "Frequently asked questions",
      items: [],
    },
  },
  [SECTION_TYPES.contact]: {
    type: SECTION_TYPES.contact,
    label: "Contact",
    description: "Embedded contact form section",
    defaultData: {
      heading: "Get in touch",
      description: "We typically respond within one business day.",
    },
  },
  [SECTION_TYPES.stats]: {
    type: SECTION_TYPES.stats,
    label: "Stats",
    description: "Key metrics and social proof numbers",
    defaultData: {
      heading: "Results that matter",
      items: [],
    },
  },
};

export function createDefaultSection(type: SectionType, id?: string): PageSection {
  const definition = SECTION_REGISTRY[type];
  return {
    id: id ?? `${type}-${crypto.randomUUID()}`,
    type,
    enabled: true,
    data: { ...definition.defaultData },
  };
}

export function getSectionDefinition(type: SectionType): SectionDefinition {
  return SECTION_REGISTRY[type];
}

export function listSectionTypes(): SectionDefinition[] {
  return Object.values(SECTION_REGISTRY);
}

export function parseSection(input: unknown) {
  return sectionSchema.safeParse(input);
}
