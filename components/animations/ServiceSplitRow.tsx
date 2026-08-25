"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/animations/PageTransition";
import { SiteImage } from "@/components/site/SiteImage";
import { cn } from "@/lib/utils";
import type { ServiceCard } from "@/lib/data/services";

gsap.registerPlugin(ScrollTrigger);

interface ServiceSplitRowProps {
  service: ServiceCard;
  index: number;
  imageSrc: string;
}

export function ServiceSplitRow({ service, index, imageSrc }: ServiceSplitRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageOnLeft = index % 2 === 0;

  useEffect(() => {
    const row = rowRef.current;
    const imageEl = imageRef.current;
    const textEl = textRef.current;
    if (!row || !imageEl || !textEl) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const imageStartX = imageOnLeft ? -80 : 80;
    const textStartX = imageOnLeft ? 80 : -80;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageEl,
        { opacity: 0, x: imageStartX },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        textEl,
        { opacity: 0, x: textStartX },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: 0.08,
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, row);

    return () => ctx.revert();
  }, [imageOnLeft]);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-2 items-center gap-3 overflow-hidden sm:gap-6 lg:gap-12"
    >
      <div
        ref={imageRef}
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 sm:aspect-[4/3] sm:rounded-2xl",
          !imageOnLeft && "order-2",
        )}
      >
        <SiteImage
          src={imageSrc}
          alt={service.featuredImage?.alt ?? service.title}
          fill
          unoptimized={imageSrc.startsWith("/images/")}
          className="object-cover"
          sizes="(max-width:640px) 45vw, 50vw"
        />
      </div>

      <div ref={textRef} className={cn("min-w-0 max-lg:text-center", !imageOnLeft && "order-1")}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal-red sm:text-xs sm:tracking-[0.2em]">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-tight sm:mt-2 sm:text-2xl lg:text-3xl">
          {service.title}
        </h3>
        {service.shortDescription ?
          <p className="mt-2 text-[11px] leading-relaxed text-steel sm:mt-4 sm:text-base">
            {service.shortDescription}
          </p>
        : null}
        <TransitionLink
          href={`/services/${service.slug}`}
          className="mt-3 inline-flex text-[11px] font-semibold text-signal-red transition hover:text-hot-red sm:mt-6 sm:text-sm max-lg:mx-auto"
        >
          View service →
        </TransitionLink>
      </div>
    </div>
  );
}
