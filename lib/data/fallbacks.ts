import type { Section } from "@/models/shared";
import { PRIMARY_CTA, ROUTES, SECONDARY_CTA, SEED_IMAGES, HERO_CTA, HERO_COPY, BRAND_ASSETS } from "@/lib/constants";

export const DEFAULT_CONTACT = {
  email: "ak_2123@hotmail.com",
  phone: "416-700-2656",
  phoneE164: "+14167002656",
};

export const HOME_SECTIONS: Section[] = [
  {
    id: "home-hero",
    type: "hero",
    order: 0,
    enabled: true,
    data: {
      layoutVariant: "redline",
      eyebrow: "DIGITAL GROWTH, REENGINEERED",
      heading: "BUILD. AUTOMATE. SCALE.",
      subheading: HERO_COPY.subheading,
      primaryCta: HERO_CTA.primary,
      priceBanner: HERO_COPY.priceBanner,
      backgroundImage: BRAND_ASSETS.heroBackground,
    },
  },
  {
    id: "home-ticker",
    type: "kineticTicker",
    order: 1,
    enabled: true,
    data: {
      items: [
        "WEB DESIGN",
        "APP DEVELOPMENT",
        "AI AUTOMATION",
        "SOCIAL MEDIA",
        "COMPETITOR ANALYSIS",
        "GOOGLE + META ADS",
        "SEO",
      ],
    },
  },
  {
    id: "home-story",
    type: "splitStory",
    order: 2,
    enabled: true,
    data: {
      eyebrow: "Small business. Big potential.",
      heading: "Practical growth for owners who want momentum.",
      body: "Netbrandit helps small-business owners build marketing campaigns, improve brand recognition, use online platforms effectively, and create systems that can generate more leads.",
      image: SEED_IMAGES.team,
    },
  },
  {
    id: "home-services",
    type: "serviceShowcase",
    order: 3,
    enabled: true,
    data: {
      eyebrow: "Services",
      heading: "Everything your growth engine needs.",
      showFromDb: true,
    },
  },
  {
    id: "home-connected",
    type: "connectedSystem",
    order: 4,
    enabled: true,
    data: {
      heading: "One partner. One connected growth system.",
      body: "Brand, website, automation, content, traffic, and conversion—aligned into one coordinated path forward.",
      image: SEED_IMAGES.automation,
    },
  },
  {
    id: "home-process",
    type: "numberedProcess",
    order: 5,
    enabled: true,
    data: {
      heading: "How we work",
      steps: [
        { number: "01", title: "Discover", description: "Understand goals, audience, and constraints." },
        { number: "02", title: "Position", description: "Sharpen messaging and channel priorities." },
        { number: "03", title: "Build", description: "Design, develop, and connect your systems." },
        { number: "04", title: "Launch", description: "Go live with tracking and clear handoff." },
        { number: "05", title: "Optimise", description: "Review performance and improve what matters." },
      ],
    },
  },
  {
    id: "home-pricing",
    type: "pricingSpotlight",
    order: 6,
    enabled: true,
    data: {
      heading: "Custom websites starting at $99",
      body: "A tailored starting point for small businesses ready to establish or improve their online presence. Final scope, timeline, and price are confirmed after discovery.",
      cta: { label: "Request My Quote", href: `${ROUTES.contact}?intent=quote` },
      image: SEED_IMAGES.webDesign,
    },
  },
  {
    id: "home-gallery",
    type: "galleryStrip",
    order: 7,
    enabled: true,
    data: {
      heading: "Selected work",
      showFromDb: true,
      cta: { label: "View Gallery", href: ROUTES.gallery },
    },
  },
  {
    id: "home-testimonials",
    type: "testimonialSlider",
    order: 8,
    enabled: true,
    data: {
      heading: "Client voices",
      showFromDb: true,
    },
  },
  {
    id: "home-faq",
    type: "faqPreview",
    order: 9,
    enabled: true,
    data: {
      heading: "Common questions",
      showFromDb: true,
      cta: { label: "View all FAQs", href: ROUTES.faqs },
    },
  },
  {
    id: "home-lead",
    type: "leadForm",
    order: 10,
    enabled: true,
    data: {
      eyebrow: "Start here",
      heading: "Get your free growth plan",
      body: "Tell us about your business and we will recommend practical next steps.",
      variant: "short",
    },
  },
  {
    id: "home-booking",
    type: "bookingCTA",
    order: 11,
    enabled: true,
    data: {
      heading: "Prefer a conversation?",
      body: "Book a free 30-minute discovery call.",
      cta: SECONDARY_CTA,
      image: SEED_IMAGES.strategy,
    },
  },
];

