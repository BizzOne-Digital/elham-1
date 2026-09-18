import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { BRAND, BRAND_ASSETS, DEFAULTS, HEADER_NAV_ITEMS, HERO_COPY, HERO_CTA, PRIMARY_CTA, PRICING_PROMO_HEADING, ROUTES } from "@/lib/constants";
import { SEED_FILE_IMAGES, SERVICE_STOCK_IMAGES, STOCK_IMAGES } from "@/lib/stock-images";
import { SECTION_TYPES } from "@/lib/cms/sections";
import {
  AdminUser,
  AvailabilityRule,
  BlogPost,
  FAQ,
  GalleryCategory,
  GalleryProject,
  MeetingType,
  Page,
  PricingPackage,
  Service,
  SiteSettings,
  Testimonial,
} from "@/models";
import type { Section } from "@/models/shared";

function loadEnvFile(fileName: string) {
  const fullPath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(fullPath)) {
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before running seed.");
  process.exit(1);
}

const adminEmail = ADMIN_EMAIL;
const adminPassword = ADMIN_PASSWORD;

const CONTACT_EMAIL = "info@netbrandit.com";
const CONTACT_PHONE = "416-700-2656";
const CONTACT_PHONE_E164 = "+14167002656";
const TIMEZONE = process.env.HOST_TIME_ZONE ?? DEFAULTS.timeZone;

function img(file: string, alt: string) {
  const url = SEED_FILE_IMAGES[file] ?? STOCK_IMAGES.webDesign;
  return {
    url,
    alt,
    width: 1200,
    height: 800,
  };
}

function serviceImg(slug: string, alt: string) {
  const url = SERVICE_STOCK_IMAGES[slug] ?? STOCK_IMAGES.webDesign;
  return {
    url,
    alt,
    width: 1200,
    height: 800,
  };
}

function section(
  id: string,
  type: string,
  order: number,
  data: Record<string, unknown>,
  label?: string,
): Section {
  return {
    id,
    type,
    label: label ?? id,
    order,
    enabled: true,
    data,
  };
}

const SERVICES = [
  {
    slug: "custom-web-design",
    title: "Custom Web Design",
    shortDescription:
      "Conversion-focused, responsive websites tailored to the business.",
    description:
      "Conversion-focused, responsive websites tailored to the business. Final scope and quote are confirmed after discovery.",
    startingPrice: "Starting from $99.99",
    highlights: [
      "Responsive layouts",
      "Lead-focused page structure",
      "Editable CMS content",
      "Discovery-led quoting",
    ],
    image: "service-web-design",
    sortOrder: 1,
  },
  {
    slug: "web-and-mobile-app-development",
    title: "Web and Mobile App Development",
    shortDescription:
      "Customer portals, internal tools, booking systems, dashboards, and custom digital products.",
    description: "Custom quote based on product scope, integrations, and timeline.",
    startingPrice: "Custom quote",
    highlights: ["Portals", "Dashboards", "Booking systems", "Custom products"],
    image: "device-mobile",
    sortOrder: 2,
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    shortDescription:
      "Identify repetitive tasks, connect tools, and improve operational efficiency with practical automation.",
    description:
      "Automation recommendations focus on business purpose, human oversight, and secure data handling.",
    startingPrice: "Custom quote",
    highlights: ["Workflow review", "Tool connections", "Lead handling", "Operational efficiency"],
    image: "service-automation",
    sortOrder: 3,
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    shortDescription:
      "Content planning, creative direction, scheduling, channel management, and performance review.",
    description: "Scope can include planning, production, scheduling, and reporting.",
    startingPrice: "Custom quote",
    highlights: ["Content planning", "Creative direction", "Scheduling", "Reporting"],
    image: "collage-grid",
    sortOrder: 4,
  },
  {
    slug: "competitor-analysis-and-market-research",
    title: "Competitor Analysis and Market Research",
    shortDescription:
      "Analyse positioning, offers, messaging, content, search visibility, and advertising activity.",
    description:
      "Findings are presented as research and strategic guidance, not guaranteed predictions.",
    startingPrice: "Custom quote",
    highlights: ["Positioning review", "Offer analysis", "Search visibility", "Ad activity review"],
    image: "texture-business-1",
    sortOrder: 5,
  },
  {
    slug: "google-and-meta-advertising",
    title: "Google and Meta Advertising",
    shortDescription:
      "Campaign strategy, creative, setup, audience targeting, tracking, optimisation, and reporting.",
    description:
      "Ad spend is separate unless explicitly included in a proposal. Results are not guaranteed.",
    startingPrice: "Custom quote",
    highlights: ["Campaign strategy", "Creative", "Tracking", "Optimisation"],
    image: "abstract-redline-2",
    sortOrder: 6,
  },
  {
    slug: "search-engine-optimisation",
    title: "Search Engine Optimisation",
    shortDescription:
      "Technical foundations, keyword research, on-page SEO, content direction, local-search support, and reporting.",
    description:
      "SEO work focuses on sound setup, content direction, and transparent reporting without ranking guarantees.",
    startingPrice: "Custom quote",
    highlights: ["Technical SEO", "Keyword research", "On-page SEO", "Local search support"],
    image: "abstract-redline-1",
    sortOrder: 7,
  },
  {
    slug: "growth-marketing-strategy",
    title: "Growth Marketing Strategy",
    shortDescription:
      "Broader marketing goals, positioning, channel planning, campaigns, offers, and an actionable growth roadmap.",
    description: "A practical roadmap aligned to business goals, channels, and capacity.",
    startingPrice: "Custom quote",
    highlights: ["Positioning", "Channel planning", "Campaign direction", "Growth roadmap"],
    image: "process-diagram",
    sortOrder: 8,
  },
] as const;

