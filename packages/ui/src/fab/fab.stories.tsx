import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FAB } from './index';

const addIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
  </svg>
);

const meta: Meta<typeof FAB> = {
  title: 'Components/Fab',
  component: FAB,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['surface', 'primary', 'secondary', 'tertiary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    icon: addIcon,
    label: 'Create',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', 'align-items': 'center' }}>
      <FAB icon={addIcon} variant="surface" />
      <FAB icon={addIcon} variant="primary" />
      <FAB icon={addIcon} variant="secondary" />
      <FAB icon={addIcon} variant="tertiary" />
      <FAB icon={addIcon} label="Extended" />
    </div>
  ),
};
