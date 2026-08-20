import { Tag } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { SiteImage } from "@/components/site/SiteImage";
import { BRAND_ASSETS, HERO_CTA, SEED_IMAGES } from "@/lib/constants";
import type { SectionComponentProps } from "@/components/sections/types";

export function HeroSection({ section }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const layoutVariant = data.layoutVariant as string | undefined;
  const backgroundImage =
    (data.backgroundImage as string | undefined) ?? BRAND_ASSETS.heroBackground;

  if (layoutVariant === "redline") {
    return <RedlineHeroSection data={data} backgroundImage={backgroundImage} />;
  }

  const eyebrow = data.eyebrow as string | undefined;
  const heading = data.heading as string;
  const subheading = data.subheading as string | undefined;
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;

  return (
    <section className="relative w-full overflow-x-clip bg-void-black grain">
      <div className="container-site section-pad">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className="label-caps mb-4 text-signal-red">{eyebrow}</p> : null}
          <h1 className="text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">{heading}</h1>
          {subheading ? <p className="mx-auto mt-6 max-w-xl text-lg text-concrete">{subheading}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {primaryCta ? (
              <TransitionLink
                href={primaryCta.href}
                className="inline-flex min-h-11 items-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold text-warm-white hover:bg-hot-red"
              >
                {primaryCta.label}
              </TransitionLink>
            ) : null}
            {secondaryCta ? (
              <TransitionLink
                href={secondaryCta.href}
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-warm-white hover:border-signal-red"
              >
                {secondaryCta.label}
              </TransitionLink>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function RedlineHeroSection({
  data,
  backgroundImage,
}: {
  data: Record<string, unknown>;
  backgroundImage: string;
}) {
  const eyebrow = (data.eyebrow as string | undefined) ?? "DIGITAL GROWTH, REENGINEERED";
  const heading = (data.heading as string | undefined) ?? "BUILD. AUTOMATE. SCALE.";
  const subheading =
    (data.subheading as string | undefined) ??
    "Websites, AI and marketing systems built to move your business forward.";
  const primaryCta =
    (data.primaryCta as { label: string; href: string } | undefined) ?? HERO_CTA.primary;
  const secondaryCta =
    (data.secondaryCta as { label: string; href: string } | undefined) ?? HERO_CTA.secondary;
  const priceBanner =
    (data.priceBanner as string | undefined) ?? "Custom websites from $99";

  const headlineLines = heading.split(/(?<=\.)\s+/).filter(Boolean);

  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full overflow-x-clip bg-void-black">
      <div className="absolute inset-0" aria-hidden>
        <SiteImage
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-[70%_center] brightness-[1.18] contrast-[1.06] saturate-[1.08] sm:object-[75%_center] lg:object-right"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void-black/70 via-void-black/45 to-void-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/55 via-transparent to-void-black/35" />
      </div>

      <div className="container-site relative flex min-h-[calc(100vh-80px)] min-w-0 items-center justify-center py-16 text-center lg:py-24">
        <ScrollReveal className="mx-auto max-w-3xl min-w-0">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-signal-red sm:text-xs">
            {eyebrow}
          </p>

          <h1 className="font-display break-words text-[clamp(2rem,7vw,5.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-warm-white">
            {headlineLines.length > 1 ?
              headlineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))
            : heading.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="block">
                  {word}
                  {index < heading.split(" ").length - 1 ? "." : ""}
                </span>
              ))
            }
          </h1>

          <p className="mx-auto mt-6 max-w-2xl break-words text-base leading-relaxed text-warm-white/75 sm:text-lg">
            {subheading}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <TransitionLink
              href={primaryCta.href}
              className="inline-flex min-h-12 items-center rounded-full bg-signal-red px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-warm-white transition hover:bg-hot-red sm:text-sm"
            >
              {primaryCta.label}
            </TransitionLink>
            <TransitionLink
              href={secondaryCta.href}
              className="inline-flex min-h-12 items-center rounded-full border-2 border-signal-red bg-transparent px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-warm-white transition hover:bg-signal-red/10 sm:text-sm"
            >
              {secondaryCta.label}
            </TransitionLink>
          </div>

          <div className="mx-auto mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-3 rounded-2xl border border-signal-red/40 bg-carbon/80 px-5 py-4 backdrop-blur-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal-red/15 text-signal-red">
              <Tag className="h-5 w-5" aria-hidden />
            </span>
            <p className="wrap-anywhere text-sm font-semibold uppercase tracking-[0.12em] text-warm-white sm:text-base">
              {priceBanner.split(/(\$99)/i).map((part, index) =>
                part.toLowerCase() === "$99" ?
                  <span key={index} className="text-signal-red">
                    {part}
                  </span>
                : part,
              )}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function KineticTickerSection({ section }: SectionComponentProps) {
  const items = (section.data.items as string[]) ?? [];
  const doubled = [...items, ...items];

  return (
    <section aria-label="Services ticker" className="w-full overflow-x-clip border-y border-white/10 bg-carbon py-4">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.25em] text-warm-white">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-signal-red" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  );
}

export function SplitStorySection({ section }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  const image = (data.image as string) ?? SEED_IMAGES.team;

  return (
    <section className="section-pad bg-graphite">
      <div className="container-site min-w-0 grid items-center gap-10 lg:grid-cols-2">
        <ScrollReveal>
          {data.eyebrow ? <p className="label-caps mb-3">{String(data.eyebrow)}</p> : null}
          <h2 className="text-3xl font-bold sm:text-4xl">{String(data.heading ?? "")}</h2>
          {data.body ? <p className="mt-5 text-lg text-concrete">{String(data.body)}</p> : null}
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <SiteImage src={image} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function BoldStatementSection({ section }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  return (
    <section className="section-pad bg-signal-red text-warm-white">
      <ScrollReveal className="container-site text-center">
        <h2 className="text-3xl font-bold sm:text-5xl">{String(data.heading ?? "")}</h2>
        {data.body ? <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">{String(data.body)}</p> : null}
      </ScrollReveal>
    </section>
  );
}

export function RichTextSection({ section }: SectionComponentProps) {
  const data = section.data as Record<string, unknown>;
  return (
    <section className="section-pad">
      <ScrollReveal className="container-site max-w-3xl">
        {data.heading ? <h2 className="mb-6 text-3xl font-bold">{String(data.heading)}</h2> : null}
        <div
          className="prose prose-invert max-w-none overflow-x-auto text-concrete [&_a]:text-signal-red"
          dangerouslySetInnerHTML={{ __html: String(data.content ?? data.body ?? "") }}
        />
      </ScrollReveal>
    </section>
  );
}
