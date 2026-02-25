import { createResource, createSignal, Show, createEffect, lazy, Suspense, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Title, Meta, Link } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Divider } from '@formanywhere/ui/divider';
import { Avatar } from '@formanywhere/ui/avatar';
import { Chip } from '@formanywhere/ui/chip';
import { IconButton } from '@formanywhere/ui/icon-button';
import { fetchBlogBySlug, recordBlogView, BlogSkeleton, BlogIcon } from '@formanywhere/marketing/blog';
import '~/styles/blog-content.scss';

// ── Lazy-load heavy feature components (small UI components are eager) ──

const ReadingModes = lazy(() =>
  import('@formanywhere/marketing/blog').then((m) => ({ default: m.ReadingModes }))
);
const ArticleChat = lazy(() =>
  import('@formanywhere/marketing/blog').then((m) => ({ default: m.ArticleChat }))
);
const CitationsPanel = lazy(() =>
  import('@formanywhere/marketing/blog').then((m) => ({ default: m.CitationsPanel }))
);
const SocialSyndication = lazy(() =>
  import('@formanywhere/marketing/blog').then((m) => ({ default: m.SocialSyndication }))
);

/**
 * Lazy-load Prism.js only when the content contains code blocks.
 * Prism core (7.5 KB min) + 8 grammars (22 KB) + theme (1.8 KB) ≈ ~10 KB gzipped
 * vs highlight.js ~31 KB gzipped — 67% smaller.
 */
async function highlightCodeBlocks(container: HTMLElement) {
  const codeBlocks = container.querySelectorAll('pre code');
  if (codeBlocks.length === 0) return;

  const Prism = (await import('prismjs')).default;

  // Load grammars — order matters (some depend on others)
  await import('prismjs/components/prism-markup');
  await import('prismjs/components/prism-css');
  await import('prismjs/components/prism-javascript');
  await import('prismjs/components/prism-typescript');
  await import('prismjs/components/prism-python');
  await import('prismjs/components/prism-json');
  await import('prismjs/components/prism-bash');
  await import('prismjs/components/prism-sql');

  // Theme CSS
  await import('prismjs/themes/prism-tomorrow.css');

  // Map language class names to Prism grammar keys
  const langMap: Record<string, string> = {
    javascript: 'javascript', js: 'javascript',
    typescript: 'typescript', ts: 'typescript',
    python: 'python', py: 'python',
    css: 'css', html: 'markup', xml: 'markup',
    json: 'json', bash: 'bash', shell: 'bash', sql: 'sql',
  };

  codeBlocks.forEach((block) => {
    if (block.getAttribute('data-highlighted')) return;

    // Extract language from class="language-xxx"
    const cls = block.className.match(/language-(\w+)/);
    const lang = cls ? langMap[cls[1]] || cls[1] : '';
    const grammar = lang ? Prism.languages[lang] : null;

    if (grammar) {
      const html = Prism.highlight(block.textContent || '', grammar, lang);
      block.innerHTML = html;
    }

    block.setAttribute('data-highlighted', 'true');
  });
}

