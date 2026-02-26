// ─── Blog Generator Orchestrator ─────────────────────────────────────────────
// 2-agent pipeline: Trends → Gemini 2.5 Pro (research+write) → Gemini 2.5 Flash (edit) → Publish

import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { blog } from '../../db/schema';
import { invalidateAllBlogCaches } from '../../lib/redis';

// Module imports
import { BLOG_TYPE_PROMPTS, pickBlogType, pickBlogVoice } from './blog-types';
import type { BlogCategory, BlogType, BlogVoice } from './blog-types';
import { pickAuthor } from './blog-authors';
import type { AuthorPersona } from './blog-authors';
import { TECH_CATEGORIES, NON_TECH_CATEGORIES, REVIEW_TOPICS } from './blog-categories';
import { getRealtimeTrends } from './news-sources';
import { buildWriterPrompt } from './prompt-generator';
import { parseMarkdownBlog } from './parser';
import {
    injectAdSlots,
    injectAffiliateLinks,
    generateSeoSchema,
    generateFaqSchema,
    generateTableOfContents,
    injectHeadingIds,
    generateRelatedPostsSection,
    fetchUnsplashImage,
    replaceInlineImages,
} from './post-processing';
import { syndicateToSocialMedia } from './social';

// ─── Inline agents ───────────────────────────────────────────────────────────

function getAI(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    return new GoogleGenAI({ apiKey });
}

async function researchAndWrite(
    topic: string,
    categoryType: 'tech' | 'non-tech',
    author: AuthorPersona,
    voice: BlogVoice,
    blogType: BlogType,
): Promise<string> {
    console.log(`✍️  [Writer] Calling gemini-2.5-pro for "${topic}"...`);
    const prompt = buildWriterPrompt(topic, categoryType, author, voice, blogType);
    const result = await getAI().models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: { temperature: 0.85, maxOutputTokens: 8192, tools: [{ googleSearch: {} }] },
    });
    const text = result.text ?? '';
    if (text.length < 200) throw new Error(`[Writer] Empty response for "${topic}"`);
    console.log(`✅ [Writer] Raw article generated (${text.length} chars)`);
    return text;
}

async function editAndPolish(
    rawArticle: string,
    voice: BlogVoice,
    blogType: BlogType,
    topic: string,
): Promise<string> {
    console.log('✏️  [Editor] Calling gemini-2.5-flash to polish...');
    const editPrompt = `You are a senior tech editor. Polish the following article about "${topic}".

Rules:
- Fix any factual inconsistencies or outdated info
- Remove ALL banned AI phrases: "delve", "tapestry", "it's worth noting", "in conclusion", "game-changer", "paradigm shift", "transformative", "holistic", "robust"
- Tighten sentences — cut 10-15% of words without losing meaning
- Ensure the voice style is "${voice.label}" throughout
- Fix any broken HTML tags
- Keep the EXACT output format (# TITLE, # EXCERPT, # CONTENT, etc.)
- Do NOT change the topic or add new information you're unsure about
- Output the FULL article in the same structured format

ARTICLE:
${rawArticle}`;

    const result = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: editPrompt,
        config: { temperature: 0.4, maxOutputTokens: 8192 },
    });
    const text = result.text ?? '';
    if (text.length < 200) {
        console.warn('[Editor] Polish returned empty — using raw article');
        return rawArticle;
    }
    console.log(`✅ [Editor] Polished article (${text.length} chars)`);
    return text;
}

