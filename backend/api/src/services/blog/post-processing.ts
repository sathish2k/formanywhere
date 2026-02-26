// ─── Post-Processing: Ads, Affiliates, SEO, TOC, Internal Links, Humanizer ─
import { db } from '../../db';
import { blog } from '../../db/schema';
import { sql, and, ne, eq } from 'drizzle-orm';
import type { AuthorPersona } from './blog-authors';
import type { BlogType } from './blog-types';

// ─── Ad Slot Injection ──────────────────────────────────────────────────────

/**
 * Injects Google AdSense in-article ad units after every 3rd <h2> tag
 * (optimized for above-the-fold visibility without policy violations).
 */
export function injectAdSlots(html: string): string {
    const adClientId = process.env.ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
    const adSlotId = process.env.ADSENSE_ARTICLE_SLOT || '1234567890';

    const adUnit = `
<div class="blog-ad-slot" style="margin: 2rem 0; text-align: center; min-height: 90px;">
  <ins class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="${adClientId}"
       data-ad-slot="${adSlotId}"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;

    // Insert ad after every 3rd <h2> tag (not <hr>)
    let h2Count = 0;
    html = html.replace(/<\/h2>/gi, (match) => {
        h2Count++;
        if (h2Count === 1 || h2Count % 3 === 0) {
            // Place first ad after first h2 (above fold) and then every 3rd
            return match + adUnit;
        }
        return match;
    });

    // End-of-article multiplex ad
    const multiplexAdSlotId = process.env.ADSENSE_MULTIPLEX_SLOT || '9876543210';
    const multiplexAd = `
<div class="blog-ad-slot blog-ad-multiplex" style="margin: 3rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block;"
       data-ad-format="autorelaxed"
       data-ad-client="${adClientId}"
       data-ad-slot="${multiplexAdSlotId}"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;
    html += multiplexAd;

    return html;
}

// ─── Affiliate Link Injection ───────────────────────────────────────────────

