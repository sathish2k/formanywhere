// ─── Prompt Generator ────────────────────────────────────────────────────────
// Generates 20 daily blog prompts stored in Redis (24h TTL).
// No AI API calls — just builds prompts the user copies into ChatGPT/Gemini.

import { redis } from '../../lib/redis';
import { getRealtimeTrends } from './news-sources';
import { BLOG_TYPE_PROMPTS, pickBlogType, pickBlogVoice } from './blog-types';
import type { BlogType, BlogVoice } from './blog-types';
import { pickAuthor } from './blog-authors';
import type { AuthorPersona } from './blog-authors';
import { TECH_CATEGORIES, NON_TECH_CATEGORIES, REVIEW_TOPICS } from './blog-categories';
import { selectBlocksForBlog, generateBlockPromptSection } from './content-blocks';

const DAILY_PROMPTS_KEY = 'blog:daily-prompts';
const PROMPTS_COUNT = 20;
const TTL_24H = 86400; // 24 hours in seconds

export interface BlogPrompt {
    id: string;
    topic: string;
    blogType: BlogType;
    categoryType: 'tech' | 'non-tech';
    author: { name: string; bio: string };
    voice: { label: string };
    writerPrompt: string;
    imagePrompt: string;
    coverImagePrompt: string;
    status: 'pending' | 'completed';
    createdAt: string;
}

/** Get today's prompts from Redis, or generate fresh ones */
export async function getDailyPrompts(): Promise<BlogPrompt[]> {
    const cached = await redis.get(DAILY_PROMPTS_KEY);
    if (cached) {
        return JSON.parse(cached as string);
    }
    return generateDailyPrompts();
}

/** Force-regenerate today's prompts */
export async function generateDailyPrompts(): Promise<BlogPrompt[]> {
    console.log(`📝 Generating ${PROMPTS_COUNT} daily blog prompts...`);

    // Fetch live trends
    const liveTrends = await getRealtimeTrends();

    // Blog type distribution for 20 prompts
    const typeDistribution: BlogType[] = [
        'news', 'news', 'news', 'news', 'news', 'news',   // 6 news
        'analysis', 'analysis', 'analysis', 'analysis',     // 4 analysis
        'review', 'review', 'review', 'review',             // 4 review
        'opinion', 'opinion', 'opinion',                     // 3 opinion
        'tutorial', 'tutorial', 'tutorial',                  // 3 tutorial
    ];

    const prompts: BlogPrompt[] = [];
    const usedTopics = new Set<string>();
    const dateStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < PROMPTS_COUNT; i++) {
        const blogType = typeDistribution[i];

        // Pick a unique topic
        let topic: string;
        let categoryType: 'tech' | 'non-tech';

        if (blogType === 'review') {
            topic = pickUnique(REVIEW_TOPICS, usedTopics);
            categoryType = 'tech';
        } else if (liveTrends.length > 0 && Math.random() < 0.8) {
            topic = pickUnique(liveTrends, usedTopics);
            categoryType = 'tech';
        } else if (Math.random() < 0.6) {
            topic = pickUnique(TECH_CATEGORIES, usedTopics);
            categoryType = 'tech';
        } else {
            topic = pickUnique(NON_TECH_CATEGORIES, usedTopics);
            categoryType = 'non-tech';
        }

        usedTopics.add(topic);

        const author = pickAuthor(topic);
        const voice = pickBlogVoice();

        const writerPrompt = buildWriterPrompt(topic, categoryType, author, voice, blogType);
        const imagePrompt = buildImagePrompt(topic, blogType);
        const coverImagePrompt = buildCoverImagePrompt(topic, blogType);

        prompts.push({
            id: `prompt-${dateStr}-${i + 1}`,
            topic,
            blogType,
            categoryType,
            author: { name: author.name, bio: author.bio },
            voice: { label: voice.label },
            writerPrompt,
            imagePrompt,
            coverImagePrompt,
            status: 'pending',
            createdAt: new Date().toISOString(),
        });
    }

    // Store in Redis with 24h TTL
    await redis.set(DAILY_PROMPTS_KEY, JSON.stringify(prompts), 'EX', TTL_24H);
    console.log(`✅ ${PROMPTS_COUNT} daily prompts generated and cached (24h TTL)`);

    return prompts;
}

