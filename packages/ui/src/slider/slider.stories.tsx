import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Slider } from './index';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    variant: { control: 'select', options: ['standard', 'glass'] },
    color: { control: 'select', options: ['primary', 'secondary', 'inherit'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    disabled: false,
    variant: 'standard',
    color: 'primary',
    label: 'Completion',
  },
  render: (args: Parameters<typeof Slider>[0]) => {
    const [value, setValue] = createSignal(35);
    return <Slider {...args} value={value()} onChange={setValue} />;
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px', width: '420px' }}>
      <Slider label="Primary" defaultValue={35} showValue />
      <Slider label="Secondary" defaultValue={60} color="secondary" showValue />
      <Slider label="Glass" defaultValue={45} variant="glass" showValue />
      <Slider label="Disabled" defaultValue={70} disabled showValue />
    </div>
  ),
};
