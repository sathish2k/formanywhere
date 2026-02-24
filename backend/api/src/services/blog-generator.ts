import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { blog } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { invalidateAllBlogCaches } from '../lib/redis';

// ─── AI Providers ───────────────────────────────────────────────────────────
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Categories ─────────────────────────────────────────────────────────────
const TECH_CATEGORIES = [
    'Artificial Intelligence & Machine Learning',
    'Web Development & JavaScript Frameworks',
    'Serverless & Edge Computing',
    'Cybersecurity Threats & Data Privacy',
    'SaaS, No-Code & Low-Code Tools',
    'Cloud Infrastructure & DevOps',
    'Mobile App Development',
    'Open Source Software & Community',
    'Programming Languages & Developer Tools',
    'Data Science & Big Data Analytics',
    'Tech Startup Funding & Acquisitions',
    'API Design & Microservices Architecture',
    'Quantum Computing & Emerging Tech',
    'Hardware, Chips & Semiconductor Industry',
    'UI/UX Design Trends & Accessibility',
    'Apple — iPhone, iPad, Mac, Vision Pro & iOS Updates',
    'Samsung — Galaxy, Foldables, One UI & Unpacked Events',
    'Google — Pixel, Android, Gemini AI & Search Updates',
    'Microsoft — Windows, Copilot, Surface & Xbox',
    'Tesla, SpaceX & Elon Musk Ventures',
    'OpenAI, ChatGPT & AI Industry Competition',
    'Smartphones, Wearables & Consumer Gadget Launches',
    'Tech Product Leaks, Rumors & Upcoming Releases',
    'NVIDIA, AMD & GPU / AI Chip Wars',
    'Social Media Platform Updates — X, Meta, TikTok, Threads',
];

const NON_TECH_CATEGORIES = [
    'Business & Entrepreneurship',
    'Science & Space Exploration',
    'Health & Wellness Technology',
    'Education & E-Learning',
    'Finance, Fintech & Cryptocurrency',
    'Climate Change & Sustainability',
    'Entertainment & Streaming Industry',
    'Sports & Analytics',
    'Travel & Digital Nomad Culture',
    'Food & AgTech Innovation',
    'Politics & Policy Impact on Tech',
    'Automotive & Electric Vehicles',
    'Real Estate & PropTech',
    'Gaming & Esports Industry',
    'Social Media Trends & Culture',
];

const AUTHOR_NAMES = [
    'Alex Chen', 'Sarah Mitchell', 'James Rodriguez',
    'Priya Sharma', 'Michael Torres', 'Emma Wilson',
    'David Kim', 'Olivia Park', 'Ryan Cooper', 'Maya Patel',
];

type BlogCategory = 'tech' | 'non-tech' | 'random';

// ─── Agent 1: Grok — Real-Time News Research ───────────────────────────────

async function researchWithGrok(topic: string): Promise<string> {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
        console.log('⚠️ No XAI_API_KEY set — skipping Grok research, using Gemini grounding only');
        return '';
    }

    try {
        console.log('🔍 Agent 1 (Grok): Researching real-time news...');
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'grok-3-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a news researcher. Find the latest breaking news, trending stories, and real-time data about the given topic. Include specific facts, dates, statistics, names, company names, and URLs. Be factual and concise. Focus on what happened in the last 7 days.',
                    },
                    {
                        role: 'user',
                        content: `Research the latest trending news about: "${topic}"\n\nProvide:\n1. Top 3-5 breaking stories from the last week\n2. Key statistics or data points\n3. Notable quotes from industry leaders\n4. Relevant URLs/sources\n5. Why this topic is trending right now`,
                    },
                ],
                search_mode: 'auto',
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            console.warn(`⚠️ Grok API returned ${response.status}, falling back to Gemini-only`);
            return '';
        }

        const data = await response.json();
        const research = data.choices?.[0]?.message?.content || '';
        console.log(`✅ Agent 1 complete (${research.length} chars of research)`);
        return research;
    } catch (err) {
        console.warn('⚠️ Grok research failed, continuing with Gemini grounding:', err);
        return '';
    }
}

// ─── Agent 2: Gemini — Structured Outline ───────────────────────────────────