export async function generateAndPublishBlog(category: BlogCategory = 'random', forceBlogType?: BlogType) {
    console.log('🚀 Starting 2-agent blog generation pipeline...');
    console.log('   Pipeline: Trends → Gemini 3 Pro (research+write) → Gemini 3 Flash (edit+fact-check)');

    try {
        // 0. Fetch real-time trends first
        const liveTrends = await getRealtimeTrends();
        const useLiveTrend = liveTrends.length > 0 && Math.random() < 0.95; // 95% live, 5% static

        // 1. Pick category
        let selectedCategory: string;
        let categoryType: 'tech' | 'non-tech';

        // 2. Pick blog type
        const blogType = forceBlogType || pickBlogType();

        if (useLiveTrend) {
            selectedCategory = liveTrends[Math.floor(Math.random() * liveTrends.length)];
            categoryType = 'tech';
            console.log(`🔥 Using LIVE trend: "${selectedCategory}"`);
        } else if (category === 'tech') {
            selectedCategory = TECH_CATEGORIES[Math.floor(Math.random() * TECH_CATEGORIES.length)];
            categoryType = 'tech';
        } else if (category === 'non-tech') {
            selectedCategory = NON_TECH_CATEGORIES[Math.floor(Math.random() * NON_TECH_CATEGORIES.length)];
            categoryType = 'non-tech';
        } else {
            if (Math.random() < 0.6) {
                selectedCategory = TECH_CATEGORIES[Math.floor(Math.random() * TECH_CATEGORIES.length)];
                categoryType = 'tech';
            } else {
                selectedCategory = NON_TECH_CATEGORIES[Math.floor(Math.random() * NON_TECH_CATEGORIES.length)];
                categoryType = 'non-tech';
            }
        }

        // For review type, pick from review-specific topics
        if (blogType === 'review') {
            if (useLiveTrend) {
                console.log(`📝 Review type with live trend: "${selectedCategory}"`);
            } else {
                selectedCategory = REVIEW_TOPICS[Math.floor(Math.random() * REVIEW_TOPICS.length)];
            }
            categoryType = 'tech';
        }

        const author = pickAuthor(selectedCategory);
        const voice = pickBlogVoice();
        console.log(`📂 Category: ${selectedCategory} (${categoryType})`);
        console.log(`✍️ Author: ${author.name} — ${author.bio.split('.')[0]}`);
        console.log(`🎭 Voice: ${voice.label}`);
        console.log(`📰 Type: ${BLOG_TYPE_PROMPTS[blogType].label}`);

        // ── Agent 1: Gemini 3.1 Pro — Research + Write (single pass) ──
        const rawArticle = await researchAndWrite(selectedCategory, categoryType, author, voice, blogType);

        // ── Agent 2: Gemini 3 Flash — Edit, fact-check, humanize ──
        const polishedArticle = await editAndPolish(rawArticle, voice, blogType, selectedCategory);

        // Parse the final polished output
        console.log('📋 Parsing final article...');
        const blogData = parseMarkdownBlog(polishedArticle);

        // 4. Generate slug
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);

        // 5. Fetch topic-relevant cover image from Unsplash
        const imageKeyword = blogData.imageKeyword || selectedCategory;
        const coverImageData = await fetchUnsplashImage(imageKeyword);
        const coverImage = coverImageData.url;

        // ── Post-Processing Pipeline ──
        let content = blogData.content;

        // Clean up AI junk: consecutive <hr> tags, newsletter CTAs, trailing whitespace
        content = content
            .replace(/(<hr\s*\/?\s*>\s*){2,}/gi, '<hr>') // collapse consecutive <hr> into one
            .replace(/<div class="newsletter-cta">[\s\S]*?<\/div>/gi, '') // strip newsletter CTAs
            .replace(/(\s*<hr\s*\/?\s*>\s*)+$/i, '') // remove trailing <hr> at end
            .trim();

        // Replace inline image placeholders with real Unsplash images
        content = await replaceInlineImages(content);

        // Inject heading IDs for TOC
        content = injectHeadingIds(content);

        // Generate Table of Contents (for articles with 4+ sections)
        const toc = generateTableOfContents(content);
        if (toc) {
            // Insert TOC after the first paragraph
            const firstPEnd = content.indexOf('</p>');
            if (firstPEnd > -1) {
                content = content.slice(0, firstPEnd + 4) + toc + content.slice(firstPEnd + 4);
            } else {
                content = toc + content;
            }
        }

        // Inject photo credit
        if (coverImageData.credit) {
            content += `\n<p class="photo-credit" style="font-size: 0.75rem; color: #888; margin-top: 2rem;">${coverImageData.credit}</p>`;
        }

        // Inject SEO JSON-LD schema
        const seoSchema = generateSeoSchema(blogData, author, coverImage, slug, blogType);
        content = seoSchema + '\n' + content;

        // Inject FAQ schema if FAQ blocks exist
        const faqSchema = generateFaqSchema(content);
        if (faqSchema) {
            content = faqSchema + '\n' + content;
        }

        // Inject in-article ad slots
        content = injectAdSlots(content);

        // Inject affiliate links
        content = injectAffiliateLinks(content);

        // Generate related posts section
        const relatedPosts = await generateRelatedPostsSection(blogData.tags, slug);
        if (relatedPosts) {
            content += relatedPosts;
        }

        // 6. Try to generate audio via OpenAI TTS
        let audioUrl: string | null = null;
        const podcastScript = blogData.podcastScript || null;

        if (process.env.OPENAI_API_KEY && podcastScript) {
            try {
                const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'tts-1-hd',
                        input: podcastScript.slice(0, 4000),
                        voice: 'nova',
                        response_format: 'mp3',
                    }),
                });

                if (ttsResponse.ok) {
                    const arrayBuffer = await ttsResponse.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    audioUrl = `data:audio/mpeg;base64,${base64}`;
                    console.log('🎧 Audio generated successfully');
                }
            } catch (ttsErr) {
                console.warn('⚠️ TTS generation failed, storing script for browser TTS:', ttsErr);
                audioUrl = `tts:${podcastScript}`;
            }
        } else if (podcastScript) {
            audioUrl = `tts:${podcastScript}`;
        }

        // 7. Save to Database
        const newBlog = {
            id: uuidv4(),
            title: blogData.title,
            slug,
            content,
            excerpt: blogData.excerpt,
            coverImage,
            seoTitle: blogData.seoTitle,
            seoDescription: blogData.seoDescription,
            tags: [...blogData.tags, categoryType, blogType],
            category: categoryType,
            audioUrl,
            viewCount: 0,
            trustScore: blogData.trustScore || 90,
            citations: blogData.citations || [],
            socialMediaPosts: {
                ...blogData.socialMedia,
                author: author.name,
                authorBio: author.bio,
                category: categoryType,
            },
            status: 'published',
            publishedAt: new Date(),
        };

        await db.insert(blog).values(newBlog);
        await invalidateAllBlogCaches();

        console.log(`✅ Published: "${newBlog.title}" by ${author.name} [${categoryType}]`);

        // 8. Auto-syndicate to social media
        await syndicateToSocialMedia(newBlog);

        return newBlog;

    } catch (error) {
        console.error('❌ Error generating blog:', error);
        throw error;
    }
}
