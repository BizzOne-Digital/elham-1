import Image from "next/image";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PricingPackageCard } from "@/components/pricing/PricingPackageCard";
import { getPublishedPricing, getPricingCardHeader, PRICING_IMAGES } from "@/lib/data/pricing";
import { PRIMARY_CTA } from "@/lib/constants";

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
              Website projects can start from $99.99. Final scope, timeline, and price are confirmed after discovery—we never claim every project costs $99.99.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, index) => (
            <PricingPackageCard
              key={pkg._id}
              pkg={pkg}
              header={getPricingCardHeader(pkg, index)}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="section-pad bg-graphite">
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
