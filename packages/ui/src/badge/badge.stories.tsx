import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Badge } from './index';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['error', 'primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    content: 7,
    max: 99,
    color: 'error',
    size: 'md',
    position: 'top-right',
  },
  render: (args: Parameters<typeof Badge>[0]) => (
    <Badge {...args}>
      <div
        style={{
          width: '44px',
          height: '44px',
          'border-radius': '12px',
          background: 'var(--m3-color-surface-container-high)',
        }}
      />
    </Badge>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '22px', 'align-items': 'center', padding: '12px 0' }}>
      <Badge content={3}>
        <div style={{ width: '36px', height: '36px', 'border-radius': '10px', background: 'var(--m3-color-surface-container-high)' }} />
      </Badge>
      <Badge content={120} max={99} color="primary">
        <div style={{ width: '36px', height: '36px', 'border-radius': '10px', background: 'var(--m3-color-surface-container-high)' }} />
      </Badge>
      <Badge dot color="secondary">
        <div style={{ width: '36px', height: '36px', 'border-radius': '10px', background: 'var(--m3-color-surface-container-high)' }} />
      </Badge>
    </div>
  ),
};
