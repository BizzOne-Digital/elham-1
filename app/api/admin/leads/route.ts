import { NextRequest } from "next/server";
import { Lead } from "@/models";
import {
  requireAdminSession,
  jsonOk,
  serialize,
} from "@/lib/admin/api-helpers";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const status = request.nextUrl.searchParams.get("status");
  const filter = status ? { status } : {};
  const items = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  return jsonOk({ items: serialize(items) });
}
