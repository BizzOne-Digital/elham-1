import Image from "next/image";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { ContactForm, GrowthPlanForm } from "@/components/forms";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/data/settings";
import { DEFAULT_CONTACT } from "@/lib/data/fallbacks";
import { PRIMARY_CTA, ROUTES, SECONDARY_CTA, SEED_IMAGES } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact Netbrandit by email, phone, or form. We typically respond within one business day.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.contact.email ?? DEFAULT_CONTACT.email;
  const phone = settings.contact.phone ?? DEFAULT_CONTACT.phone;
  const phoneHref = `tel:+14167002656`;

  return (
    <>
      <section className="section-pad bg-void-black grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <h1 className="text-4xl font-bold sm:text-5xl">Let&apos;s talk about your next move</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-concrete">
              Direct response, practical guidance, and a clear path forward. We typically respond within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold">
                Email us
              </a>
              <a href={phoneHref} className="inline-flex min-h-11 max-w-full items-center justify-center rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold sm:px-6">
                Call {phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="growth-plan" className="section-pad bg-carbon">
        <div className="container-site min-w-0 grid gap-10 lg:grid-cols-2">
          <ScrollReveal className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center">
            <h2 className="text-3xl font-bold">{PRIMARY_CTA.label}</h2>
            <p className="mt-4 text-concrete">Share your goals and we will recommend practical next steps.</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[SEED_IMAGES.webDesign, SEED_IMAGES.automation].map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <GrowthPlanForm />
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site min-w-0 grid gap-10 lg:grid-cols-2">
          <ScrollReveal className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center">
            <h2 className="text-3xl font-bold">Send a message</h2>
            <p className="mt-4 text-concrete">Questions about services, pricing, or timelines? We are here to help.</p>
            <TransitionLink href={SECONDARY_CTA.href} className="mt-6 inline-block text-signal-red">
              Prefer to book a call →
            </TransitionLink>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad bg-graphite">
        <ScrollReveal className="container-site mx-auto max-w-3xl max-lg:text-center">
          <h2 className="text-2xl font-bold">Quick help</h2>
          <p className="mt-3 text-concrete">
            Review our <TransitionLink href={ROUTES.faqs} className="text-signal-red">FAQs</TransitionLink> for answers about pricing, timelines, automation, and getting started.
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}
