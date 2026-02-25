import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { blog } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { invalidateAllBlogCaches } from '../lib/redis';
import Parser from 'rss-parser';

// ─── AI Providers ───────────────────────────────────────────────────────────
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const rssParser = new Parser();

// ─── Blog Types ─────────────────────────────────────────────────────────────
const BLOG_TYPES = ['news', 'review', 'analysis', 'opinion', 'tutorial'] as const;
type BlogType = typeof BLOG_TYPES[number];

const BLOG_TYPE_WEIGHTS: Record<BlogType, number> = {
    news: 30,
    review: 20,
    analysis: 25,
    opinion: 15,
    tutorial: 10,
};

function pickBlogType(): BlogType {
    const total = Object.values(BLOG_TYPE_WEIGHTS).reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (const [type, weight] of Object.entries(BLOG_TYPE_WEIGHTS)) {
        rand -= weight;
        if (rand <= 0) return type as BlogType;
    }
    return 'news';
}

// ─── Categories (specific & timely) ─────────────────────────────────────────
const TECH_CATEGORIES = [
    // AI & ML — specific topics
    'Latest AI model releases and benchmarks (GPT, Claude, Gemini, Llama)',
    'AI coding assistants — Copilot, Cursor, Claude Code, Windsurf',
    'Open-source AI models and local LLM running (Ollama, vLLM)',
    'AI agents, MCP servers, and tool-use frameworks',
    'AI image/video generation — Midjourney, Sora, Flux, Stable Diffusion',
    'AI regulation, safety, and alignment research',
    // Dev tools & frameworks
    'JavaScript/TypeScript framework wars — React, Next.js, SolidJS, Svelte, Astro',
    'Rust, Go, Zig — systems programming language trends',
    'Developer tools and productivity — editors, terminals, CLI tools',
    'Cloud platforms and serverless — AWS, Vercel, Cloudflare, Fly.io',
    'Database trends — Postgres, SQLite, Turso, Neon, Supabase',
    'Web platform APIs — new browser features, WebGPU, WASM',
    // Cybersecurity
    'Major security breaches and vulnerability disclosures',
    'Zero-day exploits, ransomware attacks, and nation-state hacking',
    // Hardware & gadgets
    'Apple — latest iPhone, iPad, Mac, Vision Pro, iOS updates',
    'Samsung — Galaxy, foldables, One UI, Unpacked announcements',
    'Google — Pixel, Android, Gemini AI, Search updates',
    'Microsoft — Windows, Copilot, Surface, Xbox',
    'NVIDIA, AMD, Intel — GPU launches, AI chips, benchmarks',
    'Latest smartphone launches and comparisons',
    'Wearables — smartwatches, AR glasses, health tech',
    'Laptop and PC hardware reviews and buying guides',
    // Industry
    'Tech startup funding rounds, acquisitions, and IPOs',
    'Big tech earnings, layoffs, and strategy shifts',
    'Social media platform changes — X, Meta, TikTok, Threads, Bluesky',
    'Gaming industry — new releases, console wars, game engines',
    'Cryptocurrency, blockchain, and Web3 developments',
];

const NON_TECH_CATEGORIES = [
    'Space exploration — SpaceX, NASA, ESA, Mars missions, Artemis',
    'Electric vehicles and autonomous driving — Tesla, Rivian, Waymo',
    'Climate tech, renewable energy, and sustainability innovations',
    'Biotech, gene editing, and health technology breakthroughs',
    'Education technology and the future of online learning',
    'Fintech, digital banking, and payment innovations',
    'Entertainment streaming wars — Netflix, Disney+, Apple TV+',
    'Remote work culture, productivity tools, and digital nomad trends',
    'Science discoveries — physics, biology, neuroscience breakthroughs',
    'Robotics and automation in everyday life',
    'Smart home tech and IoT innovations',
    'Food tech, lab-grown meat, and agricultural innovation',
];

// Review-specific topics (for 'review' blog type)
const REVIEW_TOPICS = [
    'Latest NVIDIA GeForce RTX GPU',
    'Latest AMD Radeon RX GPU',
    'Latest Apple MacBook Pro or MacBook Air',
    'Latest Samsung Galaxy S flagship phone',
    'Latest Google Pixel phone',
    'Latest Apple iPhone',
    'Latest iPad Pro or iPad Air',
    'Latest gaming laptop from ASUS, MSI, or Razer',
    'Latest wireless earbuds — AirPods, Galaxy Buds, Sony',
    'Latest smartwatch — Apple Watch, Galaxy Watch, Garmin',
    'Latest AI coding tool — Cursor, Windsurf, GitHub Copilot',
    'Latest mechanical keyboard for developers',
    'Latest monitor for programming and gaming',
    'Latest cloud hosting platform comparison',
    'Latest JavaScript meta-framework comparison',
];

// ─── Author Personas (consistent personalities, not random names) ───────────
const AUTHOR_PERSONAS = [
    { name: 'Alex Chen', bio: 'Senior systems engineer, ex-Google. Focuses on infrastructure, databases, and backend performance.', beats: ['cloud', 'databases', 'backend', 'devops'] },
    { name: 'Sarah Mitchell', bio: 'Former Apple engineer turned tech journalist. Covers hardware, chips, and product design.', beats: ['apple', 'hardware', 'reviews', 'design'] },
    { name: 'James Rodriguez', bio: 'AI researcher and indie hacker. Writes about ML models, AI tools, and building with LLMs.', beats: ['ai', 'machine-learning', 'llm', 'coding-assistants'] },
    { name: 'Priya Sharma', bio: 'Full-stack dev and open-source contributor. Specializes in JavaScript frameworks and web platform.', beats: ['javascript', 'frameworks', 'web', 'frontend'] },
    { name: 'Michael Torres', bio: 'Cybersecurity analyst and CTF player. Covers security breaches, exploits, and privacy.', beats: ['security', 'privacy', 'hacking', 'exploits'] },
    { name: 'Emma Wilson', bio: 'Tech policy reporter. Covers regulation, antitrust, startup funding, and industry strategy.', beats: ['policy', 'startups', 'business', 'regulation'] },
    { name: 'David Kim', bio: 'GPU enthusiast and game developer. Reviews graphics cards, gaming hardware, and engines.', beats: ['gpu', 'gaming', 'hardware', 'benchmarks'] },
    { name: 'Olivia Park', bio: 'Climate tech researcher and science writer. Covers EVs, space, biotech, and sustainability.', beats: ['climate', 'space', 'biotech', 'science'] },
    { name: 'Ryan Cooper', bio: 'DevTools addict and productivity nerd. Reviews dev tools, editors, and workflow optimizations.', beats: ['devtools', 'productivity', 'editors', 'cli'] },
    { name: 'Maya Patel', bio: 'Mobile dev and wearables geek. Covers smartphones, tablets, wearables, and mobile OS updates.', beats: ['mobile', 'android', 'ios', 'wearables'] },
];

