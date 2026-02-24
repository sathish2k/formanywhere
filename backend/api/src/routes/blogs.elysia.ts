import { Elysia, t } from 'elysia';
import { db } from '../db';
import { blog, blogView } from '../db/schema';
import { desc, eq, sql, and, ilike, or, lt, gt, inArray } from 'drizzle-orm';
import { generateAndPublishBlog } from '../services/blog-generator';
import {
    getCachedBlogBySlug, setCachedBlogBySlug,
    invalidateAllBlogCaches,
} from '../lib/redis';
import { recordView, getBufferedViewCount } from '../lib/view-tracker';
import { auth } from '../lib/auth';

export const blogsRoutes = new Elysia({ prefix: '/api/blogs' })
    /**
     * GET /api/blogs — Paginated blog list with filtering & sorting.
     *
     * Query params:
     *   page     — Page number (default: 1)
     *   limit    — Items per page (default: 12, max: 50)
     *   sort     — 'latest' | 'trending' | 'most-viewed' (default: latest)
     *   category — 'tech' | 'non-tech' | 'all' (default: all)
     *   tag      — Filter by tag (partial match)
     *   search   — Full-text search in title, excerpt, content
     */
    .get('/', async ({ query }) => {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
        const offset = (page - 1) * limit;
        const sort = (query.sort as string) || 'latest';
        const category = (query.category as string) || 'all';
        const tag = (query.tag as string)?.slice(0, 200) || '';
        const search = (query.search as string)?.slice(0, 200) || '';

        // ── Build WHERE conditions ──
        const conditions = [eq(blog.status, 'published')];

        if (category && category !== 'all') {
            conditions.push(eq(blog.category, category));
        }

        if (tag) {
            // JSONB array contains — works with GIN index at scale
            conditions.push(sql`${blog.tags}::jsonb @> ${JSON.stringify([tag])}::jsonb`);
        }

        if (search) {
            conditions.push(
                or(
                    ilike(blog.title, `%${search}%`),
                    ilike(blog.excerpt, `%${search}%`),
                )!
            );
        }

        const where = and(...conditions);

        // ── Build ORDER BY ──
        let orderBy;
        switch (sort) {
            case 'most-viewed':
                orderBy = desc(blog.viewCount);
                break;
            case 'trending':
                // Trending = views weighted toward recency (HN-style)
                // score = views / (hours_since_publish + 2)^1.5
                orderBy = sql`${blog.viewCount} / POWER(EXTRACT(EPOCH FROM (NOW() - ${blog.publishedAt})) / 3600 + 2, 1.5) DESC`;
                break;
            case 'latest':
            default:
                orderBy = desc(blog.publishedAt);
                break;
        }

        // ── Execute count + data in parallel ──
        const [countResult, blogs] = await Promise.all([
            db.select({ count: sql<number>`count(*)::int` })
              .from(blog)
              .where(where),
            db.select({
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt,
                coverImage: blog.coverImage,
                tags: blog.tags,
                category: blog.category,
                viewCount: blog.viewCount,
                publishedAt: blog.publishedAt,
                socialMediaPosts: blog.socialMediaPosts,
            })
              .from(blog)
              .where(where)
              .orderBy(orderBy)
              .limit(limit)
              .offset(offset),
        ]);

        const totalCount = countResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            blogs,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    })

    .get('/:slug', async ({ params: { slug }, error }) => {
        // Try Redis cache first
        const cached = await getCachedBlogBySlug(slug);
        if (cached) return cached;

        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        // Cache for 1 hour
        await setCachedBlogBySlug(slug, foundBlog);
        return foundBlog;
    })

    /**
     * POST /api/blogs/:slug/view — Record a view (YouTube-style unique counting).
     * Deduplicates by visitor fingerprint within a 24-hour window.
     * Uses Redis to buffer counts, flushed to Postgres periodically.
     */
    .post('/:slug/view', async ({ params: { slug }, request, error }) => {
        const [foundBlog] = await db.select({ id: blog.id }).from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        const ip = request.headers.get('x-forwarded-for')
            || request.headers.get('x-real-ip')
            || 'unknown';
        const ua = request.headers.get('user-agent') || 'unknown';

        const counted = await recordView(foundBlog.id, ip, ua);

        // Get real-time count: DB viewCount + Redis buffer
        const buffered = await getBufferedViewCount(foundBlog.id);
        const [current] = await db.select({ viewCount: blog.viewCount }).from(blog).where(eq(blog.id, foundBlog.id));
        const totalViews = (current?.viewCount || 0) + buffered;

        return { counted, views: totalViews };
    })

    // Manual trigger — protected, requires authentication.
    // Optional ?category=tech|non-tech|random
    .post('/generate', async ({ query, request, set }) => {
        // Inline auth check — only authenticated users can trigger generation
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            set.status = 401;
            return { success: false, error: 'Authentication required' };
        }

        const category = (query as any)?.category || 'random';
        const newBlog = await generateAndPublishBlog(category);
        // Invalidate all caches so new blog appears immediately
        await invalidateAllBlogCaches();
        return newBlog;
    });
