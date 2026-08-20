import { describe, expect, it } from "vitest";
import { addDays, startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  getAvailableSlotsForDay,
  parseSlotInTimeZone,
} from "@/lib/booking/slots";

describe("booking timezone handling", () => {
  const timeZone = "America/Toronto";

  it("parses a Toronto slot into the expected UTC instant", () => {
    const slot = parseSlotInTimeZone("2026-01-15", "10:00", timeZone);
    const torontoLabel = formatInTimeZone(slot, timeZone, "yyyy-MM-dd HH:mm");

    expect(torontoLabel).toBe("2026-01-15 10:00");
  });

  it("returns weekday slots between 9:00 and 17:00 in host timezone", () => {
    const day = fromZonedTime("2026-09-15T12:00:00", timeZone);
    const slots = getAvailableSlotsForDay(day, {
      timeZone,
      slotDurationMinutes: 30,
      leadTimeHours: 0,
      businessHours: {
        startHour: 9,
        endHour: 17,
      },
      bookedSlots: [],
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]?.label).toMatch(/9:00 AM/);
    expect(slots.at(-1)?.label).toMatch(/4:30 PM/);
  });

  it("excludes booked slots from availability", () => {
    const day = addDays(startOfDay(fromZonedTime("2026-06-17T12:00:00", timeZone)), 7);
    const bookedStart = parseSlotInTimeZone(
      formatInTimeZone(day, timeZone, "yyyy-MM-dd"),
      "10:00",
      timeZone,
    );

    const slots = getAvailableSlotsForDay(day, {
      timeZone,
      slotDurationMinutes: 30,
      leadTimeHours: 0,
      businessHours: {
        startHour: 9,
        endHour: 17,
      },
      bookedSlots: [bookedStart],
    });

    expect(slots.some((slot) => slot.start.getTime() === bookedStart.getTime())).toBe(false);
  });
});
