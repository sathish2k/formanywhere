import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TopAppBar } from './index';

const iconBtn = (label: string) => <button style={{ border: 'none', background: 'transparent' }}>{label}</button>;

const meta: Meta<typeof TopAppBar> = {
  title: 'Components/TopAppBar',
  component: TopAppBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: 'Dashboard',
    navigationIcon: iconBtn('≡'),
    actions: <>{iconBtn('🔍')}{iconBtn('⋮')}</>,
    variant: 'small',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      <TopAppBar title="Small" variant="small" />
      <TopAppBar title="Center aligned" variant="center-aligned" />
      <TopAppBar title="Medium" variant="medium" />
      <TopAppBar title="Large" variant="large" />
      <TopAppBar title="Glass" variant="glass" />
    </div>
  ),
};
