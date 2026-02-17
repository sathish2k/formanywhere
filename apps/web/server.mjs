/**
 * Production server with gzip compression
 * Uses Astro @astrojs/node in middleware mode + Node.js native compression
 */
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, existsSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the Astro handler (middleware mode doesn't auto-start)
const { handler } = await import('./dist/server/entry.mjs');

const PORT = parseInt(process.env.PORT || '4321');
const HOST = process.env.HOST || '0.0.0.0';

// MIME types for static files
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
};

const COMPRESSIBLE = /^(text\/(html|css|javascript|xml|plain)|application\/(javascript|json|xml|xhtml\+xml)|image\/svg\+xml)/;

const clientDir = join(__dirname, 'dist', 'client');

function getExt(path) {
    const i = path.lastIndexOf('.');
    return i > 0 ? path.substring(i) : '';
}

// Pre-compress cache for static files
const compressCache = new Map();

function serveStatic(req, res, pathname) {
    let filePath = join(clientDir, pathname);
    
    // Handle directory indexes
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, 'index.html');
    }
    
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        return false;
    }
    
    const ext = getExt(filePath);
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const content = readFileSync(filePath);
    
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldCompress = COMPRESSIBLE.test(mime) && acceptEncoding.includes('gzip') && content.length > 1024;
    
    // Cache static assets with hashed filenames for 1 year
    const isHashed = pathname.startsWith('/_astro/');
    const cacheControl = isHashed ? 'public, max-age=31536000, immutable' : 'public, max-age=0';
    
    if (shouldCompress) {
        let compressed = compressCache.get(filePath);
        if (!compressed) {
            compressed = gzipSync(content);
            if (isHashed) compressCache.set(filePath, compressed);
        }
        res.writeHead(200, {
            'Content-Type': mime,
            'Content-Encoding': 'gzip',
            'Content-Length': compressed.length,
            'Cache-Control': cacheControl,
            'Vary': 'Accept-Encoding',
        });
        res.end(compressed);
    } else {
        res.writeHead(200, {
            'Content-Type': mime,
            'Content-Length': content.length,
            'Cache-Control': cacheControl,
        });
        res.end(content);
    }
    return true;
}

const server = createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    
    // Try static files first
    if (serveStatic(req, res, pathname)) return;
    
    // For SSR routes, delegate to Astro handler
    handler(req, res);
});

server.listen(PORT, HOST, () => {
    console.log(`Server with compression listening on http://${HOST}:${PORT}`);
});
