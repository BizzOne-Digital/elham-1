/** Curated Unsplash imagery matched to Netbrandit sections and services. */

export function unsplashPhoto(id: string, width = 1400) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const STOCK_IMAGES = {
  /** Modern workspace / digital business */
  hero: unsplashPhoto("1497366216548-37526070297c"),
  /** Team collaboration */
  team: unsplashPhoto("1522071820081-009f0129c71c"),
  /** Laptop dashboard / analytics */
  device: unsplashPhoto("1460925895917-afdab827c52f"),
  /** Social content on mobile */
  social: unsplashPhoto("1611162617474-5b21e939e07a"),
  /** Data dashboard / workflow automation */
  automation: unsplashPhoto("1551288049-bebda4e38f71"),
  /** Retail / small business storefront */
  storefront: unsplashPhoto("1441986300917-64674bd600d8"),
  /** Strategy planning at desk */
  strategy: unsplashPhoto("1454165804606-c3d57bc86b40"),
  /** Website design on laptop */
  webDesign: unsplashPhoto("1467232004584-a241de8bcf5d"),
  /** Mobile apps on phone */
  mobileApp: unsplashPhoto("1512941937669-90a1ba58a7d8"),
  /** SEO / search marketing */
  seo: unsplashPhoto("1563986768609-322da13575f3"),
  /** Paid ads / digital marketing */
  ads: unsplashPhoto("1533750349088-c747871576ac"),
  /** Brand identity / design */
  brand: unsplashPhoto("1561070791-36ec0986658f"),
  /** Home hero background — modern office with screens */
  heroBackground: unsplashPhoto("1497366754035-768391de3329", 1920),
} as const;

/** Maps legacy seed SVG filenames to relevant stock photos. */
export const SEED_FILE_IMAGES: Record<string, string> = {
  "hero-workspace": STOCK_IMAGES.hero,
  "team-collab": STOCK_IMAGES.team,
  "device-mockup": STOCK_IMAGES.device,
  "social-grid": STOCK_IMAGES.social,
  "automation-flow": STOCK_IMAGES.automation,
  "storefront": STOCK_IMAGES.storefront,
  "strategy-desk": STOCK_IMAGES.strategy,
  "web-design": STOCK_IMAGES.webDesign,
  "mobile-app": STOCK_IMAGES.mobileApp,
  "seo-analytics": STOCK_IMAGES.seo,
  "paid-ads": STOCK_IMAGES.ads,
  "brand-system": STOCK_IMAGES.brand,
  "service-web-design": STOCK_IMAGES.webDesign,
  "service-automation": STOCK_IMAGES.automation,
  "device-mobile": STOCK_IMAGES.mobileApp,
  "device-laptop": STOCK_IMAGES.device,
  "device-tablet": STOCK_IMAGES.mobileApp,
  "collage-grid": STOCK_IMAGES.social,
  "texture-business-1": STOCK_IMAGES.strategy,
  "texture-business-2": STOCK_IMAGES.storefront,
  "abstract-redline-1": STOCK_IMAGES.seo,
  "abstract-redline-2": STOCK_IMAGES.ads,
  "abstract-redline-3": STOCK_IMAGES.brand,
  "process-diagram": STOCK_IMAGES.brand,
  "hero-home": STOCK_IMAGES.webDesign,
  "hero-about": STOCK_IMAGES.storefront,
  "hero-services": STOCK_IMAGES.device,
  "hero-pricing": STOCK_IMAGES.webDesign,
  "hero-gallery": STOCK_IMAGES.webDesign,
  "hero-testimonials": STOCK_IMAGES.team,
  "hero-faqs": STOCK_IMAGES.strategy,
  "hero-blog": STOCK_IMAGES.strategy,
  "hero-contact": STOCK_IMAGES.team,
  "hero-booking": STOCK_IMAGES.strategy,
};

export const SERVICE_STOCK_IMAGES: Record<string, string> = {
  "custom-web-design": STOCK_IMAGES.webDesign,
  "web-and-mobile-app-development": STOCK_IMAGES.mobileApp,
  "web-mobile-app-development": STOCK_IMAGES.mobileApp,
  "ai-automation": STOCK_IMAGES.automation,
  "social-media-management": STOCK_IMAGES.social,
  "competitor-analysis-and-market-research": STOCK_IMAGES.strategy,
  "competitor-analysis": STOCK_IMAGES.strategy,
  "google-and-meta-advertising": STOCK_IMAGES.ads,
  "google-meta-advertising": STOCK_IMAGES.ads,
  "search-engine-optimisation": STOCK_IMAGES.seo,
  "growth-marketing-strategy": STOCK_IMAGES.brand,
};

export const GALLERY_CATEGORY_IMAGES: Record<string, string> = {
  websites: STOCK_IMAGES.webDesign,
  "apps-and-portals": STOCK_IMAGES.mobileApp,
  "ai-automations": STOCK_IMAGES.automation,
  "social-media": STOCK_IMAGES.social,
  "paid-campaigns": STOCK_IMAGES.ads,
  "brand-systems": STOCK_IMAGES.brand,
};

function resolveSeedFile(url: string): string | null {
  const file = url.split("/").pop()?.replace(/\.svg$/i, "");
  if (!file) return null;
  return SEED_FILE_IMAGES[file] ?? null;
}

/** Upgrade legacy local SVG placeholders to relevant Unsplash photos. */
export function resolveStockImage(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith("http")) return url;

  if (url.includes("/images/seed/") || url.endsWith(".svg")) {
    return resolveSeedFile(url) ?? fallback;
  }

  return url;
}

export function resolveServiceImage(
  slug: string | undefined,
  url: string | undefined,
  fallback: string = STOCK_IMAGES.webDesign,
): string {
  const mapped = slug ? SERVICE_STOCK_IMAGES[slug] : undefined;
  if (!url) return mapped ?? fallback;
  return resolveStockImage(url, mapped ?? fallback);
}

export function stockImageAlt(key: keyof typeof STOCK_IMAGES): string {
  const labels: Record<keyof typeof STOCK_IMAGES, string> = {
    hero: "Modern digital workspace",
    team: "Team collaborating on a project",
    device: "Laptop showing business analytics dashboard",
    social: "Social media content on a smartphone",
    automation: "Business data dashboard and workflow automation",
    storefront: "Small business retail storefront",
    strategy: "Business strategy planning session",
    webDesign: "Custom website design on a laptop screen",
    mobileApp: "Mobile app interface on a smartphone",
    seo: "Search engine optimisation and analytics",
    ads: "Digital advertising and marketing campaign planning",
    brand: "Brand identity and design direction",
    heroBackground: "Modern office workspace with technology",
  };
  return labels[key];
}