type AuthorPersona = typeof AUTHOR_PERSONAS[number];

function pickAuthor(topic: string): AuthorPersona {
    const topicLower = topic.toLowerCase();
    // Try to match author by their beat
    const matched = AUTHOR_PERSONAS.filter(a => a.beats.some(b => topicLower.includes(b)));
    if (matched.length > 0) return matched[Math.floor(Math.random() * matched.length)];
    return AUTHOR_PERSONAS[Math.floor(Math.random() * AUTHOR_PERSONAS.length)];
}

type BlogCategory = 'tech' | 'non-tech' | 'random';

// ─── Tech Keyword Filter for Trends ─────────────────────────────────────────

const TECH_KEYWORDS = [
    // Hardware & devices
    'iphone', 'ipad', 'macbook', 'apple', 'samsung', 'galaxy', 'pixel', 'google',
    'nvidia', 'amd', 'intel', 'rtx', 'gpu', 'cpu', 'chip', 'processor', 'laptop',
    'phone', 'tablet', 'watch', 'airpods', 'headset', 'vr', 'ar', 'quest',
    // Software & platforms
    'ai', 'chatgpt', 'openai', 'gemini', 'claude', 'copilot', 'gpt', 'llm',
    'android', 'ios', 'windows', 'linux', 'macos', 'chrome', 'firefox', 'safari',
    'app', 'software', 'update', 'release', 'beta', 'api', 'cloud', 'aws', 'azure',
    // Companies
    'microsoft', 'meta', 'amazon', 'tesla', 'spacex', 'twitter', 'x.com',
    'tiktok', 'netflix', 'spotify', 'uber', 'stripe', 'shopify', 'discord',
    'steam', 'epic', 'playstation', 'xbox', 'nintendo', 'valve',
    // Dev & engineering
    'programming', 'developer', 'code', 'coding', 'github', 'rust', 'python',
    'javascript', 'typescript', 'react', 'node', 'docker', 'kubernetes',
    'database', 'sql', 'open source', 'framework', 'compiler', 'turing',
    // Tech topics
    'cyber', 'hack', 'breach', 'security', 'privacy', 'encryption', 'bitcoin',
    'crypto', 'blockchain', 'nft', 'web3', 'startup', 'funding', 'ipo',
    'robot', 'autonomous', 'self-driving', 'ev', 'electric vehicle', 'battery',
    'quantum', 'satellite', 'broadband', '5g', '6g', 'wifi', 'fiber',
    'data', 'algorithm', 'machine learning', 'neural', 'model', 'tech',
    'digital', 'semiconductor', 'silicon', 'display', 'oled', 'sensor',
];

function isTechRelated(title: string): boolean {
    const lower = title.toLowerCase();
    return TECH_KEYWORDS.some(kw => lower.includes(kw));
}

// ─── Real-Time Trend Surfing ────────────────────────────────────────────────

/** Fetches live trends from Google Trends RSS + HackerNews top stories */
async function getRealtimeTrends(): Promise<string[]> {
    try {
        console.log('🔥 Fetching real-time trends...');
        const results: string[] = [];

        // 1. Google Trends — RSS feed (general, so we filter for tech)
        try {
            const googleTrends = await rssParser.parseURL(
                'https://trends.google.com/trending/rss?geo=US'
            );
            const allTitles = googleTrends.items
                .map(i => i.title)
                .filter(Boolean) as string[];
            const techTitles = allTitles.filter(isTechRelated).slice(0, 10);
            results.push(...techTitles);
            console.log(`   📈 Google Trends: ${techTitles.length} tech topics (filtered from ${allTitles.length} total)`);
        } catch (e) {
            console.warn('   ⚠️ Google Trends RSS failed:', (e as Error).message);
        }

        // 2. HackerNews top stories
        try {
            const hnResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            if (hnResponse.ok) {
                const hnIds = ((await hnResponse.json()) as number[]).slice(0, 8);
                const hnStories = await Promise.all(
                    hnIds.map(id =>
                        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                            .then(r => r.json())
                            .catch(() => null)
                    )
                );
                const hnTitles = hnStories
                    .filter(s => s && s.title && s.score > 50)
                    .map(s => s.title as string);
                results.push(...hnTitles);
                console.log(`   🟠 HackerNews: ${hnTitles.length} trending stories`);
            }
        } catch (e) {
            console.warn('   ⚠️ HackerNews API failed:', (e as Error).message);
        }

        // 3. TechCrunch RSS for breaking news
        try {
            const tcFeed = await rssParser.parseURL('https://techcrunch.com/feed/');
            const tcTitles = tcFeed.items
                .slice(0, 5)
                .map(i => i.title)
                .filter(Boolean) as string[];
            results.push(...tcTitles);
            console.log(`   📰 TechCrunch: ${tcTitles.length} recent stories`);
        } catch (e) {
            console.warn('   ⚠️ TechCrunch RSS failed:', (e as Error).message);
        }

        if (results.length > 0) {
            console.log(`   🔥 Total live trends: ${results.length}`);
            return results;
        }

        console.warn('   ⚠️ All trend sources failed, falling back to static categories');
        return [];
    } catch (e) {
        console.warn('⚠️ Trend fetching failed entirely, using static categories');
        return [];
    }
}

