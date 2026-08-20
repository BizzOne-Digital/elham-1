import "server-only";

import crypto from "crypto";
import {
  StoredUpload,
} from "@/models/StoredUpload";
import {
  buildStoredUploadUrl,
  isStoredUploadFolder,
  parseStoredUploadUrl,
  sanitizeUploadFilename,
  type AllowedUploadMime,
  type StoredUploadFolder,
} from "@/lib/uploads/constants";

export {
  ALLOWED_UPLOAD_MIME_TYPES,
  buildStoredUploadUrl,
  isStoredUploadFolder,
  LEGACY_UPLOAD_PLACEHOLDER,
  MAX_UPLOAD_BYTES,
  parseStoredUploadUrl,
  resolvePublicImageUrl,
  sanitizeUploadFilename,
  STORED_UPLOAD_FOLDERS,
  validateUploadFile,
  type AllowedUploadMime,
  type StoredUploadFolder,
} from "@/lib/uploads/constants";

const MIME_TO_EXT: Record<AllowedUploadMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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
