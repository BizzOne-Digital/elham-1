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

    tl.fromTo(scan, { scaleX: 0 }, { scaleX: 1, duration: 0.8 })
      .fromTo(words, { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.35 }, "-=0.2")
      .fromTo(mark, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5 })
      .fromTo(tagline, { opacity: 0 }, { opacity: 1, duration: 0.35 }, "-=0.1")
      .fromTo(frame, { scale: 0.4 }, { scale: 3, duration: 0.9, ease: "power4.inOut" })
      .to(root, { opacity: 0, duration: 0.45 });

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

      <div className="intro-scan mb-8 h-px w-48 origin-left bg-signal-red" />

      <div className="mb-10 flex flex-wrap justify-center gap-4">
        {WORDS.map((word) => (
          <span key={word} className="intro-word label-caps text-signal-red">
            {word}
          </span>
        ))}
      </div>

      <div className="intro-mark mb-4">
        <Wordmark asLink={false} size="lg" />
      </div>

      <p className="intro-tagline text-sm text-steel">Your growth system is switching on.</p>

      <div className="intro-frame pointer-events-none absolute inset-10 border border-signal-red/60" />
    </div>
  );
}
