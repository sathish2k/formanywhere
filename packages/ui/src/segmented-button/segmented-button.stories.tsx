import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { SegmentedButton } from './index';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const meta: Meta<typeof SegmentedButton> = {
  title: 'Components/SegmentedButton',
  component: SegmentedButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [value, setValue] = createSignal('week');
    return <SegmentedButton value={value()} onChange={setValue} options={options} />;
  },
};

export const Variants: Story = {
  render: () => {
    const [value, setValue] = createSignal('day');
    return <SegmentedButton value={value()} onChange={setValue} options={options} variant="glass" />;
  },
};
