import { addMinutes, getDay, parseISO, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { connectDB } from "@/lib/db/connect";
import { DEFAULTS } from "@/lib/constants";
import {
  AvailabilityRule,
  BlackoutDate,
  Booking,
  MeetingType,
  SiteSettings,
} from "@/models";
import {
  getAvailableDates,
  getAvailableSlotsForDay,
  getHostTimeZone,
  type TimeSlot,
} from "@/lib/booking/slots";

function parseTimeParts(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}

export async function getDefaultMeetingType() {
  await connectDB();
  return MeetingType.findOne({ isActive: true }).sort({ sortOrder: 1 }).exec();
}

export async function getMeetingTypeBySlug(slug: string) {
  await connectDB();
  return MeetingType.findOne({ slug: slug.toLowerCase(), isActive: true }).exec();
}

export async function getHostTimezoneFromSettings(): Promise<string> {
  await connectDB();
  const settings = (await SiteSettings.findOne({ key: "global" }).lean()) as {
    timezone?: string;
  } | null;
  return settings?.timezone ?? process.env.HOST_TIME_ZONE ?? DEFAULTS.timeZone;
}

async function getBookedStartsForDay(
  date: Date,
  meetingTypeId: string,
  timeZone: string,
): Promise<Date[]> {
  const zonedDay = toZonedTime(date, timeZone);
  const dayStart = startOfDay(zonedDay);
  const dayEnd = addMinutes(dayStart, 24 * 60);

  const bookings = await Booking.find({
    meetingType: meetingTypeId,
    status: { $in: ["pending", "confirmed"] },
    startUtc: { $gte: dayStart, $lt: dayEnd },
  })
    .select("startUtc")
    .lean();

  return bookings.map((booking) => new Date(booking.startUtc));
}

async function isBlackoutDay(date: Date, meetingTypeId: string, timeZone: string) {
  const day = startOfDay(toZonedTime(date, timeZone));
  const blackout = await BlackoutDate.findOne({
    isActive: true,
    $or: [{ meetingType: meetingTypeId }, { meetingType: { $exists: false } }],
    startDate: { $lte: day },
    endDate: { $gte: day },
  }).lean();

  return Boolean(blackout);
}

export async function getAvailabilityForDate(
  dateString: string,
  meetingTypeSlug?: string,
): Promise<{
  timeZone: string;
  meetingType: { id: string; name: string; slug: string; durationMinutes: number };
  slots: TimeSlot[];
}> {
  await connectDB();

  const meetingType =
    meetingTypeSlug ?
      await getMeetingTypeBySlug(meetingTypeSlug)
    : await getDefaultMeetingType();

  if (!meetingType) {
    throw new Error("No active meeting type configured");
  }

  const timeZone = await getHostTimezoneFromSettings();
  const date = parseISO(`${dateString}T12:00:00`);
  const dayOfWeek = getDay(toZonedTime(date, timeZone));

  if (await isBlackoutDay(date, meetingType._id.toString(), timeZone)) {
    return {
      timeZone,
      meetingType: {
        id: meetingType._id.toString(),
        name: meetingType.name,
        slug: meetingType.slug,
        durationMinutes: meetingType.durationMinutes,
      },
      slots: [],
    };
  }

  const rules = await AvailabilityRule.find({
    isActive: true,
    dayOfWeek,
    $or: [{ meetingType: meetingType._id }, { meetingType: { $exists: false } }],
  })
    .sort({ sortOrder: 1 })
    .lean();

  if (rules.length === 0) {
    return {
      timeZone,
      meetingType: {
        id: meetingType._id.toString(),
        name: meetingType.name,
        slug: meetingType.slug,
        durationMinutes: meetingType.durationMinutes,
      },
      slots: [],
    };
  }

  const rule = rules[0];
  const start = parseTimeParts(rule.startTime);
  const end = parseTimeParts(rule.endTime);
  const bookedSlots = await getBookedStartsForDay(
    date,
    meetingType._id.toString(),
    timeZone,
  );

  const settings = (await SiteSettings.findOne({ key: "global" }).lean()) as {
    bookingPolicy?: { minNoticeHours?: number; maxAdvanceDays?: number };
  } | null;
  const slots = getAvailableSlotsForDay(date, {
    timeZone,
    slotDurationMinutes: meetingType.durationMinutes,
    leadTimeHours: settings?.bookingPolicy?.minNoticeHours ?? DEFAULTS.bookingLeadTimeHours,
    horizonDays: settings?.bookingPolicy?.maxAdvanceDays ?? DEFAULTS.bookingHorizonDays,
    businessHours: {
      startHour: start.hour,
      startMinute: start.minute,
      endHour: end.hour,
      endMinute: end.minute,
    },
    bookedSlots,
  });

  return {
    timeZone,
    meetingType: {
      id: meetingType._id.toString(),
      name: meetingType.name,
      slug: meetingType.slug,
      durationMinutes: meetingType.durationMinutes,
    },
    slots,
  };
}

export async function listAvailableDates(meetingTypeSlug?: string): Promise<string[]> {
  await connectDB();

  const meetingType =
    meetingTypeSlug ?
      await getMeetingTypeBySlug(meetingTypeSlug)
    : await getDefaultMeetingType();

  if (!meetingType) {
    return [];
  }

  const timeZone = await getHostTimezoneFromSettings();
  const settings = (await SiteSettings.findOne({ key: "global" }).lean()) as {
    bookingPolicy?: { minNoticeHours?: number; maxAdvanceDays?: number };
  } | null;

  return getAvailableDates(new Date(), {
    timeZone,
    slotDurationMinutes: meetingType.durationMinutes,
    leadTimeHours: settings?.bookingPolicy?.minNoticeHours ?? DEFAULTS.bookingLeadTimeHours,
    horizonDays: settings?.bookingPolicy?.maxAdvanceDays ?? DEFAULTS.bookingHorizonDays,
    businessHours: {
      startHour: 9,
      endHour: 17,
    },
  });
}

export { getHostTimeZone };
