import { createResource, createSignal, For, Show } from 'solid-js';
import { Title } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { HStack, VStack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Card } from '@formanywhere/ui/card';
import { TextField } from '@formanywhere/ui/textfield';
import { CircularProgress } from '@formanywhere/ui/progress';
import { BlogCard, BlogPost } from '@formanywhere/marketing';
import { fetchBlogs, type ApiBlogPost } from '@formanywhere/marketing/blog';

/** Map API blog posts to the BlogCard-expected format */
function toBlogCardPost(api: ApiBlogPost): BlogPost {
  const wordCount = api.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    excerpt: api.excerpt || api.seoDescription || '',
    author: {
      name: 'FormAnywhere AI',
      avatarUrl: `https://i.pravatar.cc/150?u=${api.slug}`,
    },
    publishedAt: new Date(api.publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    readTime: `${Math.max(1, Math.ceil(wordCount / 250))} min`,
    tags: api.tags || [],
    thumbnailUrl: api.coverImage || undefined,
    aiSummary: api.excerpt || undefined,
    audioUrl: api.audioUrl || undefined,
  };
}

const FORM_STATS = [
  { label: 'Forms Created', value: '12,500+', icon: 'file-text' as const },
  { label: 'Submissions Collected', value: '1.2M+', icon: 'check-circle' as const },
  { label: 'Templates Available', value: '50+', icon: 'layers' as const },
];

const QUICK_LINKS = [
  { label: 'Getting Started Guide', href: '/blog/getting-started', icon: 'rocket' as const },
  { label: 'Form Design Best Practices', href: '/blog/form-design-tips', icon: 'pen-tool' as const },
  { label: 'AI Form Builder Tutorial', href: '/blog/ai-form-builder', icon: 'sparkle' as const },
  { label: 'Integrations & Webhooks', href: '/blog/integrations', icon: 'workflow' as const },
];

