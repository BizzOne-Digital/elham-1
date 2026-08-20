import { NextRequest } from "next/server";
import { Testimonial } from "@/models";
import { testimonialSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const items = await Testimonial.find().sort({ sortOrder: 1, name: 1 }).lean();
  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const item = await Testimonial.create(parsed.data);
  return jsonOk(serialize(item.toObject()), 201);
}
