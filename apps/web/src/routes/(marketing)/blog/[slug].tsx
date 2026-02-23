import { Component, createResource, createSignal, Show, createEffect, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Title } from '@solidjs/meta';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/github-dark.css';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Avatar } from '@formanywhere/ui/avatar';
import { Chip } from '@formanywhere/ui/chip';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import { Button } from '@formanywhere/ui/button';
import {
  fetchBlogBySlug,
  ArticleChat,
  ReadingModes,
  CitationsPanel,
  SocialSyndication,
  MermaidRenderer,
} from '@formanywhere/marketing/blog';


// Register highlight.js languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sql', sql);

export default function BlogRead() {
  const params = useParams();
  const [post] = createResource(() => params.slug, fetchBlogBySlug);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [likes, setLikes] = createSignal(0);
  const [isLiked, setIsLiked] = createSignal(false);
  const [contentRef, setContentRef] = createSignal<HTMLElement | undefined>();
  const [modeContent, setModeContent] = createSignal<string | null>(null);

  const displayContent = () => modeContent() || post()?.content || '';

  // Highlight code blocks after content renders
  createEffect(() => {
    const ref = contentRef();
    const content = displayContent();
    if (!ref || !content) return;
    // Wait for innerHTML to be applied
    requestAnimationFrame(() => {
      ref.querySelectorAll('pre code').forEach((block) => {
        // Skip mermaid blocks and already-highlighted blocks
        if (block.classList.contains('language-mermaid')) return;
        if (block.getAttribute('data-highlighted')) return;
        hljs.highlightElement(block as HTMLElement);
      });
    });
  });

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

          <Typography variant="display-small" style={{ "font-weight": '900', "margin-bottom": '24px', "line-height": '1.2', "letter-spacing": '-0.02em' }}>
            {post()?.title}
          </Typography>

          <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '32px', "flex-wrap": 'wrap', gap: '16px' }}>
            <Box style={{ display: 'flex', "align-items": 'center', gap: '16px' }}>
              <Avatar src={`https://i.pravatar.cc/150?u=${post()?.slug}`} alt="FormAnywhere AI" size="md" />
              <Box style={{ display: 'flex', "flex-direction": 'column' }}>
                <Typography variant="label-large" style={{ color: 'var(--md-sys-color-on-surface)', "font-weight": 'bold' }}>
                  FormAnywhere AI
                </Typography>
                <Box style={{ display: 'flex', gap: '8px', "align-items": 'center' }}>
                  <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {post()?.publishedAt}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box style={{ display: 'flex', gap: '8px', "align-items": 'center' }}>
              <IconButton variant="standard" icon={<Icon name="bookmark" />} />
              <IconButton variant="standard" icon={<Icon name="share" />} onClick={() => navigator.clipboard.writeText(window.location.href)} />
              <IconButton variant="standard" icon={<Icon name="more-vert" />} />
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
                <Icon name="sparkle" style={{ color: 'var(--md-sys-color-on-primary-container)' }} />
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

          {post()?.coverImage && (
            <img
              src={post()?.coverImage!}
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

          {/* Reading Modes */}
          <ReadingModes
            slug={post()!.slug}
            originalContent={post()!.content}
            onContentChange={(html: string) => setModeContent(html)}
          />

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
                background: #0d1117;
                color: #e6edf3;
                padding: 24px;
                border-radius: 16px;
                overflow-x: auto;
                margin-bottom: 24px;
                font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;
                font-size: 0.9rem;
                line-height: 1.6;
                max-width: 100%;
                border: 1px solid rgba(255,255,255,0.1);
                position: relative;
              }
              .blog-content pre code {
                font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;
                display: block;
                overflow-x: auto;
                max-width: 100%;
                white-space: pre;
                word-wrap: normal;
                tab-size: 2;
              }
              .blog-content pre code::-webkit-scrollbar {
                height: 6px;
              }
              .blog-content pre code::-webkit-scrollbar-track {
                background: transparent;
              }
              .blog-content pre code::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
              }
              .blog-content pre code::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.3);
              }
              .blog-content code {
                font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;
              }
              .blog-content p code {
                background: var(--md-sys-color-surface-container);
                padding: 2px 8px;
                border-radius: 6px;
                font-size: 0.9rem;
                color: var(--md-sys-color-primary);
              }
              /* Playground blocks */
              .blog-content div[data-type='playground'] {
                background: #0d1117;
                border-radius: 16px;
                overflow: hidden;
                margin-bottom: 24px;
                border: 1px solid rgba(255,255,255,0.1);
              }
              .blog-content div[data-type='playground']::before {
                content: '▶ Interactive Playground';
                display: block;
                padding: 8px 16px;
                background: rgba(255,255,255,0.05);
                color: #7ee787;
                font-size: 0.8rem;
                font-weight: 600;
                font-family: system-ui, sans-serif;
                border-bottom: 1px solid rgba(255,255,255,0.1);
              }
              .blog-content div[data-type='playground'] pre {
                margin: 0;
                border: none;
                border-radius: 0;
              }
              /* Code block language label */
              .blog-content pre code[class*='language-']::before {
                content: attr(data-language);
                position: absolute;
                top: 8px;
                right: 12px;
                font-size: 0.7rem;
                color: rgba(255,255,255,0.35);
                text-transform: uppercase;
                font-family: system-ui, sans-serif;
                letter-spacing: 0.05em;
              }
              /* Image figure blocks */
              .blog-content figure.image-block {
                margin: 32px 0;
                text-align: center;
              }
              .blog-content figure.image-block img {
                max-width: 100%;
                border-radius: 12px;
              }
              .blog-content figure.image-block figcaption {
                margin-top: 8px;
                font-size: 0.9rem;
                color: var(--md-sys-color-on-surface-variant);
                font-style: italic;
              }
              /* Horizontal rules */
              .blog-content hr {
                border: none;
                height: 1px;
                background: var(--md-sys-color-outline-variant);
                margin: 48px 0;
              }
            `}
          </style>

          <Box
            ref={(el) => setContentRef(el)}
            class="blog-content"
            innerHTML={displayContent()}
          />
          <MermaidRenderer containerRef={contentRef()} />

          <Divider style={{ "margin-bottom": '32px' }} />

          <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '48px', "flex-wrap": 'wrap', gap: '24px' }}>
            <Box style={{ display: 'flex', gap: '8px', "flex-wrap": 'wrap' }}>
              {post()?.tags.map((tag: string) => (
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
                {likes()} Claps
              </Typography>
            </Box>
          </Box>

          {/* Citations & Trust Score */}
          <CitationsPanel slug={post()!.slug} trustScore={post()?.trustScore || 0} citations={post()?.citations || []} />

          {/* Social Media Syndication */}
          <SocialSyndication slug={post()!.slug} socialData={post()?.socialMediaPosts || undefined} />

        </article>
      )}

      {/* AI Chat (floating) */}
      <Show when={post()}>
        <ArticleChat slug={post()!.slug} />
      </Show>
    </Box>
  );
}