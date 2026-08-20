import { revalidatePath, revalidateTag } from "next/cache";
import { ROUTES } from "@/lib/constants";

export const CACHE_TAGS = {
  pages: "cms:pages",
  navigation: "cms:navigation",
  settings: "cms:settings",
  blog: "cms:blog",
  services: "cms:services",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export function revalidatePublicPages(): void {
  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.about);
  revalidatePath(ROUTES.services);
  revalidatePath(ROUTES.portfolio);
  revalidatePath(ROUTES.blog);
  revalidatePath(ROUTES.contact);
  revalidatePath(ROUTES.book);
}

export function revalidatePageBySlug(slug: string): void {
  const normalized = slug.replace(/^\/+/, "");
  revalidatePath(`/${normalized}`);
}

export function revalidateAdminArea(): void {
  revalidatePath(ROUTES.admin);
  revalidatePath(ROUTES.adminPages);
  revalidatePath(ROUTES.adminLeads);
  revalidatePath(ROUTES.adminBookings);
  revalidatePath(ROUTES.adminMedia);
  revalidatePath(ROUTES.adminSettings);
}

export function revalidateCmsTag(tag: CacheTag): void {
  revalidateTag(tag, "max");
}

export function revalidateAllCmsContent(): void {
  revalidatePublicPages();
  revalidateAdminArea();
  Object.values(CACHE_TAGS).forEach((tag) => revalidateTag(tag, "max"));
}