async function generateOutline(
    topic: string,
    categoryType: 'tech' | 'non-tech',
    research: string,
): Promise<string> {
    console.log('📐 Agent 2 (Gemini): Creating structured outline...');

    const researchBlock = research
        ? `\n\nHere is real-time research data to base the outline on:\n${research}`
        : '';

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a senior editorial planner at a top-tier ${categoryType === 'tech' ? 'tech' : 'general interest'} publication.

Create a detailed article outline about the latest news in "${topic}".${researchBlock}

Your outline MUST include:

1. HEADLINE — A specific, news-worthy headline (max 80 chars). Include company names, numbers, or key figures. Never use generic titles like "The Future of X".

2. ANGLE — What unique perspective or angle makes this article worth reading? (1 sentence)

3. SECTIONS (5-7 sections):
   For each section provide:
   - Section title
   - 2-3 bullet points of what to cover
   - Specific data points, quotes, or facts to include
   - Transition note to next section

4. KEY_FACTS — List 5-8 specific facts, statistics, or quotes that MUST appear in the article

5. SOURCES — List the real sources/URLs to cite

6. TONE — ${categoryType === 'tech'
            ? 'Confident tech journalist. Like The Verge meets Ars Technica — opinionated, data-driven, slightly irreverent.'
            : 'Engaging storyteller. Like The Atlantic meets Wired — narrative-driven, thoughtful, accessible to general readers.'}

Do NOT write the article. Only provide the structured outline.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const outline = response.text || '';
    console.log(`✅ Agent 2 complete (${outline.length} chars outline)`);
    return outline;
}

// ─── Agent 3: Gemini — Full Article Writer ──────────────────────────────────

async function writeArticle(
    outline: string,
    categoryType: 'tech' | 'non-tech',
    author: string,
): Promise<string> {
    console.log('✍️ Agent 3 (Gemini): Writing full article...');

    const prompt = `You are a world-class ${categoryType === 'tech' ? 'technology' : 'general interest'} journalist.

Write a complete blog post based on this editorial outline:

${outline}

Author: ${author}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

STYLE RULES (critical — follow these exactly):
- Open with a bold, specific statement or surprising fact — NEVER "In today's rapidly evolving..."
- Short paragraphs: 2-3 sentences max
- Use specific numbers, dates, company names — never be vague
- Include direct quotes where the outline provides them
- Add your own analysis and opinion between facts
- End major sections with a forward-looking insight or provocative question
- AVOID these AI clichés: "It's worth noting", "In conclusion", "Let's dive in", "game-changer", "landscape", "paradigm shift", "leverage", "In today's world", "The future is here", "buckle up"
- Write like a human journalist who has strong opinions, not a neutral summarizer

OUTPUT FORMAT — Use this EXACT markdown structure with section headers:

# TITLE
The headline from the outline (max 80 chars)

# EXCERPT
One compelling sentence (max 150 chars)

# SEO_TITLE
SEO-optimized page title (max 60 chars)

# SEO_DESCRIPTION
SEO meta description (max 155 chars)

# TAGS
tag1, tag2, tag3, tag4, tag5

# IMAGE_KEYWORD
A single search term (1-3 words) for a cover photo

# TRUST_SCORE
A number 85-98 based on how well-sourced the article is

# CONTENT
Write the full article using ONLY these HTML elements:

TEXT: <h1>, <h2>, <h3>, <p>, <ul><li>, <ol><li>, <blockquote><p>
INLINE: <strong>, <em>, <u>, <mark>, <code>, <a href="">
IMAGES: <figure class="image-block" data-direction="center"><img src="https://picsum.photos/seed/KEYWORD/800/400" alt="..." /><figcaption class="image-block-caption">...</figcaption></figure>
CODE: <pre><code class="language-javascript">...</code></pre>
${categoryType === 'tech' ? 'PLAYGROUND: <div data-type="playground"><pre><code>// interactive example</code></pre></div>' : ''}
DIVIDERS: <hr>

RULES:
- At least 1500 words, multiple sections
- At least 2 images using <figure> with picsum.photos
${categoryType === 'tech' ? '- At least one code example or playground' : '- Focus on storytelling and human impact'}
- Use <hr> between major sections
- HTML only — no markdown in CONTENT

# CITATIONS
- Source Name | https://url.com | Claim verified

# TWITTER_THREAD
- 🧵 Hook 1/5
- Insight 2/5
- Data 3/5
- Takeaway 4/5
- Link 5/5

# LINKEDIN_POST
Professional post (500-700 chars) with [LINK]

# NEWSLETTER
Email newsletter section with [LINK]

# PODCAST_SCRIPT
2-minute natural podcast script starting with "Hey everyone, welcome back..."`;

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });

    const article = response.text || '';
    console.log(`✅ Agent 3 complete (${article.length} chars draft)`);
    return article;
}

