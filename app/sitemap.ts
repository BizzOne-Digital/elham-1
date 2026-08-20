import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/connect";
import { ROUTES } from "@/lib/constants";
import { BlogPost, GalleryProject, Page, Service } from "@/models";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    ROUTES.home,
    ROUTES.about,
    ROUTES.services,
    ROUTES.portfolio,
    ROUTES.blog,
    ROUTES.contact,
    ROUTES.book,
    ROUTES.privacy,
    ROUTES.terms,
    "/pricing",
    "/testimonials",
    "/faqs",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === ROUTES.home ? "weekly" : "monthly",
    priority: path === ROUTES.home ? 1 : 0.7,
  }));

  try {
    await connectDB();

    const [pages, services, projects, posts] = await Promise.all([
      Page.find({ status: "published" }).select("slug updatedAt").lean(),
      Service.find({ status: "published" }).select("slug updatedAt").lean(),
      GalleryProject.find({ status: "published" }).select("slug updatedAt").lean(),
      BlogPost.find({ status: "published" }).select("slug updatedAt publishedAt").lean(),
    ]);

    const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/${page.slug === "home" ? "" : page.slug}`.replace(/\/$/, "") || baseUrl,
      lastModified: page.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: page.slug === "home" ? 1 : 0.8,
    }));

    const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/gallery/${project.slug}`,
      lastModified: project.updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...pageEntries,
      ...serviceEntries,
      ...projectEntries,
      ...blogEntries,
    ];
  } catch {
    return staticRoutes;
  }
}
