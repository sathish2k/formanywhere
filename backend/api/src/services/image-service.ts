// ─── Image Processing & Storage ─────────────────────────────────────────────
// Converts images to AVIF format, generates LQIP (Low Quality Image Placeholder),
// and uploads to DigitalOcean Spaces (S3-compatible object storage).

import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// ─── S3 Client for DigitalOcean Spaces ──────────────────────────────────────

const SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT || 'https://sgp1.digitaloceanspaces.com';
const SPACES_BUCKET = process.env.DO_SPACES_BUCKET || 'formanywhere';
const SPACES_REGION = process.env.DO_SPACES_REGION || 'sgp1';
const SPACES_CDN = process.env.DO_SPACES_CDN_URL || `https://${SPACES_BUCKET}.${SPACES_REGION}.cdn.digitaloceanspaces.com`;

const s3 = new S3Client({
    endpoint: SPACES_ENDPOINT,
    region: SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || '',
        secretAccessKey: process.env.DO_SPACES_SECRET || '',
    },
    forcePathStyle: false,
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProcessedImage {
    /** CDN URL of the full AVIF image */
    url: string;
    /** CDN URL of the WebP fallback */
    webpUrl: string;
    /** Base64-encoded tiny LQIP (~200 bytes, inline-safe) */
    lqip: string;
    /** Original width */
    width: number;
    /** Original height */
    height: number;
    /** S3 key for cleanup */
    key: string;
}

// ─── Core Processing ────────────────────────────────────────────────────────

/**
 * Process an image buffer: convert to AVIF + WebP, generate LQIP, upload to Spaces.
 *
 * @param input - Image buffer (from upload or URL fetch)
 * @param folder - S3 folder path, e.g. "blog/covers" or "blog/inline"
 * @param maxWidth - Max width to resize to (default: 1200px)
 */
export async function processAndUploadImage(
    input: Buffer,
    folder: string = 'blog',
    maxWidth: number = 1200,
): Promise<ProcessedImage> {
    const id = uuidv4().slice(0, 12);
    const timestamp = Date.now();
    const baseName = `${folder}/${timestamp}-${id}`;

    // Get metadata
    const metadata = await sharp(input).metadata();
    const originalWidth = metadata.width || maxWidth;
    const originalHeight = metadata.height || Math.round(maxWidth * 0.5625);
    const targetWidth = Math.min(originalWidth, maxWidth);

    // 1. Generate AVIF (high quality, small file)
    const avifBuffer = await sharp(input)
        .resize(targetWidth, undefined, { withoutEnlargement: true })
        .avif({ quality: 72, effort: 4 })
        .toBuffer();

    // 2. Generate WebP fallback (for older browsers)
    const webpBuffer = await sharp(input)
        .resize(targetWidth, undefined, { withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();

    // 3. Generate tiny LQIP (20px wide, heavily compressed, base64)
    const lqipBuffer = await sharp(input)
        .resize(20, undefined, { withoutEnlargement: true })
        .blur(2)
        .webp({ quality: 20 })
        .toBuffer();

    const lqip = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;

    // Get final dimensions from the AVIF output
    const avifMeta = await sharp(avifBuffer).metadata();

    // 4. Upload to DigitalOcean Spaces
    const avifKey = `${baseName}.avif`;
    const webpKey = `${baseName}.webp`;

    await Promise.all([
        s3.send(new PutObjectCommand({
            Bucket: SPACES_BUCKET,
            Key: avifKey,
            Body: avifBuffer,
            ContentType: 'image/avif',
            ACL: 'public-read',
            CacheControl: 'public, max-age=31536000, immutable',
        })),
        s3.send(new PutObjectCommand({
            Bucket: SPACES_BUCKET,
            Key: webpKey,
            Body: webpBuffer,
            ContentType: 'image/webp',
            ACL: 'public-read',
            CacheControl: 'public, max-age=31536000, immutable',
        })),
    ]);

    const url = `${SPACES_CDN}/${avifKey}`;
    const webpUrl = `${SPACES_CDN}/${webpKey}`;

    console.log(`🖼️ Image uploaded: ${avifKey} (${Math.round(avifBuffer.length / 1024)}KB AVIF, ${Math.round(webpBuffer.length / 1024)}KB WebP, LQIP: ${lqipBuffer.length}B)`);

    return {
        url,
        webpUrl,
        lqip,
        width: avifMeta.width || targetWidth,
        height: avifMeta.height || Math.round(targetWidth * (originalHeight / originalWidth)),
        key: avifKey,
    };
}

/**
 * Process an image from a URL (e.g. Unsplash, pasted link).
 * Fetches the image, processes it, and uploads to Spaces.
 */
export async function processImageFromUrl(
    imageUrl: string,
    folder: string = 'blog',
    maxWidth: number = 1200,
): Promise<ProcessedImage> {
    console.log(`📥 Fetching image from URL: ${imageUrl.slice(0, 80)}...`);

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return processAndUploadImage(buffer, folder, maxWidth);
}

/**
 * Delete an image from Spaces (both AVIF and WebP).
 */
export async function deleteImage(key: string): Promise<void> {
    const webpKey = key.replace(/\.avif$/, '.webp');

    await Promise.all([
        s3.send(new DeleteObjectCommand({ Bucket: SPACES_BUCKET, Key: key })),
        s3.send(new DeleteObjectCommand({ Bucket: SPACES_BUCKET, Key: webpKey })),
    ]).catch(err => console.warn('⚠️ Image delete failed:', err));
}