// ─── Agent 4: Gemini — Editor & Polish ──────────────────────────────────────

async function editAndPolish(rawArticle: string): Promise<string> {
    console.log('🔧 Agent 4 (Gemini): Editing and polishing...');

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a ruthless senior editor at a top publication. Your job is to take this draft article and make it publish-ready.

DRAFT TO EDIT:
${rawArticle}

YOUR EDITING CHECKLIST:

1. REMOVE AI CLICHÉS — Delete or rewrite any of these phrases:
   "In today's rapidly evolving", "It's worth noting", "game-changer", "landscape",
   "paradigm shift", "leverage", "dive in", "buckle up", "In conclusion",
   "The future is here", "revolutionize", "cutting-edge", "In today's world",
   "as we navigate", "the question remains", "only time will tell",
   "at the end of the day", "needless to say", "it goes without saying"

2. TIGHTEN PROSE — Remove filler words, redundant phrases, and weak transitions.
   Bad: "It is important to note that the company has decided to..."
   Good: "The company decided to..."

3. STRENGTHEN OPENING — The first paragraph must hook immediately with a fact, number, or bold claim. Never a generic intro.

4. FIX STRUCTURE — Ensure proper heading hierarchy (h2 → h3, never skip levels). Each section should have a clear point.

5. VERIFY HTML — Ensure all HTML tags are properly closed and only allowed tags are used (h1-h3, p, ul/ol/li, blockquote, strong, em, u, mark, code, a, figure, img, figcaption, pre, code, div[data-type=playground], hr).

6. IMPROVE HEADLINES — Section headings should be specific and intriguing, not generic.

OUTPUT: Return the COMPLETE article in the exact same # SECTION format as the input. Do NOT summarize or shorten — return the full edited version with ALL sections (TITLE, EXCERPT, SEO_TITLE, SEO_DESCRIPTION, TAGS, IMAGE_KEYWORD, TRUST_SCORE, CONTENT, CITATIONS, TWITTER_THREAD, LINKEDIN_POST, NEWSLETTER, PODCAST_SCRIPT).

Make it read like a human journalist wrote it — someone with opinions, a sense of humor, and deep knowledge.`,
    });

    const edited = response.text || rawArticle;
    console.log(`✅ Agent 4 complete (${edited.length} chars polished)`);
    return edited;
}

// ─── Unsplash: Topic-Relevant Cover Images ──────────────────────────────────

async function fetchUnsplashImage(query: string): Promise<{ url: string; credit: string }> {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!apiKey) {
        // Fallback to picsum
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

        if (!response.ok) {
            throw new Error(`Unsplash API returned ${response.status}`);
        }

        const data = await response.json();
        const photo = data.results?.[0];

        if (!photo) {
            return {
                url: `https://picsum.photos/seed/${encodeURIComponent(query)}/1200/630`,
                credit: '',
            };
        }

        // Use Unsplash dynamic resizing for optimal performance
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

// ─── Main: Generate & Publish ───────────────────────────────────────────────

export async function generateAndPublishBlog(category: BlogCategory = 'random') {
    console.log('🚀 Starting multi-agent blog generation pipeline...');
    console.log('   Pipeline: Grok (research) → Gemini (outline) → Gemini Pro (write) → Gemini (edit)');

    try {
        // 1. Pick category
        let selectedCategory: string;
        let categoryType: 'tech' | 'non-tech';

        if (category === 'tech') {
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

        const author = AUTHOR_NAMES[Math.floor(Math.random() * AUTHOR_NAMES.length)];
        console.log(`📂 Category: ${selectedCategory} (${categoryType})`);
        console.log(`✍️ Author: ${author}`);

        // ── Agent 1: Grok researches real-time news ──
        const research = await researchWithGrok(selectedCategory);

        // ── Agent 2: Gemini creates a structured outline ──
        const outline = await generateOutline(selectedCategory, categoryType, research);

        // ── Agent 3: Gemini Pro writes the full article from the outline ──
        const rawArticle = await writeArticle(outline, categoryType, author);

        // ── Agent 4: Gemini edits, removes AI clichés, polishes ──
        const polishedArticle = await editAndPolish(rawArticle);

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

        // Inject photo credit at the end of content if available
        let content = blogData.content;
        if (coverImageData.credit) {
            content += `\n<p class="photo-credit" style="font-size: 0.75rem; color: #888; margin-top: 2rem;">${coverImageData.credit}</p>`;
        }

        // ── Inject in-article ad slots between sections ──
        content = injectAdSlots(content);

        // ── Inject affiliate links for product mentions ──
        content = injectAffiliateLinks(content);

        // 6. Try to generate audio via OpenAI TTS (if API key available)
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
            tags: [...blogData.tags, categoryType],
            category: categoryType,
            audioUrl,
            viewCount: 0,
            trustScore: blogData.trustScore || 90,
            citations: blogData.citations || [],
            socialMediaPosts: {
                ...blogData.socialMedia,
                author,
                category: categoryType,
            },
            status: 'published',
            publishedAt: new Date(),
        };

        await db.insert(blog).values(newBlog);
        await invalidateAllBlogCaches();

        console.log(`✅ Published: "${newBlog.title}" by ${author} [${categoryType}]`);

        // 8. Auto-syndicate to social media
        await syndicateToSocialMedia(newBlog);

        return newBlog;

    } catch (error) {
        console.error('❌ Error generating blog:', error);
        throw error;
    }
}

