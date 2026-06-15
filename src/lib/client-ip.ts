import "server-only";

import { headers } from "next/headers";

/**
 * Returns a client IP only from headers set by the hosting edge/proxy,
 * not from generic x-forwarded-for values that clients can spoof.
 */
export async function getTrustedClientIp(): Promise<string | null> {
  const headerStore = await headers();

  const vercelIp = headerStore.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0]?.trim() || null;
  }

  const cloudflareIp = headerStore.get("cf-connecting-ip");
  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const forwarded = headerStore.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() || null;
    }
    const realIp = headerStore.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  }

  return null;
}
