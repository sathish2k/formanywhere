// ─── Blog Types, Weights, Prompts, and Voice Styles ─────────────────────────

export const BLOG_TYPES = ['news', 'review', 'analysis', 'opinion', 'tutorial'] as const;
export type BlogType = typeof BLOG_TYPES[number];

export const BLOG_TYPE_WEIGHTS: Record<BlogType, number> = {
    news: 30,
    review: 20,
    analysis: 25,
    opinion: 15,
    tutorial: 10,
};

export function pickBlogType(): BlogType {
    const total = Object.values(BLOG_TYPE_WEIGHTS).reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (const [type, weight] of Object.entries(BLOG_TYPE_WEIGHTS)) {
        rand -= weight;
        if (rand <= 0) return type as BlogType;
    }
    return 'news';
}

// ─── Blog Type Descriptions (for prompts) ───────────────────────────────────
export const BLOG_TYPE_PROMPTS: Record<BlogType, { label: string; structure: string; titleStyle: string }> = {
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
export const BLOG_VOICES = [
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

export type BlogVoice = typeof BLOG_VOICES[number];

export function pickBlogVoice(): BlogVoice {
    return BLOG_VOICES[Math.floor(Math.random() * BLOG_VOICES.length)];
}

export type BlogCategory = 'tech' | 'non-tech' | 'random';
