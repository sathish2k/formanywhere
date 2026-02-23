/**
 * CodeBlockNode — TipTap CodeBlock with lowlight syntax highlighting
 * and a language selector + copy button in the header.
 *
 * Uses @formanywhere/ui components rendered into the vanilla DOM NodeView
 * via solid-js/web render():
 *   - Select (language picker — outlined variant)
 *   - IconButton (copy button — text variant)
 *   - Icon (copy/check icons)
 *
 * Lowlight decorations are applied to the contentDOM (<code>).
 *
 * Event isolation (ProseMirror NodeView API only — NO stopPropagation):
 *   - stopEvent: returns true for events outside <code> contentDOM
 *   - ignoreMutation: returns true for DOM changes outside <code>
 *
 * IMPORTANT: Do NOT use stopPropagation/stopImmediatePropagation here.
 * SolidJS uses event delegation on `document`. Stopping propagation
 * prevents SolidJS handlers (onClick, onKeyDown, etc.) from ever firing.
 */
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { Select } from '@formanywhere/ui/select';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';

export const lowlight = createLowlight(common);

export const CodeBlockNode = CodeBlockLowlight.extend({
  addNodeView() {
    return ({ node, editor, getPos }) => {
      // ── Root wrapper ──
      const dom = document.createElement('div');
      dom.classList.add('code-block-node');

      // ── Header container ──
      const header = document.createElement('div');
      header.classList.add('code-block-header');
      header.contentEditable = 'false';

      // Mount SolidJS UI components into the header
      const selectMount = document.createElement('div');
      selectMount.classList.add('code-block-select-mount');

      const copyMount = document.createElement('div');
      copyMount.classList.add('code-block-copy-mount');

      header.appendChild(selectMount);
      header.appendChild(copyMount);
      dom.appendChild(header);

      // ── Pre / Code (contentDOM) ──
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      pre.appendChild(code);
      dom.appendChild(pre);

      // Build language options
      const AUTO = { value: '', label: 'Auto' };
      const langOptions = [AUTO, ...lowlight.listLanguages().sort().map((l) => ({ value: l, label: l }))];

      // Track current language for reactivity
      const [currentLang, setCurrentLang] = createSignal<string>(node.attrs.language || '');
      const [copied, setCopied] = createSignal(false);

      // Render Select — reactive via getters (SolidJS tracks through splitProps)
      const disposeSelect = render(() => (
        Select({
          variant: 'outlined',
          size: 'sm',
          label: 'Language',
          options: langOptions,
          get value() { return currentLang(); },
          get disabled() { return !editor.isEditable; },
          onChange: (value: string) => {
            if (typeof getPos === 'function') {
              const pos = getPos();
              if (pos == null) return;
              editor.view.dispatch(
                editor.view.state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  language: value || null,
                })
              );
            }
          },
        })
      ), selectMount);

      // Render copy IconButton — reactive icon via getter
      const disposeCopy = render(() => (
        IconButton({
          variant: 'text',
          size: 'sm',
          get icon() { return Icon({ name: copied() ? 'check' : 'copy', size: 16 }); },
          class: 'code-block-copy-icon-btn',
          'aria-label': 'Copy code',
          onClick: () => {
            const text = pre.textContent || '';
            navigator.clipboard.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          },
        })
      ), copyMount);

      return {
        dom,
        contentDOM: code,

        // ProseMirror skips its own handling for events outside <code>
        // Events still propagate to document (SolidJS delegation works)
        stopEvent(event: Event) {
          return !code.contains(event.target as Node);
        },

        // ProseMirror ignores DOM changes outside <code>
        // (Select dropdown open/close, class toggles, etc.)
        ignoreMutation(mutation: { target: Node }) {
          return !code.contains(mutation.target);
        },

        update(updatedNode) {
          if (updatedNode.type.name !== 'codeBlock') return false;
          setCurrentLang(updatedNode.attrs.language || '');
          return true;
        },

        destroy() {
          disposeSelect();
          disposeCopy();
        },
      };
    };
  },
});
