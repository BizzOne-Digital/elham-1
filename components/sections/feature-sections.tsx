"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TestimonialCarousel } from "@/components/site/TestimonialCarousel";
import { TransitionLink } from "@/components/animations/PageTransition";
import { SiteImage } from "@/components/site/SiteImage";
import { ContactForm, GrowthPlanForm, LeadForm } from "@/components/forms";
import { PRIMARY_CTA, SEED_IMAGES, BRAND_ASSETS } from "@/lib/constants";
import { ServiceSplitRow } from "@/components/animations/ServiceSplitRow";
import { resolveServiceImage } from "@/lib/stock-images";
import { isSectionCentered, sectionHeaderClass } from "@/lib/sections/layout";
import { cn } from "@/lib/utils";
import type { SectionComponentProps } from "@/components/sections/types";

export function ServiceShowcaseSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const services = context?.services ?? [];
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad">
      <div className="container-site">
        <ScrollReveal className={sectionHeaderClass(centered)}>
          {data.eyebrow ? <p className="label-caps mb-3">{String(data.eyebrow)}</p> : null}
          <h2 className="text-3xl font-bold sm:text-4xl">{String(data.heading ?? "Services")}</h2>
        </ScrollReveal>

        <div className="mt-12 space-y-10 sm:space-y-14 lg:space-y-20">
          {services.map((service, index) => {
            const imageSrc = resolveServiceImage(
              service.slug,
              service.featuredImage?.url,
              SEED_IMAGES.webDesign,
            );

            return (
              <ServiceSplitRow
                key={service._id}
                service={service}
                index={index}
                imageSrc={imageSrc}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ConnectedSystemSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const image = (data.image as string) ?? SEED_IMAGES.automation;
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad bg-void-black">
      <div className="container-site min-w-0 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ScrollReveal className={sectionHeaderClass(centered)}>
          <h2 className="text-3xl font-bold sm:text-4xl">{String(data.heading)}</h2>
          {data.body ? <p className={cn("mt-5 text-lg text-concrete", "max-lg:mx-auto max-lg:max-w-2xl", centered && "mx-auto max-w-2xl")}>{String(data.body)}</p> : null}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 max-lg:mx-auto max-lg:max-w-md">
            {["Brand", "Website", "Automation", "Content", "Traffic", "Conversion"].map((item) => (
              <li key={item} className="flex items-center justify-center gap-3 text-sm text-warm-white lg:justify-start">
                <span className="h-px w-8 bg-signal-red" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
            <SiteImage src={image} alt="Connected growth system visualization" fill className="object-cover" sizes="50vw" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function NumberedProcessSection({ section, context }: SectionComponentProps) {
  const steps = (section.data.steps as Array<{ number: string; title: string; description: string }>) ?? [];
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad bg-carbon">
      <div className="container-site">
        <ScrollReveal className={sectionHeaderClass(centered)}>
          <h2 className="text-3xl font-bold">{String(section.data.heading ?? "Process")}</h2>
        </ScrollReveal>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.05}>
              <li className="rounded-2xl border border-white/10 bg-graphite p-5">
                <span className="text-2xl font-bold text-signal-red">{step.number}</span>
                <h3 className="mt-3 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-steel">{step.description}</p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function BenefitGridSection({ section, context }: SectionComponentProps) {
  const items = (section.data.items as Array<{ title: string; description: string }>) ?? [];
  const rawImage = section.data.image as string | undefined;
  const image =
    rawImage?.startsWith("/images/") ? rawImage
    : section.id === "home-process" ? BRAND_ASSETS.processSectionImage
    : BRAND_ASSETS.storySectionImage;
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad">
      <div className="container-site min-w-0 grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <ScrollReveal className={sectionHeaderClass(centered)}>
          <h2 className="text-3xl font-bold">{String(section.data.heading)}</h2>
          <ul className="mt-8 space-y-5 max-lg:mx-auto max-lg:max-w-xl">
            {items.map((item) => (
              <li key={item.title} className="max-lg:border-l-0 max-lg:pl-0 border-l-2 border-signal-red pl-4 lg:text-left">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-steel">{item.description}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="relative aspect-[4/3] max-h-[280px] w-full overflow-hidden rounded-2xl sm:max-h-[320px] lg:max-h-[360px]">
            <SiteImage
              src={image}
              alt={
                image === BRAND_ASSETS.processSectionImage ?
                  "AI-powered growth and automation"
                : "Strategy and analytics workspace"
              }
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function PricingSpotlightSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const cta = data.cta as { label: string; href: string } | undefined;
  const image = (data.image as string) ?? SEED_IMAGES.webDesign;
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad bg-warm-white text-void-black">
      <div className="container-site min-w-0 grid items-center gap-10 lg:grid-cols-2">
        <ScrollReveal className={sectionHeaderClass(centered)}>
          <p className="label-caps mb-3 text-signal-red">Starting offer</p>
          <h2 className="text-3xl font-bold sm:text-4xl">{String(data.heading)}</h2>
          <p className={cn("mt-4 text-lg text-smoke", "max-lg:mx-auto max-lg:max-w-2xl", centered && "mx-auto max-w-2xl lg:mx-0")}>{String(data.body)}</p>
          {cta && (
            <TransitionLink
              href={cta.href}
              className={cn(
                "mt-8 inline-flex min-h-11 items-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold text-warm-white",
                "max-lg:mx-auto",
                centered && "mx-auto",
              )}
            >
              {cta.label}
            </TransitionLink>
          )}
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <SiteImage src={image} alt="Custom website starting offer" fill className="object-cover" sizes="50vw" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function GalleryStripSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const projects = context?.projects?.slice(0, 4) ?? [];
  const cta = data.cta as { label: string; href: string } | undefined;
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad">
      <div className="container-site">
        <div className={cn("mb-8 flex flex-wrap items-end gap-4 max-lg:justify-center max-lg:text-center", centered ? "justify-center text-center" : "lg:justify-between")}>
          <h2 className="text-3xl font-bold">{String(data.heading ?? "Work")}</h2>
          {cta && (
            <TransitionLink href={cta.href} className="text-sm font-semibold text-signal-red">
              {cta.label} →
            </TransitionLink>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <ScrollReveal key={project._id} delay={index * 0.05}>
              <Link href={`/gallery/${project.slug}`} className="group block overflow-hidden rounded-xl border border-white/10">
                <div className="relative aspect-[4/5]">
                  <SiteImage
                    src={project.coverImage?.url ?? SEED_IMAGES.webDesign}
                    alt={project.coverImage?.alt ?? project.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.excerpt && <p className="mt-1 text-xs text-steel">{project.excerpt}</p>}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialSliderSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const testimonials = context?.testimonials ?? [];
  const fallback = data.fallback as { heading?: string; body?: string } | undefined;
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad overflow-x-clip bg-graphite">
      <div className="container-site min-w-0">
        <ScrollReveal className={sectionHeaderClass(centered)}>
          <h2 className="break-words text-3xl font-bold">{String(data.heading ?? "Testimonials")}</h2>
        </ScrollReveal>

        {testimonials.length > 0 ? (
          <TestimonialCarousel testimonials={testimonials} />
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-8 text-center">
            <h3 className="text-xl font-bold">{fallback?.heading ?? "Client voices coming soon"}</h3>
            <p className="mx-auto mt-3 max-w-xl text-concrete">
              {fallback?.body ?? "Approved testimonials will appear here. We never publish invented reviews."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function FaqPreviewSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const faqs = context?.faqs?.slice(0, 4) ?? [];
  const cta = data.cta as { label: string; href: string } | undefined;
  const centered = isSectionCentered(section, context);

  return (
    <section className="section-pad">
      <div className={cn("container-site max-w-3xl", "max-lg:mx-auto max-lg:text-center", centered && "mx-auto text-center")}>
        <h2 className="text-3xl font-bold">{String(data.heading ?? "FAQs")}</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details key={faq._id} className="rounded-xl border border-white/10 bg-carbon p-4">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm text-steel">{faq.answer}</p>
            </details>
          ))}
        </div>
        {cta && (
          <TransitionLink href={cta.href} className="mt-6 inline-block text-sm font-semibold text-signal-red">
            {cta.label} →
          </TransitionLink>
        )}
      </div>
    </section>
  );
}

export function LeadFormSection({ section, context }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const variant = data.variant === "short" ? "short" : "full";
  const centered =
    isSectionCentered(section, context) || data.layout === "centered" || data.layoutVariant === "centered";

  if (centered) {
    return (
      <section id="growth-plan" className="section-pad bg-carbon">
        <div className="container-site mx-auto max-w-3xl text-center">
          <ScrollReveal>
            {data.eyebrow ? <p className="label-caps mb-3">{String(data.eyebrow)}</p> : null}
            <h2 className="text-3xl font-bold sm:text-4xl">
              {String(data.heading ?? "Get your free growth plan")}
            </h2>
            {data.body ? <p className="mx-auto mt-4 max-w-xl text-concrete">{String(data.body)}</p> : null}
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="mx-auto mt-10 max-w-xl max-lg:text-center lg:text-left">
            {variant === "short" ? <LeadForm /> : <GrowthPlanForm />}
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section id="growth-plan" className="section-pad bg-carbon">
        <div className="container-site min-w-0 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ScrollReveal className="max-lg:mx-auto max-lg:max-w-3xl max-lg:text-center">
          {data.eyebrow ? <p className="label-caps mb-3">{String(data.eyebrow)}</p> : null}
          <h2 className="text-3xl font-bold">{String(data.heading ?? "Get your free growth plan")}</h2>
          {data.body ? <p className="mt-4 text-concrete">{String(data.body)}</p> : null}
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          {variant === "short" ? <LeadForm /> : <GrowthPlanForm />}
        </ScrollReveal>
      </div>
    </section>
  );
}

export function BookingCTASection({ section }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const cta = (data.cta as { label: string; href: string } | undefined) ?? PRIMARY_CTA;
  const image = (data.image as string) ?? SEED_IMAGES.strategy;

  return (
    <section className="section-pad">
      <div className="container-site overflow-hidden rounded-3xl border border-white/10 bg-graphite">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-12 max-lg:text-center">
            <h2 className="text-3xl font-bold">{String(data.heading ?? "Book a discovery call")}</h2>
            {data.body ? <p className="mt-4 text-concrete">{String(data.body)}</p> : null}
            <TransitionLink
              href={cta.href}
              className="mt-8 inline-flex min-h-11 items-center rounded-full border border-signal-red px-6 py-3 text-sm font-semibold text-signal-red hover:bg-signal-red hover:text-warm-white max-lg:mx-auto"
            >
              {cta.label}
            </TransitionLink>
          </div>
          <div className="relative min-h-[240px]">
            <SiteImage src={image} alt="" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlogPreviewSection({ section, context }: SectionComponentProps) {
  const posts = context?.posts?.slice(0, 3) ?? [];
  return (
    <section className="section-pad">
      <div className="container-site max-lg:text-center">
        <h2 className="text-3xl font-bold">{String(section.data.heading ?? "Insights")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl border border-white/10">
              <div className="relative aspect-[16/10]">
                <SiteImage
                  src={post.featuredImage?.url ?? SEED_IMAGES.strategy}
                  alt={post.featuredImage?.alt ?? post.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-sm text-steel">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeviceShowcaseSection({ section }: SectionComponentProps) {
  const image = (section.data.image as string) ?? SEED_IMAGES.device;
  return (
    <section className="section-pad">
      <ScrollReveal className="container-site">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10">
          <SiteImage src={image} alt="Device showcase" width={1200} height={800} className="h-auto w-full" />
        </div>
      </ScrollReveal>
    </section>
  );
}

export function ImageMosaicSection({ section }: SectionComponentProps) {
  const images = (section.data.images as string[]) ?? [SEED_IMAGES.team, SEED_IMAGES.storefront, SEED_IMAGES.social];
  return (
    <section className="section-pad">
      <div className="container-site min-w-0 grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, index) => (
          <div key={src} className={`relative overflow-hidden rounded-xl ${index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
            <SiteImage src={src} alt="" fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactPanelSection({ section }: SectionComponentProps) {
  return (
    <section id={section.id} className="section-pad bg-carbon">
      <div className="container-site max-w-2xl">
        <ContactForm />
      </div>
    </section>
  );
}
