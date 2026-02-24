import { Elysia } from 'elysia';
import { db } from '../db';
import { blog } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

const SITE_URL = (process.env.SITE_URL || 'https://formanywhere.com').replace(/\/$/, '');

/**
 * Escape text for safe XML embedding (outside CDATA).
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Escape content for safe CDATA embedding.
 * CDATA sections end at `]]>`, so we split any occurrence into
 * separate CDATA blocks: `]]]]><![CDATA[>` 
 */
function escapeCdata(str: string): string {
    return str.replace(/\]\]>/g, ']]]]><![CDATA[>');
}

/**
 * Validate a URL to prevent attribute injection.
 */
function isSafeUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
        return false;
    }
}

export const feedRoutes = new Elysia()
    .get('/feed.xml', async ({ set }) => {
        // Only include published blogs
        const blogs = await db.select()
            .from(blog)
            .where(eq(blog.status, 'published'))
            .orderBy(desc(blog.publishedAt))
            .limit(50);

        const rssItems = blogs.map(b => {
            const safeSlug = encodeURIComponent(b.slug);
            const enclosure = (b.coverImage && isSafeUrl(b.coverImage))
                ? `<enclosure url="${escapeXml(b.coverImage)}" type="image/jpeg" />`
                : '';

            return `
        <item>
            <title><![CDATA[${escapeCdata(b.title)}]]></title>
            <link>${SITE_URL}/blog/${safeSlug}</link>
            <guid isPermaLink="true">${SITE_URL}/blog/${safeSlug}</guid>
            <pubDate>${new Date(b.publishedAt || Date.now()).toUTCString()}</pubDate>
            <description><![CDATA[${escapeCdata(b.excerpt || '')}]]></description>
            <content:encoded><![CDATA[${escapeCdata(b.content || '')}]]></content:encoded>
            ${enclosure}
        </item>`;
        }).join('');

        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Tech &amp; Sensational News</title>
        <link>${SITE_URL}</link>
        <description>Daily automated tech and sensational news updates.</description>
        <language>en-us</language>
        <atom:link href="${SITE_URL}/api/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
    </channel>
</rss>`;

        set.headers['Content-Type'] = 'application/rss+xml';
        set.headers['Cache-Control'] = 'public, max-age=3600, s-maxage=3600';
        return rssFeed;
    });
