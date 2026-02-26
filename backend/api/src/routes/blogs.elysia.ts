import { Elysia, t } from 'elysia';
import { db } from '../db';
import { blog, blogView, user } from '../db/schema';
import { desc, eq, sql, and, ilike, or, lt, gt, inArray } from 'drizzle-orm';
import { generateAndPublishBlog } from '../services/blog-generator';
import { getDailyPrompts, generateDailyPrompts, markPromptCompleted } from '../services/blog/prompt-generator';
import { publishManualBlog } from '../services/blog/manual-publish';
import {
    getCachedBlogBySlug, setCachedBlogBySlug,
    invalidateAllBlogCaches,
} from '../lib/redis';
import { recordView, getBufferedViewCount } from '../lib/view-tracker';
import { auth } from '../lib/auth';

// ─── Admin Guard Helper ─────────────────────────────────────────────────────
async function requireAdmin(request: Request): Promise<{ userId: string } | null> {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return null;

    // Check user role in DB
    const [userData] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    if (!userData || userData.role !== 'admin') return null;

    return { userId: session.user.id };
}

export const blogsRoutes = new Elysia({ prefix: '/api/blogs' })

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC ENDPOINTS — accessible to everyone
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/blogs — Paginated published blog list */
    .get('/', async ({ query }) => {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
        const offset = (page - 1) * limit;
        const sort = (query.sort as string) || 'latest';
        const category = (query.category as string) || 'all';
        const tag = (query.tag as string)?.slice(0, 200) || '';
        const search = (query.search as string)?.slice(0, 200) || '';

        const conditions = [eq(blog.status, 'published')];

        if (category && category !== 'all') {
            conditions.push(eq(blog.category, category));
        }
        if (tag) {
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

        let orderBy;
        switch (sort) {
            case 'most-viewed':
                orderBy = desc(blog.viewCount);
                break;
            case 'trending':
                orderBy = sql`${blog.viewCount} / POWER(EXTRACT(EPOCH FROM (NOW() - ${blog.publishedAt})) / 3600 + 2, 1.5) DESC`;
                break;
            case 'latest':
            default:
                orderBy = desc(blog.publishedAt);
                break;
        }

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
            pagination: { page, limit, totalCount, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
        };
    })

    /** GET /api/blogs/:slug — Single published blog by slug */
    .get('/:slug', async ({ params: { slug }, set }) => {
        const cached = await getCachedBlogBySlug(slug);
        if (cached) return cached;

        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) {
            set.status = 404;
            return { error: 'Blog not found' };
        }

        await setCachedBlogBySlug(slug, foundBlog);
        return foundBlog;
    })

    /** POST /api/blogs/:slug/view — Record a view */
    .post('/:slug/view', async ({ params: { slug }, request, set }) => {
        const [foundBlog] = await db.select({ id: blog.id }).from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) {
            set.status = 404;
            return { error: 'Blog not found' };
        }

        const ip = request.headers.get('x-forwarded-for')
            || request.headers.get('x-real-ip')
            || 'unknown';
        const ua = request.headers.get('user-agent') || 'unknown';

        const counted = await recordView(foundBlog.id, ip, ua);
        const buffered = await getBufferedViewCount(foundBlog.id);
        const [current] = await db.select({ viewCount: blog.viewCount }).from(blog).where(eq(blog.id, foundBlog.id));
        const totalViews = (current?.viewCount || 0) + buffered;

        return { counted, views: totalViews };
    })

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN ENDPOINTS — requires role: 'admin'
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/blogs/prompts — Get today's 20 daily prompts (admin only) */
    .get('/prompts', async ({ request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const prompts = await getDailyPrompts();
        return { prompts, count: prompts.length };
    })

    /** POST /api/blogs/prompts/refresh — Force-regenerate prompts (admin only) */
    .post('/prompts/refresh', async ({ request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const prompts = await generateDailyPrompts();
        return { prompts, count: prompts.length };
    })

    /** POST /api/blogs/publish-manual — Save as DRAFT (admin only) */
    .post('/publish-manual', async ({ body, request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const { promptId, rawContent, coverImageUrl, inlineImageUrls } = body as {
            promptId?: string;
            rawContent: string;
            coverImageUrl?: string;
            inlineImageUrls?: string[];
        };

        if (!rawContent || rawContent.trim().length < 100) {
            set.status = 400;
            return { error: 'rawContent is required (min 100 chars)' };
        }

        const result = await publishManualBlog(rawContent, coverImageUrl, inlineImageUrls, promptId);
        return { success: true, blog: result };
    })

    /** GET /api/blogs/drafts — List all draft posts (admin only) */
    .get('/drafts', async ({ request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const drafts = await db.select({
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            coverImage: blog.coverImage,
            tags: blog.tags,
            category: blog.category,
            createdAt: blog.createdAt,
        })
            .from(blog)
            .where(eq(blog.status, 'draft'))
            .orderBy(desc(blog.createdAt));

        return { drafts, count: drafts.length };
    })

    /** GET /api/blogs/drafts/:id — Get a single draft for editing (admin only) */
    .get('/drafts/:id', async ({ params, request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const [draft] = await db.select().from(blog).where(
            and(eq(blog.id, params.id), eq(blog.status, 'draft'))
        );
        if (!draft) { set.status = 404; return { error: 'Draft not found' }; }

        return draft;
    })

    /** PUT /api/blogs/drafts/:id — Update a draft (admin only) */
    .put('/drafts/:id', async ({ params, body, request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const { title, content, excerpt, coverImage, tags, seoTitle, seoDescription } = body as {
            title?: string;
            content?: string;
            excerpt?: string;
            coverImage?: string;
            tags?: string[];
            seoTitle?: string;
            seoDescription?: string;
        };

        const updateData: Record<string, any> = { updatedAt: new Date() };
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (tags !== undefined) updateData.tags = tags;
        if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
        if (seoDescription !== undefined) updateData.seoDescription = seoDescription;

        await db.update(blog).set(updateData).where(
            and(eq(blog.id, params.id), eq(blog.status, 'draft'))
        );

        return { success: true };
    })

    /** POST /api/blogs/drafts/:id/publish — Publish a draft (admin only) */
    .post('/drafts/:id/publish', async ({ params, request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const [draft] = await db.select({ id: blog.id, slug: blog.slug, title: blog.title })
            .from(blog)
            .where(and(eq(blog.id, params.id), eq(blog.status, 'draft')));

        if (!draft) { set.status = 404; return { error: 'Draft not found' }; }

        await db.update(blog).set({
            status: 'published',
            publishedAt: new Date(),
            updatedAt: new Date(),
        }).where(eq(blog.id, params.id));

        await invalidateAllBlogCaches();

        return { success: true, slug: draft.slug, title: draft.title };
    })

    /** DELETE /api/blogs/drafts/:id — Delete a draft (admin only) */
    .delete('/drafts/:id', async ({ params, request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        await db.delete(blog).where(
            and(eq(blog.id, params.id), eq(blog.status, 'draft'))
        );

        return { success: true };
    })

    /** POST /api/blogs/generate — Auto-generate (admin only, kept as fallback) */
    .post('/generate', async ({ query, request, set }) => {
        const admin = await requireAdmin(request);
        if (!admin) { set.status = 403; return { error: 'Admin access required' }; }

        const category = (query as any)?.category || 'random';
        const newBlog = await generateAndPublishBlog(category);
        await invalidateAllBlogCaches();
        return newBlog;
    });
