import { NextRequest } from "next/server";
import { Service } from "@/models";
import { serviceSchema } from "@/lib/admin/schemas";
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

  const services = await Service.find().sort({ sortOrder: 1, title: 1 }).lean();
  return jsonOk({ items: serialize(services) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const existing = await Service.findOne({ slug: parsed.data.slug });
  if (existing) return jsonError("Slug already in use", 409);

  const service = await Service.create(parsed.data);

  if (parsed.data.status === "published") {
    revalidatePath(ROUTES.services);
  }

  return jsonOk(serialize(service.toObject()), 201);
}
