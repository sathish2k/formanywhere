import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { IconButton } from './index';

const plusIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
  </svg>
);

const heartIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12.1 21.35l-1.1-1.02C5.14 14.88 2 12.04 2 8.5 2 5.66 4.24 3.5 7.05 3.5c1.54 0 3.04.73 3.95 1.87A5.14 5.14 0 0114.95 3.5C17.76 3.5 20 5.66 20 8.5c0 3.54-3.14 6.38-8.9 11.84l-1 .91z" />
  </svg>
);

const heartOutlineIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09A6.02 6.02 0 007.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.31C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Supports Material-like toggle behavior via `toggle`, with controlled/uncontrolled selected state and optional `selectedIcon`.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['standard', 'filled', 'filled-tonal', 'outlined', 'text'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    icon: plusIcon,
    variant: 'standard',
    size: 'md',
    disabled: false,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <IconButton icon={plusIcon} variant="standard" />
        <IconButton icon={plusIcon} variant="filled" />
        <IconButton icon={plusIcon} variant="filled-tonal" />
        <IconButton icon={plusIcon} variant="outlined" />
        <IconButton icon={plusIcon} variant="text" />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <IconButton icon={heartIcon} variant="filled-tonal" selected />
        <IconButton icon={heartIcon} variant="outlined" disabled />
        <IconButton icon={plusIcon} variant="filled" size="sm" />
        <IconButton icon={plusIcon} variant="filled" size="md" />
        <IconButton icon={plusIcon} variant="filled" size="lg" />
      </div>
    </div>
  ),
};

export const ToggleMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled toggle example with `defaultSelected` and icon swap using `selectedIcon`.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <IconButton
        icon={heartOutlineIcon}
        selectedIcon={heartIcon}
        toggle
        defaultSelected={false}
        variant="filled-tonal"
        aria-label="Toggle favorite"
      />
      <IconButton
        icon={plusIcon}
        toggle
        defaultSelected
        variant="outlined"
        aria-label="Toggle add"
      />
    </div>
  ),
};

export const ControlledToggle: Story = {
  render: () => {
    const [selected, setSelected] = createSignal(false);

    return (
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ color: 'var(--m3-color-on-surface-variant)', 'font-size': '14px' }}>
          Selected: <strong>{selected() ? 'true' : 'false'}</strong>
        </div>
        <IconButton
          icon={heartOutlineIcon}
          selectedIcon={heartIcon}
          toggle
          selected={selected()}
          onSelectedChange={setSelected}
          variant="filled"
          aria-label="Controlled favorite"
        />
      </div>
    );
  },
};