// ─── Ad Slot Injection ──────────────────────────────────────────────────────

/**
 * Injects Google AdSense in-article ad units after every 2nd <hr> tag.
 * Ad client ID is read from ADSENSE_CLIENT_ID env var.
 * If not set, injects placeholder slots that can be filled later.
 */
function injectAdSlots(html: string): string {
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

    // Insert ad after every 2nd <hr> tag
    let hrCount = 0;
    return html.replace(/<hr\s*\/?>/gi, (match) => {
        hrCount++;
        if (hrCount % 2 === 0) {
            return match + adUnit;
        }
        return match;
    });
}

// ─── Affiliate Link Injection ───────────────────────────────────────────────

/**
 * Product-to-affiliate-link mapping.
 * Detects product mentions in blog content and wraps them with affiliate URLs.
 * Uses Amazon Associates tag from AMAZON_AFFILIATE_TAG env var.
 */
function injectAffiliateLinks(html: string): string {
    const amazonTag = process.env.AMAZON_AFFILIATE_TAG;
    if (!amazonTag) return html; // Skip if no affiliate tag configured

    // Product patterns → Amazon search URL with affiliate tag
    // These are generic category searches — not specific ASINs
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
            // Only affiliate-link the FIRST mention of each product
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

/**
 * Parse structured markdown sections into a blog data object.
 */
function parseMarkdownBlog(markdown: string) {
    const sections: Record<string, string> = {};
    const sectionRegex = /^#\s+([A-Z_]+)\s*$/gm;
    const matches = [...markdown.matchAll(sectionRegex)];

    for (let i = 0; i < matches.length; i++) {
        const key = matches[i][1];
        const startIdx = matches[i].index! + matches[i][0].length;
        const endIdx = i + 1 < matches.length ? matches[i + 1].index! : markdown.length;
        sections[key] = markdown.slice(startIdx, endIdx).trim();
    }

    // Parse citations from "- Title | URL | Claim" format
    const citations = (sections.CITATIONS || '')
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
            const parts = line.replace(/^-\s*/, '').split('|').map(s => s.trim());
            return {
                title: parts[0] || 'Source',
                url: parts[1] || '',
                claim: parts[2] || '',
            };
        })
        .filter(c => c.url);

    // Parse twitter thread from "- tweet" format
    const twitterThread = (sections.TWITTER_THREAD || '')
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(Boolean);

    // Convert markdown content to HTML if it's not already HTML
    let content = sections.CONTENT || '';
    // If the content doesn't start with an HTML tag, do basic markdown→HTML conversion
    if (!content.trim().startsWith('<')) {
        content = markdownToHtml(content);
    }

    return {
        title: (sections.TITLE || 'Untitled Blog Post').slice(0, 80),
        excerpt: (sections.EXCERPT || '').slice(0, 150),
        content,
        seoTitle: (sections.SEO_TITLE || sections.TITLE || '').slice(0, 60),
        seoDescription: (sections.SEO_DESCRIPTION || sections.EXCERPT || '').slice(0, 155),
        tags: (sections.TAGS || '').split(',').map(t => t.trim()).filter(Boolean),
        trustScore: parseInt(sections.TRUST_SCORE || '90', 10),
        imageKeyword: (sections.IMAGE_KEYWORD || '').trim() || null,
        citations,
        socialMedia: {
            twitterThread,
            linkedInPost: sections.LINKEDIN_POST || '',
            newsletter: sections.NEWSLETTER || '',
        },
        podcastScript: sections.PODCAST_SCRIPT || null,
    };
}

