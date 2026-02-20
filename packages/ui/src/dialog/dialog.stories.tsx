import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Dialog } from './index';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Material 3 dialog with `onClose(reason)` and optional `onOpenChange` callbacks for state coordination.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic controlled dialog with title, content, and actions.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open dialog</button>
        <Dialog
          open={open()}
          onClose={() => setOpen(false)}
          title="Confirm action"
          actions={
            <>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={() => setOpen(false)}>Confirm</button>
            </>
          }
        >
          This action can’t be undone.
        </Dialog>
      </>
    );
  },
};

export const CloseReasons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `onClose(reason)` and `onOpenChange(open)` callbacks for tracking close source and state transitions.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = createSignal(false);
    const [lastReason, setLastReason] = createSignal<string>('none');
    const [lastOpenState, setLastOpenState] = createSignal<string>('closed');

    return (
      <div style={{ display: 'grid', gap: '12px' }}>
        <button onClick={() => setOpen(true)}>Open with reason tracking</button>
        <div style={{ 'font-size': '14px', color: 'var(--m3-color-on-surface-variant)' }}>
          Last close reason: <strong>{lastReason()}</strong> • Last open state: <strong>{lastOpenState()}</strong>
        </div>
        <Dialog
          open={open()}
          onClose={(reason) => {
            setLastReason(reason ?? 'programmatic');
            setOpen(false);
          }}
          onOpenChange={(next) => setLastOpenState(next ? 'open' : 'closed')}
          title="Track close events"
          actions={<button onClick={() => setOpen(false)}>Done</button>}
        >
          Press Escape, click backdrop, or use action to test close behavior.
        </Dialog>
      </div>
    );
  },
};

export const AlertDialogRole: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open alert dialog</button>
        <Dialog
          open={open()}
          role="alertdialog"
          ariaLabel="Delete confirmation"
          onClose={() => setOpen(false)}
          title="Delete form?"
          actions={
            <>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={() => setOpen(false)}>Delete</button>
            </>
          }
        >
          This action permanently removes the selected form.
        </Dialog>
      </>
    );
  },
};
