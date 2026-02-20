import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Modal } from './index';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open modal</button>
        <Modal
          open={open()}
          onClose={() => setOpen(false)}
          title="Modal title"
          actions={<button onClick={() => setOpen(false)}>Close</button>}
        >
          Modal content body.
        </Modal>
      </>
    );
  },
};
