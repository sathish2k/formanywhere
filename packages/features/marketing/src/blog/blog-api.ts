/**
 * Blog API Client — connects frontend to Elysia backend blog endpoints.
 * Lives in @formanywhere/marketing so all blog features are self-contained.
 */

let _apiUrl = '';

/** Configure the API base URL. Call once at app startup. */
export function configureBlogApi(apiUrl: string) {
    _apiUrl = apiUrl.replace(/\/$/, '');
}

function getApiUrl(): string {
    if (!_apiUrl) {
        // Fallback: try import.meta.env if available (works in Vite/Vinxi apps)
        try {
            _apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
        } catch {
            _apiUrl = 'http://localhost:3001';
        }
    }
    return _apiUrl;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    tags: string[];
    category: string | null;
    audioUrl: string | null;
    viewCount: number;
    trustScore: number;
    socialMediaPosts: SocialMediaPosts | null;
    citations: Citation[];
    status: string;
    publishedAt: string;
    createdAt: string;
}

/** Lightweight blog item returned by the list endpoint (no full content) */
export interface BlogListItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    tags: string[];
    category: string | null;
    viewCount: number;
    publishedAt: string;
    socialMediaPosts: SocialMediaPosts | null;
}

export interface BlogListParams {
    page?: number;
    limit?: number;
    sort?: 'latest' | 'trending' | 'most-viewed';
    category?: 'tech' | 'non-tech' | 'all';
    tag?: string;
    search?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface BlogListResponse {
    blogs: BlogListItem[];
    pagination: PaginationInfo;
}

export interface Citation {
    title: string;
    url: string;
    claim?: string;
}

export interface SocialMediaPosts {
    twitterThread?: string[];
    linkedInPost?: string;
    newsletter?: string;
    author?: string;
}

export interface ChatResponse {
    answer: string;
}

export interface ModeResponse {
    content: string;
    mode: string;
}

export interface AudioResponse {
    audioUrl?: string;
    script?: string;
    method: string;
}

export interface TrustResponse {
    trustScore: number;
    citations: Citation[];
    warnings?: string[];
}

export interface ViewResponse {
    counted: boolean;
    views: number;
}

/** Fetch paginated blog list with filtering & sorting */
export async function fetchBlogs(params: BlogListParams = {}): Promise<BlogListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.search) searchParams.set('search', params.search);

    const qs = searchParams.toString();
    const url = `${getApiUrl()}/api/blogs${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
}

/** Fetch a single blog post by slug */
export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}`);
    if (!res.ok) throw new Error('Blog not found');
    return res.json();
}

/** Record a view for a blog post (YouTube-style unique counting) */
export async function recordBlogView(slug: string): Promise<ViewResponse> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/view`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to record view');
    return res.json();
}

/** Feature 1: Chat with article */
export async function chatWithArticle(slug: string, question: string): Promise<ChatResponse> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
}

/** Feature 3: Generate audio */
export async function generateAudio(slug: string): Promise<AudioResponse> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/generate-audio`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Audio generation failed');
    return res.json();
}

/** Feature 4: Get reading mode */
export async function getReadingMode(slug: string, mode: string): Promise<ModeResponse> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
    });
    if (!res.ok) throw new Error('Mode switch failed');
    return res.json();
}

/** Feature 5: Get social media posts */
export async function getSocialPosts(slug: string): Promise<SocialMediaPosts> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/social`);
    if (!res.ok) throw new Error('Social posts fetch failed');
    return res.json();
}

/** Feature 6: Get trust score & citations */
export async function getTrustData(slug: string): Promise<TrustResponse> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/trust`);
    if (!res.ok) throw new Error('Trust data fetch failed');
    return res.json();
}

/** Feature 6: Verify & regenerate citations */
export async function verifyArticle(slug: string): Promise<TrustResponse> {
    const res = await fetch(`${getApiUrl()}/api/blogs/${slug}/verify`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Verification failed');
    return res.json();
}
