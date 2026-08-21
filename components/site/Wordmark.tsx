import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/constants";

interface WordmarkProps {
  className?: string;
  asLink?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "intro";
}

/** Logo: target icon + stacked NET / BRAND / IT */
const sizeConfig = {
  sm: { height: 40, width: 132, maxWidth: "max-w-[132px] sm:max-w-[148px]" },
  md: { height: 52, width: 172, maxWidth: "max-w-[172px] sm:max-w-[192px]" },
  lg: { height: 64, width: 212, maxWidth: "max-w-[212px] sm:max-w-[236px]" },
  xl: { height: 76, width: 252, maxWidth: "max-w-[252px] sm:max-w-[280px]" },
  intro: { height: 96, width: 320, maxWidth: "max-w-[320px] sm:max-w-[360px]" },
} as const;

export function Wordmark({ className, asLink = true, size = "md" }: WordmarkProps) {
  const { height, width, maxWidth } = sizeConfig[size];

  const content = (
    <Image
      src={BRAND_ASSETS.logo}
      alt={BRAND_ASSETS.logoAlt}
      width={width}
      height={height}
      unoptimized
      className={cn("h-auto w-auto max-w-full object-contain object-left", className)}
      style={{ maxHeight: height }}
      priority
    />
  );

  if (asLink) {
    return (
      <Link href="/" className={cn("inline-flex shrink-0 focus-visible:outline-none", maxWidth)}>
        {content}
      </Link>
    );
  }

  return content;
}
