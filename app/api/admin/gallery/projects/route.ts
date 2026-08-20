import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { GalleryProject } from "@/models";
import { galleryProjectSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const categoryId = request.nextUrl.searchParams.get("category");
  const filter = categoryId ? { category: categoryId } : {};
  const items = await GalleryProject.find(filter)
    .sort({ sortOrder: 1, title: 1 })
    .lean();

  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = galleryProjectSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  if (!mongoose.Types.ObjectId.isValid(parsed.data.category)) {
    return jsonError("Invalid category ID");
  }

  const existing = await GalleryProject.findOne({ slug: parsed.data.slug });
  if (existing) return jsonError("Slug already in use", 409);

  const project = await GalleryProject.create({
    ...parsed.data,
    category: parsed.data.category,
    publishedAt: parsed.data.status === "published" ? new Date() : undefined,
  });

  revalidatePath(ROUTES.portfolio);
  return jsonOk(serialize(project.toObject()), 201);
}
