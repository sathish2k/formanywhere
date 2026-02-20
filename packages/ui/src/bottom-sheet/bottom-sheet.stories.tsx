import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { BottomSheet } from './index';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open bottom sheet</button>
        <BottomSheet open={open()} onClose={() => setOpen(false)}>
          <div style={{ padding: '16px', display: 'grid', gap: '10px' }}>
            <strong>Quick actions</strong>
            <button onClick={() => setOpen(false)}>Dismiss</button>
          </div>
        </BottomSheet>
      </>
    );
  },
};