const FAQS = [
  {
    question: "What does Netbrandit do?",
    answer:
      "Netbrandit brings websites, apps, AI automation, social media, advertising, SEO, competitor research, and broader marketing strategy together around the needs of a small business.",
    category: "general",
  },
  {
    question: "Who do you work with?",
    answer:
      "Netbrandit is designed for small-business owners who want practical help improving their brand, digital presence, lead generation, or internal workflows.",
    category: "general",
  },
  {
    question: "Do custom websites really start at $99?",
    answer:
      "Yes, website projects can start from $99.99. The final price depends on scope, pages, functionality, content, integrations, and timeline. A clear quote is provided after discovery.",
    category: "pricing",
  },
  {
    question: "How long will my project take?",
    answer:
      "Timing depends on scope, feedback, content readiness, and required functionality. A realistic delivery plan is provided before work begins.",
    category: "process",
  },
  {
    question: "Can you automate parts of my business with AI?",
    answer:
      "Netbrandit can review repetitive workflows and recommend practical automation opportunities. Every automation should have a clear business purpose, appropriate human oversight, and secure handling of data.",
    category: "services",
  },
  {
    question: "Can you manage my social media?",
    answer:
      "Yes. The scope can include planning, creative direction, content production, scheduling, community workflows, and performance reporting.",
    category: "services",
  },
  {
    question: "Do you guarantee ad results or Google rankings?",
    answer:
      "No responsible agency can guarantee a specific ranking, lead volume, revenue result, or return. Netbrandit focuses on sound setup, strategy, testing, optimisation, and transparent reporting.",
    category: "expectations",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Ongoing support can be included in a custom proposal based on the platforms and services involved.",
    category: "support",
  },
  {
    question: "How do I get started?",
    answer:
      "Submit the growth-plan form or book a discovery call. Netbrandit will review your goals, challenges, timeline, and priorities before recommending next steps.",
    category: "getting-started",
  },
];

