import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Drawer } from './index';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open drawer</button>
        <Drawer open={open()} onClose={() => setOpen(false)} width="280px">
          <div style={{ padding: '16px', display: 'grid', gap: '8px' }}>
            <strong>Navigation</strong>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </Drawer>
      </>
    );
  },
};
