import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProjectBySlug, getProjectSlugs } from "@/lib/data/gallery";
import { PRIMARY_CTA, ROUTES, SEED_IMAGES } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildPageMetadata({
    title: project.title,
    description: project.excerpt,
    path: `/gallery/${slug}`,
  });
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const images = project.images?.length
    ? project.images
    : [{ url: project.coverImage?.url ?? SEED_IMAGES.webDesign, alt: project.title }];

  return (
    <>
      <section className="section-pad bg-carbon">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs
              centered
              items={[
                { label: "Home", href: "/" },
                { label: "Work", href: ROUTES.gallery },
                { label: project.title },
              ]}
            />
            <h1 className="mt-4 text-4xl font-bold">{project.title}</h1>
            {project.excerpt && <p className="mx-auto mt-4 max-w-2xl text-lg text-concrete">{project.excerpt}</p>}
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className={`relative overflow-hidden rounded-2xl ${index === 0 ? "md:col-span-2 lg:col-span-2 aspect-[16/10]" : "aspect-square"}`}
            >
              <Image src={image.url} alt={image.alt ?? `${project.title} image ${index + 1}`} fill className="object-cover" sizes="33vw" />
            </div>
          ))}
        </div>
      </section>

      {project.description && (
        <section className="section-pad bg-graphite">
          <ScrollReveal className="container-site max-w-3xl prose prose-invert">
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
          </ScrollReveal>
        </section>
      )}

      <section className="section-pad text-center">
        <TransitionLink href={PRIMARY_CTA.href} className="inline-flex min-h-11 items-center rounded-full bg-signal-red px-8 py-3 font-semibold">
          {PRIMARY_CTA.label}
        </TransitionLink>
      </section>
    </>
  );
}
