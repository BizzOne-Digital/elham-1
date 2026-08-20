import { NextRequest } from "next/server";
import { Page } from "@/models";
import { pageSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";
import { revalidatePageBySlug } from "@/lib/cms/revalidate";

type RouteParams = { params: Promise<{ pageId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { pageId } = await params;
  const page = await Page.findById(pageId).lean();
  if (!page) return jsonError("Page not found", 404);

  return jsonOk(serialize(page));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { pageId } = await params;
  const body = await request.json();
  const parsed = pageSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const page = await Page.findById(pageId);
  if (!page) return jsonError("Page not found", 404);

  if (parsed.data.slug && parsed.data.slug !== page.slug) {
    const existing = await Page.findOne({ slug: parsed.data.slug });
    if (existing) return jsonError("Slug already in use", 409);
  }

  Object.assign(page, parsed.data);
  if (parsed.data.sections) {
    page.markModified("sections");
  }
  if (parsed.data.status === "published" && !page.publishedAt) {
    page.publishedAt = new Date();
  }
  await page.save();

  if (page.status === "published") {
    revalidatePageBySlug(page.slug);
  }

  return jsonOk(serialize(page.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { pageId } = await params;
  const page = await Page.findByIdAndDelete(pageId);
  if (!page) return jsonError("Page not found", 404);

  revalidatePageBySlug(page.slug);
  return jsonOk({ deleted: true });
}
