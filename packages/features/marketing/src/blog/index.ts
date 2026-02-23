/**
 * Blog feature — barrel export
 * All blog components, API client, and types in one place.
 */

// API client & types
export {
  configureBlogApi,
  fetchBlogs,
  fetchBlogBySlug,
  chatWithArticle,
  generateAudio,
  getReadingMode,
  getSocialPosts,
  getTrustData,
  verifyArticle,
} from './blog-api';

export type {
  BlogPost as ApiBlogPost,
  Citation,
  SocialMediaPosts,
  ChatResponse,
  ModeResponse,
  AudioResponse,
  TrustResponse,
} from './blog-api';

// UI components
export { ArticleChat } from './article-chat';
export { PodcastPlayer } from './podcast-player';
export { ReadingModes } from './reading-modes';
export { SocialSyndication } from './social-syndication';
export { CitationsPanel } from './citations-panel';
export { MermaidRenderer } from './mermaid-renderer';

// Re-export BlogCard (already existed here)
export { BlogCard } from './blog-card';
export type { BlogPost } from './blog-card';
