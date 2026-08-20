import type { StoredUploadFolder } from "@/lib/uploads/constants";

export type SectionFieldType =
  | "text"
  | "textarea"
  | "image"
  | "images"
  | "cta"
  | "lines"
  | "boolean";

export interface SectionFieldDefinition {
  key: string;
  label: string;
  type: SectionFieldType;
  placeholder?: string;
  hint?: string;
  folder?: StoredUploadFolder;
}

const DEFAULT_FIELDS: SectionFieldDefinition[] = [
  { key: "heading", label: "Heading", type: "text" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "image", label: "Section image", type: "image", folder: "pages" },
];

export const SECTION_FIELD_DEFINITIONS: Record<string, SectionFieldDefinition[]> = {
  hero: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "backgroundImage", label: "Background image", type: "image", folder: "pages" },
    { key: "priceBanner", label: "Price banner", type: "text" },
    { key: "primaryCta", label: "Primary button", type: "cta" },
    { key: "secondaryCta", label: "Secondary button", type: "cta" },
  ],
  kineticTicker: [{ key: "items", label: "Ticker items (one per line)", type: "lines" }],
  splitStory: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "image", label: "Section image", type: "image", folder: "pages" },
  ],
  richText: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Content", type: "textarea" },
  ],
  boldStatement: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
  ],
  serviceShowcase: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "showFromDb", label: "Load services from database", type: "boolean" },
  ],
  connectedSystem: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "image", label: "Section image", type: "image", folder: "pages" },
  ],
  numberedProcess: [{ key: "heading", label: "Heading", type: "text" }],
  benefitGrid: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "image", label: "Section image", type: "image", folder: "pages" },
  ],
  pricingSpotlight: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "image", label: "Section image", type: "image", folder: "pages" },
    { key: "cta", label: "Button", type: "cta" },
  ],
  galleryStrip: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "showFromDb", label: "Load gallery from database", type: "boolean" },
    { key: "cta", label: "Button", type: "cta" },
  ],
  testimonialSlider: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "showFromDb", label: "Load testimonials from database", type: "boolean" },
  ],
  faqPreview: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "showFromDb", label: "Load FAQs from database", type: "boolean" },
    { key: "cta", label: "Button", type: "cta" },
  ],
  blogPreview: [{ key: "heading", label: "Heading", type: "text" }],
  leadForm: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
  ],
  bookingCTA: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "image", label: "Section image", type: "image", folder: "pages" },
    { key: "cta", label: "Button", type: "cta" },
  ],
  deviceShowcase: [{ key: "image", label: "Device image", type: "image", folder: "pages" }],
  imageMosaic: [{ key: "images", label: "Mosaic images", type: "images", folder: "pages" }],
  imagePair: [
    { key: "image", label: "Primary image", type: "image", folder: "pages" },
    { key: "deviceImage", label: "Secondary image", type: "image", folder: "pages" },
  ],
  contactPanel: [],
};

export function getSectionFieldDefinitions(type: string): SectionFieldDefinition[] {
  return SECTION_FIELD_DEFINITIONS[type] ?? DEFAULT_FIELDS;
}

export function formatSectionTypeLabel(type: string): string {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
