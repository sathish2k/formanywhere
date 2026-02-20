import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { TimePicker } from './index';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [time, setTime] = createSignal('09:30');
    return <TimePicker label="Meeting time" value={time()} onChange={setTime} />;
  },
};

export const Variants: Story = {
  render: () => <TimePicker label="Disabled" value="10:15" disabled />,
};
