import { describe, expect, it } from "vitest";
import {
  bookingFormSchema,
  contactFormSchema,
  emailSchema,
  newsletterFormSchema,
  quoteFormSchema,
} from "@/lib/validation/common";

describe("validation schemas", () => {
  it("accepts a valid contact form payload", () => {
    const result = contactFormSchema.safeParse({
      name: "Alex Owner",
      email: "alex@example.com",
      phone: "416-700-2656",
      message: "We need a new website and lead capture flow.",
      source: "contact-page",
    });

    expect(result.success).toBe(true);
  });

  it("rejects honeypot submissions", () => {
    const result = contactFormSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      message: "This should never pass validation checks.",
      website: "http://spam.example",
    });

    expect(result.success).toBe(false);
  });

  it("validates quote and newsletter payloads", () => {
    const quote = quoteFormSchema.safeParse({
      name: "Jamie Lee",
      email: "jamie@example.com",
      message: "Looking for a custom app quote.",
      company: "Lee Retail",
      budget: "10k-25k",
    });

    const newsletter = newsletterFormSchema.safeParse({
      email: "insights@example.com",
    });

    expect(quote.success).toBe(true);
    expect(newsletter.success).toBe(true);
  });

  it("validates booking date and time formats", () => {
    const valid = bookingFormSchema.safeParse({
      name: "Taylor Business",
      email: "taylor@example.com",
      service: "Custom Web Design",
      date: "2026-09-15",
      time: "10:00",
    });

    const invalid = bookingFormSchema.safeParse({
      name: "Taylor Business",
      email: "taylor@example.com",
      service: "Custom Web Design",
      date: "15-09-2026",
      time: "10:00 AM",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("rejects malformed email addresses", () => {
    const result = emailSchema.safeParse("not-an-email");
    expect(result.success).toBe(false);
  });
});
