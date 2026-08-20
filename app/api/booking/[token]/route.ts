import { addMinutes } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  jsonError,
  jsonSuccess,
  parseJsonBody,
} from "@/lib/api/helpers";
import {
  getAvailabilityForDate,
  getHostTimezoneFromSettings,
} from "@/lib/booking/availability";
import { parseSlotInTimeZone } from "@/lib/booking/slots";
import {
  verifyBookingToken,
  type BookingTokenAction,
} from "@/lib/booking/tokens";
import { connectDB } from "@/lib/db/connect";
import { bookingActionSchema, bookingFormSchema } from "@/lib/validation/common";
import { Booking, SiteSettings } from "@/models";

const rescheduleBodySchema = bookingFormSchema
  .pick({ date: true, time: true, notes: true })
  .extend({
    token: z.string().min(10),
  });

interface RouteContext {
  params: Promise<{ token: string }>;
}

async function loadBookingForToken(token: string) {
  let payload;
  try {
    payload = verifyBookingToken(token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Invalid token");
  }

  await connectDB();
  const booking = await Booking.findById(payload.bookingId)
    .populate("meetingType")
    .exec();

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerEmail.toLowerCase() !== payload.email.toLowerCase()) {
    throw new Error("Token does not match booking");
  }

  if (booking.status === "cancelled" || booking.status === "completed") {
    throw new Error("Booking can no longer be modified");
  }

  return { payload, booking };
}

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;

  try {
    const { payload, booking } = await loadBookingForToken(token);
    const meetingType = booking.meetingType as {
      name?: string;
      durationMinutes?: number;
    } | null;

    return jsonSuccess({
      action: payload.action,
      booking: {
        id: booking._id.toString(),
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        status: booking.status,
        startUtc: booking.startUtc.toISOString(),
        endUtc: booking.endUtc.toISOString(),
        timezoneId: booking.timezoneId,
        meetingType: meetingType?.name ?? "Discovery Call",
        durationMinutes: meetingType?.durationMinutes ?? 30,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid token", 400);
  }
}

async function enforceNoticePolicy(bookingStart: Date, action: BookingTokenAction) {
  const settings = (await SiteSettings.findOne({ key: "global" }).lean()) as {
    bookingPolicy?: { cancellationHours?: number; rescheduleHours?: number };
  } | null;
  const hours =
    action === "cancel" ?
      settings?.bookingPolicy?.cancellationHours ?? 24
    : settings?.bookingPolicy?.rescheduleHours ?? 12;

  const cutoff = addMinutes(new Date(), hours * 60);
  if (bookingStart < cutoff) {
    throw new Error(`Changes must be made at least ${hours} hours before the appointment.`);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { token: routeToken } = await context.params;
  const body = await parseJsonBody<Record<string, unknown>>(request);
  if (body instanceof NextResponse) {
    return body;
  }

  const token = typeof body.token === "string" ? body.token : routeToken;
  const actionParsed = bookingActionSchema.safeParse({ token });
  if (!actionParsed.success) {
    return jsonError("A valid token is required.", 422);
  }

  try {
    const { payload, booking } = await loadBookingForToken(token);
    await enforceNoticePolicy(booking.startUtc, payload.action);

    if (payload.action === "cancel") {
      booking.status = "cancelled";
      booking.cancelledAt = new Date();
      booking.cancellationReason =
        typeof body.reason === "string" ? body.reason.slice(0, 500) : "Cancelled by customer";
      await booking.save();

      return jsonSuccess({
        message: "Your booking has been cancelled.",
        bookingId: booking._id.toString(),
        status: booking.status,
      });
    }

    const parsed = rescheduleBodySchema.safeParse({ ...body, token });
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid reschedule data", 422);
    }

    const hostTimeZone = await getHostTimezoneFromSettings();
    const startUtc = parseSlotInTimeZone(parsed.data.date, parsed.data.time, hostTimeZone);
    const meetingType = booking.meetingType as { durationMinutes?: number } | null;
    const duration = meetingType?.durationMinutes ?? 30;
    const endUtc = addMinutes(startUtc, duration);

    const availability = await getAvailabilityForDate(parsed.data.date);
    const slotAvailable = availability.slots.some(
      (slot) => slot.start.getTime() === startUtc.getTime(),
    );

    if (!slotAvailable) {
      return jsonError("Selected time is no longer available.", 409);
    }

    booking.startUtc = startUtc;
    booking.endUtc = endUtc;
    booking.notes = parsed.data.notes ?? booking.notes;
    booking.status = "confirmed";
    booking.confirmedAt = new Date();

    try {
      await booking.save();
    } catch (error) {
      if ((error as { code?: number }).code === 11000) {
        return jsonError("That time slot has just been booked.", 409);
      }
      throw error;
    }

    return jsonSuccess({
      message: "Your booking has been rescheduled.",
      bookingId: booking._id.toString(),
      status: booking.status,
      startUtc: startUtc.toISOString(),
      endUtc: endUtc.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update booking";
    const status = message.includes("no longer") || message.includes("hours before") ? 409 : 400;
    return jsonError(message, status);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { token: routeToken } = await context.params;
  const body = await parseJsonBody<Record<string, unknown>>(request);
  const token =
    body instanceof NextResponse ?
      routeToken
    : typeof body.token === "string" ?
      body.token
    : routeToken;

  const cancelRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ token, reason: "Cancelled by customer" }),
  });

  return POST(cancelRequest, context);
}
