// ─── Content Block Palette & Selection ───────────────────────────────────────
// Provides diverse HTML block types so each blog looks structurally unique.

import type { BlogType } from './blog-types';

export interface ContentBlock {
    id: string;
    label: string;
    html: string; // Template HTML for the AI prompt
    description: string; // What the block does
}

// All available block types
const BLOCK_PALETTE: ContentBlock[] = [
    {
        id: 'callout-info',
        label: 'Info Callout',
        html: '<div class="callout callout-info"><span class="callout-icon">💡</span><div class="callout-content"><strong>Title</strong><p>Key information the reader should know.</p></div></div>',
        description: 'Highlight important context, background info, or "did you know" facts',
    },
    {
        id: 'callout-warning',
        label: 'Warning Callout',
        html: '<div class="callout callout-warning"><span class="callout-icon">⚠️</span><div class="callout-content"><strong>Warning</strong><p>Critical caveat or gotcha.</p></div></div>',
        description: 'Warn readers about common mistakes, breaking changes, or risks',
    },
    {
        id: 'callout-tip',
        label: 'Tip Callout',
        html: '<div class="callout callout-tip"><span class="callout-icon">✅</span><div class="callout-content"><strong>Pro Tip</strong><p>Expert recommendation.</p></div></div>',
        description: 'Share a practical tip, shortcut, or best practice',
    },
    {
        id: 'key-takeaway',
        label: 'Key Takeaway Box',
        html: '<div class="key-takeaway"><strong>🔑 Key Takeaway</strong><p>The most important insight from this section.</p></div>',
        description: 'Highlight the single most important point — use after a complex section',
    },
    {
        id: 'stat-highlight',
        label: 'Stat Highlight',
        html: '<div class="stat-highlight"><span class="stat-number">73%</span><span class="stat-label">of developers prefer X over Y</span><span class="stat-source">— Source Name, 2026</span></div>',
        description: 'Display a big impactful number with context — great for data-driven articles',
    },
    {
        id: 'comparison-box',
        label: 'Comparison Box',
        html: '<div class="comparison-box"><div class="comparison-col"><h4>Option A</h4><ul><li>Feature 1</li><li>Feature 2</li></ul></div><div class="comparison-col"><h4>Option B</h4><ul><li>Feature 1</li><li>Feature 2</li></ul></div></div>',
        description: 'Side-by-side comparison of two alternatives, products, or approaches',
    },
    {
        id: 'timeline',
        label: 'Timeline',
        html: '<div class="timeline"><div class="timeline-item"><span class="timeline-date">Jan 2026</span><div class="timeline-content"><strong>Event Title</strong><p>Brief description.</p></div></div><div class="timeline-item"><span class="timeline-date">Mar 2026</span><div class="timeline-content"><strong>Event Title</strong><p>Brief description.</p></div></div></div>',
        description: 'Chronological sequence of events — perfect for news context and product history',
    },
    {
        id: 'faq-section',
        label: 'FAQ Accordion',
        html: '<div class="faq-section"><h3>Frequently Asked Questions</h3><details><summary>Question text goes here?</summary><p>Detailed answer with supporting facts.</p></details><details><summary>Another common question?</summary><p>Another detailed answer.</p></details></div>',
        description: 'FAQ with collapsible answers — great for SEO rich snippets and reducing bounce',
    },
    {
        id: 'pull-quote',
        label: 'Pull Quote',
        html: '<div class="pull-quote"><p>"A compelling quote that captures the essence of this section."</p><cite>— Person Name, Title at Company</cite></div>',
        description: 'Large-format inline quote from an expert or notable statement',
    },
    {
        id: 'tldr-box',
        label: 'TL;DR Box',
        html: '<div class="tldr-box"><strong>⚡ TL;DR</strong><ul><li>Key point 1 in one sentence</li><li>Key point 2 in one sentence</li><li>Key point 3 in one sentence</li></ul></div>',
        description: 'Quick summary box — place at the top after the intro or at the bottom',
    },
    {
        id: 'pros-cons',
        label: 'Pros & Cons Card',
        html: '<div class="pros-cons-card"><div class="pros"><h4>✅ Pros</h4><ul><li>Advantage 1</li><li>Advantage 2</li></ul></div><div class="cons"><h4>❌ Cons</h4><ul><li>Disadvantage 1</li><li>Disadvantage 2</li></ul></div></div>',
        description: 'Clear pros/cons layout — essential for reviews and comparisons',
    },
];

// Which blocks each blog type should prefer
const BLOCK_PREFERENCES: Record<BlogType, string[]> = {
    news: ['timeline', 'stat-highlight', 'key-takeaway', 'callout-info', 'pull-quote', 'tldr-box'],
    review: ['pros-cons', 'comparison-box', 'stat-highlight', 'key-takeaway', 'callout-warning', 'faq-section'],
    analysis: ['stat-highlight', 'comparison-box', 'callout-info', 'key-takeaway', 'pull-quote', 'timeline'],
    opinion: ['pull-quote', 'key-takeaway', 'callout-info', 'stat-highlight', 'tldr-box'],
    tutorial: ['callout-warning', 'callout-tip', 'faq-section', 'key-takeaway', 'callout-info', 'tldr-box'],
};

/** Pick 3-5 block types for a specific blog, with type-appropriate preferences */
export function selectBlocksForBlog(blogType: BlogType): ContentBlock[] {
    const preferred = BLOCK_PREFERENCES[blogType];
    const preferredBlocks = preferred
        .map(id => BLOCK_PALETTE.find(b => b.id === id))
        .filter(Boolean) as ContentBlock[];

    // Always include newsletter CTA (revenue optimization)
    const newsletterCta = BLOCK_PALETTE.find(b => b.id === 'newsletter-cta')!;

    // Shuffle and pick 3-4 from preferences
    const shuffled = [...preferredBlocks].sort(() => Math.random() - 0.5);
    const count = 3 + Math.floor(Math.random() * 2); // 3 or 4
    return shuffled.slice(0, count);
}

/** Generate the prompt section instructing the AI to use specific blocks */
export function generateBlockPromptSection(blocks: ContentBlock[]): string {
    const blockInstructions = blocks.map((block, i) => {
        return `${i + 1}. **${block.label}** — ${block.description}
   HTML template:
   ${block.html}`;
    }).join('\n\n');

    return `
═══════════════════════════════════════════
REQUIRED CONTENT BLOCKS (use ALL of these):
═══════════════════════════════════════════
You MUST include each of these special blocks at appropriate points in the article.
These create visual variety and improve reader engagement. Place them naturally between sections.

${blockInstructions}

RULES:
- Use EVERY block listed above at least once
- Place blocks at natural break points, not all clustered together
- Fill in real content — don't leave placeholder text
`;
}