function buildPageSections(slug: string): Section[] {
  const hero = (id: string, heading: string, image: string, subheading?: string) =>
    section(id, SECTION_TYPES.hero, 0, {
      eyebrow: "NETBRANDIT",
      heading,
      subheading,
      primaryCta: { label: "Get a Free Growth Plan", href: ROUTES.contact },
      secondaryCta: { label: "Book a Discovery Call", href: ROUTES.book },
      image: SEED_FILE_IMAGES[image] ?? STOCK_IMAGES.hero,
    });

  switch (slug) {
    case "home":
      return [
        section("home-hero", SECTION_TYPES.hero, 0, {
          layoutVariant: "redline",
          heading: "BUILD. AUTOMATE. SCALE.",
          subheading: HERO_COPY.subheading,
          primaryCta: HERO_CTA.primary,
          priceBanner: HERO_COPY.priceBanner,
          backgroundImage: BRAND_ASSETS.heroBackground,
        }),
        section("home-story", SECTION_TYPES.features, 1, {
          heading: "Small business. Big potential.",
          items: [
            {
              title: "Strategy first",
              description:
                "Campaigns, brand recognition, and digital platforms aligned to business goals.",
            },
            {
              title: "Connected systems",
              description:
                "Websites, apps, automation, content, ads, and SEO working together.",
            },
            {
              title: "Practical growth",
              description: "Clear next steps, honest pricing conversations, and measurable progress.",
            },
          ],
        }),
        section("home-services", SECTION_TYPES.services, 2, {
          heading: "Services",
          items: SERVICES.slice(0, 4).map((service) => ({
            title: service.title,
            description: service.shortDescription,
            href: `/services/${service.slug}`,
          })),
        }),
        section("home-process", SECTION_TYPES.features, 3, {
          heading: "Discover · Position · Build · Launch · Optimise",
          image: BRAND_ASSETS.processSectionImage,
          items: [
            { title: "Discover", description: "Understand goals, audience, and constraints." },
            { title: "Position", description: "Sharpen the offer and message." },
            { title: "Build", description: "Design and develop the growth system." },
            { title: "Launch", description: "Deploy with tracking and QA." },
            { title: "Optimise", description: "Improve based on real performance." },
          ],
        }),
        section("home-testimonials", "testimonialSlider", 4, {
          heading: "Client voices",
          showFromDb: true,
        }),
        section("home-faq", SECTION_TYPES.faq, 5, {
          heading: "Questions before you start?",
          items: FAQS.slice(0, 3).map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        }),
        section("home-pricing", SECTION_TYPES.cta, 6, {
          heading: PRICING_PROMO_HEADING,
          body: "Final price depends on scope and is confirmed after discovery.",
          cta: PRIMARY_CTA,
          image: STOCK_IMAGES.webDesign,
        }),
      ];
    case "about":
      return [
        hero(
          "about-hero",
          "Built to help small businesses move.",
          "hero-about",
          "We help small business owners sharpen their brand, build better digital experiences, automate repetitive work, reach the right audience, and create a practical path to more leads and sustainable growth.",
        ),
        section("about-story", SECTION_TYPES.richText, 1, {
          heading: "Mission",
          content:
            "<p>Netbrandit helps small business owners improve brand recognition, build effective digital platforms, run smarter marketing campaigns, and use technology to scale.</p>",
        }),
        section("about-principles", SECTION_TYPES.features, 2, {
          heading: "Principles",
          items: [
            { title: "Tailored, not templated", description: "Every engagement starts with business context." },
            { title: "Clear strategy before execution", description: "Direction before production." },
            { title: "Technology with a business purpose", description: "Tools must serve outcomes." },
            { title: "Practical communication", description: "Plain language and honest timelines." },
            { title: "Growth measured honestly", description: "No inflated promises or fake metrics." },
          ],
        }),
        section("about-cta", "leadForm", 4, {
          heading: "Receive a free growth plan",
          variant: "full",
          layout: "centered",
        }),
      ];
    case "services":
      return [
        hero(
          "services-hero",
          "One partner. One connected growth system.",
          "hero-services",
          "Choose the capabilities you need now and expand as your business grows.",
        ),
        section("services-grid", SECTION_TYPES.services, 1, {
          heading: "Eight ways we help you grow",
          items: SERVICES.map((service) => ({
            title: service.title,
            description: service.shortDescription,
            href: `/services/${service.slug}`,
          })),
        }),
        section("services-cta", SECTION_TYPES.cta, 2, {
          heading: "Not sure where to start?",
          description: "Book a discovery call and we will map the right path.",
          buttonLabel: "Book a Discovery Call",
          buttonHref: ROUTES.book,
        }),
      ];
    case "pricing":
      return [
        hero(
          "pricing-hero",
          "Honest pricing conversations",
          "hero-pricing",
          "Starting points are published clearly. Final scope and quotes are confirmed after discovery.",
        ),
        section("pricing-note", SECTION_TYPES.richText, 1, {
          heading: "Important",
          content:
            "<p>Only the website starting price is fixed as a starting point. All other services are quoted after discovery based on scope, timeline, and required integrations.</p>",
        }),
        section("pricing-cta", SECTION_TYPES.cta, 2, {
          heading: "Request your quote",
          description: "Tell us what you are trying to achieve.",
          buttonLabel: "Request My Quote",
          buttonHref: ROUTES.contact,
        }),
      ];
    case "gallery":
      return [
        hero(
          "gallery-hero",
          "Concept work and visual direction",
          "hero-gallery",
          "Draft demo projects only. Replace with approved client work when available.",
        ),
        section("gallery-intro", SECTION_TYPES.richText, 1, {
          heading: "Gallery / Work",
          content:
            "<p>These seeded projects are concept/demo work and are not published as client case studies.</p>",
        }),
      ];
    case "testimonials":
      return [
        hero(
          "testimonials-hero",
          "Client stories appear here when approved",
          "hero-testimonials",
          "Draft placeholders exist in admin only until real testimonials are supplied.",
        ),
        section("testimonials-empty", SECTION_TYPES.richText, 1, {
          heading: "Credibility without fabrication",
          content:
            "<p>No approved testimonials are published yet. This page can be hidden from navigation until approved quotes are added.</p>",
        }),
      ];
    case "faqs":
      return [
        hero("faqs-hero", "Answers that keep things practical", "hero-faqs"),
        section("faqs-list", SECTION_TYPES.faq, 1, {
          heading: "Frequently asked questions",
          items: FAQS.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
          })),
        }),
      ];
    case "blog":
      return [
        hero(
          "blog-hero",
          "Insights for small-business growth",
          "hero-blog",
          "Practical articles on websites, automation, and marketing channels.",
        ),
      ];
    case "booking":
      return [
        hero(
          "booking-hero",
          "Free 30-Minute Discovery Call",
          "hero-booking",
          "Choose a time that works for you. Times are shown in your local time zone.",
        ),
        section("booking-note", SECTION_TYPES.richText, 1, {
          heading: "What to expect",
          content:
            "<p>We will review your goals, current challenges, timeline, and priorities before recommending next steps.</p>",
        }),
      ];
    case "contact":
      return [
        hero(
          "contact-hero",
          "Let us talk about your next move",
          "hero-contact",
          "We typically respond within one business day.",
        ),
        section("contact-panel", SECTION_TYPES.contact, 1, {
          heading: "Contact Netbrandit",
          description: `${CONTACT_EMAIL} · ${CONTACT_PHONE} · ${CONTACT_PHONE_E164}`,
        }),
      ];
    case "privacy":
      return [
        hero("privacy-hero", "Privacy Policy", "texture-business-2", "Placeholder copy for owner/legal review."),
        section("privacy-body", SECTION_TYPES.richText, 1, {
          content:
            "<p>This placeholder privacy policy covers form submissions, booking data, cookies/analytics placeholders, email communications, third-party services, data retention, and contact details. Replace with final legal copy before launch.</p>",
        }),
      ];
    case "terms":
      return [
        hero("terms-hero", "Terms of Service", "texture-business-1", "Placeholder copy for owner/legal review."),
        section("terms-body", SECTION_TYPES.richText, 1, {
          content:
            "<p>This placeholder terms page covers service scope, client responsibilities, approvals, platform compliance, and the absence of guaranteed marketing outcomes. Replace with final legal copy before launch.</p>",
        }),
      ];
    default:
      return [
        hero(`${slug}-hero`, slug.replace(/-/g, " "), "abstract-redline-3"),
      ];
  }
}

