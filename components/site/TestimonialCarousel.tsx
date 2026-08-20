"use client";

import { useEffect, useMemo, useState } from "react";
import type { TestimonialItem } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  className?: string;
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <blockquote className="flex h-full min-h-[220px] min-w-0 flex-col rounded-2xl border border-white/10 bg-carbon p-5 sm:min-h-[240px] sm:p-6">
      <p className="wrap-anywhere flex-1 text-sm leading-relaxed text-concrete sm:text-base lg:text-lg">
        &ldquo;{item.content}&rdquo;
      </p>
      <footer className="mt-4 border-t border-white/10 pt-4 text-sm font-semibold">
        {item.name}
        {(item.role || item.company) && (
          <span className="mt-1 block text-xs font-normal text-steel sm:text-sm">
            {[item.role, item.company].filter(Boolean).join(" · ")}
          </span>
        )}
      </footer>
    </blockquote>
  );
}

export function TestimonialCarousel({ testimonials, className }: TestimonialCarouselProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const loopItems = useMemo(
    () => (testimonials.length > 1 ? [...testimonials, ...testimonials] : testimonials),
    [testimonials],
  );

  if (testimonials.length === 0) return null;

  if (reducedMotion || testimonials.length === 1) {
    return (
      <div className={cn("mt-10 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6", className)}>
        {testimonials.slice(0, 2).map((item) => (
          <TestimonialCard key={item._id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("@container relative mt-10 min-w-0 max-w-full overflow-x-clip", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-graphite to-transparent sm:w-12"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-graphite to-transparent sm:w-12"
        aria-hidden
      />

      <div className="overflow-hidden" aria-label="Client testimonials carousel">
        <div
          className={cn("flex gap-4 sm:gap-6", !paused && "animate-testimonial-marquee")}
          style={{
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {loopItems.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="w-[calc(100cqw-0px)] shrink-0 sm:w-[calc((100cqw-1rem)/2)] sm:max-w-none"
            >
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only">Testimonials auto-scroll horizontally. Hover to pause.</p>
    </div>
  );
}
