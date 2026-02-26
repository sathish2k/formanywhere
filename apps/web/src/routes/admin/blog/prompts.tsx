import { Component, createSignal, createResource, For, Show, batch } from 'solid-js';
import { Title } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';

interface BlogPrompt {
    id: string;
    topic: string;
    blogType: string;
    categoryType: string;
    author: { name: string; bio: string };
    voice: { label: string };
    writerPrompt: string;
    imagePrompt: string;
    coverImagePrompt: string;
    status: 'pending' | 'completed';
    createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
    news: '📰',
    review: '📱',
    analysis: '📊',
    opinion: '💬',
    tutorial: '🛠',
};

const TYPE_COLORS: Record<string, string> = {
    news: '#ef4444',
    review: '#8b5cf6',
    analysis: '#3b82f6',
    opinion: '#f59e0b',
    tutorial: '#10b981',
};

async function fetchPrompts(): Promise<BlogPrompt[]> {
    const res = await fetch('/api/blogs/prompts', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch prompts');
    const data = await res.json();
    return data.prompts || [];
}

export default function AdminBlogPrompts() {
    const [prompts, { refetch, mutate }] = createResource(fetchPrompts);
    const [expandedId, setExpandedId] = createSignal<string | null>(null);
    const [pastedContent, setPastedContent] = createSignal<Record<string, string>>({});
    const [coverImages, setCoverImages] = createSignal<Record<string, string>>({});
    const [inlineImages, setInlineImages] = createSignal<Record<string, string[]>>({});
    const [publishing, setPublishing] = createSignal<string | null>(null);
    const [refreshing, setRefreshing] = createSignal(false);
    const [copied, setCopied] = createSignal<string | null>(null);
    const [publishResult, setPublishResult] = createSignal<Record<string, { success: boolean; slug?: string; error?: string }>>({});

    const copyToClipboard = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/blogs/prompts/refresh', { method: 'POST', credentials: 'include' });
            const data = await res.json();
            mutate(data.prompts || []);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePublish = async (promptId: string) => {
        const content = pastedContent()[promptId];
        if (!content || content.trim().length < 100) {
            setPublishResult(prev => ({ ...prev, [promptId]: { success: false, error: 'Paste at least 100 characters of AI output' } }));
            return;
        }

        setPublishing(promptId);
        try {
            const res = await fetch('/api/blogs/publish-manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    promptId,
                    rawContent: content,
                    coverImageUrl: coverImages()[promptId] || undefined,
                    inlineImageUrls: (inlineImages()[promptId] || []).filter(Boolean),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPublishResult(prev => ({ ...prev, [promptId]: { success: true, slug: data.blog.slug } }));
                refetch();
                // Redirect to the edit page after a short delay
                setTimeout(() => {
                    window.location.href = `/admin/blog/write?draft=${data.blog.id}`;
                }, 1000);
            } else {
                setPublishResult(prev => ({ ...prev, [promptId]: { success: false, error: data.error } }));
            }
        } catch (err: any) {
            setPublishResult(prev => ({ ...prev, [promptId]: { success: false, error: err.message } }));
        } finally {
            setPublishing(null);
        }
    };

    const updateInlineImage = (promptId: string, index: number, value: string) => {
        setInlineImages(prev => {
            const arr = [...(prev[promptId] || [''])];
            arr[index] = value;
            return { ...prev, [promptId]: arr };
        });
    };

    const addInlineImageField = (promptId: string) => {
        setInlineImages(prev => {
            const arr = [...(prev[promptId] || ['']), ''];
            return { ...prev, [promptId]: arr };
        });
    };

    return (
        <Box padding="xl" style={{ "max-width": '960px', margin: '0 auto', "padding-bottom": '64px' }}>
            <Title>Blog Prompts - Admin</Title>

            {/* Header */}
            <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '24px' }}>
                <div>
                    <Typography variant="headline-medium" style={{ "font-weight": 'bold' }}>
                        📝 Today's Blog Prompts
                    </Typography>
                    <Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', "margin-top": '4px' }}>
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {' • '}
                        <Show when={prompts()} fallback="Loading...">
                            {prompts()!.length} prompts • {prompts()!.filter(p => p.status === 'completed').length} completed
                        </Show>
                    </Typography>
                </div>
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    disabled={refreshing()}
                >
                    {refreshing() ? 'Refreshing...' : '🔄 Refresh Prompts'}
                </Button>
            </Box>

            <Divider style={{ "margin-bottom": '24px' }} />

            {/* Prompt Cards */}
            <Show when={prompts()} fallback={
                <Box style={{ "text-align": 'center', padding: '48px' }}>
                    <Typography variant="body-large">Loading prompts...</Typography>
                </Box>
            }>
                <div style={{ display: 'flex', "flex-direction": 'column', gap: '12px' }}>
                    <For each={prompts()}>
                        {(prompt) => {
                            const isExpanded = () => expandedId() === prompt.id;
                            const result = () => publishResult()[prompt.id];

                            return (
                                <div style={{
                                    background: 'var(--md-sys-color-surface-container)',
                                    "border-radius": '16px',
                                    border: `1px solid ${prompt.status === 'completed' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                }}>
                                    {/* Header — always visible */}
                                    <div
                                        onClick={() => setExpandedId(isExpanded() ? null : prompt.id)}
                                        style={{
                                            display: 'flex',
                                            "align-items": 'center',
                                            gap: '12px',
                                            padding: '16px 20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {/* Type badge */}
                                        <span style={{
                                            background: TYPE_COLORS[prompt.blogType] || '#666',
                                            color: '#fff',
                                            padding: '4px 10px',
                                            "border-radius": '20px',
                                            "font-size": '12px',
                                            "font-weight": '600',
                                            "white-space": 'nowrap',
                                        }}>
                                            {TYPE_ICONS[prompt.blogType]} {prompt.blogType.toUpperCase()}
                                        </span>

                                        {/* Topic */}
                                        <Typography variant="body-large" style={{
                                            flex: '1',
                                            "font-weight": '500',
                                            overflow: 'hidden',
                                            "text-overflow": 'ellipsis',
                                            "white-space": 'nowrap',
                                        }}>
                                            {prompt.topic}
                                        </Typography>

                                        {/* Status + Author */}
                                        <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', "white-space": 'nowrap' }}>
                                            {prompt.author.name} • {prompt.voice.label}
                                        </Typography>

                                        <Show when={prompt.status === 'completed'}>
                                            <span style={{ color: 'var(--md-sys-color-primary)', "font-size": '18px' }}>✅</span>
                                        </Show>

                                        <span style={{
                                            "font-size": '18px',
                                            transition: 'transform 0.2s',
                                            transform: isExpanded() ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}>▼</span>
                                    </div>

                                    {/* Expanded content */}
                                    <Show when={isExpanded()}>
                                        <div style={{ padding: '0 20px 20px', "border-top": '1px solid var(--md-sys-color-outline-variant)' }}>
                                            {/* Copy buttons */}
                                            <div style={{ display: 'flex', gap: '12px', "margin-top": '16px', "flex-wrap": 'wrap' }}>
                                                <Button
                                                    variant="filled"
                                                    onClick={(e: Event) => { e.stopPropagation(); copyToClipboard(prompt.writerPrompt, `writer-${prompt.id}`); }}
                                                >
                                                    {copied() === `writer-${prompt.id}` ? '✅ Copied!' : '📋 Copy Writer Prompt'}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={(e: Event) => { e.stopPropagation(); copyToClipboard(prompt.imagePrompt, `image-${prompt.id}`); }}
                                                >
                                                    {copied() === `image-${prompt.id}` ? '✅ Copied!' : '🖼 Copy Image Prompt'}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={(e: Event) => { e.stopPropagation(); copyToClipboard(prompt.coverImagePrompt, `cover-${prompt.id}`); }}
                                                >
                                                    {copied() === `cover-${prompt.id}` ? '✅ Copied!' : '🎨 Copy Cover Image Prompt'}
                                                </Button>
                                            </div>

                                            <Divider style={{ margin: '20px 0' }} />

                                            {/* Paste AI Output */}
                                            <Typography variant="title-small" style={{ "margin-bottom": '8px', "font-weight": '600' }}>
                                                Paste AI Output
                                            </Typography>
                                            <textarea
                                                value={pastedContent()[prompt.id] || ''}
                                                onInput={(e) => setPastedContent(prev => ({ ...prev, [prompt.id]: (e.target as HTMLTextAreaElement).value }))}
                                                placeholder="Paste the full ChatGPT/Gemini response here — must include # TITLE, # CONTENT, # TAGS sections..."
                                                rows={12}
                                                style={{
                                                    width: '100%',
                                                    "min-height": '200px',
                                                    padding: '16px',
                                                    "border-radius": '12px',
                                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                                    background: 'var(--md-sys-color-surface)',
                                                    color: 'var(--md-sys-color-on-surface)',
                                                    "font-family": "'JetBrains Mono', 'Fira Code', monospace",
                                                    "font-size": '13px',
                                                    "line-height": '1.5',
                                                    resize: 'vertical',
                                                }}
                                            />

                                            {/* Image URLs */}
                                            <div style={{ "margin-top": '16px' }}>
                                                <Typography variant="title-small" style={{ "margin-bottom": '8px', "font-weight": '600' }}>
                                                    Cover Image URL
                                                </Typography>
                                                <input
                                                    type="url"
                                                    value={coverImages()[prompt.id] || ''}
                                                    onInput={(e) => setCoverImages(prev => ({ ...prev, [prompt.id]: (e.target as HTMLInputElement).value }))}
                                                    placeholder="https://... (leave empty to auto-fetch from Unsplash)"
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        "border-radius": '12px',
                                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                                        background: 'var(--md-sys-color-surface)',
                                                        color: 'var(--md-sys-color-on-surface)',
                                                        "font-size": '14px',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ "margin-top": '12px' }}>
                                                <Typography variant="title-small" style={{ "margin-bottom": '8px', "font-weight": '600' }}>
                                                    Inline Image URLs
                                                </Typography>
                                                <For each={inlineImages()[prompt.id] || ['']}>
                                                    {(url, i) => (
                                                        <input
                                                            type="url"
                                                            value={url}
                                                            onInput={(e) => updateInlineImage(prompt.id, i(), (e.target as HTMLInputElement).value)}
                                                            placeholder={`Image ${i() + 1} URL — https://...`}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 16px',
                                                                "border-radius": '12px',
                                                                border: '1px solid var(--md-sys-color-outline-variant)',
                                                                background: 'var(--md-sys-color-surface)',
                                                                color: 'var(--md-sys-color-on-surface)',
                                                                "font-size": '14px',
                                                                "margin-bottom": '8px',
                                                            }}
                                                        />
                                                    )}
                                                </For>
                                                <Button
                                                    variant="text"
                                                    onClick={() => addInlineImageField(prompt.id)}
                                                >
                                                    + Add Image
                                                </Button>
                                            </div>

                                            <Divider style={{ margin: '20px 0' }} />

                                            {/* Result message */}
                                            <Show when={result()}>
                                                <div style={{
                                                    padding: '12px 16px',
                                                    "border-radius": '12px',
                                                    "margin-bottom": '16px',
                                                    background: result()!.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    border: `1px solid ${result()!.success ? '#10b981' : '#ef4444'}`,
                                                    color: result()!.success ? '#10b981' : '#ef4444',
                                                }}>
                                                    {result()!.success
                                                        ? `✅ Saved as draft! Redirecting to editor...`
                                                        : `❌ ${result()!.error}`
                                                    }
                                                </div>
                                            </Show>

                                            {/* Publish button */}
                                            <div style={{ display: 'flex', gap: '12px', "justify-content": 'flex-end' }}>
                                                <Button
                                                    variant="filled"
                                                    onClick={() => handlePublish(prompt.id)}
                                                    disabled={publishing() === prompt.id || !pastedContent()[prompt.id]}
                                                >
                                                    {publishing() === prompt.id ? '⏳ Saving...' : '📝 Save as Draft & Edit'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Show>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Show>
        </Box>
    );
}
