import { NextRequest } from "next/server";
import { FAQ } from "@/models";
import { faqSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const items = await FAQ.find().sort({ sortOrder: 1, category: 1 }).lean();
  return jsonOk({ items: serialize(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const item = await FAQ.create(parsed.data);
  return jsonOk(serialize(item.toObject()), 201);
}
