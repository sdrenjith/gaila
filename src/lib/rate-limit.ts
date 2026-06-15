import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const WINDOW_MS = 15 * 60 * 1000;
export const MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

let distributedLimiter: Ratelimit | null | undefined;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function getDistributedLimiter(): Ratelimit | null {
  if (distributedLimiter !== undefined) {
    return distributedLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    distributedLimiter = null;
    return null;
  }

  distributedLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_MS} ms`),
    prefix: "krew:lead",
  });
  return distributedLimiter;
}

function ensureMemoryCleanup() {
  if (cleanupInterval || getDistributedLimiter()) {
    return;
  }

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      if (entry.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }, WINDOW_MS);

  if (typeof cleanupInterval === "object" && "unref" in cleanupInterval) {
    cleanupInterval.unref();
  }
}

export function stopRateLimitCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

function checkMemoryRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  ensureMemoryCleanup();

  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  buckets.set(key, entry);
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function checkRateLimit(
  key: string,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const limiter = getDistributedLimiter();
  if (limiter) {
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      retryAfterSeconds: Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  }

  return checkMemoryRateLimit(key);
}
