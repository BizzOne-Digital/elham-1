import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import {
  checkRateLimit,
  type RateLimitOptions,
  type RateLimitResult,
} from "@/lib/rate-limit";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function jsonSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200,
) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult,
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.resetAt));
  return response;
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  options: RateLimitOptions,
): RateLimitResult | NextResponse {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, scope, options);

  if (!result.success) {
    const response = jsonError("Too many requests. Please try again later.", 429);
    return applyRateLimitHeaders(response, result);
  }

  return result;
}

export async function requireApiAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return session.user;
}

export async function parseJsonBody<T>(request: Request): Promise<T | NextResponse> {
  try {
    return (await request.json()) as T;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
}
