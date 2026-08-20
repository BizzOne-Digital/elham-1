import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getGalleryCategories, getPublishedProjects } from "@/lib/data/gallery";
import { PRIMARY_CTA, SEED_IMAGES } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Work",
  description: "Gallery and concept work across websites, apps, automation, social, and campaigns.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [projects, categories] = await Promise.all([getPublishedProjects(), getGalleryCategories()]);

  return (
    <>
      <section className="section-pad bg-void-black grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
            <p className="label-caps mb-4 text-signal-red">Gallery / Work</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Visual work and concept directions</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-concrete">
              Replace demo concept projects with approved portfolio work. No fake client results or invented metrics.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0">
          <div className="mb-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-signal-red px-4 py-2 text-xs font-semibold uppercase">All</span>
            {categories.map((cat) => (
              <span key={cat._id} className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase text-steel">
                {cat.name}
              </span>
            ))}
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {projects.map((project, index) => (
              <ScrollReveal key={project._id} delay={index * 0.04} className="mb-4 break-inside-avoid">
                <Link href={`/gallery/${project.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10">
                  <div className={`relative ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
                    <Image
                      src={project.coverImage?.url ?? SEED_IMAGES.webDesign}
                      alt={project.coverImage?.alt ?? project.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-4">
                    {project.category && <p className="text-xs uppercase tracking-widest text-signal-red">{project.category}</p>}
                    <h2 className="mt-1 font-bold">{project.title}</h2>
                    {project.excerpt && <p className="mt-2 text-sm text-steel">{project.excerpt}</p>}
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-carbon text-center">
        <TransitionLink href={PRIMARY_CTA.href} className="inline-flex min-h-11 items-center rounded-full bg-signal-red px-8 py-3 font-semibold">
          {PRIMARY_CTA.label}
        </TransitionLink>
      </section>
    </>
  );
}
