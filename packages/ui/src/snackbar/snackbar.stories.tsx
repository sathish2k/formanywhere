import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Snackbar } from './index';

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['bottom', 'top'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '8px 12px',
            border: 'none',
            'border-radius': '8px',
            background: 'var(--m3-color-primary)',
            color: 'var(--m3-color-on-primary)',
          }}
        >
          Show Snackbar
        </button>
        <Snackbar
          open={open()}
          onClose={() => setOpen(false)}
          message="Saved successfully"
          action="Undo"
          onAction={() => setOpen(false)}
        />
      </>
    );
  },
};
