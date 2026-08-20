import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createCancelToken,
  createRescheduleToken,
  verifyBookingToken,
} from "@/lib/booking/tokens";

describe("booking signed tokens", () => {
  const originalSecret = process.env.AUTH_SECRET;

  beforeEach(() => {
    process.env.AUTH_SECRET = "test-secret-for-booking-tokens";
  });

  afterEach(() => {
    process.env.AUTH_SECRET = originalSecret;
  });

  it("creates and verifies cancel and reschedule tokens", () => {
    const cancelToken = createCancelToken("booking123", "client@example.com");
    const rescheduleToken = createRescheduleToken("booking123", "client@example.com");

    const cancelPayload = verifyBookingToken(cancelToken);
    const reschedulePayload = verifyBookingToken(rescheduleToken);

    expect(cancelPayload.action).toBe("cancel");
    expect(reschedulePayload.action).toBe("reschedule");
    expect(cancelPayload.bookingId).toBe("booking123");
    expect(cancelPayload.email).toBe("client@example.com");
  });

  it("rejects tampered tokens", () => {
    const token = createCancelToken("booking123", "client@example.com");
    const tampered = `${token}x`;

    expect(() => verifyBookingToken(tampered)).toThrow();
  });
});
