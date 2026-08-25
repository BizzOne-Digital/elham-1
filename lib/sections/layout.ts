import type { Section } from "@/models/shared";
import type { SectionRenderContext } from "@/components/sections/types";
import { cn } from "@/lib/utils";

export function isSectionCentered(section: Section, context?: SectionRenderContext): boolean {
  return Boolean(
    context?.isHomePage ||
      section.data.centered === true ||
      section.data.layoutVariant === "centered",
  );
}

export function sectionHeaderClass(centered: boolean, className?: string): string {
  return cn(
    "max-lg:mx-auto max-lg:max-w-3xl max-lg:text-center",
    centered && "mx-auto max-w-3xl text-center",
    className,
  );
}

/** Center copy on phone while keeping desktop alignment. */
export function mobileCenterClass(className?: string): string {
  return cn("max-lg:mx-auto max-lg:max-w-3xl max-lg:text-center", className);
}
