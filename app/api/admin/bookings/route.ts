import { NextRequest } from "next/server";
import { Booking } from "@/models";
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
  const items = await Booking.find(filter)
    .populate("meetingType", "name durationMinutes")
    .sort({ startUtc: -1 })
    .lean();

  return jsonOk({ items: serialize(items) });
}
