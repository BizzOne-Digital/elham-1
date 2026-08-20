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

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const pages = await Page.find().sort({ sortOrder: 1, title: 1 }).lean();
  return jsonOk({ items: serialize(pages) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const existing = await Page.findOne({ slug: parsed.data.slug });
  if (existing) {
    return jsonError("A page with this slug already exists", 409);
  }

  const page = await Page.create({
    ...parsed.data,
    publishedAt: parsed.data.status === "published" ? new Date() : undefined,
  });

  if (parsed.data.status === "published") {
    revalidatePageBySlug(parsed.data.slug);
  }

  return jsonOk(serialize(page.toObject()), 201);
}
