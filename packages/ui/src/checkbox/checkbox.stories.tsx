import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Checkbox } from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Accept terms and privacy policy',
    size: 'md',
    disabled: false,
    error: false,
    indeterminate: false,
  },
  render: (args: Parameters<typeof Checkbox>[0]) => {
    const [checked, setChecked] = createSignal(false);
    return <Checkbox {...args} checked={checked()} onChange={setChecked} />;
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '12px', padding: '16px' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Error" error checked />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
};
