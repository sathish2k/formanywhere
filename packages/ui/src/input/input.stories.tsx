import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'search'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Email',
    type: 'email',
    variant: 'outlined',
    placeholder: 'you@company.com',
    supportingText: 'We never share your email',
  },
  render: (args: Parameters<typeof Input>[0]) => {
    const [value, setValue] = createSignal('');
    return (
      <Input
        {...args}
        value={value()}
        onInput={(event) => setValue((event.target as HTMLInputElement).value)}
      />
    );
  },
};

export const Variants: Story = {
  render: () => (
    <Input
      label="Email"
      type="email"
      variant="outlined"
      value="invalid"
      error
      errorText="Please enter a valid email"
    />
  ),
};
