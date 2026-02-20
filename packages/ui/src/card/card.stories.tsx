import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Card, CardContent, CardActions } from './index';
import { Typography } from '../typography';
import { Button } from '../button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined', 'glass', 'glass-strong', 'glass-subtle'],
    },
    clickable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoCard = (variant: NonNullable<Parameters<typeof Card>[0]['variant']>) => (
  <Card variant={variant} style={{ width: '320px' }}>
    <CardContent>
      <Typography variant="title-large">Field Operations</Typography>
      <Typography variant="body-medium" color="on-surface-variant" style={{ margin: '8px 0 0 0' }}>
        Offline-first forms with sync and validation workflows.
      </Typography>
    </CardContent>
    <CardActions align="end">
      <Button variant="text" size="sm">Learn more</Button>
      <Button variant="filled" size="sm">Use template</Button>
    </CardActions>
  </Card>
);

export const Playground: Story = {
  args: {
    variant: 'elevated',
    clickable: false,
  },
  render: (args: Parameters<typeof Card>[0]) => (
    <Card {...args} style={{ width: '320px' }}>
      <CardContent>
        <Typography variant="title-large">Operations Checklist</Typography>
        <Typography variant="body-medium" color="on-surface-variant" style={{ margin: '8px 0 0 0' }}>
          Build and ship resilient forms for low-connectivity environments.
        </Typography>
      </CardContent>
      <CardActions align="end">
        <Button variant="filled" size="sm">Open</Button>
      </CardActions>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px', 'grid-template-columns': 'repeat(auto-fit, minmax(320px, 1fr))', width: '100%', 'max-width': '1040px' }}>
      {DemoCard('elevated')}
      {DemoCard('filled')}
      {DemoCard('outlined')}
      {DemoCard('glass')}
      {DemoCard('glass-strong')}
      {DemoCard('glass-subtle')}
    </div>
  ),
};
