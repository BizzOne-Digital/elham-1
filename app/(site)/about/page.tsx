import Image from "next/image";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPageBySlug, sortSections } from "@/lib/data/pages";
import { PRIMARY_CTA, SEED_IMAGES } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "About",
  description: "Built to help small businesses move with tailored strategy, technology, and marketing.",
  path: "/about",
});

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const sections = sortSections(page?.sections ?? []);

  return (
    <>
      <SectionRenderer sections={sections} />
      <section className="section-pad border-t border-white/10">
        <ScrollReveal className="container-site min-w-0 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="pt-4 sm:pt-6 lg:pt-10">
            <p className="label-caps mb-3">Visual story</p>
            <h2 className="text-3xl font-bold">Strategy in motion</h2>
            <p className="mt-4 text-concrete">
              From storefronts to dashboards, we design growth systems that feel as sharp as they perform.
            </p>
            <TransitionLink href={PRIMARY_CTA.href} className="mt-6 inline-flex min-h-11 items-center text-signal-red">
              {PRIMARY_CTA.label} →
            </TransitionLink>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[SEED_IMAGES.storefront, SEED_IMAGES.automation, SEED_IMAGES.social, SEED_IMAGES.strategy].map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
