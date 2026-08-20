import { createHmac, timingSafeEqual } from "crypto";

export type BookingTokenAction = "reschedule" | "cancel";

export interface BookingTokenPayload {
  bookingId: string;
  action: BookingTokenAction;
  email: string;
  exp: number;
}

const TOKEN_SEPARATOR = ".";

function getSigningSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined");
  }
  return secret;
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function encodePayload(payload: BookingTokenPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(encoded: string): BookingTokenPayload {
  const json = Buffer.from(encoded, "base64url").toString("utf8");
  return JSON.parse(json) as BookingTokenPayload;
}

export function createBookingToken(
  payload: Omit<BookingTokenPayload, "exp">,
  ttlHours = 72,
): string {
  const fullPayload: BookingTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlHours * 60 * 60,
  };

  const encoded = encodePayload(fullPayload);
  const signature = signPayload(encoded);
  return `${encoded}${TOKEN_SEPARATOR}${signature}`;
}

export function createRescheduleToken(
  bookingId: string,
  email: string,
  ttlHours?: number,
): string {
  return createBookingToken({ bookingId, email, action: "reschedule" }, ttlHours);
}

export function createCancelToken(
  bookingId: string,
  email: string,
  ttlHours?: number,
): string {
  return createBookingToken({ bookingId, email, action: "cancel" }, ttlHours);
}

export function verifyBookingToken(token: string): BookingTokenPayload {
  const [encoded, signature] = token.split(TOKEN_SEPARATOR);

  if (!encoded || !signature) {
    throw new Error("Invalid token format");
  }

  const expected = signPayload(encoded);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid token signature");
  }

  const payload = decodePayload(encoded);

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}

export function buildTokenUrl(
  basePath: string,
  token: string,
  siteUrl?: string,
): string {
  const origin = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = new URL(basePath, origin);
  url.searchParams.set("token", token);
  return url.toString();
}
