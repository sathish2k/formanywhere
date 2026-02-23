/**
 * Seed script: Delete all existing blogs and generate 10 new ones.
 *
 * Usage:
 *   bun run src/scripts/seed-blogs.ts
 *
 * Requires GEMINI_API_KEY in environment (or .env).
 */

import { db } from '../db';
import { blog } from '../db/schema';
import { generateAndPublishBlog } from '../services/blog-generator';

async function seed() {
    console.log('🗑️  Deleting all existing blogs...');
    await db.delete(blog);
    console.log('✅ All old blogs deleted.\n');

    const total = 10;
    for (let i = 1; i <= total; i++) {
        try {
            console.log(`\n📝 Generating blog ${i}/${total}...`);
            const created = await generateAndPublishBlog();
            console.log(`   ✅ "${created.title}"`);
        } catch (err) {
            console.error(`   ❌ Failed to generate blog ${i}:`, err);
        }
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
}

seed();
