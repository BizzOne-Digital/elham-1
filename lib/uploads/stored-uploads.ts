import crypto from "crypto";
import {
  StoredUpload,
  STORED_UPLOAD_FOLDERS,
  type StoredUploadFolder,
} from "@/models/StoredUpload";
import { STOCK_IMAGES } from "@/lib/stock-images";

export { STORED_UPLOAD_FOLDERS, type StoredUploadFolder };

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedUploadMime = (typeof ALLOWED_UPLOAD_MIME_TYPES)[number];

const MIME_TO_EXT: Record<AllowedUploadMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

export function generateStoredFilename(mimeType: AllowedUploadMime): string {
  const ext = MIME_TO_EXT[mimeType];
  const randomHex = crypto.randomBytes(8).toString("hex");
  return `${Date.now()}-${randomHex}.${ext}`;
}

export async function saveStoredUpload(input: {
  folder: StoredUploadFolder;
  buffer: Buffer;
  mimeType: AllowedUploadMime;
}): Promise<{ url: string; filename: string; size: number; folder: StoredUploadFolder }> {
  const filename = generateStoredFilename(input.mimeType);

  await StoredUpload.create({
    folder: input.folder,
    filename,
    mimeType: input.mimeType,
    size: input.buffer.length,
    data: input.buffer,
  });

  return {
    folder: input.folder,
    filename,
    size: input.buffer.length,
    url: buildStoredUploadUrl(input.folder, filename),
  };
}

export async function getStoredUpload(folder: string, filename: string) {
  if (!isStoredUploadFolder(folder) || !sanitizeUploadFilename(filename)) {
    return null;
  }

  return StoredUpload.findOne({ folder, filename }).select("+data").lean();
}

export async function deleteStoredUploadByUrl(url?: string | null): Promise<boolean> {
  const parsed = url ? parseStoredUploadUrl(url) : null;
  if (!parsed) {
    return false;
  }

  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });

  return result.deletedCount > 0;
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
