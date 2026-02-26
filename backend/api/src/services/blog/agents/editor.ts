// ─── Agent 2: Gemini 3 Flash — Edit, Fact-Check, Humanize ───────────────────
// Fast, cheap editing pass that catches AI tells, verifies facts, and polishes.

import { GoogleGenAI } from '@google/genai';
import type { BlogType, BlogVoice } from '../blog-types';
import { BLOG_TYPE_PROMPTS } from '../blog-types';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function editAndPolish(rawArticle: string, voice: BlogVoice, blogType: BlogType, topic: string): Promise<string> {
    console.log('🔧 Agent 2 (Gemini 3 Flash): Editing, fact-checking, humanizing...');

    const typeInfo = BLOG_TYPE_PROMPTS[blogType];

    const typeEditChecks: Record<BlogType, string> = {
        news: `NEWS-SPECIFIC CHECKS:
- Does the first sentence tell the reader WHAT happened? If not, rewrite it.
- Are there at least 2 named sources with quotes?
- Is there a clear "What's Next" section?
- Is it tight? Cut padding. Max 1500 words.`,
        review: `REVIEW-SPECIFIC CHECKS:
- Is there a specs table? If not, add one.
- At least 3 benchmark/test results with competitor comparisons?
- Is there a Pros & Cons section?
- Final verdict with a score out of 10?
- Personal touches? ("I was surprised by...", "After testing for X days...")`,
        analysis: `ANALYSIS-SPECIFIC CHECKS:
- Surprising data point in the opening?
- At least 5 specific numbers/stats cited?
- Each claim references its source?
- Ends with a specific prediction?`,
        opinion: `OPINION-SPECIFIC CHECKS:
- Thesis stated clearly in first paragraph?
- At least one personal anecdote?
- Opposing view addressed before countering?
- Ends with a question or confession?`,
        tutorial: `TUTORIAL-SPECIFIC CHECKS:
- Every step includes working code?
- Clear problem statement at the start?
- Prerequisites listed?
- "Gotchas" section present?`,
    };

    const response = await gemini.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an elite editor at Beebom, The Verge, and dev.to. You know what separates forgettable posts from viral ones.

This is a **${typeInfo.label}** article. Voice: **${voice.label}** — ${voice.description}

⚠️ MANDATORY TOPIC: "${topic}"
The article MUST be about this topic. If the draft below is off-topic or empty, WRITE a new article about "${topic}" from scratch using Google Search.

DRAFT TO EDIT:
${rawArticle || '(Draft was empty — you must write the article about the mandatory topic above.)'}

═══════════════════════════════════════════
EDITING PASSES (do ALL of them):
═══════════════════════════════════════════

PASS 1 — TITLE TEST:
- Would YOU click this scrolling dev.to at midnight?
- Max 75 chars. Must create CURIOSITY or TENSION.

PASS 2 — OPENING TEST:
- First paragraph must HOOK in 2 sentences.
- Kill openings starting with: "In today's...", "The world of...", "As technology..."
- For ${blogType}: ${blogType === 'news' ? 'Lead with the news.' : blogType === 'review' ? 'Open with overall impression.' : blogType === 'analysis' ? 'Open with surprising data.' : blogType === 'opinion' ? 'Open with thesis.' : 'Open with the problem.'}

PASS 3 — AI SMELL TEST (most critical):
DELETE or rewrite ANY of these:
"It's worth noting", "In conclusion", "Let's dive in", "game-changer", "landscape",
"paradigm shift", "leverage", "buckle up", "revolutionize", "cutting-edge",
"as we navigate", "only time will tell", "needless to say",
"without further ado", "first and foremost", "last but not least",
"the reality is", "it's no secret", "there's no denying", "when it comes to",
"the bottom line", "moving forward", "in the ever-evolving",
"raises important questions", "sheds light on", "remains to be seen",
"a double-edged sword", "tip of the iceberg", "serves as a reminder",
"paving the way", "a wake-up call", "speaks volumes",
"it's clear that", "food for thought", "a perfect storm",
"delve", "tapestry", "plethora", "myriad", "testament to",
"underscores", "highlights", "transformative", "fostering",
"digital landscape", "navigating", "democratize", "nuanced",
"crucial", "pivotal", "realm", "ever-evolving", "a testament",
"multifaceted", "holistic", "synergy", "robust", "comprehensive",
"interestingly", "remarkably", "notably", "significantly", "fundamentally",
"essentially", "basically", "generally speaking", "in a nutshell",
"the elephant in the room", "a brave new world", "in this day and age",
"the writing is on the wall", "hit the ground running", "think outside the box"

ALSO add HUMAN IMPERFECTION:
* Em-dashes (—) in 3-4 places
* Start 2+ sentences with "And" or "But"
* Add parenthetical asides
* Include 1 short fragment sentence
* VARY sentence lengths: no 3+ consecutive similar-length sentences

PASS 4 — TIGHTENING:
- Cut: really, very, quite, somewhat, essentially, basically
- Cut hedge words: might, perhaps, potentially (unless genuine uncertainty)
- Cut pompous: utilize→use, implement→build, facilitate→help

PASS 5 — STRUCTURE:
- h2 → h3 hierarchy, never skip levels
- Specific section headings, not generic
- Paragraphs: 1-3 sentences each

PASS 6 — TYPE-SPECIFIC:
${typeEditChecks[blogType]}

PASS 7 — CONTENT BLOCKS:
- All required content blocks present (callout, key-takeaway, stat-highlight, etc.)?
- Each block uses correct HTML structure?
- Do NOT add newsletter CTAs or subscribe buttons.
- If any required block is missing, ADD it.

PASS 8 — CODE FORMAT CHECK:
- Every shell command, terminal command, or code snippet MUST be inside <pre><code class="language-bash">...</code></pre>
- NEVER leave code/commands in plain <p> tags
- Docker commands, npm/bun commands, git commands — ALL must be in code blocks

PASS 9 — FACT-CHECK (use Google Search):
- VERIFY every key claim
- RECENCY CHECK: Is this the LATEST product generation?
- Remove fabricated facts, fix wrong product names
- Remove unverifiable URLs from CITATIONS
- Better fewer REAL facts than many fabricated ones

PASS 10 — TAG CHECK:
- TAGS section must have 5-7 lowercase single-word or hyphenated tags
- Comma-separated. Example: ai, machine-learning, deepseek, open-source, llm
- Remove any tags with spaces or uppercase letters

PASS 11 — EXCERPT TEST:
- Must make someone NEED to read. Max 140 chars.
- Bad: "This article explores the latest developments in..."
- Good: "It scored 9,437. That's 25% more than its predecessor — and costs $100 less."

OUTPUT: Return the COMPLETE article in the exact same # SECTION format.
Return ALL sections: TITLE, EXCERPT, SEO_TITLE, SEO_DESCRIPTION, TAGS, IMAGE_KEYWORD, TRUST_SCORE, CONTENT, CITATIONS, TWITTER_THREAD, LINKEDIN_POST, NEWSLETTER, PODCAST_SCRIPT.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const edited = response.text || '';
    console.log(`✅ Agent 2 complete (${edited.length} chars — edited & fact-checked)`);
    return edited;
}
