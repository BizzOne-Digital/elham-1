import { addDays, addMinutes, eachMinuteOfInterval, isBefore, isEqual, startOfDay } from "date-fns";
import {
  formatInTimeZone,
  fromZonedTime,
  toZonedTime,
} from "date-fns-tz";
import { DEFAULTS } from "@/lib/constants";

export interface BusinessHours {
  startHour: number;
  startMinute?: number;
  endHour: number;
  endMinute?: number;
}

export interface SlotConfig {
  timeZone: string;
  slotDurationMinutes?: number;
  leadTimeHours?: number;
  horizonDays?: number;
  businessHours: BusinessHours;
  blockedSlots?: Date[];
  bookedSlots?: Date[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

function getHostTimeZone(): string {
  return process.env.HOST_TIME_ZONE ?? DEFAULTS.timeZone;
}

function normalizeToUtcInstant(date: Date, timeZone: string): Date {
  return fromZonedTime(date, timeZone);
}

function isSameInstant(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function overlapsBooked(slotStart: Date, bookedSlots: Date[], durationMinutes: number): boolean {
  const slotEnd = addMinutes(slotStart, durationMinutes);

  return bookedSlots.some((bookedStart) => {
    const bookedEnd = addMinutes(bookedStart, durationMinutes);
    return slotStart < bookedEnd && slotEnd > bookedStart;
  });
}

function buildDayBounds(
  date: Date,
  timeZone: string,
  hours: BusinessHours,
): { start: Date; end: Date } {
  const zonedDay = toZonedTime(date, timeZone);
  const dayStart = startOfDay(zonedDay);

  const startLocal = new Date(dayStart);
  startLocal.setHours(hours.startHour, hours.startMinute ?? 0, 0, 0);

  const endLocal = new Date(dayStart);
  endLocal.setHours(hours.endHour, hours.endMinute ?? 0, 0, 0);

  return {
    start: fromZonedTime(startLocal, timeZone),
    end: fromZonedTime(endLocal, timeZone),
  };
}

/**
 * Calculate available booking slots for a calendar day in the host timezone.
 * Handles DST transitions by converting through zoned local times.
 */
export function getAvailableSlotsForDay(
  date: Date,
  config: Partial<SlotConfig> = {},
): TimeSlot[] {
  const timeZone = config.timeZone ?? getHostTimeZone();
  const slotDuration = config.slotDurationMinutes ?? DEFAULTS.slotDurationMinutes;
  const leadTimeHours = config.leadTimeHours ?? DEFAULTS.bookingLeadTimeHours;
  const businessHours = config.businessHours ?? {
    startHour: 9,
    endHour: 17,
  };

  const bookedSlots = (config.bookedSlots ?? []).map((slot) =>
    normalizeToUtcInstant(slot, timeZone),
  );
  const blockedSlots = (config.blockedSlots ?? []).map((slot) =>
    normalizeToUtcInstant(slot, timeZone),
  );

  const { start, end } = buildDayBounds(date, timeZone, businessHours);
  const now = new Date();
  const earliestBookable = addMinutes(now, leadTimeHours * 60);

  const candidates = eachMinuteOfInterval(
    { start, end: addMinutes(end, -slotDuration) },
    { step: slotDuration },
  );

  return candidates
    .filter((slotStart) => {
      if (isBefore(slotStart, earliestBookable) && !isEqual(slotStart, earliestBookable)) {
        return false;
      }

      if (blockedSlots.some((blocked) => isSameInstant(blocked, slotStart))) {
        return false;
      }

      if (overlapsBooked(slotStart, bookedSlots, slotDuration)) {
        return false;
      }

      return true;
    })
    .map((slotStart) => {
      const slotEnd = addMinutes(slotStart, slotDuration);
      return {
        start: slotStart,
        end: slotEnd,
        label: formatInTimeZone(slotStart, timeZone, "h:mm a"),
      };
    });
}

export function getAvailableDates(
  fromDate: Date,
  config: Partial<SlotConfig> = {},
): string[] {
  const timeZone = config.timeZone ?? getHostTimeZone();
  const horizonDays = config.horizonDays ?? DEFAULTS.bookingHorizonDays;
  const dates: string[] = [];

  for (let offset = 0; offset < horizonDays; offset += 1) {
    const day = addDays(startOfDay(toZonedTime(fromDate, timeZone)), offset);
    const slots = getAvailableSlotsForDay(day, config);
    if (slots.length > 0) {
      dates.push(formatInTimeZone(day, timeZone, "yyyy-MM-dd"));
    }
  }

  return dates;
}

export function parseSlotInTimeZone(
  dateString: string,
  timeString: string,
  timeZone?: string,
): Date {
  const zone = timeZone ?? getHostTimeZone();
  const localIso = `${dateString}T${timeString}:00`;
  return fromZonedTime(localIso, zone);
}

export { getHostTimeZone };
