// ─── Image Upload API ───────────────────────────────────────────────────────
// Handles image uploads: converts to AVIF, generates LQIP, uploads to DO Spaces.
// Also supports URL-based image processing (e.g. paste a URL and we fetch + convert).

import { Elysia, t } from 'elysia';
import { auth } from '../lib/auth';
import { db } from '../db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { processAndUploadImage, processImageFromUrl, deleteImage } from '../services/image-service';
import type { ProcessedImage } from '../services/image-service';

// Admin guard
async function requireAdmin(request: Request): Promise<boolean> {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return false;
    const [userData] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    return userData?.role === 'admin';
}

export const imageRoutes = new Elysia({ prefix: '/api/images' })

    /**
     * POST /api/images/upload — Upload an image file
     * Converts to AVIF + WebP, generates LQIP, uploads to DO Spaces.
     * Returns: { url, webpUrl, lqip, width, height }
     */
    .post('/upload', async ({ body, request, set }) => {
        if (!(await requireAdmin(request))) {
            set.status = 403;
            return { error: 'Admin access required' };
        }

        const { file, folder } = body as { file: File; folder?: string };

        if (!file || !(file instanceof File)) {
            set.status = 400;
            return { error: 'No file provided' };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic'];
        if (!allowedTypes.includes(file.type)) {
            set.status = 400;
            return { error: `Unsupported image type: ${file.type}. Use JPEG, PNG, WebP, or GIF.` };
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            set.status = 400;
            return { error: 'Image too large. Max 10MB.' };
        }

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await processAndUploadImage(buffer, folder || 'blog');
            return { success: true, image: result };
        } catch (err: any) {
            console.error('❌ Image upload failed:', err);
            set.status = 500;
            return { error: `Upload failed: ${err.message}` };
        }
    })

    /**
     * POST /api/images/from-url — Process an image from URL
     * Fetches the image, converts to AVIF + WebP, generates LQIP, uploads to DO Spaces.
     */
    .post('/from-url', async ({ body, request, set }) => {
        if (!(await requireAdmin(request))) {
            set.status = 403;
            return { error: 'Admin access required' };
        }

        const { url, folder } = body as { url: string; folder?: string };

        if (!url) {
            set.status = 400;
            return { error: 'No URL provided' };
        }

        try {
            const result = await processImageFromUrl(url, folder || 'blog');
            return { success: true, image: result };
        } catch (err: any) {
            console.error('❌ Image processing failed:', err);
            set.status = 500;
            return { error: `Processing failed: ${err.message}` };
        }
    })

    /**
     * DELETE /api/images — Delete an image from Spaces
     */
    .delete('/', async ({ body, request, set }) => {
        if (!(await requireAdmin(request))) {
            set.status = 403;
            return { error: 'Admin access required' };
        }

        const { key } = body as { key: string };
        if (!key) { set.status = 400; return { error: 'No key provided' }; }

        await deleteImage(key);
        return { success: true };
    });
