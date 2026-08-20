import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { getStoredUpload, sanitizeUploadFilename } from "@/lib/uploads/stored-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { folder, filename } = await params;

  if (!sanitizeUploadFilename(filename)) {
    return new Response("Invalid filename", { status: 400 });
  }

  await connectDB();
  const upload = (await getStoredUpload(folder, filename)) as
    | { data: Buffer; mimeType: string; size: number }
    | null;
  if (!upload?.data) {
    return new Response("Not found", { status: 404 });
  }

  const body = Buffer.isBuffer(upload.data) ? upload.data : Buffer.from(upload.data as unknown as ArrayBuffer);

  return new Response(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
