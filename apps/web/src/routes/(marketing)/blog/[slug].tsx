import { Component, createResource, createSignal, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Title } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Avatar } from '@formanywhere/ui/avatar';
import { Chip } from '@formanywhere/ui/chip';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import { Button } from '@formanywhere/ui/button';
import { BlogPost } from '@formanywhere/marketing';

// Mock fetch function
const fetchPost = async (slug: string): Promise<BlogPost & { content: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    id: '1',
    slug,
    title: 'Capital Confidential: ‘Big Short’ author contemplates taking on Brexit',
    excerpt: 'We are thrilled to announce FormAnywhere, a revolutionary new way to build, manage, and analyze forms across all your platforms.',
    content: `
      <p>Forms are the lifeblood of the internet. They are how we collect leads, gather feedback, process orders, and interact with our users. But for too long, building and managing forms has been a tedious, frustrating process.</p>
      <h2>The Problem with Existing Form Builders</h2>
      <p>Most form builders are either too simple, lacking the advanced features you need, or too complex, requiring a developer to set up and maintain. They lock you into their ecosystem, making it difficult to integrate with your existing tools and workflows.</p>
      <blockquote>
        "The best form builder is the one you don't have to think about." - Jane Doe
      </blockquote>
      <h2>Enter FormAnywhere</h2>
      <p>FormAnywhere is different. We built it from the ground up to be the most powerful, flexible, and easy-to-use form builder on the market. Whether you're a marketer looking to capture more leads, a product manager gathering user feedback, or a developer building complex data collection workflows, FormAnywhere has you covered.</p>
      <h3>Code Example</h3>
      <p>Here is how you can integrate FormAnywhere into your React application:</p>
      <pre><code class="language-javascript">import { FormAnywhere } from '@formanywhere/react';

function App() {
  return (
    &lt;FormAnywhere formId="your-form-id" /&gt;
  );
}</code></pre>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Intuitive Drag-and-Drop Interface:</strong> Build beautiful forms in minutes, no coding required.</li>
        <li><strong>Advanced Conditional Logic:</strong> Create dynamic, personalized experiences for your users.</li>
        <li><strong>Seamless Integrations:</strong> Connect your forms to your favorite tools with just a few clicks.</li>
        <li><strong>Powerful Analytics:</strong> Gain deep insights into your form performance and user behavior.</li>
      </ul>
      <p>We can't wait to see what you build with FormAnywhere. Sign up for a free trial today and experience the future of form building for yourself.</p>
    `,
    author: {
      name: 'Adam Davis',
      avatarUrl: 'https://i.pravatar.cc/150?u=adam',
    },
    publishedAt: 'Mar 16',
    readTime: '1 min',
    tags: ['javascript', 'javascript', 'javascript', 'javascript', 'javascript'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200&h=600',
    aiSummary: 'FormAnywhere is launching a new, intuitive form builder designed to replace clunky legacy systems. It focuses on seamless data collection and cross-platform management.',
    audioUrl: 'mock-audio.mp3',
    mood: '🚀 Exciting',
    engagementScore: 100000,
    commentsCount: 1000000,
    sharesCount: 15000,
    likedBy: [
      { name: 'Yen', avatarUrl: 'https://i.pravatar.cc/150?u=yen' },
      { name: 'User2', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
      { name: 'User3', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
    ]
  };
};

export default function BlogRead() {
  const params = useParams();
  const [post] = createResource(() => params.slug, fetchPost);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [likes, setLikes] = createSignal(0);
  const [isLiked, setIsLiked] = createSignal(false);

  const handleLike = () => {
    if (isLiked()) {
      setLikes(l => l - 1);
      setIsLiked(false);
    } else {
      setLikes(l => l + 1);
      setIsLiked(true);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Box padding="xl" style={{ "max-width": '800px', margin: '0 auto' }}>
      {post.loading && <Typography variant="body-large">Loading...</Typography>}
      {post.error && <Typography variant="body-large" style={{ color: 'var(--md-sys-color-error)' }}>Error loading post.</Typography>}
      
      {post() && (
        <article>
          <Title>{post()?.title} - FormAnywhere Blog</Title>
          
          {/* Mood Badge */}
          <Show when={post()?.mood}>
            <Box style={{ "margin-bottom": '16px' }}>
              <Chip label={post()?.mood!} variant="assist" />
            </Box>
          </Show>

          <Typography variant="display-small" style={{ "font-weight": '900', "margin-bottom": '24px', "line-height": '1.2', "letter-spacing": '-0.02em' }}>
            {post()?.title}
          </Typography>

          <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '32px', "flex-wrap": 'wrap', gap: '16px' }}>
            <Box style={{ display: 'flex', "align-items": 'center', gap: '16px' }}>
              <Avatar src={post()?.author.avatarUrl} alt={post()?.author.name} size="md" />
              <Box style={{ display: 'flex', "flex-direction": 'column' }}>
                <Typography variant="label-large" style={{ color: 'var(--md-sys-color-on-surface)', "font-weight": 'bold' }}>
                  {post()?.author.name}
                </Typography>
                <Box style={{ display: 'flex', gap: '8px', "align-items": 'center' }}>
                  <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {post()?.readTime} read
                  </Typography>
                  <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    ·
                  </Typography>
                  <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {post()?.publishedAt}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box style={{ display: 'flex', gap: '8px', "align-items": 'center' }}>
              <Show when={post()?.audioUrl}>
                <Button
                  variant={isPlaying() ? "filled" : "tonal"}
                  onClick={() => setIsPlaying(!isPlaying())}
                  style={{ "border-radius": '20px', padding: '0 16px', height: '36px' }}
                >
                  <Icon name={isPlaying() ? "pause" : "headset"} style={{ "margin-right": '8px', "font-size": '18px' }} />
                  {isPlaying() ? "Playing..." : "Listen"}
                </Button>
              </Show>
              <IconButton variant="standard" icon={<Icon name="bookmark" />} />
              <IconButton variant="standard" icon={<Icon name="share" />} />
              <IconButton variant="standard" icon={<Icon name="more-vert" />} />
            </Box>
          </Box>

          {/* AI Summary Box */}
          <Show when={post()?.aiSummary}>
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
                <Icon name="sparkle" style={{ color: 'var(--md-sys-color-on-primary-container)' }} />
              </Box>
              <Box>
                <Typography variant="title-medium" style={{ "font-weight": 'bold', "margin-bottom": '8px' }}>
                  AI Summary
                </Typography>
                <Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', "line-height": '1.6' }}>
                  {post()?.aiSummary}
                </Typography>
              </Box>
            </Box>
          </Show>

          {post()?.thumbnailUrl && (
            <img
              src={post()?.thumbnailUrl}
              alt={post()?.title}
              style={{
                width: '100%',
                "max-height": '500px',
                "object-fit": 'cover',
                "border-radius": '16px',
                "margin-bottom": '48px',
                "box-shadow": '0 8px 32px rgba(0,0,0,0.08)',
              }}
            />
          )}

          <style>
            {`
              .blog-content {
                font-size: 1.25rem;
                line-height: 1.8;
                color: var(--md-sys-color-on-surface);
                margin-bottom: 48px;
                font-family: Georgia, serif;
              }
              .blog-content h2 {
                font-size: 2rem;
                font-weight: bold;
                margin-top: 48px;
                margin-bottom: 24px;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .blog-content h3 {
                font-size: 1.5rem;
                font-weight: bold;
                margin-top: 32px;
                margin-bottom: 16px;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .blog-content p {
                margin-bottom: 24px;
              }
              .blog-content ul {
                margin-bottom: 24px;
                padding-left: 24px;
              }
              .blog-content li {
                margin-bottom: 8px;
              }
              .blog-content blockquote {
                border-left: 4px solid var(--md-sys-color-primary);
                padding-left: 24px;
                margin-left: 0;
                margin-right: 0;
                font-style: italic;
                color: var(--md-sys-color-on-surface-variant);
                background: var(--md-sys-color-surface-container-lowest);
                padding: 24px;
                border-radius: 0 16px 16px 0;
              }
              .blog-content pre {
                background: #1E1E1E;
                color: #D4D4D4;
                padding: 24px;
                border-radius: 16px;
                overflow-x: auto;
                margin-bottom: 24px;
                font-family: 'Fira Code', monospace;
                font-size: 1rem;
              }
              .blog-content code {
                font-family: 'Fira Code', monospace;
              }
              .blog-content p code {
                background: var(--md-sys-color-surface-container);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 1rem;
              }
            `}
          </style>

          <Box
            class="blog-content"
            innerHTML={post()?.content}
          />

          <Divider style={{ "margin-bottom": '32px' }} />

          <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '48px', "flex-wrap": 'wrap', gap: '24px' }}>
            <Box style={{ display: 'flex', gap: '8px', "flex-wrap": 'wrap' }}>
              {post()?.tags.map((tag) => (
                <Chip label={tag} variant="assist" />
              ))}
            </Box>

            {/* Engagement / Like Button */}
            <Box
              onClick={handleLike}
              style={{
                display: 'flex',
                "align-items": 'center',
                gap: '8px',
                padding: '8px 16px',
                "border-radius": '24px',
                background: isLiked() ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
                color: isLiked() ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                "box-shadow": isLiked() ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Icon name="favorite" style={{ "font-size": '24px', color: isLiked() ? '#FF3B30' : 'inherit' }} />
              <Typography variant="title-medium" style={{ "font-weight": 'bold' }}>
                {formatNumber((post()?.engagementScore || 0) + likes())} Claps
              </Typography>
            </Box>
          </Box>
        </article>
      )}
    </Box>
  );
}