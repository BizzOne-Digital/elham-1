import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/models/SiteSettings";
import { DEFAULT_CONTACT } from "@/lib/data/fallbacks";
import { HEADER_NAV_ITEMS, NAV_ITEMS, PRIMARY_CTA } from "@/lib/constants";
import { serializeDoc } from "@/lib/data/serialize";
import type { Button, ContactInfo, NavItem, SocialLink } from "@/models/shared";

export interface SiteSettingsData {
  brand: {
    name: string;
    tagline?: string;
    logo?: string;
    logoAlt?: string;
    favicon?: string;
  };
  contact: ContactInfo;
  social: SocialLink[];
  nav: {
    main: NavItem[];
    footer: NavItem[];
    cta?: Button;
  };
  footer: {
    copyrightText?: string;
    tagline?: string;
    columns?: { title: string; links: NavItem[] }[];
    legalLinks?: NavItem[];
    showSocialLinks?: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  currency?: string;
  timezone?: string;
  featureFlags?: Record<string, boolean>;
  legal?: {
    privacyPolicyContent?: string;
    termsOfServiceContent?: string;
  };
}

const defaultSettings: SiteSettingsData = {
  brand: {
    name: "Netbrandit",
    tagline:
      "Your one-stop growth partner—websites, apps, AI automation, social media, and marketing programmes tailored to your business.",
  },
  contact: {
    email: DEFAULT_CONTACT.email,
    phone: DEFAULT_CONTACT.phone,
    country: "Canada",
  },
  social: [],
  nav: {
    main: [...HEADER_NAV_ITEMS],
    footer: [...NAV_ITEMS],
    cta: PRIMARY_CTA,
  },
  footer: {
    copyrightText: `© ${new Date().getFullYear()} Netbrandit. All rights reserved.`,
    tagline: "Built for small-business growth.",
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    showSocialLinks: true,
  },
  currency: "CAD",
  timezone: "America/Toronto",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ key: "global" }).lean();
    if (settings) {
      const data = serializeDoc(settings) as SiteSettingsData & { brand: SiteSettingsData["brand"] };
      return {
        ...defaultSettings,
        ...data,
        brand: { ...defaultSettings.brand, ...data.brand },
        contact: { ...defaultSettings.contact, ...data.contact },
        nav: {
          main: data.nav?.main?.length ? data.nav.main : defaultSettings.nav.main,
          footer: data.nav?.footer?.length ? data.nav.footer : defaultSettings.nav.footer,
          cta: data.nav?.cta ?? defaultSettings.nav.cta,
        },
        footer: { ...defaultSettings.footer, ...data.footer },
      };
    }
  } catch {
    // fall through
  }

  return defaultSettings;
}
