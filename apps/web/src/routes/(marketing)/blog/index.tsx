import { createResource, createSignal, createMemo, For, Show } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { Title } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Card } from '@formanywhere/ui/card';
import { TextField } from '@formanywhere/ui/textfield';
import { CircularProgress } from '@formanywhere/ui/progress';
import { Chip } from '@formanywhere/ui/chip';
import { BlogCard, type BlogPost } from '@formanywhere/marketing';
import {
  fetchBlogs,
  type BlogListItem,
  type BlogListParams,
  type BlogListResponse,
} from '@formanywhere/marketing/blog';

/** Map API blog list items to the BlogCard-expected format */
function toBlogCardPost(api: BlogListItem): BlogPost {
  const author = 'FormAnywhere';
  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    excerpt: api.excerpt || '',
    author: {
      name: author,
      avatarUrl: `https://i.pravatar.cc/150?u=${api.slug}`,
    },
    publishedAt: new Date(api.publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    readTime: '',
    tags: (api.tags as string[]) || [],
    thumbnailUrl: api.coverImage || undefined,
    viewCount: api.viewCount || 0,
  };
}

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'trending', label: 'Trending' },
  { value: 'most-viewed', label: 'Most Viewed' },
] as const;

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'tech', label: 'Tech' },
  { value: 'non-tech', label: 'Non-Tech' },
] as const;

