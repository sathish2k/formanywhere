/**
 * Templates API Routes — Elysia
 *
 * Public read-only endpoints for browsing pre-built form templates.
 * No authentication required — templates are visible to all users.
 */
import { Elysia, t } from 'elysia';
import { db } from '../db';
import { template } from '../db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const templatesRoutes = new Elysia({ prefix: '/api/templates' })

    // ── List all public templates (GET /api/templates) ─────────
    .get('/', async ({ query }) => {
        const { category } = query;

        const conditions = [eq(template.isPublic, true)];
        if (category) {
            conditions.push(eq(template.category, category));
        }

        const templates = await db
            .select({
                id: template.id,
                name: template.name,
                description: template.description,
                category: template.category,
                icon: template.icon,
                sortOrder: template.sortOrder,
                createdAt: template.createdAt,
            })
            .from(template)
            .where(and(...conditions))
            .orderBy(asc(template.sortOrder), asc(template.name));

        return { success: true, templates };
    }, {
        query: t.Object({
            category: t.Optional(t.String()),
        }),
    })

    // ── Get single template (GET /api/templates/:id) ────────────
    .get('/:id', async ({ params, set }) => {
        const [found] = await db
            .select()
            .from(template)
            .where(and(eq(template.id, params.id), eq(template.isPublic, true)));

        if (!found) {
            set.status = 404;
            return { success: false, error: 'Template not found' };
        }

        return { success: true, template: found };
    });
