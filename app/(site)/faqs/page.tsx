import { SiteImage } from "@/components/site/SiteImage";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata, buildBreadcrumbSchema, serializeJsonLd } from "@/lib/seo/metadata";
import { getFaqCategories, getPublishedFaqs } from "@/lib/data/faqs";
import { PRIMARY_CTA, ROUTES, SECONDARY_CTA, SEED_IMAGES } from "@/lib/constants";

const FAQ_GALLERY_IMAGES = [
  SEED_IMAGES.webDesign,
  SEED_IMAGES.automation,
  "/images/services/google-meta-advertising.png",
  SEED_IMAGES.seo,
] as const;

export const metadata = buildPageMetadata({
  title: "FAQs",
  description: "Answers about services, pricing, timelines, automation, and getting started with Netbrandit.",
  path: "/faqs",
});

export default async function FaqsPage() {
  const [faqs, categories] = await Promise.all([getPublishedFaqs(), getFaqCategories()]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "FAQs", path: "/faqs" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />

      <section className="section-pad bg-void-black grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />
            <h1 className="text-4xl font-bold">Questions, answered directly</h1>
            <p className="mx-auto mt-4 max-w-2xl text-concrete">Practical answers about scope, pricing, timelines, and how to get started.</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-steel">
                {category}
              </span>
            ))}
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <details key={faq._id} className="rounded-xl border border-white/10 bg-carbon p-5">
                <summary className="cursor-pointer text-lg font-semibold">{faq.question}</summary>
                <p className="mt-3 text-concrete">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FAQ_GALLERY_IMAGES.map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <SiteImage
                src={src}
                alt=""
                fill
                unoptimized={src.startsWith("/images/")}
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-graphite">
        <ScrollReveal className="container-site flex flex-wrap items-center justify-center gap-4">
          <TransitionLink href={SECONDARY_CTA.href} className="rounded-full border border-white/20 px-6 py-3 font-semibold">
            {SECONDARY_CTA.label}
          </TransitionLink>
          <TransitionLink href={ROUTES.contact} className="rounded-full bg-signal-red px-6 py-3 font-semibold">
            Contact us
          </TransitionLink>
          <TransitionLink href={PRIMARY_CTA.href} className="rounded-full border border-signal-red px-6 py-3 font-semibold text-signal-red">
            {PRIMARY_CTA.label}
          </TransitionLink>
        </ScrollReveal>
      </section>
    </>
  );
}