/** Mark a prompt as completed */
export async function markPromptCompleted(promptId: string): Promise<void> {
    const prompts = await getDailyPrompts();
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
        prompt.status = 'completed';
        const ttl = await redis.ttl(DAILY_PROMPTS_KEY);
        await redis.set(DAILY_PROMPTS_KEY, JSON.stringify(prompts), 'EX', Math.max(ttl, 60));
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function pickUnique(arr: string[], used: Set<string>): string {
    const available = arr.filter(item => !used.has(item));
    if (available.length === 0) return arr[Math.floor(Math.random() * arr.length)];
    return available[Math.floor(Math.random() * available.length)];
}

export function buildWriterPrompt(
    topic: string,
    categoryType: 'tech' | 'non-tech',
    author: AuthorPersona,
    voice: BlogVoice,
    blogType: BlogType,
): string {
    const typeInfo = BLOG_TYPE_PROMPTS[blogType];
    const selectedBlocks = selectBlocksForBlog(blogType);
    const blockPrompt = generateBlockPromptSection(selectedBlocks);
    const quirks = author.quirks;

    const typeGuides: Record<BlogType, string> = {
        news: `TYPE: Breaking News / Latest Update
STRUCTURE: Lead with the news → Key details (5W1H) → Context → Expert reactions → What's next
RULES:
- First sentence tells the reader WHAT happened
- Include 2-3 direct quotes from named sources
- End with "What's Next" — timeline, upcoming events
- Length: 800-1500 words.
TITLE STYLE: ${typeInfo.titleStyle}`,
        review: `TYPE: Product Review
STRUCTURE: Verdict teaser → Specs table → What's new → Design → Performance → Real-world usage → Pros & Cons → Who should buy → Final verdict (score/10)
RULES:
- CRITICAL: Cover the NEWEST, CURRENTLY SHIPPING generation
- Include a SPECS TABLE using HTML <table>
- Include AT LEAST 3-5 specific benchmark results
- Include Pros & Cons section
- Length: 1500-2500 words.
TITLE STYLE: ${typeInfo.titleStyle}`,
        analysis: `TYPE: Deep Analysis / Trend Piece
STRUCTURE: Surprising data point hook → Thesis → Evidence (3-4 sections) → Counter-arguments → Prediction
RULES:
- Open with the ONE most surprising data point
- At least 5 specific data points with sources
- End with a SPECIFIC prediction
- Length: 1500-2000 words.
TITLE STYLE: ${typeInfo.titleStyle}`,
        opinion: `TYPE: Opinion / Hot Take
STRUCTURE: Bold claim → Personal experience → Evidence → Counter-argument → Double down
RULES:
- State thesis in first paragraph
- Include at least one personal anecdote
- Name specific tools/companies/people
- End with a question or confession
- Length: 1000-1800 words.
TITLE STYLE: ${typeInfo.titleStyle}`,
        tutorial: `TYPE: Practical Guide / How-To
STRUCTURE: The problem → Prerequisites → Step-by-step with code → Gotchas → Final result → Next steps
RULES:
- Include WORKING code examples
- Each step: WHAT + WHY, then code, then expected output
- Include a "Gotchas" section
- Length: 1200-2500 words.
TITLE STYLE: ${typeInfo.titleStyle}`,
    };

    return `You are ${author.name}, ${author.bio}. You publish tech content on dev.to, Medium, and Beebom.

Today's date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

⚠️ MANDATORY TOPIC — You MUST write about THIS SPECIFIC topic:
"${topic}"
Do NOT change the topic. The ENTIRE article must be about "${topic}".

Search the web for the LATEST information before writing.

${typeGuides[blogType]}

Voice style: ${voice.label} — ${voice.description}

AUTHOR PERSONALITY (${author.name}):
- Writing style: ${quirks.sentenceStyle} sentences
- Favorite transitions: ${quirks.favoriteTransitions.map(t => `"${t}"`).join(', ')}
- Catchphrases: ${quirks.personalCatchphrases.map(c => `"${c}"`).join(', ')}
- Contraction rate: ${Math.round(quirks.contractionRate * 100)}%
- Start with a ${quirks.introStyle} opening

${blockPrompt}

WRITING RULES:
- Write in FIRST PERSON. Use "I", "my", "we".
- Be SPECIFIC — say "Stripe, Vercel, and Linear" not "many companies"
- OPENING: Hook in 2 sentences. No "In today's...", "The world of..."
- PARAGRAPHS: 1-3 sentences each.
- SECTION HEADINGS: Specific. Not "Performance" but "Gaming Performance: Where the 5060 Ti Shines"
- ENDING: No "In conclusion" or "time will tell"

BANNED PHRASES (will be detected as AI):
"It's worth noting", "In conclusion", "Let's dive in", "game-changer", "landscape",
"paradigm shift", "leverage", "buckle up", "revolutionize", "cutting-edge",
"as we navigate", "only time will tell", "delve", "tapestry", "plethora", "myriad",
"testament to", "transformative", "fostering", "navigating", "democratize",
"holistic", "synergy", "robust", "comprehensive", "fundamentally", "essentially"

HUMAN IMPERFECTION:
- Use em-dashes (—) frequently
- Start some sentences with "And" or "But"
- Use parentheses for side thoughts
- VARY sentence length
- Include 1-2 colloquialisms ("tbh", "ngl", "hot take")
- EVERY shell/code command must be in code blocks

OUTPUT FORMAT — Use this EXACT structure:

# TITLE
Max 75 chars. Must create curiosity or tension.

# EXCERPT
One compelling sentence (max 140 chars). A teaser, NOT a summary.

# SEO_TITLE
SEO-optimized page title (max 60 chars)

# SEO_DESCRIPTION
SEO meta description (max 155 chars)

# TAGS
5-7 lowercase single-word or hyphenated tags, comma-separated

# IMAGE_KEYWORD
1-3 word search term for cover photo

# TRUST_SCORE
85-98 based on how well-sourced the article is

# CONTENT
Full article in HTML using:
TEXT: <h1>, <h2>, <h3>, <p>, <ul><li>, <ol><li>, <blockquote><p>
INLINE: <strong>, <em>, <code>, <a href="">
${blogType === 'review' ? 'TABLES: <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>' : ''}
CODE: <pre><code class="language-bash">...</code></pre>
DIVIDERS: <hr> (only between DIFFERENT topics, not every section)
CONTENT BLOCKS: Use the required blocks with their EXACT HTML structure.

RULES:
- ${blogType === 'review' ? '1500-2500' : blogType === 'news' ? '800-1500' : blogType === 'opinion' ? '1000-1800' : '1200-2000'} words
- ${blogType === 'review' ? '2-3' : blogType === 'analysis' ? '2' : '1'} inline image placeholder(s) — use: <figure class="image-block" data-direction="center"><img src="IMAGE_URL_HERE" alt="description" /><figcaption class="image-block-caption">Caption</figcaption></figure>
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
Professional post (500-700 chars)

# PODCAST_SCRIPT
2-minute natural podcast script`;
}

function buildImagePrompt(topic: string, blogType: BlogType): string {
    const count = blogType === 'review' ? 3 : blogType === 'analysis' ? 2 : 1;
    return `Generate ${count} blog inline image(s) for an article about: "${topic}"

Requirements:
- 16:9 aspect ratio (1200x675px)
- Clean, professional, editorial style
- No text overlays or watermarks
- Photorealistic or modern illustration style
- Good lighting, sharp focus

Image ${count > 1 ? 'descriptions' : 'description'}:
${count >= 1 ? `1. Hero visual that captures the essence of "${topic}" — used after the introduction` : ''}
${count >= 2 ? `2. Supporting visual showing data, comparison, or detail — used mid-article` : ''}
${count >= 3 ? `3. Product/detail shot or diagram — used in the technical section` : ''}

Style: Tech blog editorial (think The Verge, Beebom, or Wired)`;
}

function buildCoverImagePrompt(topic: string, blogType: BlogType): string {
    return `Generate a blog cover image for: "${topic}"

Requirements:
- 16:9 aspect ratio (1200x630px)
- Eye-catching, would make someone stop scrolling
- Modern, clean design with depth
- No text overlays — the title will be overlaid by the frontend
- ${blogType === 'review' ? 'Show the product prominently' : blogType === 'news' ? 'Feel urgent and timely' : blogType === 'analysis' ? 'Feel data-driven and analytical' : blogType === 'tutorial' ? 'Show a workspace or code environment' : 'Feel thought-provoking'}
- Dark or moody tones work best (our blog uses dark mode)
- Photorealistic or high-end 3D render style

Style: Premium tech blog hero image (think The Verge or MKBHD thumbnails)`;
}