export function injectAffiliateLinks(html: string): string {
    const amazonTag = process.env.AMAZON_AFFILIATE_TAG;
    if (!amazonTag) return html;

    const affiliatePatterns: Array<{ pattern: RegExp; searchTerm: string }> = [
        // Apple products
        { pattern: /\b(iPhone\s*\d{2}\s*(?:Pro|Pro Max|Plus)?)\b/gi, searchTerm: 'iPhone' },
        { pattern: /\b(iPad\s*(?:Pro|Air|Mini)?(?:\s*\d{4})?)\b/gi, searchTerm: 'iPad' },
        { pattern: /\b(MacBook\s*(?:Pro|Air)?(?:\s*\d{2})?)\b/gi, searchTerm: 'MacBook' },
        { pattern: /\b(Apple\s*Watch\s*(?:Series\s*\d+|Ultra\s*\d?)?)\b/gi, searchTerm: 'Apple Watch' },
        { pattern: /\b(AirPods\s*(?:Pro|Max)?(?:\s*\d)?)\b/gi, searchTerm: 'AirPods' },
        { pattern: /\b(Vision\s*Pro)\b/gi, searchTerm: 'Apple Vision Pro' },
        // Samsung products
        { pattern: /\b(Galaxy\s*S\d{2}\s*(?:Ultra|Plus|\+)?)\b/gi, searchTerm: 'Samsung Galaxy' },
        { pattern: /\b(Galaxy\s*Z\s*(?:Fold|Flip)\s*\d?)\b/gi, searchTerm: 'Samsung Galaxy Fold' },
        { pattern: /\b(Galaxy\s*Tab\s*S\d+)\b/gi, searchTerm: 'Samsung Galaxy Tab' },
        // Google products
        { pattern: /\b(Pixel\s*\d+\s*(?:Pro|a)?)\b/gi, searchTerm: 'Google Pixel' },
        // Other tech products
        { pattern: /\b(PlayStation\s*\d)\b/gi, searchTerm: 'PlayStation' },
        { pattern: /\b(Xbox\s*(?:Series\s*[XS])?)\b/gi, searchTerm: 'Xbox' },
        { pattern: /\b(Nintendo\s*Switch\s*\d?)\b/gi, searchTerm: 'Nintendo Switch' },
        { pattern: /\b(RTX\s*\d{4}\s*(?:Ti|Super)?)\b/gi, searchTerm: 'NVIDIA RTX' },
        { pattern: /\b(Tesla\s*(?:Model\s*[3YSX]|Cybertruck))\b/gi, searchTerm: 'Tesla' },
        { pattern: /\b(Kindle\s*(?:Paperwhite|Oasis|Scribe)?)\b/gi, searchTerm: 'Kindle' },
        { pattern: /\b(Echo\s*(?:Dot|Show|Pop)?)\b/gi, searchTerm: 'Amazon Echo' },
    ];

    let result = html;
    const alreadyLinked = new Set<string>();

    for (const { pattern, searchTerm } of affiliatePatterns) {
        result = result.replace(pattern, (match) => {
            const key = searchTerm.toLowerCase();
            if (alreadyLinked.has(key)) return match;

            // Don't wrap if already inside an <a> tag
            const before = result.slice(0, result.indexOf(match));
            const lastOpenA = before.lastIndexOf('<a ');
            const lastCloseA = before.lastIndexOf('</a>');
            if (lastOpenA > lastCloseA) return match;

            alreadyLinked.add(key);
            const affiliateUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&tag=${amazonTag}`;
            return `<a href="${affiliateUrl}" target="_blank" rel="nofollow sponsored noopener" title="Check ${match} on Amazon">${match}</a>`;
        });
    }

    return result;
}

// ─── SEO JSON-LD Schema Generator ───────────────────────────────────────────

export function generateSeoSchema(blogData: {
    title: string;
    excerpt: string;
    seoDescription: string;
    tags: string[];
    content: string;
}, author: AuthorPersona, coverImage: string, slug: string, blogType: BlogType): string {
    const siteUrl = process.env.SITE_URL || 'https://formanywhere.com';
    const publishDate = new Date().toISOString();
    const wordCount = blogData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;

    const schemaType = blogType === 'news' ? 'NewsArticle' : blogType === 'review' ? 'Review' : 'BlogPosting';

    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: blogData.title,
        description: blogData.seoDescription || blogData.excerpt,
        image: coverImage,
        datePublished: publishDate,
        dateModified: publishDate,
        wordCount,
        articleSection: blogData.tags[0] || 'Technology',
        keywords: blogData.tags.join(', '),
        url: `${siteUrl}/blog/${slug}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${slug}`,
        },
        author: {
            '@type': 'Person',
            name: author.name,
            description: author.bio,
            url: `${siteUrl}/author/${author.name.toLowerCase().replace(/\s+/g, '-')}`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'FormAnywhere',
            url: siteUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logos/logo.png`,
            },
        },
    };

    // Add review-specific schema
    if (schemaType === 'Review') {
        schema.itemReviewed = {
            '@type': 'Product',
            name: blogData.title.replace(/\s*Review[:.].*$/, ''),
        };
    }

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ─── FAQ Schema Generator ───────────────────────────────────────────────────

/**
 * Generate FAQPage JSON-LD schema from FAQ blocks in content.
 * Great for Google rich snippets (SERP visibility → more clicks → more AdSense).
 */
export function generateFaqSchema(content: string): string {
    const faqRegex = /<details>\s*<summary>(.*?)<\/summary>\s*<p>(.*?)<\/p>\s*<\/details>/gi;
    const faqs: Array<{ question: string; answer: string }> = [];

    let match;
    while ((match = faqRegex.exec(content)) !== null) {
        faqs.push({
            question: match[1].replace(/<[^>]*>/g, '').trim(),
            answer: match[2].replace(/<[^>]*>/g, '').trim(),
        });
    }

    if (faqs.length === 0) return '';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ─── Table of Contents Generator ────────────────────────────────────────────

/**
 * Auto-generate a Table of Contents from <h2> headings.
 * Improves time-on-page and helps with SEO jump links.
 */
export function generateTableOfContents(content: string): string {
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const headings: Array<{ text: string; id: string }> = [];

    let match;
    while ((match = h2Regex.exec(content)) !== null) {
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
        headings.push({ text, id });
    }

    if (headings.length < 4) return ''; // Only show TOC for substantial articles

    const tocItems = headings.map(h =>
        `<li><a href="#${h.id}">${h.text}</a></li>`
    ).join('\n');

    return `
<nav class="table-of-contents">
  <strong>📋 In This Article</strong>
  <ol>${tocItems}</ol>
</nav>`;
}

/**
 * Inject anchor IDs into <h2> tags for TOC linking.
 */
export function injectHeadingIds(content: string): string {
    return content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, text) => {
        const plainText = text.replace(/<[^>]*>/g, '').trim();
        const id = plainText.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
        // Don't add ID if one already exists
        if (attrs.includes('id=')) return match;
        return `<h2 id="${id}"${attrs}>${text}</h2>`;
    });
}

// ─── Internal Linking ───────────────────────────────────────────────────────

/**
 * Query DB for related posts by tag overlap and inject a "Related Posts" section.
 * Reduces bounce rate → increases pages/session → more AdSense impressions.
 */
export async function generateRelatedPostsSection(tags: string[], currentSlug: string): Promise<string> {
    try {
        // Find posts that share at least one tag
        const relatedPosts = await db.select({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            coverImage: blog.coverImage,
        })
            .from(blog)
            .where(
                and(
                    eq(blog.status, 'published'),
                    ne(blog.slug, currentSlug),
                    // Match any tag using JSONB overlap
                    sql`${blog.tags}::jsonb ?| ${sql`ARRAY[${sql.join(tags.map(t => sql`${t}`), sql`, `)}]::text[]`}`,
                )
            )
            .limit(3);

        if (relatedPosts.length === 0) return '';

        const cards = relatedPosts.map(post => `
<a href="/blog/${post.slug}" class="related-post-card">
  <img src="${post.coverImage || 'https://picsum.photos/seed/related/400/225'}" alt="${post.title}" loading="lazy" />
  <div class="related-post-info">
    <strong>${post.title}</strong>
    <p>${(post.excerpt || '').slice(0, 100)}...</p>
  </div>
</a>`).join('\n');

        return `
<div class="related-posts">
  <h3>📖 You Might Also Like</h3>
  <div class="related-posts-grid">
    ${cards}
  </div>
</div>`;
    } catch (err) {
        console.warn('⚠️ Related posts query failed:', err);
        return '';
    }
}

