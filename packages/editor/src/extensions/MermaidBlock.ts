import { Node, mergeAttributes } from '@tiptap/core';
import { SolidNodeViewRenderer } from 'solid-tiptap';
import { MermaidNodeView } from '../components/MermaidNodeView';

export const MermaidBlock = Node.create({
  name: 'mermaidBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,

  addAttributes() {
    return {
      language: {
        default: 'mermaid',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node) => {
          const code = (node as HTMLElement).querySelector('code');
          if (code && code.classList.contains('language-mermaid')) {
            return { language: 'mermaid' };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(HTMLAttributes), ['code', { class: 'language-mermaid' }, 0]];
  },

  addNodeView() {
    return SolidNodeViewRenderer(MermaidNodeView);
  },
});
