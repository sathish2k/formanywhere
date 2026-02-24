/**
 * YouTube-style view tracking with Redis buffering.
 *
 * How it works:
 * 1. When a user views a blog, we hash their IP + User-Agent → visitorHash.
 * 2. Redis set `view:dedup:{blogId}` stores visitor hashes (24h TTL auto-expires).
 * 3. If the visitor already viewed within 24h → skip (no duplicate count).
 * 4. If new → increment Redis counter `view:count:{blogId}`.
 * 5. A periodic flush job writes buffered Redis counts → Postgres `viewCount`.
 * 6. After flush, Redis counters are reset to 0.
 *
 * This design handles millions of concurrent readers without hammering Postgres.
 * Even if Redis is down, views are recorded directly to Postgres (slower but works).
 */

import { redis } from './redis';
import { db } from '../db';
import { blog, blogView } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const VIEW_DEDUP_PREFIX = 'view:dedup:';
const VIEW_COUNT_PREFIX = 'view:count:';
const DEDUP_WINDOW = 24 * 60 * 60; // 24 hours in seconds

/**
 * Create a privacy-safe visitor fingerprint.
 * Uses a simple hash of IP + UserAgent (no cookies needed).
 */
async function hashVisitor(ip: string, userAgent: string): Promise<string> {
    const data = `${ip}::${userAgent}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if Redis is available for view tracking.
 */
function canUseRedis(): boolean {
    try {
        return redis.status === 'ready';
    } catch {
        return false;
    }
}

/**
 * Record a view for a blog post.
 * Returns `true` if this is a NEW unique view, `false` if duplicate.
 */
export async function recordView(blogId: string, ip: string, userAgent: string): Promise<boolean> {
    const visitorHash = await hashVisitor(ip, userAgent);

    if (canUseRedis()) {
        return recordViewRedis(blogId, visitorHash);
    }
    // Fallback: Direct Postgres (slower but works without Redis)
    return recordViewPostgres(blogId, visitorHash);
}

/**
 * Redis-based view recording (fast path).
 */
async function recordViewRedis(blogId: string, visitorHash: string): Promise<boolean> {
    const dedupKey = `${VIEW_DEDUP_PREFIX}${blogId}`;
    const countKey = `${VIEW_COUNT_PREFIX}${blogId}`;

    try {
        // SADD returns 1 if the member was added (new), 0 if already present
        const isNew = await redis.sadd(dedupKey, visitorHash);

        if (isNew === 1) {
            // Set TTL on the dedup set (resets 24h window from first view)
            // Only set TTL if the set is new (TTL not already set)
            const ttl = await redis.ttl(dedupKey);
            if (ttl === -1) {
                await redis.expire(dedupKey, DEDUP_WINDOW);
            }

            // Increment buffered count
            await redis.incr(countKey);
            return true;
        }

        return false;
    } catch (err) {
        console.warn('[ViewTracker] Redis error, falling back to Postgres:', (err as Error).message);
        return recordViewPostgres(blogId, visitorHash);
    }
}

/**
 * Postgres-based view recording (fallback / no-Redis path).
 */
async function recordViewPostgres(blogId: string, visitorHash: string): Promise<boolean> {
    try {
        // Check if this visitor viewed this blog in the last 24 hours
        const cutoff = new Date(Date.now() - DEDUP_WINDOW * 1000);
        const [existing] = await db
            .select({ id: blogView.id })
            .from(blogView)
            .where(
                sql`${blogView.blogId} = ${blogId}
                    AND ${blogView.visitorHash} = ${visitorHash}
                    AND ${blogView.viewedAt} > ${cutoff}`
            )
            .limit(1);

        if (existing) return false;

        // Insert view record
        await db.insert(blogView).values({
            id: uuidv4(),
            blogId,
            visitorHash,
        });

        // Increment view count directly
        await db.update(blog)
            .set({ viewCount: sql`${blog.viewCount} + 1` })
            .where(eq(blog.id, blogId));

        return true;
    } catch (err) {
        console.error('[ViewTracker] Postgres error:', err);
        return false;
    }
}

/**
 * Get the buffered (not yet flushed) view count for a blog from Redis.
 */
export async function getBufferedViewCount(blogId: string): Promise<number> {
    if (!canUseRedis()) return 0;
    try {
        const count = await redis.get(`${VIEW_COUNT_PREFIX}${blogId}`);
        return Number(count) || 0;
    } catch {
        return 0;
    }
}

/**
 * Flush all buffered Redis view counts to Postgres.
 * Called periodically (e.g. every 5 minutes) by the cron service.
 *
 * Uses GETDEL (atomic get + delete) to prevent losing counts during flush.
 */
export async function flushViewCounts(): Promise<number> {
    if (!canUseRedis()) return 0;

    try {
        // Find all buffered count keys using SCAN (non-blocking)
        const keys: string[] = [];
        const stream = redis.scanStream({
            match: `${VIEW_COUNT_PREFIX}*`,
            count: 100,
        });

        await new Promise<void>((resolve, reject) => {
            stream.on('data', (batch: string[]) => keys.push(...batch));
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        if (keys.length === 0) return 0;

        let flushed = 0;

        for (const key of keys) {
            const blogId = key.replace(VIEW_COUNT_PREFIX, '');

            // Atomic: get the count and delete the key
            const countStr = await redis.getdel(key);
            const count = Number(countStr) || 0;

            if (count > 0) {
                await db.update(blog)
                    .set({
                        viewCount: sql`${blog.viewCount} + ${count}`,
                        updatedAt: new Date(),
                    })
                    .where(eq(blog.id, blogId));

                // Also invalidate the slug cache so next read gets fresh count
                flushed += count;
            }
        }

        if (flushed > 0) {
            console.log(`[ViewTracker] Flushed ${flushed} views across ${keys.length} posts`);
        }

        return flushed;
    } catch (err) {
        console.error('[ViewTracker] Flush error:', err);
        return 0;
    }
}

/**
 * Clean up old view records (> 30 days) to keep the table lean.
 * Run once daily.
 */
export async function cleanupOldViews(): Promise<void> {
    try {
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await db.delete(blogView).where(sql`${blogView.viewedAt} < ${cutoff}`);
        console.log('[ViewTracker] Cleaned up view records older than 30 days');
    } catch (err) {
        console.error('[ViewTracker] Cleanup error:', err);
    }
}
