import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { TextField } from './index';

const meta: Meta<typeof TextField> = {
  title: 'Components/Textfield',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'email', 'number', 'password', 'search', 'tel', 'time', 'date', 'url', 'textarea'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'outlined',
    size: 'md',
    label: 'Form Title',
    supportingText: 'Enter a clear and concise title',
    placeholder: 'Weekly Inspection Form',
    type: 'text',
    required: false,
    disabled: false,
    error: false,
  },
  render: (args: Parameters<typeof TextField>[0]) => {
    const [value, setValue] = createSignal('');
    return (
      <TextField
        {...args}
        value={value()}
        onInput={(event) => setValue((event.target as HTMLInputElement).value)}
      />
    );
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px', width: '360px' }}>
      <TextField variant="outlined" label="Outlined" placeholder="Enter value" />
      <TextField variant="filled" label="Filled" placeholder="Enter value" />
      <TextField label="Error" error errorText="This field is required" value="" />
      <TextField label="Disabled" disabled value="Read only value" />
      <TextField label="Textarea" type="textarea" supportingText="Multi-line input" />
    </div>
  ),
};
