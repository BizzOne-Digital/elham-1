import { describe, expect, it } from "vitest";
import { buildFormRateLimitKey, getClientIp } from "@/lib/api/helpers";

describe("client IP helpers", () => {
  it("reads the first forwarded IP", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.10, 70.41.3.18" },
    });
    expect(getClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back to real IP headers", () => {
    const request = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.22" },
    });
    expect(getClientIp(request)).toBe("198.51.100.22");
  });

  it("rate limits per email when IP is unknown", () => {
    const request = new Request("https://example.com");
    expect(buildFormRateLimitKey(request, "User@Example.com")).toBe("email:user@example.com");
  });

  it("combines email and IP when available", () => {
    const request = new Request("https://example.com", {
      headers: { "cf-connecting-ip": "192.0.2.44" },
    });
    expect(buildFormRateLimitKey(request, "a@b.com")).toBe("a@b.com:192.0.2.44");
  });
});
