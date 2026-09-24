"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollAnimations } from "@/components/animations/ScrollAnimations";

export function SiteProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <PageTransition>
      <ScrollAnimations>
        {children}
      </ScrollAnimations>
    </PageTransition>
  );
}
