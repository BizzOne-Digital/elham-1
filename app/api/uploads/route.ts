import { z } from "zod";
import {
  jsonError,
  jsonSuccess,
  requireApiAuth,
} from "@/lib/api/helpers";
import { connectDB } from "@/lib/db/connect";
import { deleteUploadedFile, saveUploadedImage } from "@/lib/storage";
import { MediaAsset } from "@/models";

const deleteSchema = z.object({
  path: z.string().trim().min(1).max(500),
  assetId: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const user = await requireApiAuth();
  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("A file upload is required.", 422);
  }

  const subfolderValue = formData.get("subfolder");
  const subfolder =
    typeof subfolderValue === "string" && subfolderValue.trim() ?
      subfolderValue.trim()
    : "media";

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveUploadedImage(buffer, { subfolder });

    await connectDB();
    const asset = await MediaAsset.create({
      filename: saved.filename,
      originalName: file.name,
      mimeType: saved.mimeType,
      size: saved.size,
      url: saved.publicUrl,
      path: saved.relativePath,
      width: saved.width,
      height: saved.height,
      folder: subfolder,
      alt: file.name.replace(/\.[^.]+$/, ""),
    });

    return jsonSuccess({
      asset: {
        id: asset._id.toString(),
        url: asset.url,
        path: asset.path,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType,
        size: asset.size,
      },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Upload failed",
      422,
    );
  }
}

export async function DELETE(request: Request) {
  const user = await requireApiAuth();
  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = deleteSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid delete request", 422);
  }

  try {
    await deleteUploadedFile(parsed.data.path);

    if (parsed.data.assetId) {
      await connectDB();
      await MediaAsset.findByIdAndDelete(parsed.data.assetId);
    }

    return jsonSuccess({ message: "File deleted." });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Delete failed",
      422,
    );
  }
}
