import { NextRequest } from "next/server";
import { Booking } from "@/models";
import { bookingUpdateSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const booking = await Booking.findById(id)
    .populate("meetingType", "name durationMinutes")
    .lean();
  if (!booking) return jsonError("Booking not found", 404);

  return jsonOk(serialize(booking));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = bookingUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const booking = await Booking.findById(id);
  if (!booking) return jsonError("Booking not found", 404);

  booking.status = parsed.data.status;
  if (parsed.data.internalNotes !== undefined) {
    booking.internalNotes = parsed.data.internalNotes;
  }
  if (parsed.data.cancellationReason) {
    booking.cancellationReason = parsed.data.cancellationReason;
  }
  if (parsed.data.status === "confirmed") booking.confirmedAt = new Date();
  if (parsed.data.status === "cancelled") booking.cancelledAt = new Date();
  if (parsed.data.status === "completed") booking.completedAt = new Date();

  await booking.save();
  return jsonOk(serialize(booking.toObject()));
}
