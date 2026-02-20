import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { SearchBar } from './index';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/Search',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['standard', 'glass'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    placeholder: 'Search templates...',
    variant: 'standard',
    disabled: false,
  },
  render: (args: Parameters<typeof SearchBar>[0]) => {
    const [query, setQuery] = createSignal('');
    return <SearchBar {...args} value={query()} onChange={setQuery} />;
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '14px', width: '420px' }}>
      <SearchBar placeholder="Standard search" variant="standard" />
      <SearchBar placeholder="Glass search" variant="glass" />
      <SearchBar placeholder="Disabled" disabled />
    </div>
  ),
};
