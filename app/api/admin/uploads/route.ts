import { NextRequest } from "next/server";
import { MediaAsset } from "@/models";
import { saveUploadedImage, deleteUploadedFile } from "@/lib/storage";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
  const folder = request.nextUrl.searchParams.get("folder");

  const filter = folder ? { folder } : {};
  const items = await MediaAsset.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 100))
    .lean();

  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) ?? "general";
  const alt = (formData.get("alt") as string) ?? "";

  if (!file || !(file instanceof File)) {
    return jsonError("No file provided");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = await saveUploadedImage(buffer, { subfolder: folder });

  const asset = await MediaAsset.create({
    filename: upload.filename,
    originalName: file.name,
    mimeType: upload.mimeType,
    size: upload.size,
    url: upload.publicUrl,
    path: upload.relativePath,
    alt,
    width: upload.width,
    height: upload.height,
    folder,
  });

  return jsonOk(
    {
      ...serialize(asset.toObject()),
      url: upload.publicUrl,
    },
    201,
  );
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("ID required");

  const asset = await MediaAsset.findById(id);
  if (!asset) return jsonError("Asset not found", 404);

  await deleteUploadedFile(asset.path);
  await asset.deleteOne();

  return jsonOk({ deleted: true });
}
