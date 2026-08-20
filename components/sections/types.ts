import type { ReactNode } from "react";
import type { Section } from "@/models/shared";
import type { ServiceCard } from "@/lib/data/services";
import type { GalleryProjectSummary } from "@/lib/data/gallery";
import type { TestimonialItem } from "@/lib/data/testimonials";
import type { FAQItem } from "@/lib/data/faqs";
import type { BlogPostSummary } from "@/lib/data/blog";

export const SECTION_TYPES = [
  "hero",
  "kineticTicker",
  "splitStory",
  "richText",
  "boldStatement",
  "imagePair",
  "imageMosaic",
  "deviceShowcase",
  "serviceShowcase",
  "connectedSystem",
  "numberedProcess",
  "benefitGrid",
  "pricingSpotlight",
  "galleryStrip",
  "testimonialSlider",
  "faqPreview",
  "blogPreview",
  "leadForm",
  "bookingCTA",
  "contactPanel",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export interface SectionRenderContext {
  services?: ServiceCard[];
  projects?: GalleryProjectSummary[];
  testimonials?: TestimonialItem[];
  faqs?: FAQItem[];
  posts?: BlogPostSummary[];
}

export interface SectionComponentProps {
  section: Section;
  context?: SectionRenderContext;
}

export type SectionComponent = (props: SectionComponentProps) => ReactNode;
