import type { Metadata } from "next";
import { BRAND, ROUTES } from "@/lib/constants";

export interface PageSeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function absoluteUrl(path = "/"): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function buildTitle(title?: string): string {
  if (!title) {
    return BRAND.name;
  }
  return `${title} | ${BRAND.name}`;
}

export function buildPageMetadata(input: PageSeoInput = {}): Metadata {
  const title = buildTitle(input.title);
  const description = input.description ?? BRAND.tagline;
  const url = absoluteUrl(input.path ?? "/");
  const image = input.image ? absoluteUrl(input.image) : undefined;

  return {
    title,
    description,
    keywords: input.keywords,
    robots: input.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND.name,
      locale: BRAND.defaultLocale.replace("-", "_"),
      type: input.type ?? "website",
      images: image ? [{ url: image, alt: input.title ?? BRAND.name }] : undefined,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export interface OrganizationSchemaInput {
  logoUrl?: string;
  sameAs?: string[];
  contactEmail?: string;
}

export function buildOrganizationSchema(input: OrganizationSchemaInput = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: getSiteUrl(),
    logo: input.logoUrl ? absoluteUrl(input.logoUrl) : undefined,
    sameAs: input.sameAs,
    contactPoint:
      input.contactEmail ?
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: input.contactEmail,
        }
      : undefined,
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  url?: string;
}

export function buildServiceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: BRAND.name,
      url: getSiteUrl(),
    },
    url: input.url ? absoluteUrl(input.url) : absoluteUrl(ROUTES.services),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image ? absoluteUrl(input.image) : undefined,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    author: {
      "@type": "Person",
      name: input.authorName ?? BRAND.name,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: getSiteUrl(),
    },
    mainEntityOfPage: absoluteUrl(input.path),
  };
}

export function serializeJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(data);
}
