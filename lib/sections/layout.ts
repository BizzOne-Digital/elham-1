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
  return cn(centered && "mx-auto max-w-3xl text-center", className);
}
