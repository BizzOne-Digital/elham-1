import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SiteImage } from "@/components/site/SiteImage";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { GrowthPlanForm } from "@/components/forms";
import { buildPageMetadata, buildServiceSchema, serializeJsonLd } from "@/lib/seo/metadata";
import { getServiceBySlug, getServiceSlugs, getPublishedServices } from "@/lib/data/services";
import { PRIMARY_CTA, ROUTES, SEED_IMAGES } from "@/lib/constants";
import { resolveStockImage } from "@/lib/stock-images";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildPageMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getPublishedServices()]);

  if (!service) notFound();

  const hero = service.detailPage?.hero;
  const related = allServices.filter((s) => s.slug !== slug).slice(0, 3);
  const gallerySources = [
    hero?.image?.url ?? service.featuredImage?.url ?? SEED_IMAGES.webDesign,
    SEED_IMAGES.device,
    SEED_IMAGES.team,
    SEED_IMAGES.social,
    SEED_IMAGES.automation,
  ];
  const galleryImages = gallerySources.map((src, index) =>
    resolveStockImage(src, gallerySources[index] ?? SEED_IMAGES.webDesign),
  );

  const schema = buildServiceSchema({
    name: service.title,
    description: service.shortDescription ?? service.title,
    url: `/services/${slug}`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />

      <section className="section-pad bg-carbon grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs
              centered
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: ROUTES.services },
                { label: service.title },
              ]}
            />
            <h1 className="mt-4 text-4xl font-bold">{hero?.title ?? service.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-concrete">{hero?.subtitle ?? service.shortDescription}</p>
            <TransitionLink href={PRIMARY_CTA.href} className="mt-8 inline-flex min-h-11 items-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold">
              {hero?.cta?.label ?? PRIMARY_CTA.label}
            </TransitionLink>
          </ScrollReveal>
        </div>
      </section>

      {service.detailPage?.sections && service.detailPage.sections.length > 0 ? (
        <SectionRenderer
          sections={service.detailPage.sections.map((section, index) => ({
            id: section.id,
            type: section.type,
            order: section.order ?? index,
            enabled: section.enabled,
            data: section.data,
          }))}
        />
      ) : (
        <>
          <section className="section-pad">
            <ScrollReveal className="container-site mx-auto max-w-3xl max-lg:text-center">
              <h2 className="text-3xl font-bold">The business problem</h2>
              <p className="mt-4 text-concrete">
                Small-business owners need {service.title.toLowerCase()} that supports real outcomes—not generic templates or vague promises.
              </p>
            </ScrollReveal>
          </section>
          <section className="section-pad bg-graphite">
            <ScrollReveal className="container-site mx-auto max-w-3xl max-lg:text-center">
              <h2 className="text-3xl font-bold">The Netbrandit approach</h2>
              <div
                className="prose prose-invert mt-4 max-w-none overflow-x-auto text-concrete max-lg:text-center lg:text-left"
                dangerouslySetInnerHTML={{ __html: service.detailPage?.content ?? service.description ?? "" }}
              />
            </ScrollReveal>
          </section>
        </>
      )}

      <section className="section-pad">
        <div className="container-site max-lg:text-center">
          <h2 className="mb-8 text-3xl font-bold">Visual gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((src, index) => (
              <div key={`${src}-${index}`} className={`relative overflow-hidden rounded-xl ${index === 0 ? "sm:col-span-2 lg:col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                <SiteImage src={src} alt={`${service.title} visual ${index + 1}`} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad bg-carbon">
          <div className="container-site max-lg:text-center">
            <h2 className="mb-6 text-2xl font-bold">Related services</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <TransitionLink key={item._id} href={`/services/${item.slug}`} className="rounded-xl border border-white/10 p-4 hover:border-signal-red/40">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-steel">{item.shortDescription}</p>
                </TransitionLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-site max-w-2xl">
          <GrowthPlanForm />
        </div>
      </section>
    </>
  );
}
