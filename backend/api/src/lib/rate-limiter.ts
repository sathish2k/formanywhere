/**
 * Redis-backed sliding-window rate limiter for Elysia.
 *
 * Uses Redis sorted sets for accurate sliding-window counting.
 * Falls back to an in-memory Map when Redis is unavailable.
 */
import { Elysia } from 'elysia';
import { redis } from './redis';

interface RateLimitConfig {
    /** Max requests in the window */
    max: number;
    /** Window duration in seconds */
    window: number;
    /** Key prefix for namespacing (default: 'rl') */
    prefix?: string;
    /** Custom key generator. Defaults to IP-based. */
    keyGenerator?: (request: Request) => string;
}

/**
 * Extract client IP from request headers.
 */
function getClientIp(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}

// ── In-memory fallback ──────────────────────────────────────────────
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 60s
setInterval(() => {
    const now = Date.now();
    for (const [key, val] of memoryStore) {
        if (val.resetAt <= now) memoryStore.delete(key);
    }
}, 60_000);

async function checkMemory(key: string, max: number, windowMs: number): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || entry.resetAt <= now) {
        memoryStore.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
    }

    entry.count++;
    const allowed = entry.count <= max;
    return { allowed, remaining: Math.max(0, max - entry.count), resetAt: entry.resetAt };
}

// ── Redis-based sliding window ──────────────────────────────────────
async function checkRedis(key: string, max: number, windowSec: number): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const windowMs = windowSec * 1000;
    const windowStart = now - windowMs;

    try {
        // Pipeline: remove expired, add current, count, set TTL
        const pipeline = redis.pipeline();
        pipeline.zremrangebyscore(key, 0, windowStart);
        pipeline.zadd(key, now.toString(), `${now}:${Math.random()}`);
        pipeline.zcard(key);
        pipeline.expire(key, windowSec + 1);
        const results = await pipeline.exec();

        const count = (results?.[2]?.[1] as number) || 0;
        const allowed = count <= max;

        return {
            allowed,
            remaining: Math.max(0, max - count),
            resetAt: now + windowMs,
        };
    } catch {
        // Redis error — fall back to memory
        return checkMemory(key, max, windowMs);
    }
}

function canUseRedis(): boolean {
    try {
        return redis.status === 'ready';
    } catch {
        return false;
    }
}

/**
 * Create an Elysia rate-limiting plugin.
 *
 * Usage:
 *   .use(rateLimit({ max: 60, window: 60 }))        // 60 req/min
 *   .use(rateLimit({ max: 10, window: 60, prefix: 'ai' }))  // 10 AI req/min
 */
export function rateLimit(config: RateLimitConfig) {
    const { max, window: windowSec, prefix = 'rl', keyGenerator } = config;
    const windowMs = windowSec * 1000;

    return new Elysia({ name: `rate-limit-${prefix}` })
        .onBeforeHandle(async ({ request, set }) => {
            const ip = keyGenerator ? keyGenerator(request) : getClientIp(request);
            const key = `${prefix}:${ip}`;

            const result = canUseRedis()
                ? await checkRedis(key, max, windowSec)
                : await checkMemory(key, max, windowMs);

            // Always set rate limit headers
            set.headers['X-RateLimit-Limit'] = String(max);
            set.headers['X-RateLimit-Remaining'] = String(result.remaining);
            set.headers['X-RateLimit-Reset'] = String(Math.ceil(result.resetAt / 1000));

            if (!result.allowed) {
                set.status = 429;
                set.headers['Retry-After'] = String(windowSec);
                return {
                    success: false,
                    error: 'Too many requests. Please try again later.',
                };
            }
        });
}
