// ─── Blog Content Parser ────────────────────────────────────────────────────

/**
 * Parse structured markdown sections into a blog data object.
 */
export function parseMarkdownBlog(markdown: string) {
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

    // Fix ALL CAPS titles from AI
    let title = (sections.TITLE || 'Untitled Blog Post').replace(/^["']+|["']+$/g, '').slice(0, 80);
    if (title === title.toUpperCase() && title.length > 10) {
        // Convert "THE MOON'S BLOOD MOON UPDATE" → "The Moon's Blood Moon Update"
        title = title.toLowerCase().replace(/(?:^|\s)\S/g, c => c.toUpperCase());
    }

    return {
        title,
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
export function markdownToHtml(md: string): string {
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
    // Preserve custom content blocks (callout, key-takeaway, stat-highlight, etc.)
    html = html.replace(/<div\s+class="(?:callout|key-takeaway|stat-highlight|comparison-box|timeline|faq-section|pull-quote|tldr-box|newsletter-cta|pros-cons-card)"[\s\S]*?<\/div>/g, preserveBlock);

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