// ─── Blog Type Descriptions (for prompts) ───────────────────────────────────
const BLOG_TYPE_PROMPTS: Record<BlogType, { label: string; structure: string; titleStyle: string }> = {
    news: {
        label: 'Breaking News / Latest Update',
        structure: 'Lead with the news. What happened? Why does it matter? What are experts saying? What happens next? Fast-paced, factual, with expert quotes.',
        titleStyle: 'Direct and informative with a hook. Examples: "NVIDIA Just Dropped the RTX 5060 Ti — And It Beats the 5070 in Some Games", "OpenAI Releases GPT-5: Here\'s What\'s Actually New", "Apple\'s M4 Ultra Benchmarks Are In. The Numbers Are Wild."',
    },
    review: {
        label: 'Product Review / Tech Review',
        structure: 'Like Beebom, The Verge, or MKBHD: Start with verdict teaser → Specs/what\'s new → Design & build → Performance (benchmarks/real-world) → Pros & Cons → Who should buy it → Final verdict with score. Include specific numbers, comparisons with competitors, and personal hands-on opinions.',
        titleStyle: 'Product name + clear value proposition. Examples: "MSI GeForce RTX 5060 Ti 16GB Review: Perfect Upgrade for Budget Gamers", "Pixel 9 Pro Review: The Camera King Has a New Trick", "Cursor vs Windsurf: I Used Both for 30 Days. Here\'s My Pick."',
    },
    analysis: {
        label: 'Deep Analysis / Trend Piece',
        structure: 'Start with a surprising data point → Explain the trend → Show evidence from multiple sources → Analyze what it means → Make a prediction. Data-heavy, well-sourced, analytical.',
        titleStyle: 'Data-driven with specific numbers. Examples: "We Analyzed 10,000 Dev.to Posts. AI Content Is Up 340% — But Engagement Is Down.", "The Real Cost of Microservices: What 50 CTOs Told Us", "Why 73% of AI Startups Will Fail by 2027"',
    },
    opinion: {
        label: 'Opinion / Hot Take',
        structure: 'Bold thesis → Personal experience → Evidence → Counter-argument → Double down on thesis. Conversational, opinionated, personal.',
        titleStyle: 'Provocative and personal. Examples: "Stop Using React. Seriously.", "AI Won\'t Replace Developers — But Developers Using AI Will Replace You", "I Mass-Deleted a Production Table on Purpose. Here\'s Why."',
    },
    tutorial: {
        label: 'Practical Guide / How-To',
        structure: 'The problem → Why existing solutions fall short → Step-by-step solution → Real code examples → Gotchas and tips → Final working result.',
        titleStyle: 'Clear outcome with specificity. Examples: "Deploy a SolidJS App to Cloudflare in 5 Minutes", "Build a RAG Pipeline That Actually Works (No LangChain)", "The Only Git Workflow You\'ll Ever Need"',
    },
};

// ─── Blog Voice Types ────────────────────────────────────────────────────────
const BLOG_VOICES = [
    {
        id: 'personal-story',
        label: 'Personal Story',
        description: 'First-person narrative — "I built X", "Why I stopped doing Y", "How I learned Z the hard way"',
        titlePatterns: [
            'I {verb} {thing} — {surprising result}',
            'Why I Stopped {doing thing} (And What I Do Instead)',
            'How {specific experience} Changed the Way I {activity}',
            '{Time period} of {activity}: What Nobody Tells You',
        ],
    },
    {
        id: 'contrarian-take',
        label: 'Contrarian Take',
        description: 'Challenges conventional wisdom — "X is wrong", "Stop doing Y", "The real problem with Z"',
        titlePatterns: [
            'Stop {common practice}. It\'s Making {thing} Worse.',
            '{Popular belief}. The Data Says Otherwise.',
            'The {adjective} Truth About {topic} Nobody Wants to Hear',
            '{thing} Is {negative} — Here\'s What to Do Instead',
        ],
    },
    {
        id: 'deep-analysis',
        label: 'Deep Analysis',
        description: 'Data-driven deep dive with specific numbers, charts, comparisons',
        titlePatterns: [
            '{Number} {things} I Analyzed — Here\'s What I Found',
            '{Metric}: What {N} {data points} Reveal About {topic}',
            'The {adjective} Economics of {topic}',
            'We Analyzed {N} {things}. {Surprising finding}.',
        ],
    },
    {
        id: 'practical-guide',
        label: 'Practical Guide',
        description: 'Actionable how-to with real code/examples — "How to X without Y"',
        titlePatterns: [
            'How to {achieve goal} Without {common pain}',
            '{Problem}? Here\'s the {N}-Step Fix That Actually Works',
            'The Only {topic} Guide You\'ll Actually Finish Reading',
            '{task} in {timeframe}: A No-BS Walkthrough',
        ],
    },
    {
        id: 'opinion-essay',
        label: 'Opinion Essay',
        description: 'Strong stance on industry trend — provocative thesis with reasoning',
        titlePatterns: [
            'The Real Reason {topic} Is {state}',
            '{topic} Isn\'t {what people think} — It\'s {what it actually is}',
            'Everyone\'s Wrong About {topic}. Here\'s Why.',
            '{bold claim about the future of topic}',
        ],
    },
] as const;

type BlogVoice = typeof BLOG_VOICES[number];

function pickBlogVoice(): BlogVoice {
    return BLOG_VOICES[Math.floor(Math.random() * BLOG_VOICES.length)];
}

// ─── Agent 1: Grok — Real-Time Research & Story Finding ─────────────────────

