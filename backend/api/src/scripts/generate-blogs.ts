/**
 * Generate N blogs without deleting existing ones.
 *
 * Usage:
 *   bun run src/scripts/generate-blogs.ts          # generates 5 blogs (mixed types)
 *   bun run src/scripts/generate-blogs.ts 3        # generates 3 blogs
 *   bun run src/scripts/generate-blogs.ts 2 review # generates 2 review blogs
 *   bun run src/scripts/generate-blogs.ts 1 news   # generates 1 news blog
 *
 * Supported blog types: news, review, analysis, opinion, tutorial
 * Requires GEMINI_API_KEY in environment (or .env).
 */

import { generateAndPublishBlog } from '../services/blog-generator';

const total = parseInt(process.argv[2] || '5', 10);
const forceBlogType = process.argv[3] as 'news' | 'review' | 'analysis' | 'opinion' | 'tutorial' | undefined;

const categories: Array<'tech' | 'non-tech' | 'random'> = [
    'tech', 'non-tech', 'tech', 'non-tech', 'random',
    'tech', 'non-tech', 'random', 'tech', 'non-tech',
];

// When generating mixed content, vary the blog types for good coverage
const blogTypeMix: Array<'news' | 'review' | 'analysis' | 'opinion' | 'tutorial'> = [
    'news', 'review', 'analysis', 'news', 'opinion',
    'news', 'tutorial', 'review', 'analysis', 'news',
];

async function run() {
    console.log(`\n🚀 Generating ${total} blog(s)${forceBlogType ? ` (type: ${forceBlogType})` : ' (mixed types)'}...\n`);

    let success = 0;
    for (let i = 1; i <= total; i++) {
        const cat = categories[(i - 1) % categories.length];
        const type = forceBlogType || blogTypeMix[(i - 1) % blogTypeMix.length];
        try {
            console.log(`📝 [${i}/${total}] Generating "${cat}" ${type} blog...`);
            const created = await generateAndPublishBlog(cat, type);
            console.log(`   ✅ "${created.title}" [${type}]\n`);
            success++;
        } catch (err) {
            console.error(`   ❌ Failed blog ${i}:`, err);
        }
    }

    console.log(`\n🎉 Done! ${success}/${total} blogs generated.`);
    process.exit(0);
}

run();
