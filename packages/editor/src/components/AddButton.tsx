/**
 * AddButton — Medium/Dante3-style "+" button on empty lines.
 * Expands to reveal block insert options using Menu & MenuItem.
 *
 * Uses @formanywhere/ui:
 *   - FAB (circular + button)
 *   - Menu + MenuItem (expandable block inserter)
 *   - Icon (all icons)
 */
import { Component, createSignal } from 'solid-js';
import type { Editor } from '@tiptap/core';
import { FAB } from '@formanywhere/ui/fab';
import { Menu, MenuItem, MenuDivider } from '@formanywhere/ui/menu';
import { Icon } from '@formanywhere/ui/icon';
import type { EditorActions } from '../hooks/useEditor';

interface Props {
  editor: Editor;
  actions: EditorActions;
  onImageClick: () => void;
  onVideoClick: () => void;
  onFormClick: () => void;
}

export const AddButton: Component<Props> = (props) => {
  const [open, setOpen] = createSignal(false);
  let anchorRef!: HTMLButtonElement;

  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open());
  };

  const act = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <div class="dante-add-button-wrap">
      {/* The signature circular + button — FAB from UI */}
      <FAB
        ref={(el: HTMLButtonElement) => { anchorRef = el; }}
        variant="surface"
        size="sm"
        icon={<Icon name="plus" size={18} />}
        class={`dante-add-fab ${open() ? 'is-open' : ''}`}
        onMouseDown={toggle}
        aria-label="Insert block"
      />

      {/* Block insert menu — Menu from UI */}
      <Menu
        open={open()}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef}
        position="bottom-start"
      >
        <MenuItem
          label="Image"
          leadingIcon={<Icon name="image" size={18} />}
          onClick={() => act(props.onImageClick)}
        />
        <MenuItem
          label="Video"
          leadingIcon={<Icon name="video" size={18} />}
          onClick={() => act(props.onVideoClick)}
        />
        <MenuDivider />
        <MenuItem
          label="Divider"
          leadingIcon={<Icon name="divider" size={18} />}
          onClick={() => act(() => props.actions.insertDivider())}
        />
        <MenuItem
          label="Code Block"
          leadingIcon={<Icon name="code-block" size={18} />}
          onClick={() => act(() => props.actions.toggleCodeBlock())}
        />
        <MenuDivider />
        <MenuItem
          label="Embed Form"
          leadingIcon={<Icon name="layout" size={18} />}
          onClick={() => act(props.onFormClick)}
        />
        <MenuItem
          label="AI Assist"
          leadingIcon={<Icon name="sparkle" size={18} />}
          style={{ color: '#AF52DE' }}
          onClick={() => act(() => props.actions.insertAI())}
        />
      </Menu>
    </div>
  );
};
