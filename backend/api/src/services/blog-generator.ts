import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { blog } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAndPublishBlog() {
    console.log('🚀 Starting automated blog generation process...');
    
    try {
        // 1. Ask Gemini to pick a trending topic dynamically
        const categories = [
            'Artificial Intelligence Breakthroughs',
            'Web Development Frameworks (SolidJS, React, Svelte, etc.)',
            'Serverless & Edge Computing',
            'Cybersecurity Threats & Solutions',
            'Future of SaaS and No-Code Tools',
            'Sensational Tech Industry News',
            'UI/UX Design Trends',
            'Cloud Infrastructure & DevOps',
            'Mobile App Development',
            'Blockchain & Web3 Technology',
            'Open Source Software News',
            'Programming Languages & Paradigms',
            'Data Science & Machine Learning',
            'Tech Startup Funding & Acquisitions',
            'Developer Productivity & Tools',
            'API Design & Microservices',
            'Quantum Computing Advances',
            'Tech Company Earnings & Strategy',
            'Remote Work & Developer Culture',
            'Hardware & Chip Technology',
        ];
        const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
        
        console.log(`📂 Selected category: ${selectedCategory}`);

        // ── Single call: Google Search grounding + markdown output ──
        const prompt = `
You are an expert tech journalist writing for a premium tech publication.
Research the absolute latest trending news related to "${selectedCategory}" and write a comprehensive blog post.

Use this EXACT markdown structure with these section headers (they are used for parsing):

# TITLE
Your catchy headline here (max 80 chars)

# EXCERPT
Compelling summary in one sentence (max 150 chars)

# SEO_TITLE
SEO-optimized page title (max 60 chars)

# SEO_DESCRIPTION
SEO meta description (max 155 chars)

# TAGS
tag1, tag2, tag3, tag4, tag5

# TRUST_SCORE
92

# CONTENT
Write the full blog article here using ONLY these supported HTML elements:

TEXT & STRUCTURE:
- Headings: <h1>, <h2>, <h3>
- Paragraphs: <p>
- Lists: <ul><li>...</li></ul> and <ol><li>...</li></ol>
- Blockquotes: <blockquote><p>...</p></blockquote>

INLINE FORMATTING:
- Bold: <strong>text</strong>
- Italic: <em>text</em>
- Underline: <u>text</u>
- Highlight: <mark>text</mark>
- Inline code: <code>text</code>
- Links: <a href="url">text</a>

IMAGES — use <figure> wrapper (NOT raw <img>):
<figure class="image-block" data-direction="center">
  <img src="https://picsum.photos/seed/example/800/400" alt="description" />
  <figcaption class="image-block-caption">Caption text</figcaption>
</figure>

CODE BLOCKS with syntax highlighting:
<pre><code class="language-javascript">
// your code here
</code></pre>
(Supported languages: javascript, typescript, python, html, css, json, bash, etc.)

MERMAID DIAGRAMS:
<pre><code class="language-mermaid">
graph TD;
    A[Start] --> B[Process];
    B --> C[End];
</code></pre>

INTERACTIVE CODE PLAYGROUND:
<div data-type="playground"><pre><code>
// Working interactive code example here
console.log("Hello World");
</code></pre></div>

HORIZONTAL DIVIDERS: <hr>

IMPORTANT RULES:
- Make the content at least 1500 words with multiple sections.
- Include at least 2 images using <figure class="image-block"> format with picsum.photos URLs.
- Include at least one interactive playground using <div data-type="playground">.
- Include at least one Mermaid diagram.
- Include code examples with proper language classes.
- Use <hr> between major sections.
- Do NOT use markdown inside the CONTENT section. Use ONLY the HTML tags listed above.

# CITATIONS
- Source Name | https://real-url.com | The claim this source verifies
- Another Source | https://another-url.com | Another claim

# TWITTER_THREAD
- 🧵 Thread: [compelling hook] 1/5
- Key insight 2/5
- Data point 3/5
- Actionable takeaway 4/5
- Read the full article: [LINK] 5/5

# LINKEDIN_POST
Professional LinkedIn post (500-700 chars) ending with [LINK]

# NEWSLETTER
Email newsletter section with intro, key points, and CTA with [LINK]

# PODCAST_SCRIPT
A natural-sounding 2-minute podcast script. Start with "Hey everyone, welcome back..." and end with "That is all for today..."
`;

        console.log('🔍 Generating blog with Google Search grounding...');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error('No response from Gemini API');
        }

        console.log('📋 Parsing markdown response...');
        const blogData = parseMarkdownBlog(responseText);
        
        // 3. Generate a slug
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);

        // 4. Cover image (picsum.photos — reliable placeholder service)
        const imageId = Math.floor(Math.random() * 1000);
        const coverImage = `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/630`;

        // 5. Try to generate audio via OpenAI TTS (if API key available)
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
            // Store script for browser-side TTS fallback
            audioUrl = `tts:${podcastScript}`;
        }

        // 6. Save to Database
        const newBlog = {
            id: uuidv4(),
            title: blogData.title,
            slug,
            content: blogData.content,
            excerpt: blogData.excerpt,
            coverImage,
            seoTitle: blogData.seoTitle,
            seoDescription: blogData.seoDescription,
            tags: blogData.tags,
            audioUrl,
            trustScore: blogData.trustScore || 90,
            citations: blogData.citations || [],
            socialMediaPosts: blogData.socialMedia || {},
            status: 'published',
            publishedAt: new Date(),
        };

        await db.insert(blog).values(newBlog);

        console.log(`✅ Published: "${newBlog.title}"`);

        // 7. Auto-syndicate to social media (Feature 5)
        await syndicateToSocialMedia(newBlog);

        return newBlog;

    } catch (error) {
        console.error('❌ Error generating blog:', error);
        throw error;
    }
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

    // Preserve <pre>...</pre> blocks (code blocks, mermaid)
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
