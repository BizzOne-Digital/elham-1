import { NextRequest } from "next/server";
import { Testimonial } from "@/models";
import { testimonialSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const item = await Testimonial.findById(id);
  if (!item) return jsonError("Testimonial not found", 404);

  Object.assign(item, parsed.data);
  await item.save();

  return jsonOk(serialize(item.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const item = await Testimonial.findByIdAndDelete(id);
  if (!item) return jsonError("Testimonial not found", 404);

  return jsonOk({ deleted: true });
}