export default function BlogList() {
  const [activeTab, setActiveTab] = createSignal('Latest');
  const tabs = ['Latest', 'Trending', 'Recommended'];

  const [apiPosts] = createResource(fetchBlogs);
  const posts = () => (apiPosts() || []).map(toBlogCardPost);

  return (
    <Box
      padding="xl"
      maxWidth="xl"
      style={{ margin: '0 auto', background: 'var(--md-sys-color-surface, #F8F9FA)', 'min-height': '100vh' }}
    >
      <Title>Blog - FormAnywhere</Title>

      {/* Header */}
      <HStack align="center" justify="between" style={{ 'margin-bottom': '48px' }}>
        <Typography
          variant="display-medium"
          style={{ 'font-weight': '900', 'letter-spacing': '-0.02em', color: 'var(--md-sys-color-on-surface)' }}
        >
          Explore
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Search articles..."
          leadingIcon={<Icon name="search" />}
          size="sm"
          style={{ width: '300px' }}
        />
      </HStack>

      <HStack gap="xl" align="start">
        {/* Main Content Area */}
        <Box style={{ flex: '1' }}>
          {/* Tabs */}
          <HStack gap="lg" style={{ 'margin-bottom': '32px', 'border-bottom': '2px solid var(--md-sys-color-outline-variant, #E5E5E5)' }}>
            <For each={tabs}>
              {(tab) => (
                <Box
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0 0 16px 0',
                    cursor: 'pointer',
                    position: 'relative',
                    color: activeTab() === tab ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)',
                    'font-weight': activeTab() === tab ? 'bold' : '500',
                    'font-size': '1.125rem',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {tab}
                  {activeTab() === tab && (
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--md-sys-color-on-surface)',
                        'border-radius': '2px 2px 0 0',
                      }}
                    />
                  )}
                </Box>
              )}
            </For>
          </HStack>

          {/* Loading */}
          <Show when={apiPosts.loading}>
            <HStack gap="sm" align="center" justify="center" style={{ padding: '48px' }}>
              <CircularProgress indeterminate size={24} />
              <Typography variant="body-large" color="on-surface-variant">
                Loading articles...
              </Typography>
            </HStack>
          </Show>

          {/* Error */}
          <Show when={apiPosts.error}>
            <Typography variant="body-large" color="on-surface-variant" align="center" style={{ padding: '48px' }}>
              Unable to load articles. Please try again later.
            </Typography>
          </Show>

          {/* Empty */}
          <Show when={!apiPosts.loading && !apiPosts.error && posts().length === 0}>
            <VStack align="center" gap="sm" style={{ padding: '48px' }}>
              <Typography variant="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                No articles yet
              </Typography>
              <Typography variant="body-large" color="on-surface-variant">
                Our AI writes fresh articles every day at 4:00 AM. Check back soon!
              </Typography>
            </VStack>
          </Show>

          {/* Masonry Grid */}
          <Box style={{ 'column-count': '2', 'column-gap': '24px' }}>
            <For each={posts()}>
              {(post) => (
                <Box style={{ 'break-inside': 'avoid', 'margin-bottom': '24px' }}>
                  <BlogCard post={post} />
                </Box>
              )}
            </For>
          </Box>
        </Box>

        {/* Sidebar */}
        <VStack gap="lg" style={{ width: '320px', 'flex-shrink': '0', position: 'sticky', top: '24px' }}>

          {/* Popular Topics */}
          <Card variant="elevated" padding="lg">
            <Typography
              variant="title-large"
              style={{ 'font-weight': 'bold', 'margin-bottom': '16px', color: 'var(--md-sys-color-on-surface)' }}
            >
              Popular Topics
            </Typography>
            <HStack gap="sm" style={{ 'flex-wrap': 'wrap' }}>
              <Show when={posts().length > 0} fallback={
                <For each={['AI Forms', 'Productivity', 'Design', 'No-Code', 'Analytics', 'Automation']}>
                  {(tag) => (
                    <Button variant="tonal" size="sm" style={{ 'border-radius': '999px' }}>
                      {tag}
                    </Button>
                  )}
                </For>
              }>
                <For each={[...new Set(posts().flatMap(p => p.tags))].slice(0, 8)}>
                  {(tag) => (
                    <Button variant="tonal" size="sm" style={{ 'border-radius': '999px' }}>
                      {tag}
                    </Button>
                  )}
                </For>
              </Show>
            </HStack>
          </Card>

          {/* Platform Stats */}
          <Card variant="elevated" padding="lg">
            <Typography
              variant="title-large"
              style={{ 'font-weight': 'bold', 'margin-bottom': '16px', color: 'var(--md-sys-color-on-surface)' }}
            >
              FormAnywhere in Numbers
            </Typography>
            <VStack gap="md">
              <For each={FORM_STATS}>
                {(stat) => (
                  <HStack gap="sm" align="center">
                    <Box
                      style={{
                        width: '40px',
                        height: '40px',
                        'border-radius': '12px',
                        background: 'var(--md-sys-color-primary-container, #E8DEF8)',
                        display: 'flex',
                        'align-items': 'center',
                        'justify-content': 'center',
                        'flex-shrink': '0',
                      }}
                    >
                      <Icon name={stat.icon} size={20} color="var(--md-sys-color-primary, #6750A4)" />
                    </Box>
                    <VStack>
                      <Typography variant="title-medium" style={{ 'font-weight': 'bold', color: 'var(--md-sys-color-on-surface)' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body-small" color="on-surface-variant">
                        {stat.label}
                      </Typography>
                    </VStack>
                  </HStack>
                )}
              </For>
            </VStack>
          </Card>

          {/* Quick Links */}
          <Card variant="elevated" padding="lg">
            <Typography
              variant="title-large"
              style={{ 'font-weight': 'bold', 'margin-bottom': '16px', color: 'var(--md-sys-color-on-surface)' }}
            >
              Quick Links
            </Typography>
            <VStack gap="sm">
              <For each={QUICK_LINKS}>
                {(link) => (
                  <HStack
                    gap="sm"
                    align="center"
                    style={{
                      padding: '10px 12px',
                      'border-radius': '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <Icon name={link.icon} size={18} color="var(--md-sys-color-primary, #6750A4)" />
                    <Typography variant="body-medium" style={{ 'font-weight': '500' }}>
                      {link.label}
                    </Typography>
                    <Box style={{ 'margin-left': 'auto' }}>
                      <Icon name="chevron-right" size={16} color="var(--md-sys-color-on-surface-variant)" />
                    </Box>
                  </HStack>
                )}
              </For>
            </VStack>
          </Card>

          {/* CTA Card */}
          <Card
            variant="filled"
            padding="lg"
            style={{
              background: 'linear-gradient(135deg, var(--md-sys-color-primary, #6750A4), var(--md-sys-color-tertiary, #7D5260))',
              color: 'white',
            }}
          >
            <VStack gap="md" align="center">
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
            </VStack>
          </Card>

        </VStack>
      </HStack>
    </Box>
  );
}
