/**
 * ImageBlock — Enhanced Image extension with Medium/Dante3-style features.
 *
 * Features:
 * - Figure wrapper with figcaption
 * - Alignment/direction controls (center, wide, full-width) via SegmentedButton
 * - Caption editing (contentEditable figcaption, managed via node attrs)
 * - Progressive image loading via BlogImage (LQIP + AVIF/WebP)
 * - Upload progress support
 *
 * Uses @formanywhere/ui components rendered into the vanilla DOM NodeView
 * via solid-js/web render():
 *   - BlogImage (progressive loading with AVIF/WebP fallback)
 *   - SegmentedButton (alignment selector — reactive via getter props)
 *   - Icon (align icons)
 *
 * Event isolation (ProseMirror NodeView API only — NO stopPropagation):
 *   - stopEvent: returns true for ALL events (atom node)
 *   - ignoreMutation: returns true to prevent ProseMirror DOM interference
 *
 * IMPORTANT: Do NOT use stopPropagation/stopImmediatePropagation here.
 * SolidJS uses event delegation on `document`. Stopping propagation
 * prevents SolidJS handlers (onClick, onKeyDown, etc.) from ever firing.
 */
import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { SegmentedButton } from '@formanywhere/ui/segmented-button';
import { Icon } from '@formanywhere/ui/icon';
import { BlogImage } from '@formanywhere/ui/blog-image';

export type ImageDirection = 'center' | 'wide' | 'fill';

