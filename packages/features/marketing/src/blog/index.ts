/**
 * Blog feature — barrel export
 * All blog components, API client, and types in one place.
 */

// API client & types
export {
  configureBlogApi,
  fetchBlogs,
  fetchBlogBySlug,
  recordBlogView,
} from './blog-api';

export type {
  BlogPost as ApiBlogPost,
  BlogListItem,
  BlogListParams,
  BlogListResponse,
  PaginationInfo,
  ViewResponse,
} from './blog-api';

// UI components
export { BlogCard } from './blog-card';
export type { BlogPost } from './blog-card';

// Skeleton loader (lightweight — no heavy deps)
export { BlogSkeleton } from './blog-skeleton';

// Lightweight blog-only icon (~700 B vs 19 KB full Icon)
export { BlogIcon } from './blog-icon';
export type { BlogIconProps } from './blog-icon';
