import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Tag } from './index';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'New',
    tone: 'secondary',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px', 'flex-wrap': 'wrap' }}>
      <Tag label="Neutral" tone="neutral" />
      <Tag label="Primary" tone="primary" />
      <Tag label="Secondary" tone="secondary" />
      <Tag label="Tertiary" tone="tertiary" />
      <Tag label="Success" tone="success" />
      <Tag label="Warning" tone="warning" />
      <Tag label="Error" tone="error" />
    </div>
  ),
};
