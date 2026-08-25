import Image from "next/image";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatPrice, getPublishedPricing, getPricingCardHeader, PRICING_IMAGES } from "@/lib/data/pricing";
import { PRIMARY_CTA, ROUTES } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Pricing",
  description: "Transparent starting points and custom quotes for websites, apps, automation, and marketing.",
  path: "/pricing",
});

export default async function PricingPage() {
  const packages = await getPublishedPricing();

  return (
    <>
      <section className="section-pad bg-carbon grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
            <p className="label-caps mb-4 text-signal-red">Investment</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Clear starting points. Honest custom quotes.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-concrete">
              Website projects can start from CAD 99. Final scope, timeline, and price are confirmed after discovery—we never claim every project costs $99.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, index) => {
            const header = getPricingCardHeader(pkg, index);

            return (
            <ScrollReveal key={pkg._id} delay={index * 0.05}>
              <article className={`flex h-full flex-col overflow-hidden rounded-2xl border ${pkg.isPopular ? "border-signal-red bg-graphite" : "border-white/10 bg-carbon"}`}>
                <div
                  className={`flex aspect-[16/10] flex-col items-center justify-center px-4 text-center ${
                    header.featured ? "bg-signal-red" : "border-x-4 border-signal-red bg-carbon"
                  }`}
                >
                  <p className="text-sm font-bold tracking-[0.18em] text-warm-white sm:text-base">{header.label}</p>
                  <p className={`mt-2 max-w-[16rem] text-xs sm:text-sm ${header.featured ? "text-warm-white/85" : "text-steel"}`}>
                    {header.tagline}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-6 max-lg:items-center max-lg:text-center">
                  {pkg.isPopular && <span className="mb-2 text-xs font-bold uppercase text-signal-red">Popular</span>}
                  <h2 className="text-xl font-bold">{pkg.name}</h2>
                  <p className="mt-2 text-2xl font-bold text-signal-red">{formatPrice(pkg)}</p>
                  {pkg.description && <p className="mt-3 flex-1 text-sm text-steel">{pkg.description}</p>}
                  <ul className="mt-4 space-y-2 text-sm text-concrete max-lg:w-full">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex gap-2 max-lg:justify-center">
                        <span className="text-signal-red">—</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <TransitionLink
                    href={pkg.cta?.href ?? `${ROUTES.contact}?intent=quote`}
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-signal-red px-4 py-2 text-sm font-semibold"
                  >
                    {pkg.cta?.label ?? "Request a Quote"}
                  </TransitionLink>
                </div>
              </article>
            </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="section-pad bg-warm-white text-void-black">
        <ScrollReveal className="container-site min-w-0 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center pt-4 sm:pt-6 lg:pt-10">
            <h2 className="text-3xl font-bold">What affects your quote?</h2>
            <ul className="mt-4 space-y-2 text-smoke">
              <li>Scope, pages, and functionality</li>
              <li>Content readiness and integrations</li>
              <li>Timeline and support requirements</li>
              <li>Ad spend remains separate unless stated otherwise</li>
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={PRICING_IMAGES[0]} alt="Pricing consultation visual" fill className="object-cover" sizes="50vw" />
          </div>
        </ScrollReveal>
      </section>

      <section className="section-pad text-center">
        <ScrollReveal className="container-site mx-auto max-w-2xl">
          <p className="label-caps mb-3 text-signal-red">Next step</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Ready for a quote that fits your business?</h2>
          <p className="mt-4 text-concrete">
            Book a free discovery call. We&apos;ll review your goals, recommend the right services, and outline scope, timeline, and pricing—no pressure.
          </p>
          <TransitionLink
            href={PRIMARY_CTA.href}
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-signal-red px-8 py-3 font-semibold"
          >
            {PRIMARY_CTA.label}
          </TransitionLink>
        </ScrollReveal>
      </section>
    </>
  );
}
