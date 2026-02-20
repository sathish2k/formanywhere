import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Menu, MenuItem, MenuDivider } from './index';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Supports keyboard navigation plus selectable item semantics (`menuitem`, `menuitemcheckbox`, `menuitemradio`) and configurable `closeOnSelect` behavior.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    let anchorEl: HTMLButtonElement | undefined;
    return (
      <>
        <button ref={anchorEl} onClick={() => setOpen((prev) => !prev)}>
          Open menu
        </button>
        <Menu open={open()} onClose={() => setOpen(false)} anchorEl={anchorEl}>
          <MenuItem label="New file" onClick={() => setOpen(false)} />
          <MenuItem label="Save" onClick={() => setOpen(false)} />
          <MenuDivider />
          <MenuItem label="Delete" onClick={() => setOpen(false)} />
        </Menu>
      </>
    );
  },
};

export const PersistentMenu: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Menu-level `closeOnSelect={false}` keeps the menu open while selecting items.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = createSignal(false);
    const [lastAction, setLastAction] = createSignal('none');
    let anchorEl: HTMLButtonElement | undefined;

    return (
      <>
        <button ref={anchorEl} onClick={() => setOpen((prev) => !prev)}>
          Open persistent menu
        </button>
        <div style={{ 'margin-top': '8px', 'font-size': '14px', color: 'var(--m3-color-on-surface-variant)' }}>
          Last action: <strong>{lastAction()}</strong>
        </div>
        <Menu open={open()} onClose={() => setOpen(false)} anchorEl={anchorEl} closeOnSelect={false}>
          <MenuItem label="Rename" onClick={() => setLastAction('Rename')} />
          <MenuItem label="Duplicate" onClick={() => setLastAction('Duplicate')} />
          <MenuDivider />
          <MenuItem label="Close" onClick={() => setOpen(false)} closeOnSelect />
        </Menu>
      </>
    );
  },
};

export const SelectableItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows `type` + `selected` semantics for checkbox and radio menu items, with per-item close behavior.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = createSignal(false);
    const [autosave, setAutosave] = createSignal(true);
    const [syncMode, setSyncMode] = createSignal<'manual' | 'auto'>('auto');
    let anchorEl: HTMLButtonElement | undefined;

    return (
      <>
        <button ref={anchorEl} onClick={() => setOpen((prev) => !prev)}>
          Open selectable menu
        </button>
        <Menu open={open()} onClose={() => setOpen(false)} anchorEl={anchorEl} closeOnSelect={false}>
          <MenuItem
            label="Enable autosave"
            type="checkbox"
            selected={autosave()}
            onClick={() => setAutosave((prev) => !prev)}
          />
          <MenuDivider />
          <MenuItem
            label="Manual sync"
            type="radio"
            selected={syncMode() === 'manual'}
            onClick={() => setSyncMode('manual')}
          />
          <MenuItem
            label="Auto sync"
            type="radio"
            selected={syncMode() === 'auto'}
            onClick={() => setSyncMode('auto')}
          />
          <MenuDivider />
          <MenuItem label="Done" closeOnSelect onClick={() => setOpen(false)} />
        </Menu>
      </>
    );
  },
};
