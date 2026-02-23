import { Elysia, t } from 'elysia';
import { db } from '../db';
import { blog } from '../db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const blogFeaturesRoutes = new Elysia({ prefix: '/api/blogs' })

    // ─── FEATURE 1: Chat with this Article ──────────────────────────────
    .post('/:slug/chat', async ({ params: { slug }, body, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        const prompt = `
            You are an AI assistant embedded in a blog post titled "${foundBlog.title}".
            The user is reading this article and has a question.
            
            ARTICLE CONTENT:
            ${foundBlog.content}
            
            USER QUESTION:
            ${body.question}
            
            Answer the user's question based ONLY on the article content provided above. 
            If the answer is not in the article, politely say so.
            Keep the answer concise, helpful, and formatted in HTML (use <p>, <strong>, <code>, <ul>, <li> tags).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { answer: response.text };
    }, {
        body: t.Object({
            question: t.String()
        })
    })

    // ─── FEATURE 3: Generate AI Podcast (TTS) ──────────────────────────
    .post('/:slug/generate-audio', async ({ params: { slug }, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        // Strip HTML tags for TTS
        const plainText = foundBlog.content
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ')
            .trim();

        // Truncate to ~4000 chars for TTS limits
        const ttsText = plainText.slice(0, 4000);

        try {
            // Use OpenAI TTS API (works with OPENAI_API_KEY env var)
            const ttsApiKey = process.env.OPENAI_API_KEY;
            if (!ttsApiKey) {
                // Fallback: use Gemini to generate a podcast script summary
                const scriptPrompt = `
                    Convert this blog post into a short, natural-sounding podcast script (1-2 minutes read).
                    Write it as if a host is speaking to the audience. Keep it engaging.
                    Blog: ${ttsText.slice(0, 2000)}
                    Return ONLY the script text, no JSON.
                `;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: scriptPrompt,
                });

                // Save script as pseudo-audio (frontend will use browser TTS)
                await db.update(blog)
                    .set({ audioUrl: `tts:${response.text}` })
                    .where(eq(blog.slug, slug));

                return { 
                    audioUrl: `tts:script`,
                    script: response.text,
                    method: 'browser-tts'
                };
            }

            // OpenAI TTS API call
            const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ttsApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'tts-1-hd',
                    input: ttsText,
                    voice: 'nova',
                    response_format: 'mp3',
                }),
            });

            if (!ttsResponse.ok) {
                throw new Error(`TTS API error: ${ttsResponse.statusText}`);
            }

            // Convert to base64 data URL
            const arrayBuffer = await ttsResponse.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            const audioUrl = `data:audio/mpeg;base64,${base64}`;

            await db.update(blog)
                .set({ audioUrl })
                .where(eq(blog.slug, slug));

            return { audioUrl, method: 'openai-tts' };
        } catch (err: any) {
            console.error('TTS generation failed:', err);
            return error(500, `TTS failed: ${err.message}`);
        }
    })

    // ─── FEATURE 4: Dynamic Reading Modes ───────────────────────────────
    .post('/:slug/mode', async ({ params: { slug }, body, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        const modeInstructions: Record<string, string> = {
            tldr: 'Rewrite as a very short TL;DR with 3-5 bullet points. Use <ul><li> tags.',
            eli5: 'Rewrite as if explaining to a 5-year-old child. Use simple words, fun analogies, and short sentences.',
            executive: 'Rewrite as a professional executive summary with key takeaways, metrics, and action items.',
            deep: 'Expand the article into a deep-dive with additional technical details, examples, and best practices.',
        };

        const prompt = `
            ${modeInstructions[body.mode] || modeInstructions.tldr}
            
            ARTICLE CONTENT:
            ${foundBlog.content}
            
            Return ONLY the rewritten content in clean HTML format (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> tags).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { content: response.text, mode: body.mode };
    }, {
        body: t.Object({
            mode: t.Union([
                t.Literal('tldr'),
                t.Literal('eli5'),
                t.Literal('executive'),
                t.Literal('deep')
            ])
        })
    })

    // ─── FEATURE 5: Get Social Media Posts ──────────────────────────────
    .get('/:slug/social', async ({ params: { slug }, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        // If already generated, return cached
        if (foundBlog.socialMediaPosts && Object.keys(foundBlog.socialMediaPosts as object).length > 0) {
            return foundBlog.socialMediaPosts;
        }

        // Generate on-the-fly
        const prompt = `
            Generate social media posts for this blog article.
            Blog Title: "${foundBlog.title}"
            Blog Excerpt: "${foundBlog.excerpt}"
            
            Return as JSON:
            {
                "twitterThread": ["tweet 1 (max 280 chars)", "tweet 2", "tweet 3", "tweet 4", "tweet 5 with link placeholder [LINK]"],
                "linkedInPost": "professional LinkedIn post (500-700 chars) with [LINK] placeholder",
                "newsletter": "email newsletter summary (3-4 paragraphs) with [LINK] placeholder"
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' },
        });

        const socialData = JSON.parse(response.text || '{}');

        // Cache in DB
        await db.update(blog)
            .set({ socialMediaPosts: socialData })
            .where(eq(blog.slug, slug));

        return socialData;
    })

    // ─── FEATURE 6: Get Citations & Trust Score ─────────────────────────
    .get('/:slug/trust', async ({ params: { slug }, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        return {
            trustScore: foundBlog.trustScore || 90,
            citations: foundBlog.citations || [],
        };
    })

    // ─── Regenerate citations using Gemini with grounding ───────────────
    .post('/:slug/verify', async ({ params: { slug }, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');

        const prompt = `
            Analyze the following blog post for factual accuracy.
            For each major claim in the article, provide a real-world source URL.
            Also provide an overall trust score (0-100) based on how verifiable the claims are.
            
            ARTICLE:
            ${foundBlog.content}
            
            Return as JSON:
            {
                "trustScore": 85,
                "citations": [
                    {"title": "Source title", "url": "https://...", "claim": "The specific claim this verifies"}
                ],
                "warnings": ["Any claims that could not be verified"]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' },
        });

        const verifyData = JSON.parse(response.text || '{}');

        await db.update(blog)
            .set({
                trustScore: verifyData.trustScore,
                citations: verifyData.citations,
            })
            .where(eq(blog.slug, slug));

        return verifyData;
    });
