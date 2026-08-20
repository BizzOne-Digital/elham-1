import { STOCK_IMAGES } from "@/lib/stock-images";

export const STORED_UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type StoredUploadFolder = (typeof STORED_UPLOAD_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedUploadMime = (typeof ALLOWED_UPLOAD_MIME_TYPES)[number];

export const LEGACY_UPLOAD_PLACEHOLDER = STOCK_IMAGES.webDesign;

export function isStoredUploadFolder(value: string): value is StoredUploadFolder {
  return (STORED_UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function buildStoredUploadUrl(folder: StoredUploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseStoredUploadUrl(url: string): { folder: StoredUploadFolder; filename: string } | null {
  if (!url.startsWith("/api/uploads/")) {
    return null;
  }

  const parts = url.replace(/^\/+/, "").split("/");
  if (parts.length !== 4 || parts[0] !== "api" || parts[1] !== "uploads") {
    return null;
  }

  const folder = parts[2]!;
  const filename = parts[3]!;
  if (!folder || !filename || !isStoredUploadFolder(folder)) {
    return null;
  }

  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }

  return { folder, filename };
}

export function sanitizeUploadFilename(filename: string): boolean {
  return !filename.includes("..") && !filename.includes("/") && !filename.includes("\\");
}

export function resolvePublicImageUrl(url?: string | null): string {
  if (!url) {
    return LEGACY_UPLOAD_PLACEHOLDER;
  }

  if (url.startsWith("/uploads/") || url.startsWith("/images/seed/")) {
    return LEGACY_UPLOAD_PLACEHOLDER;
  }

  return url;
}

export function validateUploadFile(file: File): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file.type as AllowedUploadMime)) {
    return { ok: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image must be 8MB or smaller." };
  }

  return { ok: true };
}
