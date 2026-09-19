import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { SiteImage } from "@/components/site/SiteImage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPageBySlug, sortSections } from "@/lib/data/pages";
import { BRAND_ASSETS, PRIMARY_CTA, SEED_IMAGES } from "@/lib/constants";

const ABOUT_GRID_IMAGES = [
  { src: BRAND_ASSETS.storySectionImage, alt: "Strategy and analytics workspace" },
  { src: SEED_IMAGES.automation, alt: "Business automation dashboard" },
  { src: SEED_IMAGES.device, alt: "Analytics and performance dashboard" },
  { src: SEED_IMAGES.webDesign, alt: "Custom website design workspace" },
] as const;

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
          <div className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center pt-4 sm:pt-6 lg:pt-10">
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
            {ABOUT_GRID_IMAGES.map((item) => (
              <div key={item.src} className="relative aspect-square overflow-hidden rounded-xl">
                <SiteImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized={item.src.startsWith("/images/")}
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
