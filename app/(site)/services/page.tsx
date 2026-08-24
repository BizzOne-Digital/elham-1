import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SiteImage } from "@/components/site/SiteImage";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPublishedServices } from "@/lib/data/services";
import { getPublishedFaqs } from "@/lib/data/faqs";
import { resolveServiceImage } from "@/lib/stock-images";
import { PRIMARY_CTA, ROUTES, SEED_IMAGES, SECONDARY_CTA } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Services",
  description: "Websites, apps, AI automation, social media, ads, SEO, and growth strategy for small business.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, faqs] = await Promise.all([getPublishedServices(), getPublishedFaqs(4)]);

  return (
    <>
      <section className="relative overflow-hidden bg-carbon grain section-pad">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
            <p className="label-caps mb-4 text-signal-red">Capabilities</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Choose your growth path</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-concrete">
              Eight connected services—from custom web design starting at CAD 99 to full growth marketing strategy.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <TransitionLink href={PRIMARY_CTA.href} className="rounded-full bg-signal-red px-6 py-3 text-sm font-semibold">
                {PRIMARY_CTA.label}
              </TransitionLink>
              <TransitionLink href={SECONDARY_CTA.href} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold">
                {SECONDARY_CTA.label}
              </TransitionLink>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0 grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const imageSrc = resolveServiceImage(
              service.slug,
              service.featuredImage?.url,
              SEED_IMAGES.webDesign,
            );

            return (
            <ScrollReveal key={service._id} delay={index * 0.04}>
              <TransitionLink
                href={`/services/${service.slug}`}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite md:grid md:grid-cols-[minmax(0,180px)_minmax(0,1fr)]"
              >
                <div className="relative aspect-[16/10] min-h-[160px] md:aspect-auto md:min-h-[180px]">
                  <SiteImage
                    src={imageSrc}
                    alt={service.featuredImage?.alt ?? service.title}
                    fill
                    unoptimized={imageSrc.startsWith("/images/")}
                    className="object-cover transition group-hover:scale-105"
                    sizes="180px"
                  />
                </div>
                <div className="min-w-0 p-6">
                  <span className="text-sm font-bold text-signal-red">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="mt-2 text-xl font-bold">{service.title}</h2>
                  <p className="mt-2 text-sm text-steel">{service.shortDescription}</p>
                </div>
              </TransitionLink>
            </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="section-pad bg-void-black">
        <ScrollReveal className="container-site min-w-0 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <SiteImage src={SEED_IMAGES.automation} alt="Connected service diagram" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="pt-4 sm:pt-6 lg:pt-10">
            <h2 className="text-3xl font-bold">One connected growth system</h2>
            <p className="mt-4 text-concrete">
              Brand, website, automation, content, traffic, and conversion—designed to work together instead of in silos.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold">Pricing teaser</h2>
          <p className="mt-4 text-concrete">
            Custom websites can start from CAD 99. Apps, automation, ads, and strategy are quoted after discovery.
          </p>
          <TransitionLink href={ROUTES.pricing} className="mt-6 inline-block font-semibold text-signal-red">
            View pricing →
          </TransitionLink>
        </div>
      </section>

      <section className="section-pad bg-graphite">
        <div className="container-site max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq._id} className="rounded-xl border border-white/10 bg-carbon p-4">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm text-steel">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
