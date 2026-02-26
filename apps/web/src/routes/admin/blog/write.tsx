import { Component, createSignal, createEffect, Show, Suspense, onMount } from 'solid-js';
import { Title } from '@solidjs/meta';
import { clientOnly } from '@solidjs/start';
import { useSearchParams, useNavigate } from '@solidjs/router';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [draftId, setDraftId] = createSignal<string | null>(null);
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');
  const [excerpt, setExcerpt] = createSignal('');
  const [tags, setTags] = createSignal('');
  const [thumbnailUrl, setThumbnailUrl] = createSignal('');
  const [seoTitle, setSeoTitle] = createSignal('');
  const [seoDescription, setSeoDescription] = createSignal('');
  const [isPreview, setIsPreview] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [publishing, setPublishing] = createSignal(false);
  const [statusMsg, setStatusMsg] = createSignal<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Load draft data if ?draft=ID is present
  onMount(async () => {
    const id = searchParams.draft as string;
    if (!id) return;

    setDraftId(id);
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/drafts/${id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setExcerpt(data.excerpt || '');
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setThumbnailUrl(data.coverImage || '');
        setSeoTitle(data.seoTitle || '');
        setSeoDescription(data.seoDescription || '');
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to load draft' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  });

  const handleSave = async () => {
    if (!draftId()) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/blogs/drafts/${draftId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title(),
          content: content(),
          excerpt: excerpt(),
          coverImage: thumbnailUrl(),
          tags: tags().split(',').map(t => t.trim()).filter(Boolean),
          seoTitle: seoTitle(),
          seoDescription: seoDescription(),
        }),
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Draft saved!' });
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', text: data.error || 'Save failed' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!draftId()) {
      // Direct publish (new blog — not from draft)
      console.log('Publishing new blog post');
      return;
    }

    setPublishing(true);
    setStatusMsg(null);

    // Save first, then publish
    try {
      await fetch(`/api/blogs/drafts/${draftId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title(),
          content: content(),
          excerpt: excerpt(),
          coverImage: thumbnailUrl(),
          tags: tags().split(',').map(t => t.trim()).filter(Boolean),
          seoTitle: seoTitle(),
          seoDescription: seoDescription(),
        }),
      });

      const res = await fetch(`/api/blogs/drafts/${draftId()}/publish`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setStatusMsg({ type: 'success', text: `Published! View at /blog/${data.slug}` });
        // Redirect to published blog after 2 seconds
        setTimeout(() => {
          window.location.href = `/blog/${data.slug}`;
        }, 2000);
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', text: data.error || 'Publish failed' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!draftId() || !confirm('Delete this draft permanently?')) return;

    try {
      await fetch(`/api/blogs/drafts/${draftId()}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      navigate('/admin/blog/prompts');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <Box padding="xl" style={{ "max-width": '800px', margin: '0 auto', "padding-bottom": '64px' }}>
      <Title>{draftId() ? 'Edit Draft' : 'Write Blog Post'} - Admin</Title>

      <Show when={loading()}>
        <Box style={{ "text-align": 'center', padding: '48px' }}>
          <Typography variant="body-large">Loading draft...</Typography>
        </Box>
      </Show>

      <Show when={!loading()}>
        {/* Header */}
        <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '24px' }}>
          <div>
            <Typography variant="headline-medium" style={{ "font-weight": 'bold' }}>
              {draftId() ? '✏️ Edit Draft' : '📝 Write a new story'}
            </Typography>
            <Show when={draftId()}>
              <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', "margin-top": '4px' }}>
                Draft ID: {draftId()}
              </Typography>
            </Show>
          </div>
          <Box style={{ display: 'flex', gap: '12px', "align-items": 'center' }}>
            <Button variant="outlined" onClick={() => setIsPreview(!isPreview())}>
              {isPreview() ? 'Edit' : 'Preview'}
            </Button>
            <Show when={draftId()}>
              <Button variant="outlined" onClick={handleSave} disabled={saving()}>
                {saving() ? 'Saving...' : '💾 Save Draft'}
              </Button>
              <Button variant="outlined" onClick={handleDelete} style={{ color: '#ef4444' }}>
                🗑 Delete
              </Button>
            </Show>
            <Button variant="filled" onClick={handlePublish} disabled={publishing()}>
              {publishing() ? 'Publishing...' : '🚀 Publish'}
            </Button>
          </Box>
        </Box>

        {/* Status message */}
        <Show when={statusMsg()}>
          <div style={{
            padding: '12px 16px',
            "border-radius": '12px',
            "margin-bottom": '16px',
            background: statusMsg()!.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${statusMsg()!.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: statusMsg()!.type === 'success' ? '#10b981' : '#ef4444',
          }}>
            {statusMsg()!.text}
          </div>
        </Show>

        <Divider style={{ "margin-bottom": '24px' }} />

        <Box style={{ display: 'flex', "flex-direction": 'column', gap: '24px' }}>
          {/* Title */}
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

          {/* Excerpt */}
          <input
            type="text"
            value={excerpt()}
            onInput={(e) => setExcerpt((e.target as HTMLInputElement).value)}
            placeholder="Excerpt (short summary for blog listing)"
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

          {/* Cover Image */}
          <input
            type="text"
            value={thumbnailUrl()}
            onInput={(e) => setThumbnailUrl((e.target as HTMLInputElement).value)}
            placeholder="Cover image URL"
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

          {/* Tags */}
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

          {/* SEO fields (collapsible) */}
          <details>
            <summary style={{ cursor: 'pointer', color: 'var(--md-sys-color-on-surface-variant)', "margin-bottom": '12px' }}>
              🔍 SEO Settings
            </summary>
            <Box style={{ display: 'flex', "flex-direction": 'column', gap: '12px' }}>
              <input
                type="text"
                value={seoTitle()}
                onInput={(e) => setSeoTitle((e.target as HTMLInputElement).value)}
                placeholder="SEO Title (max 60 chars)"
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
                value={seoDescription()}
                onInput={(e) => setSeoDescription((e.target as HTMLInputElement).value)}
                placeholder="SEO Description (max 155 chars)"
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
            </Box>
          </details>

          {/* Cover image preview */}
          <Show when={thumbnailUrl()}>
            <Box style={{ "border-radius": '12px', overflow: 'hidden', "max-height": '300px' }}>
              <img
                src={thumbnailUrl()}
                alt="Cover preview"
                style={{ width: '100%', "object-fit": 'cover', "max-height": '300px' }}
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </Box>
          </Show>

          {/* Content editor / preview */}
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
                    .blog-preview p { margin-bottom: 24px; }
                    .blog-preview ul { margin-bottom: 24px; padding-left: 24px; }
                    .blog-preview li { margin-bottom: 8px; }
                    .blog-preview blockquote {
                      border-left: 4px solid var(--md-sys-color-primary);
                      padding: 24px;
                      margin-left: 0; margin-right: 0;
                      font-style: italic;
                      color: var(--md-sys-color-on-surface-variant);
                      background: var(--md-sys-color-surface-container-lowest);
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
                    .blog-preview code { font-family: 'Fira Code', monospace; }
                    .blog-preview p code {
                      background: var(--md-sys-color-surface-container);
                      padding: 4px 8px;
                      border-radius: 4px;
                      font-size: 1rem;
                    }
                    .blog-preview figure.image-block { margin: 2em 0; text-align: center; }
                    .blog-preview figure.image-block img {
                      max-width: 100%; height: auto; border-radius: 4px;
                    }
                    .blog-preview .image-block-caption {
                      font-size: 0.9rem;
                      color: var(--md-sys-color-on-surface-variant);
                      font-style: italic; padding: 8px 0;
                    }
                    .blog-preview table {
                      border-collapse: separate; border-spacing: 0;
                      width: 100%; margin: 1.5em 0; overflow: hidden;
                      border-radius: 12px;
                      border: 1px solid var(--m3-color-outline-variant, #c4c7c5);
                    }
                    .blog-preview td, .blog-preview th {
                      border-bottom: 1px solid var(--m3-color-outline-variant, #c4c7c5);
                      border-right: 1px solid var(--m3-color-outline-variant, #c4c7c5);
                      padding: 10px 14px;
                    }
                    .blog-preview td:last-child, .blog-preview th:last-child { border-right: none; }
                    .blog-preview tr:last-child td { border-bottom: none; }
                    .blog-preview th {
                      font-weight: 600;
                      background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
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
      </Show>
    </Box>
  );
}
