import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CircularProgress, LinearProgress } from './index';

const meta: Meta<typeof CircularProgress> = {
  title: 'Components/Progress',
  component: CircularProgress,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
      <CircularProgress value={30} />
      <CircularProgress value={65} />
      <CircularProgress indeterminate />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '12px', width: '360px' }}>
      <LinearProgress value={25} />
      <LinearProgress value={60} buffer={80} />
      <LinearProgress indeterminate />
    </div>
  ),
};