export const ABOUT_SECTIONS: Section[] = [
  {
    id: "about-hero",
    type: "hero",
    order: 0,
    enabled: true,
    data: {
      eyebrow: "About Netbrandit",
      heading: "Built to help small businesses move.",
      subheading:
        "We help small business owners improve brand recognition, build effective digital platforms, run smarter marketing campaigns, and use technology to scale.",
      primaryCta: PRIMARY_CTA,
      image: SEED_IMAGES.storefront,
    },
  },
  {
    id: "about-statement",
    type: "boldStatement",
    order: 1,
    enabled: true,
    data: {
      heading: "Why Netbrandit",
      body: "Bold strategy. Practical execution. One connected growth system.",
    },
  },
  {
    id: "about-principles",
    type: "benefitGrid",
    order: 2,
    enabled: true,
    data: {
      heading: "Principles we work by",
      items: [
        { title: "Tailored, not templated", description: "Every engagement starts with your business context." },
        { title: "Clear strategy before execution", description: "We align on goals before building." },
        { title: "Technology with a business purpose", description: "Tools serve outcomes, not the other way around." },
        { title: "Practical communication", description: "Plain language, honest timelines, no jargon walls." },
        { title: "Growth measured honestly", description: "We report what we can prove—never guaranteed rankings or ROAS." },
      ],
      image: SEED_IMAGES.brand,
    },
  },
  {
    id: "about-connected",
    type: "connectedSystem",
    order: 3,
    enabled: true,
    data: {
      heading: "Connected capabilities",
      body: "Websites, apps, automation, content, ads, and SEO—working together.",
      image: SEED_IMAGES.automation,
    },
  },
  {
    id: "about-process",
    type: "numberedProcess",
    order: 4,
    enabled: true,
    data: {
      heading: "Our process in detail",
      steps: [
        { number: "01", title: "Discover", description: "Goals, audience, offer, and current gaps." },
        { number: "02", title: "Position", description: "Messaging, priorities, and channel plan." },
        { number: "03", title: "Build", description: "Design, development, and integrations." },
        { number: "04", title: "Launch", description: "QA, tracking, and go-live support." },
        { number: "05", title: "Optimise", description: "Iterate based on real performance data." },
      ],
    },
  },
  {
    id: "about-audience",
    type: "splitStory",
    order: 5,
    enabled: true,
    data: {
      eyebrow: "Who we work best with",
      heading: "Small-business owners ready to invest in growth.",
      body: "Owners who want a capable partner for websites, marketing, automation, and ongoing improvement—not a one-off template.",
      image: SEED_IMAGES.team,
    },
  },
  {
    id: "about-cta",
    type: "leadForm",
    order: 6,
    enabled: true,
    data: {
      heading: "Receive a free growth plan",
      variant: "full",
      layout: "centered",
    },
  },
];

export function getFallbackPage(slug: string) {
  const pages: Record<string, { title: string; subtitle?: string; sections: Section[] }> = {
    home: { title: "Home", sections: HOME_SECTIONS },
    about: { title: "About", sections: ABOUT_SECTIONS },
  };

  return pages[slug] ?? null;
}