async function researchWithGrok(topic: string, blogType: BlogType, voice: BlogVoice): Promise<string> {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
        console.log('⚠️ No XAI_API_KEY set — skipping Grok research, using Gemini grounding only');
        return '';
    }

    const typePrompts: Record<BlogType, string> = {
        news: `You are a breaking news researcher for a top-tier tech publication (like The Verge or Beebom). Find the LATEST, most significant development in this topic from the past 48 hours. Focus on:
- What exactly happened/was announced (specifics, not generalities)
- Official statements, press releases, or first-hand reports
- Key specifications, pricing, availability dates
- How it compares to competitors or predecessors (specific numbers)
- Industry reactions — who praised it, who criticized it, and why`,
        review: `You are a product researcher for a tech review site (like Beebom, MKBHD, or The Verge). Find the most detailed, recent information about this product/tool. Focus on:
- MOST IMPORTANT: Identify the CURRENT/NEWEST generation or model that is actually shipping right now. Do NOT default to older generations. For example: if asked about MacBooks, the M4 chip is the latest (2024-2025), NOT M3. If asked about GPUs, find the newest launched SKU.
- Full specifications and pricing of the LATEST model
- Official benchmark results or performance claims
- Real-world user reviews and early hands-on impressions
- Direct competitor comparisons with specific numbers
- Known issues, limitations, or controversies
- Availability, release dates, regional pricing
- EXPLICITLY STATE the model generation/year so downstream writers use the correct product name`,
        analysis: `You are a data analyst for a tech publication. Find surprising data, statistics, and trends about this topic. Focus on:
- Specific numbers, percentages, growth rates from credible sources
- Survey results, research papers, or industry reports
- Counter-intuitive findings that challenge conventional wisdom
- Multiple data points that tell a cohesive story
- Expert interpretations of the data`,
        opinion: `You are a story researcher for a popular dev.to/Medium blog. Find the most compelling STORY within this topic — not just facts, but the human angle. Focus on:
- A specific incident or decision that captures a bigger trend
- Surprising data that contradicts popular belief
- Who disagrees and why — the real debate
- Named people with real quotes
- Personal experiences shared by developers/users online`,
        tutorial: `You are a technical researcher for a developer education platform. Find the most practical, up-to-date technical information about this topic. Focus on:
- Current best practices and official documentation
- Common pain points and mistakes developers make
- Working code examples from official repos or trusted sources
- Performance benchmarks comparing different approaches
- Recent changes or deprecations developers should know about`,
    };

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
                        content: typePrompts[blogType],
                    },
                    {
                        role: 'user',
                        content: `Research the latest developments about: "${topic}"

I need you to find:
1. THE LATEST GENERATION/MODEL: First, identify what is the NEWEST, CURRENTLY AVAILABLE version of any product in this topic. For example:
   - MacBook → M4 series (released late 2024 / early 2025), NOT M3
   - iPhone → find the newest model currently sold
   - GPUs → find the most recently launched SKU
   - Software → find the latest version number
   DO NOT default to older generations. Search specifically for "latest" or "newest" or "2025" or "2026" versions.
2. SPECIFIC DETAILS: Names, numbers, dates, prices, benchmarks — the more specific, the more credible
3. EXPERT VOICES: 2-3 real quotes from named people (founders, engineers, reviewers, researchers)
4. COMPARISON DATA: How does this compare to alternatives/competitors/predecessors? Use specific numbers.
5. THE ANGLE: What's the most interesting or surprising thing about this topic right now?
6. SOURCES: Real URLs for fact-checking — ONLY include URLs you found in search results. DO NOT generate or guess URLs.

Today's date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

CRITICAL ACCURACY RULES:
- ONLY report facts you found in actual search results. DO NOT fabricate any data.
- If a product hasn't been announced yet, say so — don't invent specs or features.
- Always verify you're reporting on the NEWEST generation, not an older one. Double-check model numbers and release dates.
- Every statistic must come from a named, real source you found in search.
- Every quote must be from a real person who actually said those words.
- If you can't find enough current information, say "LIMITED DATA AVAILABLE" rather than making things up.
- Mark each fact with its source so downstream agents know what's verified.
- At the TOP of your response, clearly state: "LATEST MODEL: [product name + generation + release date]" so writers know exactly which product to cover.

Focus on the MOST RECENT developments. Old news is useless.`,
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
    voice: BlogVoice,
    blogType: BlogType,
): Promise<string> {
    console.log('📐 Agent 2 (Gemini): Creating structured outline...');

    const researchBlock = research
        ? `\n\nHere is real-time research data to base the outline on (THIS DATA IS FROM LIVE WEB SEARCH AND IS MORE CURRENT THAN YOUR TRAINING DATA — ALWAYS TRUST THIS OVER YOUR OWN KNOWLEDGE):\n${research}`
        : '';

    const titleExamples = voice.titlePatterns.join('\n   - ');
    const typeInfo = BLOG_TYPE_PROMPTS[blogType];

    // Type-specific outline structures
    const typeStructures: Record<BlogType, string> = {
        news: `ARTICLE STRUCTURE (News format — like The Verge, Beebom, TechCrunch):
1. HEADLINE — Informative but with a hook. Lead with the news, add the "so what"
   Examples: ${typeInfo.titleStyle}
2. LEAD — The most important fact in 1-2 sentences. What happened + why it matters.
3. KEY DETAILS — The 5W1H: Who, What, When, Where, Why, How (with specifics)
4. CONTEXT — How this fits into the bigger picture. Previous versions, competitor landscape.
5. EXPERT REACTIONS — 2-3 named experts/analysts with quotes
6. WHAT'S NEXT — Timeline, availability, upcoming events
7. BOTTOM LINE — One-sentence "why you should care" takeaway`,
        review: `ARTICLE STRUCTURE (Review format — like Beebom, The Verge, MKBHD):
1. HEADLINE — Product name + clear verdict hook
   Examples: ${typeInfo.titleStyle}
2. VERDICT TEASER — Quick score/recommendation in 2 sentences (this hooks the reader)
3. SPECS TABLE — Full specifications in a clean format
4. WHAT'S NEW — Key differences from predecessor and competitors
5. DESIGN & BUILD — Physical impressions, materials, ergonomics, personal reactions
6. PERFORMANCE — Benchmarks, real-world tests, specific numbers with comparisons
   - Include at least 3 benchmark/test results with specific numbers
   - Always compare to 2-3 competitors with percentage differences
7. REAL-WORLD USAGE — Day-to-day experience, battery life, software, ecosystem
8. PROS & CONS — Bullet list, be honest about weaknesses
9. WHO SHOULD BUY — Specific audience segments
10. VERDICT — Final score (out of 10) with one-paragraph summary`,
        analysis: `ARTICLE STRUCTURE (Analysis format — like dev.to deep dives, Medium analytics):
1. HEADLINE — Data-driven with specific numbers
   Examples: ${typeInfo.titleStyle}
2. THE HOOK — One surprising data point that makes the reader stop scrolling
3. THESIS — The one big insight this piece will prove
4. THE DATA — 3-4 sections, each building a piece of the argument:
   - Section 1: The surface-level trend everyone knows
   - Section 2: The counter-intuitive finding underneath
   - Section 3: What the experts are missing
   - Section 4: The prediction nobody's making
5. METHODOLOGY — Brief: where the data comes from, why it's credible
6. IMPLICATIONS — What this means for reader's career/business/choices
7. THE TAKEAWAY — Not "time will tell" — a specific, bold prediction`,
        opinion: `ARTICLE STRUCTURE (Opinion format — like popular dev.to/Medium posts):
1. HEADLINE — Provocative, personal, creates tension
   Examples: ${typeInfo.titleStyle}
2. THE BOLD CLAIM — Your thesis, stated without apology
3. THE STORY — Personal experience that led to this opinion
4. THE EVIDENCE — 2-3 supporting data points or examples
5. THE COUNTER — Steelman the opposing view, then dismantle it
6. THE STAKES — What happens if we don't listen?
7. THE LANDING — Circle back to the personal, end with a question or confession`,
        tutorial: `ARTICLE STRUCTURE (Tutorial format — like the best dev.to guides):
1. HEADLINE — Clear outcome, specific tool/technique
   Examples: ${typeInfo.titleStyle}
2. THE PROBLEM — What pain this solves, why existing solutions fall short
3. PREREQUISITES — What the reader needs (be specific: versions, accounts, etc.)
4. STEP-BY-STEP — 3-7 clear steps, each with:
   - What we're doing and why
   - The code/command
   - What to expect / how to verify it worked
5. GOTCHAS — 2-3 things that commonly go wrong and how to fix them
6. THE RESULT — Show the final working thing
7. NEXT STEPS — Where to go from here`,
    };

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are the editorial brain behind a top tech blog that publishes on dev.to, Medium, and their own site (similar to Beebom, The Verge, or TechCrunch). You plan articles that get thousands of reads — because they deliver REAL VALUE, not clickbait.

Plan a **${typeInfo.label}** blog post about "${topic}" using voice style: **${voice.label}** — ${voice.description}${researchBlock}

${typeStructures[blogType]}

TITLE RULES (applies to ALL types):
- Max 75 characters
- Must create curiosity, tension, or promise clear value
- NO generic roundup style ("X, Y, Z: The Week in Tech") 
- Be SPECIFIC — use product names, numbers, bold claims
- Voice-specific patterns: ${titleExamples}
- Reference titles from top sites:
  * Beebom: "MSI GeForce RTX 5060 Ti 16GB Review: Perfect Upgrade for Budget Gamers"
  * dev.to: "I Built a Profiler for My LLM Bill (and It Saved Me $30/month)"
  * Medium: "Developers Think AI Makes Them 24% Faster. The Data Says 19% Slower."
  * The Verge: "The iPhone 16 Pro is the obvious satisfying upgrade"

TODAY'S DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

CRITICAL RULES:
- This is a ${typeInfo.label}. Follow the ${blogType} structure above.
- Every fact must be specific — no "many companies" or "growing trend". Name names, cite numbers.
- ONLY use facts from the research data above. Do NOT add facts, statistics, or product names that aren't in the research.
- RECENCY CHECK: The research data identifies the LATEST product generation. Use THAT generation, not an older one from your training data. If research says "M4", do NOT write about "M3". If research says "RTX 5060 Ti", do NOT write about "RTX 4060 Ti".
- For EACH fact/statistic in the outline, include its source in parentheses so the writer knows what's verified.
- If the research says "LIMITED DATA AVAILABLE", design the outline around analysis/opinion rather than fabricated facts.
- ${blogType === 'review' ? 'Include at least 5 specific benchmark numbers or test results with competitor comparisons.' : ''}
- ${blogType === 'news' ? 'Lead with the LATEST development. Old news is worthless.' : ''}
- ${blogType === 'analysis' ? 'Every claim needs a data source. No hand-waving.' : ''}
- ${blogType === 'opinion' ? 'Take a STRONG stance. Wishy-washy opinions get ignored.' : ''}
- ${blogType === 'tutorial' ? 'Every step needs working code. No pseudo-code or "exercise for the reader".' : ''}

Do NOT write the article. Only provide the structured outline.

TITLE GENERATION — A/B TESTING:
Generate exactly 5 candidate titles for this article. Then act as a harsh HackerNews/Twitter editor:
- Which title creates the strongest curiosity gap?
- Which would get the most upvotes on HackerNews?
- Which would get the most clicks on Twitter/X?
Pick the ONE best title and put it as the main outline title. List all 5 candidates below it labeled "TITLE_CANDIDATES:" so the writer can see the alternatives.`,
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
    author: AuthorPersona,
    voice: BlogVoice,
    blogType: BlogType,
): Promise<string> {
    console.log('✍️ Agent 3 (Gemini): Writing full article...');

    const typeInfo = BLOG_TYPE_PROMPTS[blogType];

    // Type-specific writing instructions
    const typeWritingGuide: Record<BlogType, string> = {
        news: `NEWS ARTICLE RULES:
- Lead with the news: first sentence tells the reader WHAT happened
- Second paragraph: WHY it matters
- Third paragraph: CONTEXT (what came before, what competitors are doing)
- Include 2-3 direct quotes from named sources
- End with "What's Next" — timeline, upcoming events, what to watch for
- Tone: Informative, fast-paced, authoritative — like The Verge or Beebom
- Include a spec table or key facts box if relevant (using HTML table)
- Length: 800-1500 words. News should be tight, not padded.`,
        review: `REVIEW ARTICLE RULES (follow Beebom / The Verge / MKBHD style):
- Open with a 2-sentence verdict teaser that gives the reader a feel for your take
- Include a SPECS TABLE using HTML <table> with key specifications
- DESIGN section: physical impressions, materials, weight, build quality. Be honest.
- PERFORMANCE section: Include AT LEAST 3-5 specific benchmark results or test numbers
  * Always compare to predecessor and 1-2 competitors using specific numbers/percentages
  * Format: "scored X, which is Y% better/worse than Z"
  * Include real-world usage scenarios, not just synthetic benchmarks
- PROS & CONS: Bullet list using <ul>. Be genuinely honest about weaknesses.
- WHO SHOULD BUY: Specific audience recommendations
- VERDICT: Score out of 10, one-paragraph summary
- Add personal touches: "I was surprised by...", "What disappointed me was...", "After using it for X days..."
- Length: 1500-2500 words. Reviews need thoroughness.`,
        analysis: `ANALYSIS ARTICLE RULES:
- Open with the ONE most surprising data point — make the reader stop scrolling
- Every claim needs a source: "According to [Source Name]..." or "[Person], [Title] at [Company], found that..."
- Include at least 5 specific data points with numbers
- Show the data in context: "X might sound small, but it's a 340% increase from Y"
- Address counter-arguments: "Critics argue X, but the data shows Y"
- End with a SPECIFIC prediction, not hand-waving
- Length: 1500-2000 words. Dense with data, not dense with words.`,
        opinion: `OPINION ARTICLE RULES (dev.to/Medium style):
- Open with your thesis — no building up to it. State your stance in the first paragraph.
- Use "I" freely. This is YOUR take, YOUR experience.
- Include at least one personal anecdote: "I once...", "Last year at work, I..."
- Name specific tools/companies/people — no "a popular framework" or "many companies"
- Steelman the opposing view before dismantling it
- Use sentence fragments for emphasis. Short paragraphs.
- End with a question or a confession, never "In conclusion"
- Length: 1000-1800 words. Opinions should be sharp, not long.`,
        tutorial: `TUTORIAL ARTICLE RULES (dev.to guide style):
- Open with THE PROBLEM: Why should someone read this? What pain does it solve?
- Include WORKING code examples — real, copy-pasteable code. No pseudo-code.
- Each step: explain WHAT we're doing, WHY, then show the code, then show expected output
- Include a "Gotchas" or "Common Mistakes" section
- End with the working result and "Next Steps"
- Length: 1200-2500 words depending on complexity.`,
    };

    const prompt = `You are ${author.name}, ${author.bio}. You publish tech content on dev.to, Medium, and Beebom. You have thousands of followers because your writing is specific, honest, and useful — not generic filler.

Your perspective comes from your background — write with the authority and specific knowledge of someone who does this for a living.

Write a **${typeInfo.label}** blog post based on this editorial outline:

${outline}

Voice style: ${voice.label} — ${voice.description}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

═══════════════════════════════════════════
TYPE-SPECIFIC RULES:
═══════════════════════════════════════════
${typeWritingGuide[blogType]}

═══════════════════════════════════════════
⚠️ CRITICAL — FACTUAL ACCURACY RULES (HIGHEST PRIORITY):
═══════════════════════════════════════════
1. ONLY use facts, statistics, quotes, product names, and benchmark numbers that appear in the outline above.
2. DO NOT INVENT OR FABRICATE:
   - Product names that don't exist (e.g. don't invent "Developer Edition" or "Pro Max Ultra" variants)
   - Statistics or percentages not present in the research (e.g. don't make up "40% of Fortune 500")
   - Quotes from people who didn't say those words
   - Benchmark scores, prices, or release dates not in the research
   - URLs or source names not in the research
3. RECENCY IS CRITICAL: Use the EXACT product names and model numbers from the outline. The outline is based on LIVE web search and is more current than your training data.
   - If the outline says "M4 MacBook", write about M4 — NOT M3.
   - If the outline says "RTX 5060 Ti", write about that — NOT older GPUs.
   - NEVER substitute a product name from your training data for the one in the outline.
4. If the outline lacks specific data for a section, write around it with analysis/opinion rather than fabricating numbers.
5. Every named source, statistic, or quote MUST come from the outline/research data. No exceptions.
6. For the CITATIONS section: ONLY include URLs that were provided in the research. DO NOT generate fake URLs.
7. If you're unsure whether a fact is real, OMIT IT. A shorter factual article beats a longer fabricated one.

═══════════════════════════════════════════
UNIVERSAL WRITING RULES:
═══════════════════════════════════════════

VOICE & TONE:
- Write in FIRST PERSON. Use "I", "my", "we". You are a real person.
- Be SPECIFIC where others are vague. Don't say "many companies" — say "Stripe, Vercel, and Linear"
- Have strong opinions. Readers follow writers who THINK, not writers who summarize.
${blogType === 'review' ? '- Share personal hands-on experiences: "I tested...", "In my experience...", "What surprised me was..."' : ''}
${blogType === 'news' ? '- Be authoritative and well-sourced. Quote named people.' : ''}

STRUCTURE:
- OPENING: Must hook in 2 sentences. No "In today's...", "The world of...", "As we navigate..."
- PARAGRAPHS: 1-3 sentences each. If more than 4 sentences, split it.
- SECTION HEADINGS: Specific and descriptive. Not "Performance" but "Gaming Performance: Where the 5060 Ti Shines"
- ENDING: No "In conclusion" or "time will tell". End with impact.

BANNED PHRASES (instant AI detection — will kill credibility):
"It's worth noting", "In conclusion", "Let's dive in", "game-changer", "landscape", "paradigm shift",
"leverage", "In today's world", "buckle up", "revolutionize", "cutting-edge",
"at the end of the day", "needless to say", "as we navigate", "only time will tell",
"without further ado", "first and foremost", "last but not least", "the reality is",
"it's no secret that", "there's no denying", "when it comes to", "on the other hand",
"the bottom line is", "moving forward", "in the ever-evolving", "a growing number of",
"raises important questions", "sheds light on", "remains to be seen",
"let's take a closer look", "this begs the question", "a double-edged sword",
"the tip of the iceberg", "serves as a reminder", "paving the way",
"a wake-up call", "speaks volumes", "it's clear that", "food for thought",
"delve", "tapestry", "plethora", "myriad", "testament to",
"underscores", "highlights", "transformative", "fostering",
"digital landscape", "navigating", "democratize", "nuanced",
"crucial", "pivotal", "realm", "ever-evolving", "a testament",
"multifaceted", "holistic", "synergy", "robust", "comprehensive"

HUMAN IMPERFECTION RULES (critical for passing the "Reddit Test"):
- Use em-dashes (—) frequently instead of commas or semicolons
- Start some sentences with "And" or "But". It's allowed. Grammarians can deal.
- Use parentheses for side thoughts (like this one — readers love asides)
- Occasionally use a one-word sentence for emphasis. Seriously.
- Break a grammar rule once or twice on purpose. Fragment sentences are fine.
- Sound like a real person writing on Reddit or HackerNews, not a corporate press release.

═══════════════════════════════════════════
OUTPUT FORMAT — Use this EXACT structure:
═══════════════════════════════════════════

# TITLE
The headline from the outline (max 75 chars). Must create curiosity or tension.

# EXCERPT
One compelling sentence that makes someone click (max 140 chars). NOT a summary — a teaser.

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
${blogType === 'review' ? 'TABLES: <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table> — for specs' : ''}
IMAGES: <figure class="image-block" data-direction="center"><img src="https://picsum.photos/seed/KEYWORD/800/400" alt="..." /><figcaption class="image-block-caption">...</figcaption></figure>
CODE: <pre><code class="language-javascript">...</code></pre>
${categoryType === 'tech' ? 'PLAYGROUND: <div data-type="playground"><pre><code>// interactive example</code></pre></div>' : ''}
DIVIDERS: <hr>

DATA VISUALIZATION (use when article has comparisons, benchmarks, or trends):
If the article involves performance comparisons, market share, growth rates, or benchmark data, you MUST include at least one chart.
Generate a chart URL using QuickChart.io with this HTML format:
<figure class="image-block" data-direction="center"><img src="https://quickchart.io/chart?c=URL_ENCODED_JSON" alt="Chart: Description" /><figcaption class="image-block-caption">Source: data source name</figcaption></figure>

Chart JSON format (URL-encode the entire JSON):
- Bar chart: {type:'bar',data:{labels:['A','B','C'],datasets:[{label:'Score',data:[85,72,91],backgroundColor:['#4285f4','#ea4335','#34a853']}]},options:{plugins:{title:{display:true,text:'Chart Title'}}}}
- Line chart: {type:'line',data:{labels:['Q1','Q2','Q3','Q4'],datasets:[{label:'Growth',data:[10,25,45,80],borderColor:'#4285f4',fill:false}]}}
- Radar chart: {type:'radar',data:{labels:['Speed','Battery','Display','Camera','Value'],datasets:[{label:'Product A',data:[9,7,8,9,6]},{label:'Product B',data:[7,9,7,8,8]}]}}

Chart rules:
- Use real data from the outline/research. Never fabricate chart data.
- ${blogType === 'review' ? 'Include a benchmark comparison bar chart and optionally a radar chart for overall scoring.' : ''}
- ${blogType === 'analysis' ? 'Include at least 1-2 charts showing the key data trends.' : ''}
- ${blogType === 'news' ? 'Include a chart if there are numbers worth visualizing (market share, pricing, performance).' : ''}
- Keep chart JSON compact. Use short labels.

RULES:
- ${blogType === 'review' ? '1500-2500' : blogType === 'news' ? '800-1500' : blogType === 'opinion' ? '1000-1800' : '1200-2000'} words
- At least 2 images using <figure> with picsum.photos
- Include data charts (QuickChart) when the article has comparative or numerical data
${blogType === 'review' ? '- Include a specs table, at least one comparison table, AND a benchmark chart' : ''}
${blogType === 'tutorial' ? '- Include real code examples with syntax highlighting' : ''}
${blogType === 'news' ? '- Include a key facts/timeline section' : ''}
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

    // Use thinking budget for better quality + Google Search for fact verification
    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 4096,
            },
            tools: [{ googleSearch: {} }],
        },
    });

    const article = response.text || '';
    console.log(`✅ Agent 3 complete (${article.length} chars draft)`);
    return article;
}

