import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tooltip } from './index';

const anchor = (label: string) => (
  <button
    style={{
      padding: '8px 12px',
      border: 'none',
      'border-radius': '8px',
      background: 'var(--m3-color-surface-container-high)',
      color: 'var(--m3-color-on-surface)',
    }}
  >
    {label}
  </button>
);

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    variant: { control: 'select', options: ['standard', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    text: 'Tooltip content',
    position: 'top',
    variant: 'standard',
    showDelay: 150,
  },
  render: (args: Parameters<typeof Tooltip>[0]) => <Tooltip {...args}>{anchor('Hover me')}</Tooltip>,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', 'align-items': 'center' }}>
      <Tooltip text="Top" position="top">{anchor('Top')}</Tooltip>
      <Tooltip text="Right" position="right">{anchor('Right')}</Tooltip>
      <Tooltip text="Bottom" position="bottom">{anchor('Bottom')}</Tooltip>
      <Tooltip text="Left" position="left">{anchor('Left')}</Tooltip>
      <Tooltip text="Glass" variant="glass">{anchor('Glass')}</Tooltip>
    </div>
  ),
};
