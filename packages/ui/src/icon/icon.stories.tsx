import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Icon } from './index';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    name: 'search',
    size: 24,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
      <Icon name="search" />
      <Icon name="settings" />
      <Icon name="check" />
      <Icon name="close" />
      <Icon name="calendar" />
    </div>
  ),
};
