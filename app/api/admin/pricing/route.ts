import { NextRequest } from "next/server";
import { PricingPackage } from "@/models";
import { pricingSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const items = await PricingPackage.find().sort({ sortOrder: 1, name: 1 }).lean();
  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = pricingSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const existing = await PricingPackage.findOne({ slug: parsed.data.slug });
  if (existing) return jsonError("Slug already in use", 409);

  const pkg = await PricingPackage.create(parsed.data);
  return jsonOk(serialize(pkg.toObject()), 201);
}
