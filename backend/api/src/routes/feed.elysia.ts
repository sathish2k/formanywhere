import { Elysia } from 'elysia';
import { db } from '../db';
import { blog } from '../db/schema';
import { desc } from 'drizzle-orm';

export const feedRoutes = new Elysia()
    .get('/feed.xml', async ({ set }) => {
        const blogs = await db.select().from(blog).orderBy(desc(blog.publishedAt)).limit(50);
        
        const siteUrl = 'https://yourdomain.com'; // Replace with actual domain
        
        const rssItems = blogs.map(b => `
        <item>
            <title><![CDATA[${b.title}]]></title>
            <link>${siteUrl}/blog/${b.slug}</link>
            <guid isPermaLink="true">${siteUrl}/blog/${b.slug}</guid>
            <pubDate>${new Date(b.publishedAt || Date.now()).toUTCString()}</pubDate>
            <description><![CDATA[${b.excerpt}]]></description>
            <content:encoded><![CDATA[${b.content}]]></content:encoded>
            ${b.coverImage ? `<enclosure url="${b.coverImage}" type="image/jpeg" />` : ''}
        </item>
        `).join('');

        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Tech & Sensational News</title>
        <link>${siteUrl}</link>
        <description>Daily automated tech and sensational news updates.</description>
        <language>en-us</language>
        <atom:link href="${siteUrl}/api/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
    </channel>
</rss>`;

        set.headers['Content-Type'] = 'application/rss+xml';
        return rssFeed;
    });
