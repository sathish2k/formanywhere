import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Chip } from './index';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['assist', 'filter', 'input', 'suggestion', 'label'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'assist',
    size: 'md',
    label: 'Offline Sync',
    selected: false,
    disabled: false,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px', 'flex-wrap': 'wrap' }}>
      <Chip variant="assist" label="Assist" />
      <Chip variant="suggestion" label="Suggestion" />
      <Chip variant="label" label="Label" />
      <Chip variant="input" label="Input" onRemove={() => {}} />
      <Chip variant="filter" label="Filter" selected />
    </div>
  ),
};

export const InteractiveFilter: Story = {
  render: () => {
    const [selected, setSelected] = createSignal(false);
    return (
      <Chip
        variant="filter"
        label={selected() ? 'Selected' : 'Select me'}
        selected={selected()}
        onClick={() => setSelected((current) => !current)}
      />
    );
  },
};
