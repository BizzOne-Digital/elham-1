"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Wordmark } from "@/components/site/Wordmark";

const SESSION_KEY = "netbrandit_intro_seen";
const WORDS = ["BUILD", "AUTOMATE", "REACH", "GROW"];

type IntroPhase = "skip" | "play";

function shouldPlayIntro(): boolean {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem(SESSION_KEY);

  if (seen || reducedMotion) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return false;
  }

  return true;
}

export function CinematicIntro() {
  const [phase, setPhase] = useState<IntroPhase>("skip");
  const [skipped, setSkipped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldPlayIntro()) {
      queueMicrotask(() => setPhase("play"));
    }
  }, []);

  useEffect(() => {
    if (phase !== "play" || skipped) {
      return;
    }

    document.body.style.overflow = "hidden";

    const root = rootRef.current;
    if (!root) {
      return;
    }

    const scan = root.querySelector(".intro-scan");
    const words = root.querySelectorAll(".intro-word");
    const mark = root.querySelector(".intro-mark");
    const tagline = root.querySelector(".intro-tagline");
    const frame = root.querySelector(".intro-frame");

    if (!scan || !mark || !tagline || !frame) {
      document.body.style.overflow = "";
      queueMicrotask(() => setPhase("skip"));
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setPhase("skip");
        document.body.style.overflow = "";
      },
    });

    tl.fromTo(scan, { scaleX: 0 }, { scaleX: 1, duration: 1.0 })
      .fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.16, duration: 0.45 }, "-=0.25")
      .fromTo(mark, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.75 })
      .fromTo(tagline, { opacity: 0 }, { opacity: 1, duration: 0.45 }, "-=0.15")
      .to({}, { duration: 0.75 })
      .fromTo(frame, { scale: 0.4 }, { scale: 3, duration: 1.1, ease: "power4.inOut" })
      .to(root, { opacity: 0, duration: 0.55 });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [phase, skipped]);

  const skip = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setSkipped(true);
    setPhase("skip");
    document.body.style.overflow = "";
  };

  if (phase !== "play" || skipped) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void-black grain"
      role="dialog"
      aria-label="Site introduction"
    >
      <button
        type="button"
        onClick={skip}
        className="absolute right-4 top-4 z-10 min-h-11 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-concrete hover:border-signal-red hover:text-warm-white"
      >
        Skip Intro
      </button>

      <div className="intro-scan mb-10 h-px w-56 origin-left bg-signal-red sm:w-64" />

      <div className="mb-12 flex flex-wrap justify-center gap-4 sm:gap-5">
        {WORDS.map((word) => (
          <span key={word} className="intro-word text-sm font-bold uppercase tracking-[0.28em] text-signal-red sm:text-base">
            {word}
          </span>
        ))}
      </div>

      <div className="intro-mark mb-5">
        <Wordmark asLink={false} size="intro" />
      </div>

      <p className="intro-tagline text-base text-steel sm:text-lg">Your growth system is switching on.</p>

      <div className="intro-frame pointer-events-none absolute inset-10 border border-signal-red/60" />
    </div>
  );
}
