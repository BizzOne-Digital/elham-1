"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { formatPrice, type PricingItem, type PricingCardHeader } from "@/lib/data/pricing";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PricingPackageCardProps {
  pkg: PricingItem;
  header: PricingCardHeader;
  index: number;
}

export function PricingPackageCard({ pkg, header, index }: PricingPackageCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.45, rootMargin: "-10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ScrollReveal delay={index * 0.05}>
      <article
        ref={cardRef}
        data-inview={inView ? "true" : "false"}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-carbon transition-colors duration-300",
          "max-lg:data-[inview=true]:border-signal-red max-lg:data-[inview=true]:bg-graphite",
          "lg:hover:border-signal-red lg:hover:bg-graphite",
        )}
      >
        <div
          className={cn(
            "flex aspect-[16/10] flex-col items-center justify-center border-b border-signal-red/25 bg-carbon px-4 text-center transition-colors duration-300",
            "max-lg:group-data-[inview=true]:border-b-0 max-lg:group-data-[inview=true]:bg-signal-red",
            "lg:group-hover:border-b-0 lg:group-hover:bg-signal-red",
          )}
        >
          <p
            className={cn(
              "text-sm font-bold tracking-[0.18em] text-concrete transition-colors sm:text-base",
              "max-lg:group-data-[inview=true]:text-warm-white lg:group-hover:text-warm-white",
            )}
          >
            {header.label}
          </p>
          <p
            className={cn(
              "mt-2 max-w-[16rem] text-xs text-steel transition-colors sm:text-sm",
              "max-lg:group-data-[inview=true]:text-warm-white/85 lg:group-hover:text-warm-white/85",
            )}
          >
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
}