export const ImageBlock = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: '' },
      direction: { default: 'center' as ImageDirection },
    };
  },

  // Output figure + figcaption so captions appear in getHTML() / preview
  renderHTML({ HTMLAttributes }) {
    const { caption, direction, ...imgAttrs } = HTMLAttributes;
    return [
      'figure',
      { 'data-direction': direction || 'center', class: 'image-block' },
      ['img', mergeAttributes(this.options.HTMLAttributes, imgAttrs)],
      ['figcaption', { class: 'image-block-caption' }, caption || ''],
    ];
  },

  // Parse both <figure> wrapper and plain <img> formats
  parseHTML() {
    return [
      {
        tag: 'figure.image-block',
        getAttrs: (el: HTMLElement) => {
          const img = el.querySelector('img');
          if (!img) return false;
          return {
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
            caption: el.querySelector('figcaption')?.textContent || '',
            direction: el.getAttribute('data-direction') || 'center',
          };
        },
      },
      { tag: 'img[src]' },
    ];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      // ── Figure (root) ──
      const figure = document.createElement('figure');
      figure.classList.add('image-block');
      figure.dataset.direction = node.attrs.direction || 'center';

      // ── Image container — BlogImage rendered via SolidJS ──
      const imgWrap = document.createElement('div');
      imgWrap.classList.add('image-block-img-wrap');

      // Reactive signals so BlogImage updates without re-mount
      const [imgSrc, setImgSrc] = createSignal<string>(node.attrs.src || '');
      const [imgAlt, setImgAlt] = createSignal<string>(node.attrs.alt || '');
      const [imgWidth, setImgWidth] = createSignal<number | undefined>(node.attrs.width || undefined);
      const [imgHeight, setImgHeight] = createSignal<number | undefined>(node.attrs.height || undefined);

      // Click anywhere on the image to select the node
      imgWrap.addEventListener('click', () => {
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos != null) editor.commands.setNodeSelection(pos);
        }
      });

      const disposeImage = render(() => (
        BlogImage({
          get src() { return imgSrc(); },
          get alt() { return imgAlt(); },
          get width() { return imgWidth(); },
          get height() { return imgHeight(); },
          loading: 'eager',
          class: 'image-block-img',
          style: {
            'border-radius': '0',
          },
        })
      ), imgWrap);

      figure.appendChild(imgWrap);

      // ── Alignment toolbar — SegmentedButton ──
      const toolbarMount = document.createElement('div');
      toolbarMount.classList.add('image-block-toolbar');
      toolbarMount.contentEditable = 'false';

      const [currentDir, setCurrentDir] = createSignal<string>(node.attrs.direction || 'center');

      const alignSegments = [
        { value: 'center', label: '', icon: Icon({ name: 'align-left', size: 16 }) },
        { value: 'wide', label: '', icon: Icon({ name: 'align-center', size: 16 }) },
        { value: 'fill', label: '', icon: Icon({ name: 'align-right', size: 16 }) },
      ];

      const disposeToolbar = render(() => (
        SegmentedButton({
          segments: alignSegments,
          get value() { return currentDir(); },
          showCheckmark: false,
          size: 'sm',
          class: 'image-block-align-segment',
          onChange: (value: string) => {
            if (typeof getPos === 'function') {
              const pos = getPos();
              if (pos == null) return;
              const nodeAtPos = editor.view.state.doc.nodeAt(pos);
              if (!nodeAtPos) return;
              editor.view.dispatch(
                editor.view.state.tr.setNodeMarkup(pos, undefined, {
                  ...nodeAtPos.attrs,
                  direction: value,
                })
              );
            }
          },
        })
      ), toolbarMount);

      figure.appendChild(toolbarMount);

      // ── Caption ──
      const caption = document.createElement('figcaption');
      caption.classList.add('image-block-caption');
      if (editor.isEditable) {
        caption.contentEditable = 'true';
      }
      caption.dataset.placeholder = 'Type a caption (optional)';
      caption.textContent = node.attrs.caption || '';

      // Sync caption text → node attrs on input (direct listener, not SolidJS)
      caption.addEventListener('input', () => {
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos == null) return;
          const nodeAtPos = editor.view.state.doc.nodeAt(pos);
          if (!nodeAtPos) return;
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(pos, undefined, {
              ...nodeAtPos.attrs,
              caption: caption.textContent || '',
            })
          );
        }
      });

      // Handle specific keys in caption (direct listener):
      // - Enter → exit caption, create new paragraph below image
      // - Escape / Tab → exit caption, refocus editor
      // No stopPropagation needed: stopEvent() prevents ProseMirror handling
      caption.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          caption.blur();
          // Create a new paragraph after this image node
          if (typeof getPos === 'function') {
            const pos = getPos();
            if (pos != null) {
              const nodeAtPos = editor.view.state.doc.nodeAt(pos);
              if (nodeAtPos) {
                const insertPos = pos + nodeAtPos.nodeSize;
                editor.commands.insertContentAt(insertPos, { type: 'paragraph' });
                editor.commands.focus(insertPos + 1);
              }
            }
          }
        }
        if (e.key === 'Escape' || e.key === 'Tab') {
          e.preventDefault();
          caption.blur();
          editor.commands.focus();
        }
      });

      figure.appendChild(caption);

      return {
        dom: figure,

        // Atom node — ProseMirror should not handle ANY events here.
        // Events still propagate to `document` for SolidJS delegation.
        stopEvent: () => true,

        // Ignore ALL mutations — we manage the DOM ourselves
        ignoreMutation: () => true,

        update(updatedNode) {
          if (updatedNode.type.name !== 'image') return false;
          // Update reactive signals — BlogImage re-renders automatically
          setImgSrc(updatedNode.attrs.src || '');
          setImgAlt(updatedNode.attrs.alt || '');
          setImgWidth(updatedNode.attrs.width || undefined);
          setImgHeight(updatedNode.attrs.height || undefined);
          // Only update caption text if the caption is NOT focused
          // (to prevent cursor position loss during typing)
          if (document.activeElement !== caption) {
            caption.textContent = updatedNode.attrs.caption || '';
          }
          const dir = updatedNode.attrs.direction || 'center';
          setCurrentDir(dir);
          figure.dataset.direction = dir;
          return true;
        },

        selectNode() {
          figure.classList.add('is-selected');
        },
        deselectNode() {
          figure.classList.remove('is-selected');
        },

        destroy() {
          disposeImage();
          disposeToolbar();
        },
      };
    };
  },
});
