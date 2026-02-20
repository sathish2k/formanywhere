import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { FocusRing } from './index';

const meta: Meta<typeof FocusRing> = {
  title: 'Components/FocusRing',
  component: FocusRing,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Focus ring primitive for keyboard-focus visibility around interactive surfaces.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    visible: true,
    inward: false,
  },
  render: (args: Parameters<typeof FocusRing>[0]) => (
    <div
      style={{
        position: 'relative',
        width: '220px',
        padding: '14px 16px',
        'border-radius': '12px',
        background: 'var(--m3-color-surface-container-high, #ece6f0)',
      }}
    >
      Focus target surface
      <FocusRing {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [focused, setFocused] = createSignal(false);

    return (
      <button
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: 'relative',
          padding: '12px 16px',
          'border-radius': '12px',
          border: '1px solid var(--m3-color-outline, #79747e)',
          background: 'var(--m3-color-surface, #fff)',
          color: 'var(--m3-color-on-surface, #1d1b20)',
        }}
      >
        Keyboard focus me
        <FocusRing visible={focused()} />
      </button>
    );
  },
};
