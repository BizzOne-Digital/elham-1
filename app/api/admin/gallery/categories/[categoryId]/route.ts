import { NextRequest } from "next/server";
import { GalleryCategory, GalleryProject } from "@/models";
import { galleryCategorySchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";

type RouteParams = { params: Promise<{ categoryId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { categoryId } = await params;
  const category = await GalleryCategory.findById(categoryId).lean();
  if (!category) return jsonError("Category not found", 404);

  const projects = await GalleryProject.find({ category: categoryId })
    .sort({ sortOrder: 1, title: 1 })
    .lean();

  return jsonOk({ category: serialize(category), projects: serialize(projects) });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { categoryId } = await params;
  const body = await request.json();
  const parsed = galleryCategorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const category = await GalleryCategory.findById(categoryId);
  if (!category) return jsonError("Category not found", 404);

  Object.assign(category, parsed.data);
  await category.save();
  revalidatePath(ROUTES.portfolio);

  return jsonOk(serialize(category.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { categoryId } = await params;
  const projectCount = await GalleryProject.countDocuments({ category: categoryId });
  if (projectCount > 0) {
    return jsonError("Delete all projects in this category first", 409);
  }

  const category = await GalleryCategory.findByIdAndDelete(categoryId);
  if (!category) return jsonError("Category not found", 404);

  revalidatePath(ROUTES.portfolio);
  return jsonOk({ deleted: true });
}
