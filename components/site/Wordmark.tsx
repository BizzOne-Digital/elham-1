import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/constants";

interface WordmarkProps {
  className?: string;
  asLink?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "header" | "footer" | "footerBar";
}

/** Client logo lockup (emblem + NETBRANDIT wordmark) */
const sizeConfig = {
  sm: { height: 40, width: 120, maxWidth: "max-w-[120px] sm:max-w-[140px]" },
  md: { height: 48, width: 144, maxWidth: "max-w-[144px] sm:max-w-[160px]" },
  lg: { height: 56, width: 168, maxWidth: "max-w-[168px] sm:max-w-[190px]" },
  xl: { height: 64, width: 192, maxWidth: "max-w-[192px] sm:max-w-[220px]" },
  header: { height: 52, width: 156, maxWidth: "max-w-[156px] sm:max-w-[180px]" },
  footer: { height: 80, width: 240, maxWidth: "max-w-[240px] sm:max-w-[280px]" },
  footerBar: { height: 56, width: 168, maxWidth: "max-w-[168px] sm:max-w-[190px]" },
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