const SYSTEM_PAGES = [
  { slug: "home", title: "Home", navLabel: "Home", showInNav: true, navOrder: 0 },
  { slug: "about", title: "About", navLabel: "About", showInNav: true, navOrder: 1 },
  { slug: "services", title: "Services", navLabel: "Services", showInNav: true, navOrder: 2 },
  { slug: "pricing", title: "Pricing", navLabel: "Pricing", showInNav: true, navOrder: 4 },
  { slug: "gallery", title: "Gallery / Work", navLabel: "Work", showInNav: true, navOrder: 3 },
  { slug: "testimonials", title: "Testimonials", navLabel: "Testimonials", showInNav: false, navOrder: 6 },
  { slug: "faqs", title: "FAQs", navLabel: "FAQs", showInNav: false, navOrder: 7 },
  { slug: "blog", title: "Insights", navLabel: "Insights", showInNav: true, navOrder: 5 },
  { slug: "booking", title: "Booking", navLabel: "Booking", showInNav: false, navOrder: 8 },
  { slug: "contact", title: "Contact", navLabel: "Contact", showInNav: true, navOrder: 6 },
  { slug: "privacy", title: "Privacy Policy", navLabel: "Privacy", showInNav: false, navOrder: 90 },
  { slug: "terms", title: "Terms of Service", navLabel: "Terms", showInNav: false, navOrder: 91 },
];

