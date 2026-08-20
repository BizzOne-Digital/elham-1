import type { Section } from "@/models/shared";
import {
  HeroSection,
  KineticTickerSection,
  SplitStorySection,
  BoldStatementSection,
  RichTextSection,
} from "@/components/sections/content-sections";
import {
  ServiceShowcaseSection,
  ConnectedSystemSection,
  NumberedProcessSection,
  BenefitGridSection,
  PricingSpotlightSection,
  GalleryStripSection,
  TestimonialSliderSection,
  FaqPreviewSection,
  LeadFormSection,
  BookingCTASection,
  BlogPreviewSection,
  DeviceShowcaseSection,
  ImageMosaicSection,
  ContactPanelSection,
} from "@/components/sections/feature-sections";
import type { SectionComponent, SectionRenderContext } from "@/components/sections/types";

const registry: Record<string, SectionComponent> = {
  hero: HeroSection,
  kineticTicker: KineticTickerSection,
  splitStory: SplitStorySection,
  richText: RichTextSection,
  boldStatement: BoldStatementSection,
  serviceShowcase: ServiceShowcaseSection,
  connectedSystem: ConnectedSystemSection,
  numberedProcess: NumberedProcessSection,
  benefitGrid: BenefitGridSection,
  pricingSpotlight: PricingSpotlightSection,
  galleryStrip: GalleryStripSection,
  testimonialSlider: TestimonialSliderSection,
  faqPreview: FaqPreviewSection,
  leadForm: LeadFormSection,
  bookingCTA: BookingCTASection,
  blogPreview: BlogPreviewSection,
  deviceShowcase: DeviceShowcaseSection,
  imageMosaic: ImageMosaicSection,
  contactPanel: ContactPanelSection,
  // Legacy CMS section types
  features: BenefitGridSection,
  services: ServiceShowcaseSection,
  testimonials: TestimonialSliderSection,
  cta: BookingCTASection,
  gallery: GalleryStripSection,
  faq: FaqPreviewSection,
  contact: ContactPanelSection,
  stats: BoldStatementSection,
};

interface SectionRendererProps {
  sections: Section[];
  context?: SectionRenderContext;
}

function UnknownSection({ section }: { section: Section }) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="container-site py-8 text-sm text-steel">
        Unknown section type: {section.type}
      </div>
    );
  }
  return null;
}

export function SectionRenderer({ sections, context }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        if (section.enabled === false) return null;
        const Component = registry[section.type] ?? UnknownSection;
        return <Component key={section.id} section={section} context={context} />;
      })}
    </>
  );
}

export { registry as sectionRegistry };
