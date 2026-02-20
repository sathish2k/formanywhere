import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Ripple } from './index';

const meta: Meta<typeof Ripple> = {
  title: 'Components/Ripple',
  component: Ripple,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '220px',
        padding: '14px 16px',
        'border-radius': '12px',
        background: 'var(--m3-color-surface-container-high)',
      }}
    >
      <Ripple />
      Tap area with ripple
    </div>
  ),
};
