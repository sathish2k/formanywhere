import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Stack } from './index';

const block = (label: string) => (
  <div
    style={{
      padding: '10px 14px',
      'border-radius': '10px',
      background: 'var(--m3-color-surface-container-high)',
    }}
  >
    {label}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    direction: 'row',
    gap: 'sm',
    align: 'center',
    justify: 'start',
  },
  render: (args: Parameters<typeof Stack>[0]) => (
    <Stack {...args}>
      {block('One')}
      {block('Two')}
      {block('Three')}
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '14px' }}>
      <Stack direction="row" gap="sm">{block('A')}{block('B')}{block('C')}</Stack>
      <Stack direction="column" gap="sm">{block('A')}{block('B')}{block('C')}</Stack>
    </div>
  ),
};
