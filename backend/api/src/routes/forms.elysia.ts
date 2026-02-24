/**
 * Forms API Routes — Elysia
 *
 * Full CRUD with search, filter, sort, and pagination.
 * All routes are protected via inline auth (session cookie → user).
 */
import { Elysia, t } from 'elysia';
import { db } from '../db';
import { form } from '../db/schema';
import { eq, and, or, gte, lte, ilike, desc, asc, count } from 'drizzle-orm';
import { auth } from '../lib/auth';
import crypto from 'crypto';

/** Valid form status schema for TypeBox validation */
const VALID_STATUSES = new Set(['draft', 'published', 'archived', 'closed']);

function isValidStatus(s: string): boolean {
    return VALID_STATUSES.has(s);
}

/**
 * Generate a cryptographically secure random ID (16 chars).
 */
function generateId(): string {
    return crypto.randomBytes(12).toString('base64url').slice(0, 16);
}

export const formsRoutes = new Elysia({ prefix: '/api/forms' })
    .derive(async ({ request, set }) => {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            set.status = 401;
            return { user: null as any };
        }

        return { user: session.user };
    })
    .onBeforeHandle(({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { success: false, error: 'Unauthorized' };
        }
    })

    // ── List forms (GET /api/forms) ────────────────────────────
    .get('/', async ({ user, query }) => {
        const {
            search,
            sortBy = 'date',
            sortOrder = 'desc',
            page = '1',
            limit = '12',
            dateFrom,
            dateTo,
            responseRanges,
            statuses,
        } = query;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
        const offset = (pageNum - 1) * limitNum;

        // Build WHERE conditions
        const conditions = [eq(form.userId, user.id)];

        // Search filter (title or description)
        if (search) {
            conditions.push(
                or(
                    ilike(form.title, `%${search}%`),
                    ilike(form.description, `%${search}%`),
                )!
            );
        }

        // Date range filter
        if (dateFrom) {
            conditions.push(gte(form.createdAt, new Date(dateFrom)));
        }
        if (dateTo) {
            // Include the full end day
            const end = new Date(dateTo);
            end.setHours(23, 59, 59, 999);
            conditions.push(lte(form.createdAt, end));
        }

        // Status filter
        if (statuses) {
            const statusList = statuses.split(',').filter(Boolean);
            if (statusList.length > 0) {
                conditions.push(
                    or(...statusList.map(s => eq(form.status, s)))!
                );
            }
        }

        // Response range filter (e.g. "0-50,51-100,101+")
        if (responseRanges) {
            const ranges = responseRanges.split(',').filter(Boolean);
            const rangeConds = ranges.map(range => {
                if (range === '101+') return gte(form.submissions, 101);
                const [min, max] = range.split('-').map(Number);
                return and(gte(form.submissions, min), lte(form.submissions, max));
            }).filter(Boolean);
            if (rangeConds.length > 0) {
                conditions.push(or(...rangeConds)!);
            }
        }

        const where = and(...conditions);

        // Sort
        const orderColumn = sortBy === 'name' ? form.title
            : sortBy === 'responses' ? form.submissions
            : form.createdAt; // default: date
        const orderFn = sortOrder === 'asc' ? asc : desc;

        // Count total matching rows
        const [{ total }] = await db
            .select({ total: count() })
            .from(form)
            .where(where);

        // Fetch page
        const forms = await db
            .select({
                id: form.id,
                title: form.title,
                description: form.description,
                schema: form.schema,
                status: form.status,
                submissions: form.submissions,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
                userId: form.userId,
            })
            .from(form)
            .where(where)
            .orderBy(orderFn(orderColumn))
            .limit(limitNum)
            .offset(offset);

        return {
            success: true,
            forms,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }, {
        query: t.Object({
            search: t.Optional(t.String()),
            sortBy: t.Optional(t.String()),
            sortOrder: t.Optional(t.String()),
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            dateFrom: t.Optional(t.String()),
            dateTo: t.Optional(t.String()),
            responseRanges: t.Optional(t.String()),
            statuses: t.Optional(t.String()),
        }),
    })

    // ── Get single form (GET /api/forms/:id) ───────────────────
    .get('/:id', async ({ user, params, set }) => {
        const [found] = await db
            .select()
            .from(form)
            .where(and(eq(form.id, params.id), eq(form.userId, user.id)));

        if (!found) {
            set.status = 404;
            return { success: false, error: 'Form not found' };
        }

        return { success: true, form: found };
    })

    // ── Create form (POST /api/forms) ──────────────────────────
    .post('/', async ({ user, body, set }) => {
        const id = generateId();
        const now = new Date();

        const status = body.status || 'draft';
        if (!isValidStatus(status)) {
            set.status = 400;
            return { success: false, error: 'Invalid status. Must be draft, published, archived, or closed.' };
        }

        const [created] = await db.insert(form).values({
            id,
            userId: user.id,
            title: body.title || 'Untitled Form',
            description: body.description || null,
            schema: body.schema || null,
            status,
            submissions: 0,
            createdAt: now,
            updatedAt: now,
        }).returning();

        return { success: true, form: created };
    }, {
        body: t.Object({
            title: t.Optional(t.String({ maxLength: 500 })),
            description: t.Optional(t.String({ maxLength: 5000 })),
            schema: t.Optional(t.Unknown()),
            status: t.Optional(t.String()),
        }),
    })

    // ── Update form (PUT /api/forms/:id) ───────────────────────
    .put('/:id', async ({ user, params, body, set }) => {
        // Verify ownership
        const [existing] = await db
            .select({ id: form.id })
            .from(form)
            .where(and(eq(form.id, params.id), eq(form.userId, user.id)));

        if (!existing) {
            set.status = 404;
            return { success: false, error: 'Form not found' };
        }

        if (body.status && !isValidStatus(body.status)) {
            set.status = 400;
            return { success: false, error: 'Invalid status. Must be draft, published, archived, or closed.' };
        }

        const updates: Record<string, unknown> = { updatedAt: new Date() };
        if (body.title !== undefined) updates.title = body.title;
        if (body.description !== undefined) updates.description = body.description;
        if (body.schema !== undefined) updates.schema = body.schema;
        if (body.status !== undefined) updates.status = body.status;

        const [updated] = await db
            .update(form)
            .set(updates)
            .where(eq(form.id, params.id))
            .returning();

        return { success: true, form: updated };
    }, {
        body: t.Object({
            title: t.Optional(t.String({ maxLength: 500 })),
            description: t.Optional(t.String({ maxLength: 5000 })),
            schema: t.Optional(t.Unknown()),
            status: t.Optional(t.String()),
        }),
    })

    // ── Delete form (DELETE /api/forms/:id) ─────────────────────
    .delete('/:id', async ({ user, params, set }) => {
        const [existing] = await db
            .select({ id: form.id })
            .from(form)
            .where(and(eq(form.id, params.id), eq(form.userId, user.id)));

        if (!existing) {
            set.status = 404;
            return { success: false, error: 'Form not found' };
        }

        await db.delete(form).where(eq(form.id, params.id));

        return { success: true };
    })

    // ── Duplicate form (POST /api/forms/:id/duplicate) ──────────
    .post('/:id/duplicate', async ({ user, params, set }) => {
        const [original] = await db
            .select()
            .from(form)
            .where(and(eq(form.id, params.id), eq(form.userId, user.id)));

        if (!original) {
            set.status = 404;
            return { success: false, error: 'Form not found' };
        }

        const id = generateId();
        const now = new Date();

        const [duplicate] = await db.insert(form).values({
            id,
            userId: user.id,
            title: `${original.title} (Copy)`,
            description: original.description,
            schema: original.schema,
            status: 'draft',
            submissions: 0,
            createdAt: now,
            updatedAt: now,
        }).returning();

        return { success: true, form: duplicate };
    });
