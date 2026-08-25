/** Shared constants safe for client and server. Never put secrets here. */

import { STOCK_IMAGES } from "@/lib/stock-images";

export const BRAND = {
  name: "Netbrandit",
  tagline:
    "Your one-stop growth partner—websites, apps, AI automation, social media, and marketing programmes tailored to your business.",
  defaultLocale: "en-CA",
} as const;

export const BRAND_COLORS = {
  voidBlack: "#050505",
  sand: "#DDC7A0",
  sandDeep: "#D0B88F",
  sandCard: "#C4AE82",
  ink: "#1A1410",
  carbon: "#0D0D0F",
  graphite: "#18181B",
  signalRed: "#F21D2F",
  hotRed: "#FF3347",
  deepCrimson: "#8D0715",
  warmWhite: "#F7F4EF",
  concrete: "#D8D4CE",
  steel: "#9A9A9F",
  smoke: "#5D5D63",
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  pricing: "/pricing",
  gallery: "/gallery",
  portfolio: "/gallery",
  testimonials: "/testimonials",
  faqs: "/faqs",
  blog: "/blog",
  booking: "/booking",
  book: "/booking",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminPages: "/admin/pages",
  adminLeads: "/admin/leads",
  adminBookings: "/admin/bookings",
  adminMedia: "/admin/uploads",
  adminSettings: "/admin/settings",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "Work", href: ROUTES.gallery },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Insights", href: ROUTES.blog },
  { label: "Contact", href: ROUTES.contact },
] as const;

/** Primary header navigation — matches approved hero mockup */
export const HEADER_NAV_ITEMS = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Testimonials", href: ROUTES.testimonials },
  { label: "FAQ", href: ROUTES.faqs },
] as const;

export const BRAND_ASSETS = {
  logo: "/brand/logo.png",
  logoAlt: "Netbrandit — NET BRAND IT",
  heroBackground: "/images/hero/cyber-monogram.png",
  heroArtwork: "/images/hero/cyber-monogram.png",
  storySectionImage: "/images/story/strategy-desk.png",
  processSectionImage: "/images/process/ai-growth.png",
  favicon: "/brand/logo.png",
} as const;

export const PRIMARY_CTA = {
  label: "Book a Call",
  href: ROUTES.booking,
} as const;

export const SECONDARY_CTA = {
  label: "Book a Discovery Call",
  href: ROUTES.booking,
} as const;

export const HERO_CTA = {
  primary: { label: "Get a free growth plan", href: `${ROUTES.contact}?intent=growth-plan` },
  secondary: { label: "Explore Services", href: ROUTES.services },
} as const;

export const HERO_COPY = {
  subheading:
    "We help small businesses turn their online presence into new customers with custom websites, AI and marketing systems built to move your business forward.",
  priceBanner: "Websites starting at $99 CAD • Based in Canada • No long-term contracts",
} as const;

export const PRICING_PROMO_HEADING =
  "Custom website packages starting at $99 and for a limited time all new packages come with a FREE CUSTOM LOGO";

export const LEAD_STATUS = {
  new: "new",
  contacted: "contacted",
  qualified: "qualified",
  converted: "converted",
  closed: "closed",
  spam: "spam",
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const BOOKING_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
  completed: "completed",
  noShow: "no_show",
  rescheduled: "rescheduled",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const USER_ROLES = {
  admin: "admin",
  editor: "editor",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PAGE_STATUS = {
  draft: "draft",
  published: "published",
  archived: "archived",
} as const;

export type PageStatus = (typeof PAGE_STATUS)[keyof typeof PAGE_STATUS];

export const FORM_TYPES = {
  contact: "contact",
  quote: "quote",
  newsletter: "newsletter",
  booking: "booking",
  growthPlan: "growth_plan",
} as const;

export type FormType = (typeof FORM_TYPES)[keyof typeof FORM_TYPES];

/** Default section and card imagery — curated Unsplash photos. */
export const SEED_IMAGES = {
  hero: STOCK_IMAGES.hero,
  team: STOCK_IMAGES.team,
  device: STOCK_IMAGES.device,
  social: STOCK_IMAGES.social,
  automation: STOCK_IMAGES.automation,
  storefront: STOCK_IMAGES.storefront,
  strategy: STOCK_IMAGES.strategy,
  webDesign: STOCK_IMAGES.webDesign,
  mobileApp: STOCK_IMAGES.mobileApp,
  seo: STOCK_IMAGES.seo,
  ads: STOCK_IMAGES.ads,
  brand: STOCK_IMAGES.brand,
} as const;

/** Server-only defaults derived from env at runtime via helpers in other modules. */
export const DEFAULTS = {
  currency: "CAD",
  timeZone: "America/Toronto",
  slotDurationMinutes: 30,
  bookingLeadTimeHours: 24,
  bookingHorizonDays: 60,
  maxUploadBytes: 5 * 1024 * 1024,
  allowedImageMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;
