import { NextRequest } from "next/server";
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

type RouteParams = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { projectId } = await params;
  const project = await GalleryProject.findById(projectId).lean();
  if (!project) return jsonError("Project not found", 404);

  return jsonOk(serialize(project));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { projectId } = await params;
  const body = await request.json();
  const parsed = galleryProjectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const project = await GalleryProject.findById(projectId);
  if (!project) return jsonError("Project not found", 404);

  Object.assign(project, parsed.data);
  if (parsed.data.status === "published" && !project.publishedAt) {
    project.publishedAt = new Date();
  }
  await project.save();

  revalidatePath(ROUTES.portfolio);
  return jsonOk(serialize(project.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { projectId } = await params;
  const project = await GalleryProject.findByIdAndDelete(projectId);
  if (!project) return jsonError("Project not found", 404);

  revalidatePath(ROUTES.portfolio);
  return jsonOk({ deleted: true });
}
