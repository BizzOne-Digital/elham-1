import { NextRequest } from "next/server";
import { GalleryCategory } from "@/models";
import { galleryCategorySchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const items = await GalleryCategory.find().sort({ sortOrder: 1, name: 1 }).lean();
  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = galleryCategorySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const existing = await GalleryCategory.findOne({ slug: parsed.data.slug });
  if (existing) return jsonError("Slug already in use", 409);

  const category = await GalleryCategory.create(parsed.data);
  revalidatePath(ROUTES.portfolio);
  return jsonOk(serialize(category.toObject()), 201);
}
