interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

function getKey(identifier: string, scope: string): string {
  return `${scope}:${identifier}`;
}

export function checkRateLimit(
  identifier: string,
  scope: string,
  options: RateLimitOptions,
): RateLimitResult {
  const key = getKey(identifier, scope);
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetAt,
    };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    limit: options.limit,
    remaining: Math.max(options.limit - existing.count, 0),
    resetAt: existing.resetAt,
  };
}

export const RATE_LIMITS = {
  contactForm: { limit: 5, windowMs: 15 * 60 * 1000 },
  bookingForm: { limit: 5, windowMs: 15 * 60 * 1000 },
  login: { limit: 10, windowMs: 15 * 60 * 1000 },
  newsletter: { limit: 3, windowMs: 60 * 60 * 1000 },
} as const;

export function resetRateLimit(identifier: string, scope: string): void {
  store.delete(getKey(identifier, scope));
}

/** Test helper to clear all in-memory counters. */
export function clearAllRateLimits(): void {
  store.clear();
}