export default function BlogRead() {
  const params = useParams();

  const formatViews = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  };

  const [post] = createResource(() => params.slug, fetchBlogBySlug);
  const [contentRef, setContentRef] = createSignal<HTMLElement | undefined>();
  const [modeContent, setModeContent] = createSignal<string | null>(null);
  const [viewCount, setViewCount] = createSignal<number | null>(null);

  // Record a view when the blog loads (YouTube-style unique counting)
  createEffect(() => {
    const slug = post()?.slug;
    if (!slug) return;
    recordBlogView(slug)
      .then((res) => setViewCount(res.views))
      .catch(() => setViewCount(post()?.viewCount || 0));
  });

  const displayContent = () => modeContent() || post()?.content || '';

  // Highlight code blocks after content renders (lazy-loaded)
  createEffect(() => {
    const ref = contentRef();
    const content = displayContent();
    if (!ref || !content) return;
    requestAnimationFrame(() => {
      highlightCodeBlocks(ref);
    });
  });

  // Initialize AdSense in-article ad slots after content renders
  createEffect(() => {
    const ref = contentRef();
    const content = displayContent();
    if (!ref || !content) return;
    requestAnimationFrame(() => {
      try {
        const adSlots = ref.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
        adSlots.forEach(() => {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        });
      } catch { /* AdSense not loaded or blocked */ }
    });
  });

  // Load AdSense script once on mount (async, non-blocking)
  onMount(() => {
    const adClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
    if (!adClientId || typeof document === 'undefined') return;
    if (document.querySelector('script[src*="adsbygoogle"]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;
    document.head.appendChild(script);
  });



  return (
    <>
      {/* ── Skeleton: renders instantly, zero-wait ── */}
      <Show when={post.loading}>
        <BlogSkeleton />
      </Show>

      {/* ── Error state ── */}
      <Show when={post.error}>
        <Box padding="xl" style={{ "max-width": '800px', margin: '0 auto' }}>
          <Typography variant="body-large" style={{ color: 'var(--md-sys-color-error)' }}>
            Error loading post.
          </Typography>
        </Box>
      </Show>

      {/* ── Content: only mounts after data arrives ── */}
      <Show when={post()}>
        <Box padding="xl" style={{ "max-width": '800px', margin: '0 auto' }}>
          <article>
            <Title>{post()?.seoTitle || post()?.title} - FormAnywhere Blog</Title>
            <Meta name="description" content={post()?.seoDescription || post()?.excerpt || ''} />
            <Meta property="og:type" content="article" />
            <Meta property="og:title" content={post()?.seoTitle || post()?.title || ''} />
            <Meta property="og:description" content={post()?.seoDescription || post()?.excerpt || ''} />
            <Meta property="og:image" content={post()?.coverImage || 'https://formanywhere.com/logos/og-default.png'} />
            <Meta property="og:url" content={`https://formanywhere.com/blog/${post()?.slug}`} />
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta name="twitter:title" content={post()?.seoTitle || post()?.title || ''} />
            <Meta name="twitter:description" content={post()?.seoDescription || post()?.excerpt || ''} />
            <Meta name="twitter:image" content={post()?.coverImage || 'https://formanywhere.com/logos/og-default.png'} />
            <Link rel="canonical" href={`https://formanywhere.com/blog/${post()?.slug}`} />

            <Typography
              variant="display-small"
              style={{
                "font-weight": '900',
                "margin-bottom": '24px',
                "line-height": '1.2',
                "letter-spacing": '-0.02em',
              }}
            >
              {post()?.title}
            </Typography>

            {/* Author row */}
            <Box
              style={{
                display: 'flex',
                "align-items": 'center',
                "justify-content": 'space-between',
                "margin-bottom": '32px',
                "flex-wrap": 'wrap',
                gap: '16px',
              }}
            >
              <Box style={{ display: 'flex', "align-items": 'center', gap: '16px' }}>
                <Avatar src={`https://i.pravatar.cc/150?u=${post()?.slug}`} alt={post()?.socialMediaPosts?.author || 'FormAnywhere'} size="md" />
                <Box style={{ display: 'flex', "flex-direction": 'column' }}>
                  <Typography variant="label-large" style={{ color: 'var(--md-sys-color-on-surface)', "font-weight": 'bold' }}>
                    {post()?.socialMediaPosts?.author || 'FormAnywhere'}
                  </Typography>
                  <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {post()?.publishedAt}
                    {viewCount() !== null && ` · ${formatViews(viewCount()!)} views`}
                  </Typography>
                </Box>
              </Box>

              <Box style={{ display: 'flex', gap: '8px', "align-items": 'center' }}>
                <IconButton variant="standard" icon={<BlogIcon name="share" />} onClick={() => navigator.clipboard.writeText(window.location.href)} />
              </Box>
            </Box>

            {/* AI Summary Box */}
            <Show when={post()?.excerpt}>
              <Box
                style={{
                  background: 'var(--md-sys-color-surface-container-low)',
                  padding: '24px',
                  "border-radius": '16px',
                  "margin-bottom": '32px',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  display: 'flex',
                  gap: '16px',
                  "align-items": 'flex-start',
                }}
              >
                <Box style={{ background: 'var(--md-sys-color-primary-container)', padding: '8px', "border-radius": '50%', display: 'flex' }}>
                  <BlogIcon name="sparkle" style={{ color: 'var(--md-sys-color-on-primary-container)' }} />
                </Box>
                <Box>
                  <Typography variant="title-medium" style={{ "font-weight": 'bold', "margin-bottom": '8px' }}>
                    AI Summary
                  </Typography>
                  <Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', "line-height": '1.6' }}>
                    {post()?.excerpt}
                  </Typography>
                </Box>
              </Box>
            </Show>

            {/* Cover image */}
            <Show when={post()?.coverImage}>
              <img
                src={post()!.coverImage!}
                alt={post()?.title}
                loading="lazy"
                decoding="async"
                width={800}
                height={450}
                style={{
                  width: '100%',
                  height: 'auto',
                  "max-height": '500px',
                  "object-fit": 'cover',
                  "border-radius": '16px',
                  "margin-bottom": '48px',
                  "box-shadow": '0 8px 32px rgba(0,0,0,0.08)',
                  "aspect-ratio": '16 / 9',
                }}
              />
            </Show>

            {/* Reading Modes (lazy) */}
            <Suspense>
              <ReadingModes
                slug={post()!.slug}
                originalContent={post()!.content}
                onContentChange={(html: string) => setModeContent(html)}
              />
            </Suspense>

            {/* Blog content */}
            <Box
              ref={(el) => setContentRef(el)}
              class="blog-content"
              innerHTML={displayContent()}
            />

            <Divider style={{ "margin-bottom": '32px' }} />

            {/* Tags */}
            <Show when={post()?.tags?.length}>
              <Box
                style={{
                  display: 'flex',
                  "align-items": 'center',
                  "margin-bottom": '48px',
                  "flex-wrap": 'wrap',
                  gap: '8px',
                }}
              >
                {post()?.tags.map((tag: string) => (
                  <Chip label={tag} variant="assist" />
                ))}
              </Box>
            </Show>

            {/* Citations & Trust Score (lazy) */}
            <Suspense>
              <CitationsPanel slug={post()!.slug} trustScore={post()?.trustScore || 0} citations={post()?.citations || []} />
            </Suspense>

            {/* Social Syndication (lazy) */}
            <Suspense>
              <SocialSyndication slug={post()!.slug} socialData={post()?.socialMediaPosts || undefined} />
            </Suspense>
          </article>
        </Box>

        {/* AI Chat FAB (lazy) */}
        <Suspense>
          <ArticleChat slug={post()!.slug} />
        </Suspense>
      </Show>
    </>
  );
}