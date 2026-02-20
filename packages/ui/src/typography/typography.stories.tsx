import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Typography } from './index';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display-large', 'display-medium', 'display-small',
        'headline-large', 'headline-medium', 'headline-small',
        'title-large', 'title-medium', 'title-small',
        'body-large', 'body-medium', 'body-small',
        'label-large', 'label-medium', 'label-small',
      ],
    },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'on-surface', 'on-surface-variant', 'error', 'inherit'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'headline-medium',
    color: 'on-surface',
    children: 'Typography sample',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '10px' }}>
      <Typography variant="display-small">Display Small</Typography>
      <Typography variant="headline-small">Headline Small</Typography>
      <Typography variant="title-large">Title Large</Typography>
      <Typography variant="body-large">Body Large text for primary reading content.</Typography>
      <Typography variant="body-medium" color="on-surface-variant">Body Medium supporting text.</Typography>
      <Typography variant="label-large" color="primary">Label Large</Typography>
    </div>
  ),
};