// ─── Agent 4: Gemini — Editor & Polish ──────────────────────────────────────

async function editAndPolish(rawArticle: string, voice: BlogVoice, blogType: BlogType): Promise<string> {
    console.log('🔧 Agent 4 (Gemini): Editing and polishing...');

    const typeInfo = BLOG_TYPE_PROMPTS[blogType];

    const typeEditChecks: Record<BlogType, string> = {
        news: `NEWS-SPECIFIC CHECKS:
- Does the first sentence tell the reader WHAT happened? If not, rewrite it.
- Are there at least 2 named sources with quotes?
- Is there a clear "What's Next" or "Timeline" section?
- Is the article tight? News shouldn't be more than 1500 words. Cut padding.
- Are dates, prices, and specs accurate and specific?`,
        review: `REVIEW-SPECIFIC CHECKS:
- Is there a specs table? If not, you MUST add one with an HTML <table>.
- Are there at least 3 specific benchmark/test results with numbers?
- Does each benchmark compare to at least 1 competitor with a percentage?
- Is there a Pros & Cons section? If not, add one.
- Is there a final verdict with a score out of 10?
- Does the review have personal touches? ("I was surprised by...", "After testing for X days...")
- Is the title in format "Product Name Review: Clear Value Statement"?`,
        analysis: `ANALYSIS-SPECIFIC CHECKS:
- Does the opening contain a specific, surprising data point?
- Are there at least 5 specific numbers/stats cited?
- Does each claim reference its source?
- Is there a clear thesis that the article PROVES with data?
- Does it end with a specific prediction, not vague hand-waving?`,
        opinion: `OPINION-SPECIFIC CHECKS:
- Is the thesis stated clearly in the first paragraph?
- Is there at least one personal anecdote?
- Does the author steelman the opposing view before countering it?
- Is the tone genuinely opinionated (not neutral/balanced)?
- Does it end with a question or confession?`,
        tutorial: `TUTORIAL-SPECIFIC CHECKS:
- Does every step include actual working code?
- Is there a clear problem statement at the start?
- Are prerequisites listed?
- Is there a "Gotchas" or "Common Mistakes" section?
- Does it show the final working result?`,
    };

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an elite editor who's worked at Beebom, The Verge, dev.to, and Medium. You know EXACTLY what separates a forgettable post from one that gets massive engagement.

This is a **${typeInfo.label}** article with voice style: **${voice.label}** — ${voice.description}

DRAFT TO EDIT:
${rawArticle}

═══════════════════════════════════════════
YOUR EDITING PASSES (do all of them):
═══════════════════════════════════════════

PASS 1 — THE TITLE TEST:
- Read the title. Would YOU click on it scrolling through dev.to/Beebom/Medium at midnight?
- For type "${blogType}": ${typeInfo.titleStyle}
- Max 75 chars. Must create CURIOSITY or TENSION or promise CLEAR VALUE.
- NO news-roundup format. NO "X, Y, Z: The Something Something"
- NO generic subtitles after colons. Every word must earn its place.

PASS 2 — THE OPENING TEST:
- First paragraph must HOOK in 2 sentences.
- Kill any opening that starts with: "In today's...", "The world of...", "As technology...", "In an era...", "In recent years..."
- For ${blogType}: ${blogType === 'news' ? 'Lead with the news, not context.' : blogType === 'review' ? 'Open with your overall impression.' : blogType === 'analysis' ? 'Open with the most surprising data point.' : blogType === 'opinion' ? 'Open with your thesis.' : 'Open with the problem.'}

PASS 3 — THE AI SMELL TEST (most critical):
- Does it sound like a HUMAN wrote it? Read it mentally.
- DELETE or rewrite ANY of these phrases:
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
  "the question remains", "it goes without saying", "at the end of the day",
  "delve", "tapestry", "plethora", "myriad", "testament to",
  "underscores", "highlights", "transformative", "fostering",
  "digital landscape", "navigating", "democratize", "nuanced",
  "crucial", "pivotal", "realm", "ever-evolving", "a testament",
  "multifaceted", "holistic", "synergy", "robust", "comprehensive"
- ALSO check for HUMAN IMPERFECTION:
  * Add em-dashes (—) in at least 3-4 places
  * Start at least 2 sentences with "And" or "But"
  * Add at least 1 parenthetical aside
  * Include at least 1 short fragment sentence for emphasis
  * If the writing is too "smooth" or "polished" — rough it up a little

PASS 4 — THE TIGHTENING PASS:
- Cut filler: really, very, quite, somewhat, essentially, basically
- Cut hedge words: might, perhaps, potentially (unless genuine uncertainty)
- Cut pompous: utilize→use, implement→build, facilitate→help
- Remove paragraphs that restate the previous one

PASS 5 — THE STRUCTURE CHECK:
- h2 → h3 hierarchy never skip levels
- Section headings must be SPECIFIC, not generic
- Paragraphs: 1-3 sentences each
- Smooth transitions between sections

PASS 6 — TYPE-SPECIFIC CHECK:
${typeEditChecks[blogType]}

PASS 7 — FACT-CHECK & HALLUCINATION SWEEP (CRITICAL):
- Use Google Search to VERIFY every key claim in the article:
  * Do the named products actually exist? (e.g. "Razer BlackWidow V4 Pro Developer Edition" — is this real?)
  * Are the benchmark numbers real? Check if they match published reviews.
  * Are the statistics cited from real reports? (e.g. "40% of Fortune 500" — did Gartner actually say this?)
  * Do the quoted people exist and did they say what's attributed to them?
- RECENCY CHECK: Search Google to verify the article covers the LATEST generation:
  * "What is the latest MacBook chip?" — If the article says M3 but M4 is out, FIX IT.
  * "What is the newest iPhone?" — If the article references unreleased models, FIX IT.
  * "Latest NVIDIA GPU?" — Ensure it's the most recently launched, not an older generation.
  * If the article is about an older product when a newer one exists, UPDATE the entire article to cover the latest model.
- If you find a FABRICATED fact: REMOVE IT entirely or replace with a verified alternative.
- If a product name is wrong/fabricated: Fix it to the actual product name or remove the claim.
- If a product generation is OUTDATED: Replace with the current generation using data from your Google Search.
- If a statistic has no verifiable source: Remove the specific number and rephrase with general language.
- For CITATIONS: Remove any URL that doesn't point to a real, existing page. Only keep verifiable sources.
- Better to have FEWER facts that are 100% real than MANY facts that might be fabricated.

PASS 8 — THE EXCERPT TEST:
- EXCERPT must make someone NEED to read the article. Max 140 chars.
- Bad: "This article explores the latest developments in..."
- Good: "It scored 9,437. That's 25% more than its predecessor — and it costs $100 less."

OUTPUT: Return the COMPLETE article in the exact same # SECTION format. Do NOT summarize or shorten. Return ALL sections: TITLE, EXCERPT, SEO_TITLE, SEO_DESCRIPTION, TAGS, IMAGE_KEYWORD, TRUST_SCORE, CONTENT, CITATIONS, TWITTER_THREAD, LINKEDIN_POST, NEWSLETTER, PODCAST_SCRIPT.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const edited = response.text || rawArticle;
    console.log(`✅ Agent 4 complete (${edited.length} chars polished)`);
    return edited;
}

