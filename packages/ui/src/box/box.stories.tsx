import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box } from './index';

const meta: Meta<typeof Box> = {
  title: 'Components/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    rounded: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
    bg: {
      control: 'select',
      options: ['surface', 'surface-variant', 'surface-dim', 'primary', 'secondary', 'tertiary', 'transparent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    padding: 'md',
    rounded: 'md',
    bg: 'surface-variant',
    children: 'Box content',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      <Box padding="sm" rounded="sm" bg="surface-variant">Compact section</Box>
      <Box padding="md" rounded="md" bg="surface">Standard section</Box>
      <Box padding="lg" rounded="lg" bg="surface-dim">Prominent section</Box>
    </div>
  ),
};
