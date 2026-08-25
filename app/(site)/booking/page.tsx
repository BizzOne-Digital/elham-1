import Image from "next/image";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { BookingForm } from "@/components/forms";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SECONDARY_CTA, SEED_IMAGES } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Book a Discovery Call",
  description: "Schedule a free 30-minute discovery call with Netbrandit.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <section className="section-pad bg-carbon grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Booking" }]} />
            <p className="label-caps mb-4 text-signal-red">Discovery call</p>
            <h1 className="text-4xl font-bold">{SECONDARY_CTA.label}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-concrete">
              Free 30-minute discovery call. Times are shown in your local timezone. No payment required.
            </p>
            <ul className="mx-auto mt-6 w-fit space-y-2 text-sm text-steel">
              <li>Review goals, challenges, and timeline</li>
              <li>Discuss services that fit your priorities</li>
              <li>Receive practical next-step recommendations</li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-4">
              {[SEED_IMAGES.team, SEED_IMAGES.device, SEED_IMAGES.automation, SEED_IMAGES.storefront].map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <BookingForm />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
