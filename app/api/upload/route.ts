import { NextRequest } from "next/server";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
} from "@/lib/admin/api-helpers";
import {
  deleteStoredUploadByUrl,
  isStoredUploadFolder,
  saveStoredUpload,
  type AllowedUploadMime,
  validateUploadFile,
} from "@/lib/uploads/stored-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "misc");

  if (!file || !(file instanceof File)) {
    return jsonError("No file provided", 400);
  }

  if (!isStoredUploadFolder(folder)) {
    return jsonError("Invalid upload folder", 400);
  }

  const validation = validateUploadFile(file);
  if (!validation.ok) {
    return jsonError(validation.error, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await saveStoredUpload({
    folder,
    buffer,
    mimeType: file.type as AllowedUploadMime,
  });

  return jsonOk(
    {
      success: true,
      url: saved.url,
      filename: saved.filename,
      size: saved.size,
      folder: saved.folder,
    },
    201,
  );
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return jsonError("URL required", 400);
  }

  const deleted = await deleteStoredUploadByUrl(url);
  if (!deleted) {
    return jsonError("Upload not found", 404);
  }

  return jsonOk({ success: true, deleted: true });
}
