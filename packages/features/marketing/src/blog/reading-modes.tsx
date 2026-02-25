/**
 * Feature 4: Dynamic Reading Modes — TL;DR | ELI5 | Executive | Deep Dive
 * Toggle between different difficulty/length versions of the same article.
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';
import { CircularProgress } from '@formanywhere/ui/progress';
import { getReadingMode } from './blog-api';

interface ReadingModeOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const MODES: ReadingModeOption[] = [
  { id: 'original', label: 'Full Article', icon: '📖', description: 'Original version' },
  { id: 'tldr', label: 'TL;DR', icon: '⚡', description: '30-second summary' },
  { id: 'eli5', label: 'ELI5', icon: '🧒', description: 'Simple explanation' },
  { id: 'executive', label: 'Executive', icon: '💼', description: 'Key takeaways' },
  { id: 'deep', label: 'Deep Dive', icon: '🔬', description: 'Extended analysis' },
];

export const ReadingModes: Component<{
  slug: string;
  originalContent: string;
  onContentChange: (html: string) => void;
}> = (props) => {
  const [activeMode, setActiveMode] = createSignal('original');
  const [loading, setLoading] = createSignal(false);
  const [cache, setCache] = createSignal<Record<string, string>>({});

  const switchMode = async (modeId: string) => {
    if (modeId === activeMode()) return;

    if (modeId === 'original') {
      setActiveMode('original');
      props.onContentChange(props.originalContent);
      return;
    }

    const cached = cache();
    if (cached[modeId]) {
      setActiveMode(modeId);
      props.onContentChange(cached[modeId]);
      return;
    }

    setLoading(true);
    try {
      const res = await getReadingMode(props.slug, modeId);
      const content = res.content || '';
      setCache((prev) => ({ ...prev, [modeId]: content }));
      setActiveMode(modeId);
      props.onContentChange(content);
    } catch (err) {
      console.error('Mode switch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ 'margin-bottom': '24px' }}>
      <Typography
        variant="label-small"
        color="on-surface-variant"
        style={{
          'margin-bottom': '8px',
          'text-transform': 'uppercase',
          'letter-spacing': '0.05em',
        }}
      >
        Reading Mode
      </Typography>
      <Stack direction="row" gap="xs" wrap>
        <For each={MODES}>
          {(mode) => (
            <Chip
              variant={activeMode() === mode.id ? 'filter' : 'assist'}
              label={`${mode.icon} ${mode.label}`}
              selected={activeMode() === mode.id}
              disabled={loading()}
              onClick={() => switchMode(mode.id)}
            />
          )}
        </For>
      </Stack>
      <Show when={loading()}>
        <Stack direction="row" gap="sm" align="center" style={{ 'margin-top': '12px' }}>
          <CircularProgress indeterminate size={16} />
          <Typography variant="body-small" color="on-surface-variant">
            Rewriting article...
          </Typography>
        </Stack>
      </Show>
    </Box>
  );
};
