import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Divider } from './index';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '10px', width: '420px' }}>
      <Divider />
      <Divider inset />
      <Divider insetBoth />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ height: '72px', display: 'flex', gap: '12px', 'align-items': 'stretch' }}>
      <Divider vertical />
      <Divider vertical />
      <Divider vertical />
    </div>
  ),
};
