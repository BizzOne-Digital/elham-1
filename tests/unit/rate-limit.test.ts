import { describe, expect, it, beforeEach } from "vitest";
import {
  checkRateLimit,
  clearAllRateLimits,
} from "@/lib/rate-limit";

describe("rate limiting", () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  it("allows requests until the limit is reached", () => {
    const scope = "unit-test";
    const identifier = "127.0.0.1";
    const options = { limit: 3, windowMs: 60_000 };

    const first = checkRateLimit(identifier, scope, options);
    const second = checkRateLimit(identifier, scope, options);
    const third = checkRateLimit(identifier, scope, options);
    const fourth = checkRateLimit(identifier, scope, options);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(third.success).toBe(true);
    expect(fourth.success).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("tracks separate scopes independently", () => {
    const identifier = "203.0.113.10";
    const tightLimit = { limit: 1, windowMs: 60_000 };

    const contactFirst = checkRateLimit(identifier, "contact-form", tightLimit);
    const contactSecond = checkRateLimit(identifier, "contact-form", tightLimit);
    const bookingFirst = checkRateLimit(identifier, "booking-form", tightLimit);

    expect(contactFirst.success).toBe(true);
    expect(contactSecond.success).toBe(false);
    expect(bookingFirst.success).toBe(true);
  });
});
