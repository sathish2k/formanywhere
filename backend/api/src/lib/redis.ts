import Redis from 'ioredis';

/**
 * Redis client for caching blog data.
 *
 * Env vars:
 *   REDIS_URL   — full connection string (e.g. redis://user:pass@host:6379)
 *   REDIS_HOST  — host (default: 127.0.0.1)
 *   REDIS_PORT  — port (default: 6379)
 *   REDIS_PASSWORD — password (optional)
 */
const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl
    ? new Redis(redisUrl, { maxRetriesPerRequest: 3, lazyConnect: true })
    : new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
      });

// Graceful connection — don't crash the server if Redis is down
redis.on('error', (err) => {
    console.warn('[Redis] Connection error (cache disabled):', err.message);
});

let isConnected = false;

redis.on('connect', () => {
    isConnected = true;
    console.log('[Redis] Connected');
});

redis.on('close', () => {
    isConnected = false;
});

// ── Cache helpers ───────────────────────────────────────────────────────

const CACHE_PREFIX = 'blog:';
const BLOG_LIST_KEY = `${CACHE_PREFIX}list`;
const BLOG_SLUG_PREFIX = `${CACHE_PREFIX}slug:`;

/** Default TTL: 1 hour */
const DEFAULT_TTL = 60 * 60;

/** Check if Redis is usable */
function canUseCache(): boolean {
    return isConnected;
}

/**
 * Get cached blog list.
 * Returns null on miss or if Redis is unavailable.
 */
export async function getCachedBlogList(): Promise<any[] | null> {
    if (!canUseCache()) return null;
    try {
        const data = await redis.get(BLOG_LIST_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

/**
 * Cache the full blog list.
 */
export async function setCachedBlogList(blogs: any[], ttl = DEFAULT_TTL): Promise<void> {
    if (!canUseCache()) return;
    try {
        await redis.set(BLOG_LIST_KEY, JSON.stringify(blogs), 'EX', ttl);
    } catch { /* noop */ }
}

/**
 * Get a cached blog by slug.
 */
export async function getCachedBlogBySlug(slug: string): Promise<any | null> {
    if (!canUseCache()) return null;
    try {
        const data = await redis.get(`${BLOG_SLUG_PREFIX}${slug}`);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

/**
 * Cache a single blog by slug.
 */
export async function setCachedBlogBySlug(slug: string, blogData: any, ttl = DEFAULT_TTL): Promise<void> {
    if (!canUseCache()) return;
    try {
        await redis.set(`${BLOG_SLUG_PREFIX}${slug}`, JSON.stringify(blogData), 'EX', ttl);
    } catch { /* noop */ }
}

/**
 * Invalidate a single blog's cache.
 */
export async function invalidateBlogCache(slug?: string): Promise<void> {
    if (!canUseCache()) return;
    try {
        // Always invalidate the list
        await redis.del(BLOG_LIST_KEY);

        // Invalidate specific slug if provided
        if (slug) {
            await redis.del(`${BLOG_SLUG_PREFIX}${slug}`);
        }
    } catch { /* noop */ }
}

/**
 * Invalidate ALL blog caches (list + every slug).
 * Used after new blog generation.
 * Uses SCAN instead of KEYS to avoid blocking Redis in production.
 */
export async function invalidateAllBlogCaches(): Promise<void> {
    if (!canUseCache()) return;
    try {
        const stream = redis.scanStream({
            match: `${CACHE_PREFIX}*`,
            count: 100,
        });

        stream.on('data', async (keys: string[]) => {
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        });

        await new Promise<void>((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });
    } catch { /* noop */ }
}

// Connect eagerly but don't block startup
redis.connect().catch(() => {
    console.warn('[Redis] Could not connect on startup — caching disabled');
});
