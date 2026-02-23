/**
 * useEditor — Medium-style TipTap editor hook using solid-tiptap.
 *
 * Uses createTiptapEditor() for proper SolidJS reactive integration.
 * No toolbar — formatting via bubble menu & add-button only.
 *
 * Extensions:
 *   - StarterKit (codeBlock, link, underline disabled — registered separately)
 *   - ImageBlock (figure wrapper, caption, alignment)
 *   - CodeBlockNode (lowlight syntax highlighting + language selector)
 *   - BubbleMenu (only on text selection)
 *   - FloatingMenu (only on empty paragraphs)
 *   - Link, Underline, Highlight, TextAlign, TextStyle, Color, Youtube, FormEmbed
 */
import { Accessor } from 'solid-js';
import type { Editor } from '@tiptap/core';
import { createTiptapEditor, createEditorTransaction } from 'solid-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { ImageBlock } from '../extensions/ImageBlock';
import { CodeBlockNode, lowlight } from '../extensions/CodeBlockNode';
import { FormEmbed } from '../extensions/FormEmbed';
import { DividerBlock } from '../extensions/DividerBlock';
import { PlaygroundBlock } from '../extensions/PlaygroundBlock';
import { DraftHistory } from '../extensions/DraftHistory';
import { DynamicVariables } from '../extensions/DynamicVariables';
import { SlashCommand } from '../extensions/SlashCommand';
import { suggestion } from '../extensions/slash-suggestion';
import { MermaidBlock } from '../extensions/MermaidBlock';

export interface UseEditorOptions {
  content: string;
  placeholder?: string;
  onChange: (html: string) => void;
  editorEl: Accessor<HTMLDivElement | undefined>;
  onHistoryChange?: (history: any[]) => void;
  variables?: Record<string, string>;
}

export interface EditorActions {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleStrike: () => void;
  toggleCode: () => void;
  toggleHighlight: () => void;
  setLink: (url: string) => void;
  unsetLink: () => void;
  getLinkHref: () => string;
  setParagraph: () => void;
  setHeading: (level: 1 | 2 | 3) => void;
  toggleBlockquote: () => void;
  toggleCodeBlock: () => void;
  toggleBullet: () => void;
  toggleOrdered: () => void;
  setAlign: (align: 'left' | 'center' | 'right') => void;
  insertImage: (src: string) => void;
  insertImageFile: (file: File) => void;
  insertVideo: (src: string, width: number, height: number) => void;
  insertDivider: () => void;
  insertForm: (formId: string) => void;
  insertPlayground: () => void;
  insertAI: () => void;
  undo: () => void;
  redo: () => void;
  /** Reactive isActive — use createEditorTransaction in components for reactive tracking */
  isActive: (name: string, attrs?: Record<string, unknown>) => boolean;
  focus: () => void;
}

export function useEditor(opts: UseEditorOptions): [Accessor<Editor | undefined>, EditorActions] {
  const editor = createTiptapEditor(() => {
    const el = opts.editorEl();
    if (!el) return undefined as unknown as { element: HTMLDivElement; extensions: never[] };

    return {
      element: el,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          codeBlock: false,
          horizontalRule: false,
          link: false,
          underline: false,
        }),
        CodeBlockNode.configure({ lowlight }),
        DividerBlock,
        Underline,
        Highlight.configure({ multicolor: false }),
        TextStyle,
        Color,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ImageBlock.configure({ inline: false, allowBase64: true }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
        }),
        Youtube.configure({ controls: true }),
        FormEmbed,
        PlaygroundBlock,
        MermaidBlock,
        DraftHistory.configure({
          onHistoryChange: opts.onHistoryChange,
        }),
        DynamicVariables.configure({
          variables: opts.variables || {},
        }),
        SlashCommand.configure({
          suggestion,
        }),
        Placeholder.configure({
          placeholder: opts.placeholder ?? 'Tell your story\u2026',
        }),
      ],
      content: opts.content,
      editorProps: {
        attributes: {
          class: 'dante-editor-content',
          spellcheck: 'true',
        },
        handleDrop: (view, event) => {
          const files = event.dataTransfer?.files;
          if (!files || files.length === 0) return false;
          const imageFile = Array.from(files).find((f) => f.type.startsWith('image/'));
          if (!imageFile) return false;

          event.preventDefault();
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            const { state } = view;
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (pos) {
              const tr = state.tr.insert(pos.pos, state.schema.nodes.image.create({ src }));
              view.dispatch(tr);
            }
          };
          reader.readAsDataURL(imageFile);
          return true;
        },
        handlePaste: (view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              const file = item.getAsFile();
              if (!file) continue;
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                const { state } = view;
                const tr = state.tr.replaceSelectionWith(state.schema.nodes.image.create({ src }));
                view.dispatch(tr);
              };
              reader.readAsDataURL(file);
              return true;
            }
          }
          return false;
        },
      },
      onUpdate: ({ editor: e }) => {
        opts.onChange(e.getHTML());
      },
    };
  });

  const e = () => editor();

  const actions: EditorActions = {
    toggleBold: () => e()?.chain().focus().toggleBold().run(),
    toggleItalic: () => e()?.chain().focus().toggleItalic().run(),
    toggleUnderline: () => e()?.chain().focus().toggleUnderline().run(),
    toggleStrike: () => e()?.chain().focus().toggleStrike().run(),
    toggleCode: () => e()?.chain().focus().toggleCode().run(),
    toggleHighlight: () => e()?.chain().focus().toggleHighlight().run(),
    setLink: (url) => e()?.chain().focus().extendMarkRange('link').setLink({ href: url }).run(),
    unsetLink: () => e()?.chain().focus().extendMarkRange('link').unsetLink().run(),
    getLinkHref: () => e()?.getAttributes('link').href ?? '',
    setParagraph: () => e()?.chain().focus().setParagraph().run(),
    setHeading: (level) => e()?.chain().focus().toggleHeading({ level }).run(),
    toggleBlockquote: () => e()?.chain().focus().toggleBlockquote().run(),
    toggleCodeBlock: () => e()?.chain().focus().toggleCodeBlock().run(),
    toggleBullet: () => e()?.chain().focus().toggleBulletList().run(),
    toggleOrdered: () => e()?.chain().focus().toggleOrderedList().run(),
    setAlign: (align) => e()?.chain().focus().setTextAlign(align).run(),
    insertImage: (src) => e()?.chain().focus().setImage({ src }).run(),
    insertImageFile: (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        e()?.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    },
    insertVideo: (src, width, height) => e()?.commands.setYoutubeVideo({ src, width, height }),
    insertDivider: () => e()?.chain().focus().setHorizontalRule().run(),
    insertForm: (formId) =>
      e()?.chain().focus().insertContent({ type: 'formEmbed', attrs: { formId } }).run(),
    insertPlayground: () =>
      e()?.chain().focus().insertContent({ type: 'playgroundBlock' }).run(),
    insertAI: () =>
      e()
        ?.chain()
        .focus()
        .insertContent(
          '<p><em>\u2728 AI Suggestion: Consider adding a personal anecdote here to increase reader engagement!</em></p>'
        )
        .run(),
    undo: () => e()?.chain().focus().undo().run(),
    redo: () => e()?.chain().focus().redo().run(),
    isActive: (name, attrs) => !!e()?.isActive(name, attrs),
    focus: () => e()?.chain().focus().run(),
  };

  return [editor as Accessor<Editor | undefined>, actions];
}