// ─── SEO JSON-LD Schema Generator ───────────────────────────────────────────

function generateSeoSchema(blogData: {
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

export async function generateAndPublishBlog(category: BlogCategory = 'random', forceBlogType?: BlogType) {
    console.log('🚀 Starting multi-agent blog generation pipeline...');
    console.log('   Pipeline: Trends → Grok (research) → Gemini (outline+A/B titles) → Gemini Pro (write+charts) → Gemini (edit)');

    try {
        // 0. Fetch real-time trends first
        const liveTrends = await getRealtimeTrends();
        const useLiveTrend = liveTrends.length > 0 && Math.random() < 0.8; // 80% live, 20% static

        // 1. Pick category
        let selectedCategory: string;
        let categoryType: 'tech' | 'non-tech';

        // 2. Pick blog type
        const blogType = forceBlogType || pickBlogType();

        if (useLiveTrend) {
            // Use a live trending topic
            selectedCategory = liveTrends[Math.floor(Math.random() * liveTrends.length)];
            categoryType = 'tech'; // Trends are tech-focused since we pull from tech RSS
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
                // Keep the live trend but ensure it's reviewable
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

        // ── Agent 1: Grok researches real-time news ──
        const research = await researchWithGrok(selectedCategory, blogType, voice);

        // ── Agent 2: Gemini creates a structured outline ──
        const outline = await generateOutline(selectedCategory, categoryType, research, voice, blogType);

        // ── Agent 3: Gemini Pro writes the full article from the outline ──
        const rawArticle = await writeArticle(outline, categoryType, author, voice, blogType);

        // ── Agent 4: Gemini edits, removes AI clichés, polishes ──
        const polishedArticle = await editAndPolish(rawArticle, voice, blogType);

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

        // ── Inject SEO JSON-LD schema at the top ──
        const seoSchema = generateSeoSchema(blogData, author, coverImage, slug, blogType);
        content = seoSchema + '\n' + content;

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
    // More robust regex: matches # or ## or ### followed by section key, with optional trailing chars
    const sectionRegex = /^#{1,3}\s+([A-Z][A-Z_]+)\s*$/gm;
    const matches = [...markdown.matchAll(sectionRegex)];

    // If strict regex fails, try a looser match that allows more variation
    if (matches.length < 3) {
        const looseRegex = /^#{1,3}\s+([A-Z][A-Z_\s]*[A-Z])\s*$/gm;
        const looseMatches = [...markdown.matchAll(looseRegex)];
        if (looseMatches.length > matches.length) {
            matches.length = 0;
            matches.push(...looseMatches);
        }
    }

    for (let i = 0; i < matches.length; i++) {
        const key = matches[i][1].replace(/\s+/g, '_');
        const startIdx = matches[i].index! + matches[i][0].length;
        const endIdx = i + 1 < matches.length ? matches[i + 1].index! : markdown.length;
        sections[key] = markdown.slice(startIdx, endIdx).trim();
    }

    // Fallback: if no TITLE section found, try to extract from first # heading in the content
    if (!sections.TITLE) {
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch && titleMatch[1] && !titleMatch[1].match(/^[A-Z_]+$/)) {
            sections.TITLE = titleMatch[1].trim();
        }
    }

    // Fallback: try inline format "# TITLE: value" or "# TITLE\nvalue" patterns
    if (!sections.TITLE || !sections.CONTENT) {
        const inlineRegex = /^#{1,3}\s+(TITLE|EXCERPT|SEO_TITLE|SEO_DESCRIPTION|TAGS|IMAGE_KEYWORD|TRUST_SCORE|CONTENT|CITATIONS|TWITTER_THREAD|LINKEDIN_POST|NEWSLETTER|PODCAST_SCRIPT)\s*[:\-]\s*(.+)$/gm;
        let inlineMatch;
        while ((inlineMatch = inlineRegex.exec(markdown)) !== null) {
            const key = inlineMatch[1];
            if (!sections[key]) {
                sections[key] = inlineMatch[2].trim();
            }
        }
    }

    // Debug: log parsed sections for troubleshooting
    const foundSections = Object.keys(sections).filter(k => sections[k]);
    console.log(`   📄 Parsed sections: ${foundSections.join(', ')}`);

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
        title: (sections.TITLE || 'Untitled Blog Post').replace(/^["']+|["']+$/g, '').slice(0, 80),
        excerpt: (sections.EXCERPT || '').replace(/^["']+|["']+$/g, '').slice(0, 150),
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
