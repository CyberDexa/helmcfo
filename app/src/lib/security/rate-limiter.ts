/**
 * In-memory sliding window rate limiter.
 *
 * Suitable for development and low-traffic production use.
 * For distributed deployments, swap the store for Redis (Upstash recommended).
 *
 * Usage:
 *   const result = checkRateLimit(ip, { limit: 10, windowMs: 60_000 });
 *   if (!result.allowed) return new Response("Too Many Requests", { status: 429 });
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp (ms) when the oldest request expires
  retryAfterMs: number;
}

// Module-level map — persists for the lifetime of the Node.js process.
// Entries are pruned lazily on each check.
const store = new Map<string, RateLimitEntry>();

/**
 * Check (and record) whether `key` has exceeded the rate limit.
 * `key` is typically an IP address, user ID, or API key.
 */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Prune timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const count = entry.timestamps.length;
  const allowed = count < limit;

  if (allowed) {
    entry.timestamps.push(now);
  }

  const oldest = entry.timestamps[0] ?? now;
  const resetAt = oldest + windowMs;
  const retryAfterMs = allowed ? 0 : resetAt - now;
  const remaining = Math.max(0, limit - entry.timestamps.length);

  return { allowed, remaining, resetAt, retryAfterMs };
}

/**
 * Build standard rate-limit response headers (RFC 6585 + draft-ietf-httpapi-ratelimit-headers).
 */
export function rateLimitHeaders(result: RateLimitResult, limit: number): HeadersInit {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfterMs > 0
      ? { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) }
      : {}),
  };
}

/**
 * Preset configurations for common endpoints.
 */
export const RATE_LIMITS = {
  /** Public API endpoints — generous, prevents scraping */
  public: { limit: 60, windowMs: 60_000 } satisfies RateLimitOptions,
  /** AI/LLM endpoints — expensive, throttle hard */
  ai: { limit: 10, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Auth endpoints — prevent brute force */
  auth: { limit: 5, windowMs: 300_000 } satisfies RateLimitOptions,
  /** Webhook endpoints — high volume expected */
  webhook: { limit: 500, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Waitlist / marketing forms */
  form: { limit: 3, windowMs: 3_600_000 } satisfies RateLimitOptions,
} as const;

/**
 * Extract a suitable rate-limit key from a Next.js Request.
 * Prefers X-Forwarded-For (set by Vercel/Cloudflare) over socket.remoteAddress.
 */
export function getRateLimitKey(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
