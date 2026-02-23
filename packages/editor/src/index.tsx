export { default as RichTextEditor } from './Editor';
export type { RichTextEditorProps } from './Editor';
// Extensions (consumers can compose their own editors)
export { FormEmbed } from './extensions/FormEmbed';
export { ImageBlock } from './extensions/ImageBlock';
export { CodeBlockNode } from './extensions/CodeBlockNode';
// Hook (for advanced use — bring-your-own-UI)
export { useEditor } from './hooks/useEditor';
export type { EditorActions, UseEditorOptions } from './hooks/useEditor';
// Re-export solid-tiptap utilities for custom toolbar reactivity
export { createEditorTransaction, createTiptapEditor, useEditorHTML, useEditorIsActive, useEditorJSON } from 'solid-tiptap';