/**
 * Basic markdown to HTML converter for blog content.
 * Preserves editor-compatible HTML that is already present.
 */
function markdownToHtml(md: string): string {
    let html = md;

    // Preserve existing HTML blocks — don't transform content inside <pre>, <figure>, <div data-type>, etc.
    const preserved: string[] = [];
    const preserveBlock = (match: string) => {
        preserved.push(match);
        return `__PRESERVED_${preserved.length - 1}__`;
    };

    // Preserve <pre>...</pre> blocks (code blocks)
    html = html.replace(/<pre[\s\S]*?<\/pre>/g, preserveBlock);
    // Preserve <figure>...</figure> blocks (images)
    html = html.replace(/<figure[\s\S]*?<\/figure>/g, preserveBlock);
    // Preserve <div data-type="playground">...</div> blocks
    html = html.replace(/<div\s+data-type="playground"[\s\S]*?<\/div>/g, preserveBlock);

    // Code blocks (``` ```) — convert to editor format
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const cls = lang ? ` class="language-${lang}"` : '';
        return preserveBlock(`<pre><code${cls}>${code.trim()}</code></pre>`);
    });

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold & italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images — convert markdown images to figure blocks
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
        '<figure class="image-block" data-direction="center"><img src="$2" alt="$1" /><figcaption class="image-block-caption">$1</figcaption></figure>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Blockquotes
    html = html.replace(/^>\s?(.+)$/gm, '<blockquote><p>$1</p></blockquote>');

    // Unordered lists
    html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Paragraphs: wrap remaining lines that aren't already HTML tags
    html = html
        .split('\n\n')
        .map(block => {
            block = block.trim();
            if (!block) return '';
            if (block.startsWith('<')) return block;
            if (block.startsWith('__PRESERVED_')) return block;
            return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('\n');

    // Restore preserved blocks
    html = html.replace(/__PRESERVED_(\d+)__/g, (_, idx) => preserved[parseInt(idx)]);

    return html;
}

/**
 * Feature 5: Automated Social Media & Newsletter Syndication
 * Posts to Twitter/X and LinkedIn via their APIs.
 */
async function syndicateToSocialMedia(blogPost: {
    title: string;
    slug: string;
    socialMediaPosts: any;
}) {
    const siteUrl = process.env.SITE_URL || 'https://yourdomain.com';
    const blogUrl = `${siteUrl}/blog/${blogPost.slug}`;
    const social = blogPost.socialMediaPosts;

    if (!social) return;

    // ─── Twitter/X API ──────────────────────────────────────────────────
    if (process.env.TWITTER_BEARER_TOKEN && social.twitterThread) {
        try {
            console.log('🐦 Posting Twitter thread...');
            let lastTweetId: string | null = null;

            for (const tweet of social.twitterThread) {
                const tweetText = tweet.replace('[LINK]', blogUrl);
                const body: any = { text: tweetText };
                if (lastTweetId) {
                    body.reply = { in_reply_to_tweet_id: lastTweetId };
                }

                const res = await fetch('https://api.twitter.com/2/tweets', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (res.ok) {
                    const data = await res.json();
                    lastTweetId = data.data?.id;
                }
            }
            console.log('✅ Twitter thread posted');
        } catch (err) {
            console.error('⚠️ Twitter posting failed:', err);
        }
    }

    // ─── LinkedIn API ───────────────────────────────────────────────────
    if (process.env.LINKEDIN_ACCESS_TOKEN && social.linkedInPost) {
        try {
            console.log('💼 Posting to LinkedIn...');
            const postText = social.linkedInPost.replace('[LINK]', blogUrl);

            await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0',
                },
                body: JSON.stringify({
                    author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: { text: postText },
                            shareMediaCategory: 'ARTICLE',
                            media: [{
                                status: 'READY',
                                originalUrl: blogUrl,
                            }],
                        },
                    },
                    visibility: {
                        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                    },
                }),
            });
            console.log('✅ LinkedIn post published');
        } catch (err) {
            console.error('⚠️ LinkedIn posting failed:', err);
        }
    }
}
