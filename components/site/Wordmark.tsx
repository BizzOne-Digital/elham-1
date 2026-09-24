import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/constants";

interface WordmarkProps {
  className?: string;
  asLink?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "header" | "footer" | "footerBar";
}

/** Logo: NET BRAND IT horizontal lockup with globe + tagline */
const sizeConfig = {
  sm: { height: 48, width: 200, maxWidth: "max-w-[200px] sm:max-w-[220px]" },
  md: { height: 56, width: 240, maxWidth: "max-w-[240px] sm:max-w-[264px]" },
  lg: { height: 68, width: 290, maxWidth: "max-w-[290px] sm:max-w-[320px]" },
  xl: { height: 80, width: 340, maxWidth: "max-w-[340px] sm:max-w-[380px]" },
  header: { height: 64, width: 300, maxWidth: "max-w-[300px] sm:max-w-[340px]" },
  footer: { height: 120, width: 520, maxWidth: "max-w-[520px] sm:max-w-[580px]" },
  footerBar: { height: 72, width: 340, maxWidth: "max-w-[340px] sm:max-w-[380px]" },
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
