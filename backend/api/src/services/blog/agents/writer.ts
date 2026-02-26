// ─── Agent 1: Gemini 3 Pro — Research + Write (single pass) ─────────────────
// Combines research, outlining, and writing into one powerful call.
// Uses Google Search grounding for real-time data + thinking for better quality.

import { GoogleGenAI } from '@google/genai';
import type { BlogType, BlogVoice } from '../blog-types';
import { BLOG_TYPE_PROMPTS } from '../blog-types';
import type { AuthorPersona } from '../blog-authors';
import { generateBlockPromptSection, selectBlocksForBlog } from '../content-blocks';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function researchAndWrite(
    topic: string,
    categoryType: 'tech' | 'non-tech',
    author: AuthorPersona,
    voice: BlogVoice,
    blogType: BlogType,
): Promise<string> {
    console.log('✍️ Agent 1 (Gemini 3.1 Pro): Researching + Writing...');

    const typeInfo = BLOG_TYPE_PROMPTS[blogType];
    const selectedBlocks = selectBlocksForBlog(blogType);
    const blockPrompt = generateBlockPromptSection(selectedBlocks);

    // Author quirk instructions
    const quirks = author.quirks;
    const authorQuirkPrompt = `
AUTHOR PERSONALITY (${author.name}):
- Writing style: ${quirks.sentenceStyle} sentences
- Favorite transitions: ${quirks.favoriteTransitions.map(t => `"${t}"`).join(', ')}
- Use these personal catchphrases naturally: ${quirks.personalCatchphrases.map(c => `"${c}"`).join(', ')}
- Contraction rate: ${Math.round(quirks.contractionRate * 100)}% (use "don't" instead of "do not", etc.)
- ${quirks.parentheticalFrequency === 'high' ? 'Use MANY parenthetical asides (2-3 per section)' : quirks.parentheticalFrequency === 'medium' ? 'Use occasional parenthetical asides (1 per section)' : 'Minimal parenthetical asides'}
- ${quirks.emojiFrequency === 'medium' ? 'Use 2-3 emojis in the article' : quirks.emojiFrequency === 'low' ? 'Use at most 1 emoji' : 'Do NOT use any emojis'}
- Start the article with a ${quirks.introStyle} opening (${quirks.introStyle === 'anecdote' ? 'personal story' : quirks.introStyle === 'question' ? 'rhetorical question to the reader' : quirks.introStyle === 'data-point' ? 'surprising statistic' : quirks.introStyle === 'scene-setting' ? 'vivid scene description' : 'challenge conventional wisdom'})
`;

    // Type-specific structure + writing guide
    const typeGuides: Record<BlogType, string> = {
        news: `TYPE: Breaking News / Latest Update
STRUCTURE: Lead with the news → Key details (5W1H) → Context → Expert reactions → What's next
RULES:
- First sentence tells the reader WHAT happened
- Include 2-3 direct quotes from named sources (search for real quotes)
- End with "What's Next" — timeline, upcoming events
- Include a spec table or key facts box if relevant
- Length: 800-1500 words. News should be tight, not padded.
TITLE STYLE: ${typeInfo.titleStyle}`,

        review: `TYPE: Product Review (Beebom / The Verge / MKBHD style)
STRUCTURE: Verdict teaser → Specs table → What's new → Design → Performance (benchmarks) → Real-world usage → Pros & Cons → Who should buy → Final verdict (score/10)
RULES:
- CRITICAL: Search for the NEWEST, CURRENTLY SHIPPING generation of this product. Do NOT review an older model.
- Include a SPECS TABLE using HTML <table>
- Include AT LEAST 3-5 specific benchmark results with competitor comparisons
- Include a Pros & Cons section
- Add personal touches: "I was surprised by...", "What disappointed me was..."
- Length: 1500-2500 words.
TITLE STYLE: ${typeInfo.titleStyle}`,

        analysis: `TYPE: Deep Analysis / Trend Piece
STRUCTURE: Surprising data point hook → Thesis → Evidence (3-4 data sections) → Counter-arguments → Prediction
RULES:
- Open with the ONE most surprising data point
- Every claim needs a source with specific numbers
- Include at least 5 specific data points
- End with a SPECIFIC prediction, not hand-waving
- Length: 1500-2000 words.
TITLE STYLE: ${typeInfo.titleStyle}`,

        opinion: `TYPE: Opinion / Hot Take (dev.to/Medium style)
STRUCTURE: Bold claim → Personal experience → Evidence → Counter-argument → Double down
RULES:
- State your thesis in the first paragraph. No building up to it.
- Include at least one personal anecdote
- Name specific tools/companies/people — no "a popular framework"
- End with a question or confession, never "In conclusion"
- Length: 1000-1800 words.
TITLE STYLE: ${typeInfo.titleStyle}`,

        tutorial: `TYPE: Practical Guide / How-To (dev.to guide style)
STRUCTURE: The problem → Prerequisites → Step-by-step with code → Gotchas → Final result → Next steps
RULES:
- Include WORKING code examples — real, copy-pasteable code
- Each step: explain WHAT + WHY, then code, then expected output
- Include a "Gotchas" section
- Length: 1200-2500 words.
TITLE STYLE: ${typeInfo.titleStyle}`,
    };

    const prompt = `You are ${author.name}, ${author.bio}. You publish tech content on dev.to, Medium, and Beebom.

Today's date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

⚠️ MANDATORY TOPIC — You MUST write about THIS SPECIFIC topic:
"${topic}"
Do NOT change the topic. Do NOT write about something else. The ENTIRE article must be about "${topic}".

═══════════════════════════════════════════
STEP 1 — RESEARCH (use Google Search)
═══════════════════════════════════════════
Before writing ANYTHING, search the web for the LATEST information about: "${topic}"

Find:
1. THE LATEST GENERATION/MODEL — What is the NEWEST, CURRENTLY AVAILABLE version? Search for "latest" + "2025" + "2026" versions.
2. SPECIFIC DETAILS — Names, numbers, dates, prices, benchmarks
3. EXPERT VOICES — 2-3 real quotes from named people
4. COMPARISON DATA — How does this compare to alternatives? Use specific numbers.
5. SOURCES — Real URLs you found in search results. Do NOT fabricate URLs.

ACCURACY RULES:
- ONLY report facts from your search results. Do NOT fabricate data.
- Every statistic must come from a named, real source.
- Every quote must be from a real person who actually said those words.
- If you can't find enough current info, focus on analysis/opinion rather than making things up.

═══════════════════════════════════════════
STEP 2 — WRITE THE ARTICLE
═══════════════════════════════════════════
Using your research, write a complete blog post.

${typeGuides[blogType]}

Voice style: ${voice.label} — ${voice.description}

${authorQuirkPrompt}

${blockPrompt}

═══════════════════════════════════════════
WRITING RULES:
═══════════════════════════════════════════

VOICE & TONE:
- Write in FIRST PERSON. Use "I", "my", "we".
- Be SPECIFIC — don't say "many companies", say "Stripe, Vercel, and Linear"
- Have strong opinions.
${blogType === 'review' ? '- Share personal hands-on experiences: "I tested...", "In my experience..."' : ''}

STRUCTURE:
- OPENING: Hook in 2 sentences. No "In today's...", "The world of...", "As we navigate..."
- PARAGRAPHS: 1-3 sentences each.
- SECTION HEADINGS: Specific. Not "Performance" but "Gaming Performance: Where the 5060 Ti Shines"
- ENDING: No "In conclusion" or "time will tell".

BANNED PHRASES (instant AI detection):
"It's worth noting", "In conclusion", "Let's dive in", "game-changer", "landscape",
"paradigm shift", "leverage", "In today's world", "buckle up", "revolutionize",
"cutting-edge", "at the end of the day", "needless to say", "as we navigate",
"only time will tell", "without further ado", "first and foremost",
"last but not least", "the reality is", "it's no secret that",
"there's no denying", "when it comes to", "on the other hand",
"the bottom line is", "moving forward", "in the ever-evolving",
"raises important questions", "sheds light on", "remains to be seen",
"let's take a closer look", "this begs the question", "a double-edged sword",
"the tip of the iceberg", "serves as a reminder", "paving the way",
"a wake-up call", "speaks volumes", "it's clear that", "food for thought",
"delve", "tapestry", "plethora", "myriad", "testament to",
"underscores", "highlights", "transformative", "fostering",
"digital landscape", "navigating", "democratize", "nuanced",
"crucial", "pivotal", "realm", "ever-evolving", "a testament",
"multifaceted", "holistic", "synergy", "robust", "comprehensive",
"interestingly", "remarkably", "notably", "significantly", "fundamentally",
"essentially", "basically", "generally speaking", "in a nutshell",
"the elephant in the room", "a brave new world", "in this day and age",
"the writing is on the wall", "hit the ground running", "think outside the box"

HUMAN IMPERFECTION RULES:
- Use em-dashes (—) frequently
- Start some sentences with "And" or "But"
- Use parentheses for side thoughts (like this)
- Use one-word sentences occasionally. Seriously.
- VARY sentence length: mix short (3-5 words) with medium (12-18 words)
- Include 1-2 colloquialisms ("tbh", "ngl", "hot take", "wild")

═══════════════════════════════════════════
OUTPUT FORMAT — Use this EXACT structure:
═══════════════════════════════════════════

# TITLE
Max 75 chars. Must create curiosity or tension.

# EXCERPT
One compelling sentence (max 140 chars). A teaser, NOT a summary.

# SEO_TITLE
SEO-optimized page title (max 60 chars)

# SEO_DESCRIPTION
SEO meta description (max 155 chars)

# TAGS
5-7 lowercase single-word or hyphenated tags, comma-separated. Example: ai, machine-learning, deepseek, open-source, llm

# IMAGE_KEYWORD
1-3 word search term for cover photo

# TRUST_SCORE
85-98 based on how well-sourced the article is

# CONTENT
Full article in HTML using:
TEXT: <h1>, <h2>, <h3>, <p>, <ul><li>, <ol><li>, <blockquote><p>
INLINE: <strong>, <em>, <u>, <mark>, <code>, <a href="">
${blogType === 'review' ? 'TABLES: <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>' : ''}
IMAGES: <figure class="image-block" data-direction="center"><img data-search="DESCRIPTIVE_KEYWORD" src="" alt="descriptive alt text" /><figcaption class="image-block-caption">Caption describing what's shown</figcaption></figure>
IMPORTANT: The data-search attribute must be a 2-4 word search term describing what the image SHOULD show (e.g. "lunar eclipse red moon", "nvidia gpu benchmark", "coding laptop setup"). Do NOT use picsum.photos or any placeholder URL. Leave src empty.
CODE: <pre><code class="language-javascript">...</code></pre>
${categoryType === 'tech' ? 'PLAYGROUND: <div data-type="playground"><pre><code>// interactive example</code></pre></div>' : ''}
DIVIDERS: <hr>
CONTENT BLOCKS: Use the required blocks above with their EXACT HTML structure.
CHARTS: <figure class="image-block" data-direction="center"><img src="https://quickchart.io/chart?c=URL_ENCODED_JSON" alt="Chart: Description" /><figcaption class="image-block-caption">Source: data source</figcaption></figure>

RULES:
- ${blogType === 'review' ? '1500-2500' : blogType === 'news' ? '800-1500' : blogType === 'opinion' ? '1000-1800' : '1200-2000'} words
- EXACTLY ${blogType === 'review' ? '2-3' : blogType === 'news' ? '1' : blogType === 'analysis' ? '2' : blogType === 'tutorial' ? '1-2' : '1'} inline image(s) — no more, no less
- Each image must use a UNIQUE, SPECIFIC data-search keyword relevant to that section's content
- Use <hr> between major sections — but only between DIFFERENT topics, not between every section
- HTML only — no markdown in CONTENT
- EVERY shell command, code snippet, or terminal command MUST be inside <pre><code class="language-bash">...</code></pre> tags
- NEVER put code/commands in a plain <p> tag

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
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 8192 },
            tools: [{ googleSearch: {} }],
        },
    });

    // Extract text — thinking models may return content in candidates rather than .text
    let article = response.text || '';
    if (!article && response.candidates?.[0]?.content?.parts) {
        article = response.candidates[0].content.parts
            .filter((p: any) => p.text && !p.thought)
            .map((p: any) => p.text)
            .join('\n');
    }
    console.log(`✅ Agent 1 complete (${article.length} chars — research + draft)`);
    return article;
}