async function seedSiteSettings() {
  await SiteSettings.findOneAndUpdate(
    { key: "global" },
    {
      key: "global",
      brand: {
        name: BRAND.name,
        tagline: BRAND.tagline,
        logo: BRAND_ASSETS.logo,
        logoAlt: BRAND_ASSETS.logoAlt,
        favicon: BRAND_ASSETS.favicon,
        primaryColor: "#050505",
        secondaryColor: "#F21D2F",
      },
      contact: {
        email: CONTACT_EMAIL,
        phone: CONTACT_PHONE,
        country: "Canada",
        mapEmbedUrl: `tel:${CONTACT_PHONE_E164}`,
      },
      social: [],
      nav: {
        main: HEADER_NAV_ITEMS.map((item) => ({
          label: item.label,
          href: item.href,
        })),
        footer: SYSTEM_PAGES.filter((page) => ["about", "services", "contact", "privacy", "terms"].includes(page.slug)).map(
          (page) => ({
            label: page.navLabel,
            href: page.slug === "home" ? ROUTES.home : `/${page.slug}`,
          }),
        ),
        cta: {
          label: PRIMARY_CTA.label,
          href: PRIMARY_CTA.href,
          variant: "primary",
        },
      },
      footer: {
        copyrightText: `© ${new Date().getFullYear()} Netbrandit`,
        tagline: "Digital branding and web solutions for small business.",
        showSocialLinks: true,
        legalLinks: [
          { label: "Privacy", href: ROUTES.privacy },
          { label: "Terms", href: ROUTES.terms },
        ],
      },
      seo: {
        title: BRAND.name,
        description: BRAND.tagline,
        keywords: ["web design", "marketing", "automation", "small business"],
      },
      currency: DEFAULTS.currency,
      timezone: TIMEZONE,
      bookingPolicy: {
        minNoticeHours: DEFAULTS.bookingLeadTimeHours,
        maxAdvanceDays: DEFAULTS.bookingHorizonDays,
        cancellationHours: 24,
        rescheduleHours: 12,
        confirmationMessage: "Your discovery call request has been received.",
        cancellationPolicy: "Please cancel or reschedule at least 24 hours in advance.",
        autoConfirm: true,
      },
      featureFlags: {
        enableBlog: true,
        enableGallery: true,
        enableBooking: true,
        enableTestimonials: true,
        enableFAQ: true,
        enableLeadCapture: true,
        enablePricing: true,
        maintenanceMode: false,
      },
      legal: {
        privacyPolicyUrl: ROUTES.privacy,
        termsOfServiceUrl: ROUTES.terms,
        privacyPolicyContent:
          "Placeholder privacy policy for owner/legal review.",
        termsOfServiceContent:
          "Placeholder terms of service for owner/legal review.",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

async function seedPages() {
  for (const page of SYSTEM_PAGES) {
    await Page.findOneAndUpdate(
      { slug: page.slug },
      {
        slug: page.slug,
        title: page.title,
        subtitle: BRAND.tagline,
        sections: buildPageSections(page.slug),
        seo: {
          title: page.title,
          description: BRAND.tagline,
        },
        navigation: {
          showInNav: page.showInNav,
          navLabel: page.navLabel,
          navOrder: page.navOrder,
        },
        status: "published",
        publishedAt: new Date(),
        sortOrder: page.navOrder,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedServices() {
  for (const service of SERVICES) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      {
        slug: service.slug,
        title: service.title,
        shortDescription: service.shortDescription,
        description: service.description,
        icon: "sparkles",
        featuredImage: serviceImg(service.slug, `${service.title} illustration`),
        highlights: [...service.highlights],
        isFeatured: service.sortOrder <= 3,
        sortOrder: service.sortOrder,
        status: "published",
        detailPage: {
          hero: {
            title: service.title,
            subtitle: service.shortDescription,
            image: serviceImg(service.slug, `${service.title} hero image`),
            cta: {
              label: "Request a Quote",
              href: ROUTES.contact,
              variant: "primary",
            },
          },
          sections: [
            section("problem", SECTION_TYPES.richText, 0, {
              heading: "The business problem",
              content:
                "<p>Small businesses need digital experiences that support lead generation without unnecessary complexity.</p>",
            }),
            section("approach", SECTION_TYPES.richText, 1, {
              heading: "The Netbrandit approach",
              content: `<p>${service.description}</p>`,
            }),
            section("deliverables", SECTION_TYPES.features, 2, {
              heading: "Deliverables",
              items: service.highlights.map((item) => ({
                title: item,
                description: "Scope confirmed during discovery.",
              })),
            }),
            section("cta", SECTION_TYPES.cta, 3, {
              heading: "Ready to discuss this service?",
              description: service.startingPrice,
              buttonLabel: "Get a Free Growth Plan",
              buttonHref: ROUTES.contact,
            }),
          ],
          seo: {
            title: service.title,
            description: service.shortDescription,
          },
          cta: {
            label: "Book a Discovery Call",
            href: ROUTES.book,
            variant: "primary",
          },
          content: service.description,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedPricing() {
  const packages = [
    {
      slug: "custom-website",
      name: "Custom Website",
      description:
        "A tailored starting point for small businesses ready to establish or improve their online presence. Final scope, timeline, and price are confirmed after a discovery conversation.",
      price: 99.99,
      billingPeriod: "one_time",
      features: [
        "Discovery-led scope",
        "Responsive design direction",
        "Lead-focused structure",
        "Editable CMS content",
      ],
      isPopular: true,
      sortOrder: 1,
      cta: { label: "Request My Quote", href: ROUTES.contact, variant: "primary" },
    },
    {
      slug: "apps-and-portals",
      name: "Apps and Portals",
      description: "Custom quote for portals, dashboards, and digital products.",
      price: 0,
      billingPeriod: "custom",
      features: ["Discovery workshop", "Scope definition", "Custom quote"],
      sortOrder: 2,
    },
    {
      slug: "ai-automation",
      name: "AI Automation",
      description: "Custom quote for workflow review and automation implementation.",
      price: 0,
      billingPeriod: "custom",
      features: ["Workflow audit", "Tool mapping", "Automation plan"],
      sortOrder: 3,
    },
    {
      slug: "social-media-management",
      name: "Social Media Management",
      description: "Custom quote based on channels, cadence, and production needs.",
      price: 0,
      billingPeriod: "custom",
      features: ["Planning", "Creative direction", "Reporting"],
      sortOrder: 4,
    },
    {
      slug: "advertising-and-seo",
      name: "Advertising and SEO",
      description: "Custom quote for paid campaigns and search visibility work.",
      price: 0,
      billingPeriod: "custom",
      features: ["Campaign setup", "Tracking", "Optimisation"],
      sortOrder: 5,
    },
    {
      slug: "growth-strategy",
      name: "Growth Strategy",
      description: "Custom quote for broader marketing planning and roadmaps.",
      price: 0,
      billingPeriod: "custom",
      features: ["Positioning", "Channel plan", "Roadmap"],
      sortOrder: 6,
    },
  ] as const;

  for (const pkg of packages) {
    await PricingPackage.findOneAndUpdate(
      { slug: pkg.slug },
      {
        ...pkg,
        currency: DEFAULTS.currency,
        status: "published",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedGallery() {
  const categories = [
    { slug: "websites", name: "Websites", description: "Website concept visuals", sortOrder: 1 },
    { slug: "apps-and-portals", name: "Apps and Portals", description: "App and portal concepts", sortOrder: 2 },
    { slug: "ai-automations", name: "AI Automations", description: "Automation flow concepts", sortOrder: 3 },
    { slug: "social-media", name: "Social Media", description: "Social content concepts", sortOrder: 4 },
    { slug: "paid-campaigns", name: "Paid Campaigns", description: "Campaign creative concepts", sortOrder: 5 },
    { slug: "brand-systems", name: "Brand Systems", description: "Brand direction concepts", sortOrder: 6 },
  ];

  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const saved = await GalleryCategory.findOneAndUpdate(
      { slug: category.slug },
      { ...category, status: "published" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    categoryIds.set(category.slug, saved._id.toString());
  }

  const projects = [
    ["concept-redline-homepage", "websites", "Concept homepage layout", "hero-home"],
    ["concept-service-grid", "websites", "Service grid exploration", "collage-grid"],
    ["concept-booking-flow", "apps-and-portals", "Booking flow concept", "device-tablet"],
    ["concept-client-portal", "apps-and-portals", "Client portal dashboard concept", "device-laptop"],
    ["concept-automation-map", "ai-automations", "Automation map concept", "service-automation"],
    ["concept-lead-routing", "ai-automations", "Lead routing concept", "abstract-redline-2"],
    ["concept-social-grid", "social-media", "Social content grid concept", "collage-grid"],
    ["concept-editorial-post", "social-media", "Editorial post concept", "texture-business-1"],
    ["concept-paid-campaign", "paid-campaigns", "Paid campaign visual concept", "abstract-redline-1"],
    ["concept-landing-test", "paid-campaigns", "Landing page test concept", "hero-pricing"],
    ["concept-brand-system", "brand-systems", "Brand system concept", "abstract-redline-3"],
    ["concept-wordmark-system", "brand-systems", "Wordmark system concept", "process-diagram"],
  ] as const;

  for (const [index, [slug, categorySlug, title, image]] of projects.entries()) {
    await GalleryProject.findOneAndUpdate(
      { slug },
      {
        title,
        slug,
        category: categoryIds.get(categorySlug),
        description: "Concept/demo visual only. Replace with approved client work before publishing.",
        excerpt: "Draft concept project",
        coverImage: img(image, `${title} cover`),
        images: [img(image, `${title} image`), img("texture-business-2", `${title} detail`)],
        tags: ["concept", "demo"],
        isFeatured: index < 3,
        sortOrder: index + 1,
        status: "draft",
        seo: {
          title,
          description: "Draft concept project for Netbrandit gallery.",
          noIndex: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedFaqs() {
  for (const [index, faq] of FAQS.entries()) {
    await FAQ.findOneAndUpdate(
      { question: faq.question },
      {
        ...faq,
        sortOrder: index + 1,
        status: "published",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedBlogPosts(adminId?: string) {
  const posts = [
    {
      slug: "small-business-website-lead-generation",
      title: "What a Small-Business Website Needs to Generate Leads",
      excerpt:
        "The essentials for a website that helps visitors understand your offer and take action.",
      content:
        "<p>A lead-generating website needs a clear offer, fast structure, trust signals, and obvious next steps. This draft article outlines the fundamentals without inventing client results.</p>",
      tags: ["websites", "leads"],
      categories: ["Websites"],
    },
    {
      slug: "ai-automation-without-losing-the-human-touch",
      title: "Where AI Automation Can Save Time Without Losing the Human Touch",
      excerpt:
        "Practical automation opportunities for small businesses that still need human oversight.",
      content:
        "<p>Automation works best when it removes repetitive work while keeping people in control of customer-facing decisions. This draft explores common starting points.</p>",
      tags: ["automation", "operations"],
      categories: ["Automation"],
    },
    {
      slug: "seo-ads-or-social-where-to-start",
      title: "SEO, Ads, or Social: Which Channel Should You Start With?",
      excerpt:
        "How to choose a starting channel based on offer clarity, budget, and sales cycle.",
      content:
        "<p>There is no universal answer. This draft article compares starting with search visibility, paid traffic, or social presence based on business context.</p>",
      tags: ["seo", "ads", "social"],
      categories: ["Marketing"],
    },
  ];

  for (const [index, post] of posts.entries()) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        ...post,
        featuredImage: img(
          post.slug.includes("automation")
            ? "service-automation"
            : post.slug.includes("seo")
              ? "seo-analytics"
              : "service-web-design",
          `${post.title} featured image`,
        ),
        author: adminId,
        status: "draft",
        readingTimeMinutes: 5,
        isFeatured: index === 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedTestimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      company: "Maple & Main Café",
      role: "Owner",
      content:
        "We needed a website that actually brings in reservations, not just looks nice. Netbrandit rebuilt our site, tightened our Google listing, and gave us a simple way to track inquiries. Calls from the website started picking up within the first month.",
    },
    {
      name: "Marcus Reid",
      company: "Reid Home Services",
      role: "Founder",
      content:
        "I was juggling quotes in my inbox and losing follow-ups. They set up a clean site with a contact flow and helped me understand what to post locally. It feels professional now—and I spend less time chasing paperwork.",
    },
    {
      name: "Priya Sharma",
      company: "Bloom Studio Marketing",
      role: "Co-owner",
      content:
        "We wanted help with social content without hiring a full in-house team. The planning was structured, the creative direction was clear, and we finally had a calendar we could stick to.",
    },
    {
      name: "James Okafor",
      company: "Okafor Legal Support Services",
      role: "Director",
      content:
        "The discovery call was straightforward—no pressure, just honest scope talk. Our new pages explain what we do in plain language, and clients mention the site when they reach out.",
    },
  ];

  await Testimonial.deleteMany({
    name: { $in: ["Draft Testimonial Placeholder", "Second Draft Placeholder"] },
  });

  for (const [index, testimonial] of testimonials.entries()) {
    await Testimonial.findOneAndUpdate(
      { name: testimonial.name, company: testimonial.company },
      {
        ...testimonial,
        rating: 5,
        avatar: img("hero-testimonials", `${testimonial.name} portrait placeholder`),
        sortOrder: index + 1,
        status: "published",
        isFeatured: index < 2,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedMeetingTypeAndAvailability() {
  const meetingType = await MeetingType.findOneAndUpdate(
    { slug: "free-30-minute-discovery-call" },
    {
      name: "Free 30-Minute Discovery Call",
      slug: "free-30-minute-discovery-call",
      description:
        "A no-pressure conversation about your goals, challenges, and the services that may fit.",
      durationMinutes: 30,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 10,
      color: "#F21D2F",
      location: "online",
      locationDetails: "Video call link sent after confirmation.",
      isActive: true,
      sortOrder: 0,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  for (const dayOfWeek of [1, 2, 3, 4, 5]) {
    await AvailabilityRule.findOneAndUpdate(
      {
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
        timezoneId: TIMEZONE,
        meetingType: meetingType._id,
      },
      {
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
        timezoneId: TIMEZONE,
        meetingType: meetingType._id,
        isActive: true,
        sortOrder: dayOfWeek,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}

async function seedAdminUser() {
  const passwordHash = adminPassword.startsWith("$2") ?
    adminPassword
  : await bcrypt.hash(adminPassword, 12);

  const admin = await AdminUser.findOneAndUpdate(
    { email: adminEmail.toLowerCase() },
    {
      email: adminEmail.toLowerCase(),
      passwordHash,
      name: "Netbrandit Admin",
      role: "super_admin",
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return admin._id.toString();
}

async function main() {
  console.log("Connecting to MongoDB...");
  await connectDB();

  console.log("Seeding site settings...");
  await seedSiteSettings();

  console.log("Seeding pages...");
  await seedPages();

  console.log("Seeding services...");
  await seedServices();

  console.log("Seeding pricing...");
  await seedPricing();

  console.log("Seeding gallery...");
  await seedGallery();

  console.log("Seeding FAQs...");
  await seedFaqs();

  console.log("Seeding admin user...");
  const adminId = await seedAdminUser();

  console.log("Seeding blog posts...");
  await seedBlogPosts(adminId);

  console.log("Seeding testimonial placeholders...");
  await seedTestimonials();

  console.log("Seeding meeting type and availability...");
  await seedMeetingTypeAndAvailability();

  console.log("Seed completed successfully.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
