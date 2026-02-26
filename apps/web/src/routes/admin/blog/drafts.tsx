import { createSignal, createResource, For, Show } from 'solid-js';
import { Title } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Divider } from '@formanywhere/ui/divider';

interface Draft {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    tags: string[] | null;
    category: string | null;
    createdAt: string;
}

async function fetchDrafts(): Promise<Draft[]> {
    const res = await fetch('/api/blogs/drafts', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch drafts');
    const data = await res.json();
    return data.drafts || [];
}

export default function AdminBlogDrafts() {
    const [drafts, { refetch }] = createResource(fetchDrafts);
    const [actionLoading, setActionLoading] = createSignal<string | null>(null);

    const handlePublish = async (id: string) => {
        if (!confirm('Publish this draft? It will go live immediately.')) return;
        setActionLoading(id);
        try {
            const res = await fetch(`/api/blogs/drafts/${id}/publish`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                refetch();
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this draft permanently?')) return;
        setActionLoading(id);
        try {
            await fetch(`/api/blogs/drafts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            refetch();
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <Box padding="xl" style={{ "max-width": '960px', margin: '0 auto', "padding-bottom": '64px' }}>
            <Title>Drafts - Admin</Title>

            {/* Header */}
            <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '24px' }}>
                <div>
                    <Typography variant="headline-medium" style={{ "font-weight": 'bold' }}>
                        📄 Draft Posts
                    </Typography>
                    <Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', "margin-top": '4px' }}>
                        <Show when={drafts()} fallback="Loading...">
                            {drafts()!.length} draft{drafts()!.length !== 1 ? 's' : ''}
                        </Show>
                    </Typography>
                </div>
                <Box style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="outlined" onClick={() => window.location.href = '/admin/blog/prompts'}>
                        📝 Prompts
                    </Button>
                    <Button variant="filled" onClick={() => window.location.href = '/admin/blog/write'}>
                        ✍️ New Post
                    </Button>
                </Box>
            </Box>

            <Divider style={{ "margin-bottom": '24px' }} />

            {/* Drafts list */}
            <Show when={drafts()} fallback={
                <Box style={{ "text-align": 'center', padding: '48px' }}>
                    <Typography variant="body-large">Loading drafts...</Typography>
                </Box>
            }>
                <Show when={drafts()!.length > 0} fallback={
                    <Box style={{
                        "text-align": 'center',
                        padding: '64px 24px',
                        background: 'var(--md-sys-color-surface-container)',
                        "border-radius": '16px',
                    }}>
                        <Typography variant="headline-small" style={{ "margin-bottom": '8px' }}>No drafts yet</Typography>
                        <Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Go to Prompts → Copy a prompt → Paste AI output → Save as Draft
                        </Typography>
                    </Box>
                }>
                    <div style={{ display: 'flex', "flex-direction": 'column', gap: '12px' }}>
                        <For each={drafts()}>
                            {(draft) => (
                                <div style={{
                                    display: 'flex',
                                    "align-items": 'center',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    background: 'var(--md-sys-color-surface-container)',
                                    "border-radius": '16px',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    transition: 'background 0.15s',
                                }}>
                                    {/* Cover image thumbnail */}
                                    <Show when={draft.coverImage} fallback={
                                        <div style={{
                                            width: '80px', height: '56px',
                                            "border-radius": '8px',
                                            background: 'var(--md-sys-color-surface-container-highest)',
                                            display: 'flex', "align-items": 'center', "justify-content": 'center',
                                            "flex-shrink": '0',
                                            "font-size": '24px',
                                        }}>📄</div>
                                    }>
                                        <img
                                            src={draft.coverImage!}
                                            alt=""
                                            style={{
                                                width: '80px', height: '56px',
                                                "border-radius": '8px',
                                                "object-fit": 'cover',
                                                "flex-shrink": '0',
                                            }}
                                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                        />
                                    </Show>

                                    {/* Content */}
                                    <div style={{ flex: '1', "min-width": '0' }}>
                                        <Typography variant="title-medium" style={{
                                            "font-weight": '600',
                                            overflow: 'hidden',
                                            "text-overflow": 'ellipsis',
                                            "white-space": 'nowrap',
                                        }}>
                                            {draft.title || 'Untitled Draft'}
                                        </Typography>
                                        <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', "margin-top": '2px' }}>
                                            {formatDate(draft.createdAt)}
                                            {draft.tags && draft.tags.length > 0 ? ` • ${(draft.tags as string[]).slice(0, 3).join(', ')}` : ''}
                                        </Typography>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', "flex-shrink": '0' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => window.location.href = `/admin/blog/write?draft=${draft.id}`}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="filled"
                                            onClick={() => handlePublish(draft.id)}
                                            disabled={actionLoading() === draft.id}
                                        >
                                            {actionLoading() === draft.id ? '...' : '🚀 Publish'}
                                        </Button>
                                        <Button
                                            variant="text"
                                            onClick={() => handleDelete(draft.id)}
                                            style={{ color: '#ef4444' }}
                                        >
                                            🗑
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </Show>
        </Box>
    );
}
