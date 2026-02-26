// ─── Re-export from new modular structure ───────────────────────────────────
// This file maintains backward compatibility for existing imports.
// New code should import from '../services/blog' instead.

export { generateAndPublishBlog } from './blog/index';
