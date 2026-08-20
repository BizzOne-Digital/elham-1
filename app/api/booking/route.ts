import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { addMinutes, parseISO } from "date-fns";
import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/models/Booking";
import { Lead } from "@/models/Lead";
import { MeetingType } from "@/models/MeetingType";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { bookingFormSchema } from "@/lib/validation/common";
import { sanitizePlainText } from "@/lib/validation/sanitize";
import { DEFAULTS } from "@/lib/constants";

export async function POST(request: Request) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(ip, "booking", RATE_LIMITS.bookingForm);
  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = bookingFormSchema.safeParse({
    name: body.name,
    email: body.email,
    phone: body.phone,
    service: body.services ?? body.service ?? "Discovery call",
    date: body.date,
    time: body.time,
    notes: body.challenge ?? body.notes,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking data." }, { status: 400 });
  }

  const startUtc = parseISO(`${parsed.data.date}T${parsed.data.time}:00`);
  const endUtc = addMinutes(startUtc, DEFAULTS.slotDurationMinutes);
  const hostTimeZone = process.env.HOST_TIME_ZONE ?? DEFAULTS.timeZone;
  const clientTimeZone =
    typeof body.clientTimeZone === "string" ? body.clientTimeZone : hostTimeZone;

  await connectDB();

  const meetingType =
    ((await MeetingType.findOne({ isActive: true }).sort({ sortOrder: 1 }).lean()) ??
      (await MeetingType.findOne({ slug: "discovery-call" }).lean())) as {
      _id: import("mongoose").Types.ObjectId;
      durationMinutes?: number;
    } | null;

  if (!meetingType) {
    return NextResponse.json(
      {
        error: "Booking is not configured yet. Please use the contact form or call us directly.",
      },
      { status: 503 },
    );
  }

  const existing = await Booking.findOne({
    meetingType: meetingType._id,
    startUtc,
    status: { $in: ["pending", "confirmed"] },
  }).lean();

  if (existing) {
    return NextResponse.json({ error: "That time slot is no longer available." }, { status: 409 });
  }

  const lead = await Lead.create({
    name: sanitizePlainText(parsed.data.name, 120),
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone ? sanitizePlainText(parsed.data.phone, 32) : undefined,
    company: body.company ? sanitizePlainText(String(body.company), 160) : undefined,
    message: sanitizePlainText(
      `Services: ${parsed.data.service}\nChallenge: ${parsed.data.notes ?? ""}`,
      5000,
    ),
    source: "booking-form",
    status: "new",
  });

  await Booking.create({
    lead: lead._id,
    customerName: sanitizePlainText(parsed.data.name, 120),
    customerEmail: parsed.data.email.toLowerCase(),
    customerPhone: parsed.data.phone ? sanitizePlainText(parsed.data.phone, 32) : undefined,
    meetingType: meetingType._id,
    startUtc,
    endUtc,
    timezoneId: clientTimeZone,
    hostTimezoneId: hostTimeZone,
    status: "pending",
    notes: parsed.data.notes ? sanitizePlainText(parsed.data.notes, 2000) : undefined,
    metadata: {
      servicesInterested: sanitizePlainText(parsed.data.service, 500),
      businessName: body.company ? sanitizePlainText(String(body.company), 160) : undefined,
    },
  });

  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);

  return NextResponse.json({
    success: true,
    warning: smtpConfigured
      ? undefined
      : "Booking saved. Email confirmation is not configured in this environment.",
  });
}