// ─── Unsplash Cover Images ──────────────────────────────────────────────────

export async function fetchUnsplashImage(query: string): Promise<{ url: string; credit: string }> {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!apiKey) {
        const seed = query.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
        return {
            url: `https://picsum.photos/seed/${seed}/1200/630`,
            credit: '',
        };
    }

    try {
        console.log('🖼️ Fetching Unsplash image...');
        const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`;
        const response = await fetch(searchUrl, {
            headers: { Authorization: `Client-ID ${apiKey}` },
        });

        if (!response.ok) throw new Error(`Unsplash API returned ${response.status}`);

        const data = await response.json();
        const photo = data.results?.[0];

        if (!photo) {
            return {
                url: `https://picsum.photos/seed/${encodeURIComponent(query)}/1200/630`,
                credit: '',
            };
        }

        const url = `${photo.urls.raw}&w=1200&h=630&fit=crop&auto=format&q=80`;
        const credit = `Photo by <a href="${photo.user.links.html}?utm_source=formanywhere&utm_medium=referral">${photo.user.name}</a> on <a href="https://unsplash.com?utm_source=formanywhere&utm_medium=referral">Unsplash</a>`;

        console.log(`✅ Unsplash image: ${photo.user.name}`);
        return { url, credit };
    } catch (err) {
        console.warn('⚠️ Unsplash failed, using picsum fallback:', err);
        return {
            url: `https://picsum.photos/seed/${encodeURIComponent(query)}/1200/630`,
            credit: '',
        };
    }
}

// ─── Inline Image Replacement ───────────────────────────────────────────────

/**
 * Replace inline image placeholders with real, topic-relevant images.
 * Handles both:
 *   1. New format: <img data-search="keyword" src="" ...>
 *   2. Legacy format: <img src="https://picsum.photos/seed/KEYWORD/..." ...>
 */
export async function replaceInlineImages(html: string): Promise<string> {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;

    // Collect all search queries from both formats
    const searches: Array<{ marker: string; query: string }> = [];

    // Format 1: data-search attribute (new format)
    const dataSearchRegex = /<img\s+data-search="([^"]+)"\s+src=""\s+alt="([^"]*)"/gi;
    let match;
    while ((match = dataSearchRegex.exec(html)) !== null) {
        searches.push({ marker: match[0], query: match[1] });
    }

    // Format 2: picsum URLs (legacy/fallback)
    const picsumRegex = /<img\s+src="https:\/\/picsum\.photos\/seed\/([^/]+)\/(\d+)\/(\d+)"\s+alt="([^"]*)"/gi;
    while ((match = picsumRegex.exec(html)) !== null) {
        const keyword = decodeURIComponent(match[1]).replace(/-/g, ' ');
        searches.push({ marker: match[0], query: keyword });
    }

    if (searches.length === 0) return html;

    console.log(`🖼️ Replacing ${searches.length} inline image(s)...`);

    // Batch-fetch images
    let result = html;
    for (const { marker, query } of searches) {
        let imageUrl: string;

        if (apiKey) {
            // Use Unsplash API for high-quality, relevant images
            try {
                const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`;
                const response = await fetch(searchUrl, {
                    headers: { Authorization: `Client-ID ${apiKey}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    const photo = data.results?.[0];
                    if (photo) {
                        imageUrl = `${photo.urls.raw}&w=800&h=400&fit=crop&auto=format&q=80`;
                        console.log(`   ✅ Unsplash: "${query}" → ${photo.user.name}`);
                    } else {
                        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(query.replace(/\s+/g, '-'))}/800/400`;
                    }
                } else {
                    imageUrl = `https://picsum.photos/seed/${encodeURIComponent(query.replace(/\s+/g, '-'))}/800/400`;
                }
            } catch {
                imageUrl = `https://picsum.photos/seed/${encodeURIComponent(query.replace(/\s+/g, '-'))}/800/400`;
            }
        } else {
            // No API key — use picsum with descriptive seed for some visual consistency
            const seed = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
            imageUrl = `https://picsum.photos/seed/${seed}/800/400`;
        }

        // Replace the marker with the real src
        if (marker.includes('data-search=')) {
            // New format: replace data-search + empty src
            const altMatch = marker.match(/alt="([^"]*)"/);
            const alt = altMatch ? altMatch[1] : query;
            result = result.replace(marker, `<img src="${imageUrl}" alt="${alt}"`);
        } else {
            // Legacy picsum format: just swap the URL
            const altMatch = marker.match(/alt="([^"]*)"/);
            const alt = altMatch ? altMatch[1] : query;
            result = result.replace(marker, `<img src="${imageUrl}" alt="${alt}"`);
        }
    }

    return result;
}
