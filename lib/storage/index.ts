import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { DEFAULTS } from "@/lib/constants";

export interface UploadResult {
  filename: string;
  relativePath: string;
  publicUrl: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

export interface UploadOptions {
  subfolder?: string;
  maxBytes?: number;
  allowedMimeTypes?: readonly string[];
}

/** Local dev filesystem uploads only — production uses MongoDB via `/api/upload`. */
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function getUploadRoot(): string {
  return UPLOAD_ROOT;
}

function assertSafeSegment(segment: string, label: string): string {
  const normalized = segment.trim();
  if (!normalized || normalized.includes("..") || /[\\/]/.test(normalized)) {
    throw new Error(`Invalid ${label}`);
  }
  return normalized;
}

function buildRelativePath(parts: string[]): string {
  return parts.map((part) => assertSafeSegment(part, "path segment")).join("/");
}

function resolveWithinUploadRoot(relativePath: string): string {
  const root = getUploadRoot();
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Path traversal detected");
  }

  return absolute;
}

function getPublicUrl(relativePath: string): string {
  return `/uploads/${relativePath}`.replace(/\\/g, "/");
}

async function validateImage(
  buffer: Buffer,
  allowedMimeTypes: readonly string[],
): Promise<{ width: number; height: number; mimeType: string }> {
  const image = sharp(buffer, { failOn: "error" });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image dimensions");
  }

  const format = metadata.format;
  const mimeType =
    format === "jpeg" ? "image/jpeg"
    : format === "png" ? "image/png"
    : format === "webp" ? "image/webp"
    : format === "gif" ? "image/gif"
    : null;

  if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
    throw new Error("Unsupported image type");
  }

  return {
    width: metadata.width,
    height: metadata.height,
    mimeType,
  };
}

/**
 * Save an uploaded image locally with Sharp validation.
 * Files are stored under year/month subfolders with UUID filenames.
 */
export async function saveUploadedImage(
  buffer: Buffer,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const maxBytes = options.maxBytes ?? DEFAULTS.maxUploadBytes;
  const allowedMimeTypes =
    options.allowedMimeTypes ?? DEFAULTS.allowedImageMimeTypes;

  if (buffer.length === 0) {
    throw new Error("Empty file");
  }

  if (buffer.length > maxBytes) {
    throw new Error(`File exceeds maximum size of ${maxBytes} bytes`);
  }

  const { width, height, mimeType } = await validateImage(
    buffer,
    allowedMimeTypes,
  );

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension =
    mimeType === "image/jpeg" ? "jpg"
    : mimeType === "image/png" ? "png"
    : mimeType === "image/webp" ? "webp"
    : "gif";

  const filename = `${randomUUID()}.${extension}`;
  const segments = [year, month];

  if (options.subfolder) {
    segments.unshift(assertSafeSegment(options.subfolder, "subfolder"));
  }

  const relativePath = buildRelativePath([...segments, filename]);
  const absolutePath = resolveWithinUploadRoot(relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  return {
    filename,
    relativePath,
    publicUrl: getPublicUrl(relativePath),
    width,
    height,
    size: buffer.length,
    mimeType,
  };
}

export async function deleteUploadedFile(relativePath: string): Promise<void> {
  const safeRelative = buildRelativePath(relativePath.split("/"));
  const absolutePath = resolveWithinUploadRoot(safeRelative);

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export async function readUploadedFile(relativePath: string): Promise<Buffer> {
  const safeRelative = buildRelativePath(relativePath.split("/"));
  const absolutePath = resolveWithinUploadRoot(safeRelative);
  return fs.readFile(absolutePath);
}
