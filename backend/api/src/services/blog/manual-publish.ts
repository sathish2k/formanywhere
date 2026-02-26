// ─── Manual Blog Publish ────────────────────────────────────────────────────
// Takes raw AI-generated content (pasted by user), parses it,
// runs the full post-processing pipeline, and publishes to the database.

import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { blog } from '../../db/schema';
import { invalidateAllBlogCaches } from '../../lib/redis';
import { parseMarkdownBlog } from './parser';
import {
    injectAdSlots,
    injectAffiliateLinks,
    generateTableOfContents,
    injectHeadingIds,
    generateRelatedPostsSection,
    fetchUnsplashImage,
} from './post-processing';
import { markPromptCompleted } from './prompt-generator';

// Fallback author if no prompt context
const DEFAULT_AUTHOR = { name: 'FormAnywhere Team', bio: 'Tech content team' };

export async function publishManualBlog(
    rawContent: string,
    coverImageUrl?: string,
    inlineImageUrls?: string[],
    promptId?: string,
) {
    console.log('📋 Publishing manual blog...');

    // 1. Parse the raw AI output
    const blogData = parseMarkdownBlog(rawContent);

    if (!blogData.title || blogData.title === 'Untitled Blog Post') {
        throw new Error('Could not parse a title from the content. Make sure the output has "# TITLE" section.');
    }

    // 2. Generate slug
    const slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);

    // 3. Cover image — use provided URL, or fetch from Unsplash, or fallback to picsum
    let coverImage = coverImageUrl;
    if (!coverImage) {
        const imageKeyword = blogData.imageKeyword || blogData.title.split(' ').slice(0, 3).join(' ');
        const coverImageData = await fetchUnsplashImage(imageKeyword);
        coverImage = coverImageData.url;
    }

    // 4. Replace inline image placeholders with provided URLs
    let content = blogData.content;

    if (inlineImageUrls && inlineImageUrls.length > 0) {
        // Replace IMAGE_URL_HERE or empty src="" with provided URLs
        let urlIndex = 0;
        content = content.replace(
            /(<img\s[^>]*?)src="(?:IMAGE_URL_HERE|)"/gi,
            (match, prefix) => {
                if (urlIndex < inlineImageUrls.length) {
                    const url = inlineImageUrls[urlIndex++];
                    return `${prefix}src="${url}"`;
                }
                return match;
            }
        );
    }

    // 5. Clean up AI junk
    content = content
        .replace(/(<hr\s*\/?\s*>\s*){2,}/gi, '<hr>')
        .replace(/<div class="newsletter-cta">[\s\S]*?<\/div>/gi, '')
        .replace(/(\s*<hr\s*\/?\s*>\s*)+$/i, '')
        .trim();

    // 6. Post-processing pipeline
    content = injectHeadingIds(content);

    const toc = generateTableOfContents(content);
    if (toc) {
        const firstPEnd = content.indexOf('</p>');
        if (firstPEnd > -1) {
            content = content.slice(0, firstPEnd + 4) + toc + content.slice(firstPEnd + 4);
        } else {
            content = toc + content;
        }
    }

    content = injectAdSlots(content);
    content = injectAffiliateLinks(content);

    // 8. Related posts
    const relatedSection = await generateRelatedPostsSection(blogData.tags, slug);
    if (relatedSection) content += relatedSection;

    // 9. Save to database
    const id = uuidv4();
    await db.insert(blog).values({
        id,
        title: blogData.title,
        slug,
        excerpt: blogData.excerpt || blogData.title,
        content,
        coverImage,
        tags: blogData.tags.length > 0 ? blogData.tags : ['tech', 'news'],
        category: 'tech',
        seoTitle: blogData.seoTitle || blogData.title,
        seoDescription: blogData.seoDescription || blogData.excerpt || '',
        trustScore: blogData.trustScore,
        socialMediaPosts: {
            twitter: blogData.socialMedia?.twitterThread || [],
            linkedIn: blogData.socialMedia?.linkedInPost || '',
        },
        status: 'draft',
    });

    // 10. Mark prompt as completed
    if (promptId) {
        await markPromptCompleted(promptId);
    }

    // 11. Invalidate caches
    await invalidateAllBlogCaches();

    console.log(`✅ Published: "${blogData.title}" [${slug}]`);

    return {
        id,
        title: blogData.title,
        slug,
        excerpt: blogData.excerpt,
        coverImage,
        tags: blogData.tags,
    };
}
