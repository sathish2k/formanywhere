import { Component, createSignal, Show, Suspense } from 'solid-js';
import { Title } from '@solidjs/meta';
import { clientOnly } from '@solidjs/start';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';

// Client-only: TipTap requires DOM APIs and injects <style> tags that cause hydration mismatch
const RichTextEditor = clientOnly(() =>
  import('@formanywhere/editor').then((m) => ({ default: m.RichTextEditor }))
);

export default function AdminBlogWrite() {
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');
  const [tags, setTags] = createSignal('');
  const [thumbnailUrl, setThumbnailUrl] = createSignal('');
  const [isPreview, setIsPreview] = createSignal(false);

  const handlePublish = () => {
    console.log('Publishing blog post:', {
      title: title(),
      content: content(),
      tags: tags().split(',').map(t => t.trim()),
      thumbnailUrl: thumbnailUrl(),
    });
    alert('Blog post published successfully!');
  };

  return (
    <Box padding="xl" style={{ "max-width": '800px', margin: '0 auto' }}>
      <Title>Write Blog Post - Admin</Title>
      
      <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '32px' }}>
        <Typography variant="headline-medium" style={{ "font-weight": 'bold' }}>
          Write a new story
        </Typography>
        <Box style={{ display: 'flex', gap: '16px' }}>
          <Button variant="outlined" onClick={() => setIsPreview(!isPreview())}>
            {isPreview() ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="filled" onClick={handlePublish}>Publish</Button>
        </Box>
      </Box>

      <Divider style={{ "margin-bottom": '32px' }} />

      <Box style={{ display: 'flex', "flex-direction": 'column', gap: '24px' }}>
        <input
          type="text"
          value={title()}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          placeholder="Title"
          style={{
            "font-size": '2.5rem',
            "font-weight": 'bold',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--md-sys-color-on-surface)',
            width: '100%',
            "font-family": 'system-ui, -apple-system, sans-serif',
          }}
        />

        <input
          type="text"
          value={thumbnailUrl()}
          onInput={(e) => setThumbnailUrl((e.target as HTMLInputElement).value)}
          placeholder="Thumbnail URL (e.g., https://example.com/image.jpg)"
          style={{
            "font-size": '1rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--md-sys-color-on-surface-variant)',
            width: '100%',
            padding: '8px 0',
            "border-bottom": '1px solid var(--md-sys-color-outline-variant)',
          }}
        />

        <input
          type="text"
          value={tags()}
          onInput={(e) => setTags((e.target as HTMLInputElement).value)}
          placeholder="Tags (comma separated)"
          style={{
            "font-size": '1rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--md-sys-color-on-surface-variant)',
            width: '100%',
            padding: '8px 0',
            "border-bottom": '1px solid var(--md-sys-color-outline-variant)',
          }}
        />

        <Show
          when={!isPreview()}
          fallback={
            <Box>
              <style>
                {`
                  .blog-preview {
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: var(--md-sys-color-on-surface);
                    font-family: Georgia, serif;
                    min-height: 400px;
                  }
                  .blog-preview h2 {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-top: 48px;
                    margin-bottom: 24px;
                    font-family: system-ui, -apple-system, sans-serif;
                  }
                  .blog-preview h3 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-top: 32px;
                    margin-bottom: 16px;
                    font-family: system-ui, -apple-system, sans-serif;
                  }
                  .blog-preview p {
                    margin-bottom: 24px;
                  }
                  .blog-preview ul {
                    margin-bottom: 24px;
                    padding-left: 24px;
                  }
                  .blog-preview li {
                    margin-bottom: 8px;
                  }
                  .blog-preview blockquote {
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
                  .blog-preview pre {
                    background: #1E1E1E;
                    color: #D4D4D4;
                    padding: 24px;
                    border-radius: 16px;
                    overflow-x: auto;
                    margin-bottom: 24px;
                    font-family: 'Fira Code', monospace;
                    font-size: 1rem;
                  }
                  .blog-preview code {
                    font-family: 'Fira Code', monospace;
                  }
                  .blog-preview p code {
                    background: var(--md-sys-color-surface-container);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 1rem;
                  }
                  .form-embed-block {
                    padding: 24px;
                    border: 2px dashed var(--md-sys-color-primary);
                    border-radius: 12px;
                    text-align: center;
                    margin: 24px 0;
                    background: var(--md-sys-color-surface-container);
                  }
                  .blog-preview figure.image-block {
                    margin: 2em 0;
                    text-align: center;
                  }
                  .blog-preview figure.image-block img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                  }
                  .blog-preview figure.image-block[data-direction='wide'] {
                    max-width: calc(100% + 200px);
                    margin-left: -100px;
                    margin-right: -100px;
                  }
                  .blog-preview figure.image-block[data-direction='fill'] {
                    max-width: 100vw;
                    margin-left: calc(-50vw + 50%);
                    margin-right: calc(-50vw + 50%);
                  }
                  .blog-preview .image-block-caption {
                    font-size: 0.9rem;
                    color: var(--md-sys-color-on-surface-variant);
                    font-style: italic;
                    padding: 8px 0;
                    text-align: center;
                  }
                  .blog-preview .image-block-caption:empty {
                    display: none;
                  }
                `}
              </style>
              <Box class="blog-preview" innerHTML={content() || '<p style="color: var(--md-sys-color-on-surface-variant); font-style: italic;">Nothing to preview yet...</p>'} />
            </Box>
          }
        >
          <Box style={{ display: 'flex', "flex-direction": 'column', gap: '8px' }}>
            <RichTextEditor content={content()} onChange={setContent} />
          </Box>
        </Show>
      </Box>
    </Box>
  );
}
