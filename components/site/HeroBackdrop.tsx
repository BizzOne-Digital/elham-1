import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/constants";

interface HeroBackdropProps {
  className?: string;
  src?: string;
}

const DEFAULT_HERO = BRAND_ASSETS.heroArtwork;

/** Resolve hero artwork — always prefer local cyber-monogram unless another http(s) URL is set. */
export function resolveHeroArtwork(src?: string | null): string {
  if (!src || src.startsWith("/images/seed/") || src.startsWith("/uploads/")) {
    return DEFAULT_HERO;
  }
  if (src.startsWith("/images/hero/")) {
    return src;
  }
  if (src.startsWith("http")) {
    return src;
  }
  return DEFAULT_HERO;
}

export function HeroBackdrop({
  className,
  src = DEFAULT_HERO,
}: HeroBackdropProps) {
  const artwork = resolveHeroArtwork(src);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-0 min-h-[inherit]", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[68%_center] sm:bg-[70%_center] lg:bg-[right_center]"
        style={{ backgroundImage: `url("${artwork}")` }}
      />
      {/* Left fade for headline readability — keep the right side clear for the monogram */}
      <div className="absolute inset-0 bg-gradient-to-r from-sand via-sand/80 via-45% to-transparent to-85%" />
      <div className="absolute inset-0 bg-gradient-to-t from-sand/60 via-transparent to-sand/25" />
    </div>
  );
}
