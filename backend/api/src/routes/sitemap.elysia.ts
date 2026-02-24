/**
 * Sitemap route — generates /sitemap.xml dynamically.
 *
 * Includes:
 *   - Static pages (home, about, pricing, blog list, etc.)
 *   - All published blog post URLs (fetched from DB)
 *
 * Cached for 1 hour via Cache-Control header.
 */
import { Elysia } from 'elysia';
import { db } from '../db';
import { blog } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const SITE_URL = (process.env.SITE_URL || process.env.FRONTEND_URL || 'https://formanywhere.com').replace(/\/$/, '');

/** Escape XML special characters */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** Static pages with their priority and change frequency */
const STATIC_PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
    { path: '/templates', priority: '0.7', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

export const sitemapRoutes = new Elysia()
    .get('/sitemap.xml', async ({ set }) => {
        set.headers['Content-Type'] = 'application/xml; charset=utf-8';
        set.headers['Cache-Control'] = 'public, max-age=3600, s-maxage=3600';

        // Fetch all published blog slugs + dates
        const blogs = await db
            .select({
                slug: blog.slug,
                updatedAt: blog.updatedAt,
            })
            .from(blog)
            .where(eq(blog.status, 'published'))
            .orderBy(desc(blog.publishedAt));

        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static pages
        for (const page of STATIC_PAGES) {
            xml += `
  <url>
    <loc>${escapeXml(SITE_URL + page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        }

        // Blog posts
        for (const b of blogs) {
            const lastmod = b.updatedAt
                ? new Date(b.updatedAt).toISOString().split('T')[0]
                : today;
            xml += `
  <url>
    <loc>${escapeXml(SITE_URL + '/blog/' + b.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }

        xml += `
</urlset>`;

        return xml;
    });
