import { NextRequest } from "next/server";
import { PricingPackage } from "@/models";
import { pricingSchema } from "@/lib/admin/schemas";
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
  const parsed = pricingSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const pkg = await PricingPackage.findById(id);
  if (!pkg) return jsonError("Package not found", 404);

  Object.assign(pkg, parsed.data);
  await pkg.save();

  return jsonOk(serialize(pkg.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const pkg = await PricingPackage.findByIdAndDelete(id);
  if (!pkg) return jsonError("Package not found", 404);

  return jsonOk({ deleted: true });
}
