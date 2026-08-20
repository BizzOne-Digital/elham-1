import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getPageBySlug,
  getPublishedFaqs,
  getPublishedPosts,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  sortSections,
} from "@/lib/data";

export const metadata = buildPageMetadata({
  title: "Digital growth for small business",
  description:
    "Netbrandit helps small-business owners build smarter websites, apps, automation, and marketing systems that generate qualified leads.",
  path: "/",
});

export default async function HomePage() {
  const [page, services, projects, testimonials, faqs, posts] = await Promise.all([
    getPageBySlug("home"),
    getPublishedServices(),
    getPublishedProjects(),
    getPublishedTestimonials(4),
    getPublishedFaqs(4),
    getPublishedPosts(3),
  ]);

  const sections = sortSections(page?.sections ?? []);

  return (
    <SectionRenderer
      sections={sections}
      context={{ services, projects, testimonials, faqs, posts }}
    />
  );
}