const QUICK_LINKS = [
  { label: 'Getting Started Guide', href: '/blog/getting-started', icon: 'rocket' as const },
  { label: 'Form Design Best Practices', href: '/blog/form-design-tips', icon: 'pen-tool' as const },
  { label: 'AI Form Builder Tutorial', href: '/blog/ai-form-builder', icon: 'sparkle' as const },
  { label: 'Integrations & Webhooks', href: '/blog/integrations', icon: 'workflow' as const },
];

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Reactive query params ──
  const page = () => Math.max(1, Number(searchParams.page) || 1);
  const sort = () => (searchParams.sort as BlogListParams['sort']) || 'latest';
  const category = () => (searchParams.category as BlogListParams['category']) || 'all';
  const tag = () => (searchParams.tag as string) || '';
  const search = () => (searchParams.search as string) || '';

  // Build fetch params key for createResource reactivity
  const fetchParams = createMemo<BlogListParams>(() => ({
    page: page(),
    limit: 12,
    sort: sort(),
    category: category(),
    tag: tag(),
    search: search(),
  }));

  const [data] = createResource(fetchParams, fetchBlogs);
  const blogs = () => data()?.blogs || [];
  const pagination = () => data()?.pagination;
  const posts = () => blogs().map(toBlogCardPost);

  // ── Search with debounce ──
  let searchTimeout: ReturnType<typeof setTimeout>;
  const [searchInput, setSearchInput] = createSignal(search());
  const handleSearch = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setSearchParams({ search: value || undefined, page: '1' });
    }, 400);
  };

  const setSort = (s: string) => setSearchParams({ sort: s, page: '1' });
  const setCategory = (c: string) => setSearchParams({ category: c, page: '1' });
  const setTag = (t: string) => setSearchParams({ tag: t || undefined, page: '1' });
  const goToPage = (p: number) => setSearchParams({ page: String(p) });

  // Collect all unique tags from current results for the sidebar
  const allTags = createMemo(() => {
    const tagSet = new Set<string>();
    blogs().forEach((b) => ((b.tags as string[]) || []).forEach((t) => tagSet.add(t)));
    return [...tagSet].slice(0, 12);
  });

  const formatCount = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  };

  return (
    <Box
      padding="xl"
      maxWidth="xl"
      style={{ margin: '0 auto', background: 'var(--m3-color-surface)', 'min-height': '100vh' }}
    >
      <Title>Blog - FormAnywhere</Title>

      {/* ── Header ── */}
      <Stack direction="row" align="center" justify="between" style={{ 'margin-bottom': '32px', 'flex-wrap': 'wrap', gap: '16px' }}>
        <Typography
          variant="display-medium"
          style={{ 'font-weight': '900', 'letter-spacing': '-0.02em', color: 'var(--m3-color-on-surface)' }}
        >
          Explore
        </Typography>

        <Box style={{ width: '320px' }}>
          <TextField
            variant="outlined"
            placeholder="Search articles..."
            leadingIcon={<Icon name="search" />}
            size="sm"
            value={searchInput()}
            onInput={(e: any) => handleSearch(e.target?.value || '')}
          />
        </Box>
      </Stack>

      {/* ── Category + Sort bar ── */}
      <Stack direction="row" gap="md" align="center" justify="between" style={{ 'margin-bottom': '32px', 'flex-wrap': 'wrap' }}>
        <Stack direction="row" gap="sm">
          <For each={CATEGORY_OPTIONS}>
            {(opt) => (
              <Chip
                label={opt.label}
                variant="filter"
                selected={category() === opt.value}
                onClick={() => setCategory(opt.value)}
              />
            )}
          </For>
        </Stack>

        <Stack direction="row" gap="sm">
          <For each={SORT_OPTIONS}>
            {(opt) => (
              <Chip
                label={opt.label}
                variant="filter"
                selected={sort() === opt.value}
                onClick={() => setSort(opt.value)}
              />
            )}
          </For>
        </Stack>
      </Stack>

      {/* ── Active tag filter indicator ── */}
      <Show when={tag()}>
        <Stack direction="row" gap="sm" align="center" style={{ 'margin-bottom': '24px' }}>
          <Typography variant="body-medium" style={{ color: 'var(--m3-color-on-surface-variant)' }}>
            Filtered by tag:
          </Typography>
          <Chip label={tag()} variant="input" onRemove={() => setTag('')} />
        </Stack>
      </Show>

      <Stack direction="row" gap="xl" align="start">
        {/* ── Main Content Area ── */}
        <Box style={{ flex: '1', 'min-width': '0' }}>

          {/* Loading */}
          <Show when={data.loading}>
            <Stack direction="row" gap="sm" align="center" justify="center" style={{ padding: '48px' }}>
              <CircularProgress indeterminate size={24} />
              <Typography variant="body-large" color="on-surface-variant">
                Loading articles...
              </Typography>
            </Stack>
          </Show>

          {/* Error */}
          <Show when={data.error}>
            <Typography variant="body-large" color="on-surface-variant" align="center" style={{ padding: '48px' }}>
              Unable to load articles. Please try again later.
            </Typography>
          </Show>

          {/* Empty */}
          <Show when={!data.loading && !data.error && posts().length === 0}>
            <Stack align="center" gap="sm" style={{ padding: '48px' }}>
              <Typography variant="title-large" style={{ color: 'var(--m3-color-on-surface)' }}>
                No articles found
              </Typography>
              <Typography variant="body-large" color="on-surface-variant">
                {search() ? `No results for "${search()}". Try a different search.` : 'Our AI writes fresh articles every day. Check back soon!'}
              </Typography>
            </Stack>
          </Show>

          {/* ── Blog Grid ── */}
          <Show when={posts().length > 0}>
            <Box style={{ 'column-count': '2', 'column-gap': '24px' }}>
              <For each={posts()}>
                {(post) => (
                  <Box style={{ 'break-inside': 'avoid', 'margin-bottom': '24px' }}>
                    <BlogCard post={post} />
                  </Box>
                )}
              </For>
            </Box>
          </Show>

          {/* ── Pagination ── */}
          <Show when={pagination() && pagination()!.totalPages > 1}>
            <Stack direction="row" gap="sm" align="center" justify="center" style={{ 'margin-top': '48px', 'margin-bottom': '32px', 'flex-wrap': 'wrap' }}>
              <Button
                variant="outlined"
                size="sm"
                disabled={!pagination()!.hasPrev}
                onClick={() => goToPage(page() - 1)}
                icon={<Icon name="chevron-left" size={16} />}
              >
                Previous
              </Button>

              <For each={getPaginationRange(page(), pagination()!.totalPages)}>
                {(p) => (
                  <Show
                    when={p !== '...'}
                    fallback={
                      <Typography variant="body-medium" style={{ padding: '0 4px', color: 'var(--m3-color-on-surface-variant)' }}>
                        ...
                      </Typography>
                    }
                  >
                    <Button
                      variant={page() === Number(p) ? 'filled' : 'outlined'}
                      size="sm"
                      onClick={() => goToPage(Number(p))}
                      style={{ 'min-width': '40px' }}
                    >
                      {p}
                    </Button>
                  </Show>
                )}
              </For>

              <Button
                variant="outlined"
                size="sm"
                disabled={!pagination()!.hasNext}
                onClick={() => goToPage(page() + 1)}
                trailingIcon={<Icon name="chevron-right" size={16} />}
              >
                Next
              </Button>
            </Stack>

            <Typography variant="body-small" align="center" style={{ color: 'var(--m3-color-on-surface-variant)', 'margin-bottom': '32px' }}>
              Showing {((page() - 1) * (pagination()!.limit)) + 1}–{Math.min(page() * pagination()!.limit, pagination()!.totalCount)} of {formatCount(pagination()!.totalCount)} articles
            </Typography>
          </Show>
        </Box>

        {/* ── Sidebar ── */}
        <Stack gap="lg" style={{ width: '320px', 'flex-shrink': '0', position: 'sticky', top: '24px' }}>

          {/* Popular Topics */}
          <Card variant="elevated" padding="lg">
            <Typography
              variant="title-large"
              style={{ 'font-weight': 'bold', 'margin-bottom': '16px', color: 'var(--m3-color-on-surface)' }}
            >
              Popular Topics
            </Typography>
            <Stack direction="row" gap="sm" style={{ 'flex-wrap': 'wrap' }}>
              <Show when={allTags().length > 0} fallback={
                <For each={['AI', 'Tech', 'Apple', 'Samsung', 'Google', 'Startups']}>
                  {(t) => (
                    <Button variant="tonal" size="sm" style={{ 'border-radius': '999px' }} onClick={() => setTag(t)}>
                      {t}
                    </Button>
                  )}
                </For>
              }>
                <For each={allTags()}>
                  {(t) => (
                    <Button
                      variant={tag() === t ? 'filled' : 'tonal'}
                      size="sm"
                      style={{ 'border-radius': '999px' }}
                      onClick={() => setTag(tag() === t ? '' : t)}
                    >
                      {t}
                    </Button>
                  )}
                </For>
              </Show>
            </Stack>
          </Card>

          {/* Quick Links */}
          <Card variant="elevated" padding="lg">
            <Typography
              variant="title-large"
              style={{ 'font-weight': 'bold', 'margin-bottom': '16px', color: 'var(--m3-color-on-surface)' }}
            >
              Quick Links
            </Typography>
            <Stack gap="sm">
              <For each={QUICK_LINKS}>
                {(link) => (
                  <Stack direction="row"
                    gap="sm"
                    align="center"
                    style={{
                      padding: '10px 12px',
                      'border-radius': '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <Icon name={link.icon} size={18} color="var(--m3-color-primary)" />
                    <Typography variant="body-medium" style={{ 'font-weight': '500' }}>
                      {link.label}
                    </Typography>
                    <Box style={{ 'margin-left': 'auto' }}>
                      <Icon name="chevron-right" size={16} color="var(--m3-color-on-surface-variant)" />
                    </Box>
                  </Stack>
                )}
              </For>
            </Stack>
          </Card>

          {/* CTA Card */}
          <Card
            variant="filled"
            padding="lg"
            style={{
              background: 'linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-tertiary))',
              color: 'white',
            }}
          >
            <Stack gap="md" align="center">
              <Icon name="sparkle" size={32} color="white" />
              <Typography
                variant="title-large"
                style={{ 'font-weight': 'bold', color: 'white', 'text-align': 'center' }}
              >
                Build Forms with AI
              </Typography>
              <Typography
                variant="body-medium"
                style={{ color: 'rgba(255,255,255,0.85)', 'text-align': 'center' }}
              >
                Describe your form in plain English and let AI create it for you in seconds.
              </Typography>
              <Button
                variant="elevated"
                href="/dashboard"
                icon={<Icon name="arrow-right" size={18} />}
                style={{ 'margin-top': '4px' }}
              >
                Get Started Free
              </Button>
            </Stack>
          </Card>

        </Stack>
      </Stack>
    </Box>
  );
}

/**
 * Generate pagination range with ellipsis for large page counts.
 * e.g. [1, 2, 3, '...', 98, 99, 100] for page 2 of 100
 */
function getPaginationRange(current: number, total: number): (string | number)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (string | number)[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) pages.push('...');

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  // Always show last page
  if (total > 1) pages.push(total);

  return pages;
}
