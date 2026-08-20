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

type RouteParams = { params: Promise<{ postId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { postId } = await params;
  const post = await BlogPost.findById(postId).lean();
  if (!post) return jsonError("Post not found", 404);

  return jsonOk(serialize(post));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { postId } = await params;
  const body = await request.json();
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const post = await BlogPost.findById(postId);
  if (!post) return jsonError("Post not found", 404);

  if (parsed.data.slug && parsed.data.slug !== post.slug) {
    const existing = await BlogPost.findOne({ slug: parsed.data.slug });
    if (existing) return jsonError("Slug already in use", 409);
  }

  Object.assign(post, parsed.data);
  if (parsed.data.status === "published" && !post.publishedAt) {
    post.publishedAt = new Date();
  }
  await post.save();

  if (post.status === "published") {
    revalidatePath(ROUTES.blog);
    revalidatePath(`${ROUTES.blog}/${post.slug}`);
  }

  return jsonOk(serialize(post.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { postId } = await params;
  const post = await BlogPost.findByIdAndDelete(postId);
  if (!post) return jsonError("Post not found", 404);

  revalidatePath(ROUTES.blog);
  return jsonOk({ deleted: true });
}
