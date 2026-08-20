import { NextRequest } from "next/server";
import { BlogPost } from "@/models";
import { blogPostSchema } from "@/lib/admin/schemas";
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

  const items = await BlogPost.find().sort({ createdAt: -1 }).lean();
  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const existing = await BlogPost.findOne({ slug: parsed.data.slug });
  if (existing) return jsonError("Slug already in use", 409);

  const post = await BlogPost.create({
    ...parsed.data,
    publishedAt: parsed.data.status === "published" ? new Date() : undefined,
  });

  if (parsed.data.status === "published") {
    revalidatePath(ROUTES.blog);
    revalidatePath(`${ROUTES.blog}/${parsed.data.slug}`);
  }

  return jsonOk(serialize(post.toObject()), 201);
}
