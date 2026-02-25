/**
 * Feature 4: Dynamic Reading Modes — TL;DR | ELI5 | Executive | Deep Dive
 * Toggle between different difficulty/length versions of the same article.
 *
 * Uses M3 Liquid Glass card with icon-enhanced chips for mode selection.
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';
import { Icon } from '@formanywhere/ui/icon';
import { CircularProgress } from '@formanywhere/ui/progress';
import { getReadingMode } from './blog-api';

interface ReadingModeOption {
  id: string;
  label: string;
  /** Icon name from @formanywhere/ui/icon */
  icon: string;
  description: string;
}

const MODES: ReadingModeOption[] = [
  { id: 'original', label: 'Full Article', icon: 'file-text', description: 'Original version' },
  { id: 'tldr', label: 'TL;DR', icon: 'lightning', description: '30-second summary' },
  { id: 'eli5', label: 'ELI5', icon: 'help-circle', description: 'Simple explanation' },
  { id: 'executive', label: 'Executive', icon: 'bar-chart', description: 'Key takeaways' },
  { id: 'deep', label: 'Deep Dive', icon: 'search', description: 'Extended analysis' },
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

  const activeLabel = () => MODES.find((m) => m.id === activeMode())?.description ?? '';

  return (
    <Box style={{ 'margin-bottom': '24px' }}>
      {/* Header row */}
      <Stack direction="row" align="center" justify="space-between" style={{ 'margin-bottom': '12px' }}>
        <Stack direction="row" align="center" gap="xs">
          <Icon name="eye" size={16} color="var(--m3-color-on-surface-variant)" />
          <Typography
            variant="label-medium"
            color="on-surface-variant"
            style={{
              'text-transform': 'uppercase',
              'letter-spacing': '0.08em',
            }}
          >
            Reading Mode
          </Typography>
        </Stack>

        {/* Active mode description */}
        <Show when={!loading()}>
          <Typography
            variant="body-small"
            color="on-surface-variant"
            style={{ opacity: '0.7', 'font-style': 'italic' }}
          >
            {activeLabel()}
          </Typography>
        </Show>

        <Show when={loading()}>
          <Stack direction="row" gap="xs" align="center">
            <CircularProgress indeterminate size={14} />
            <Typography variant="body-small" color="primary">
              Rewriting…
            </Typography>
          </Stack>
        </Show>
      </Stack>

      {/* Mode chips */}
      <Stack direction="row" gap="sm" wrap>
        <For each={MODES}>
          {(mode) => (
            <Chip
              variant={activeMode() === mode.id ? 'glass' : 'assist'}
              label={mode.label}
              selected={activeMode() === mode.id}
              disabled={loading()}
              icon={<Icon name={mode.icon} size={16} />}
              onClick={() => switchMode(mode.id)}
            />
          )}
        </For>
      </Stack>
    </Box>
  );
};
