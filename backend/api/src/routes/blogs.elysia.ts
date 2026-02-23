import { Elysia } from 'elysia';
import { db } from '../db';
import { blog } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { generateAndPublishBlog } from '../services/blog-generator';

export const blogsRoutes = new Elysia({ prefix: '/api/blogs' })
    .get('/', async () => {
        const blogs = await db.select().from(blog).orderBy(desc(blog.publishedAt));
        return blogs;
    })
    .get('/:slug', async ({ params: { slug }, error }) => {
        const [foundBlog] = await db.select().from(blog).where(eq(blog.slug, slug));
        if (!foundBlog) return error(404, 'Blog not found');
        return foundBlog;
    })
    // Manual trigger for testing
    .post('/generate', async () => {
        const newBlog = await generateAndPublishBlog();
        return newBlog;
    });
