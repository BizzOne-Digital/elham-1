import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/constants";

interface WordmarkProps {
  className?: string;
  asLink?: boolean;
  size?: "sm" | "md" | "lg";
}

/** Updated logo is taller (icon + stacked NET / BRAND / IT). */
const sizeConfig = {
  sm: { height: 44, width: 108, maxWidth: "max-w-[108px] sm:max-w-[120px]" },
  md: { height: 52, width: 128, maxWidth: "max-w-[128px] sm:max-w-[148px]" },
  lg: { height: 60, width: 148, maxWidth: "max-w-[148px] sm:max-w-[172px]" },
} as const;

export function Wordmark({ className, asLink = true, size = "md" }: WordmarkProps) {
  const { height, width, maxWidth } = sizeConfig[size];

  const content = (
    <Image
      src={BRAND_ASSETS.logo}
      alt={BRAND_ASSETS.logoAlt}
      width={width}
      height={height}
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
