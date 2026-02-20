import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Avatar, AvatarGroup } from './index';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['circular', 'rounded', 'square', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    initials: 'FA',
    size: 'md',
    variant: 'circular',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', 'align-items': 'center' }}>
        <Avatar initials="XS" size="xs" />
        <Avatar initials="SM" size="sm" />
        <Avatar initials="MD" size="md" />
        <Avatar initials="LG" size="lg" />
        <Avatar initials="XL" size="xl" />
      </div>
      <div style={{ display: 'flex', gap: '12px', 'align-items': 'center' }}>
        <Avatar initials="CI" variant="circular" />
        <Avatar initials="RO" variant="rounded" />
        <Avatar initials="SQ" variant="square" />
        <Avatar initials="GL" variant="glass" />
      </div>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar initials="A" size="md" />
      <Avatar initials="B" size="md" />
      <Avatar initials="C" size="md" />
      <Avatar initials="D" size="md" />
    </AvatarGroup>
  ),
};
