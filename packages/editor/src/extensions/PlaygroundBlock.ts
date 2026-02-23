import { Node, mergeAttributes } from '@tiptap/core';
import { loadSandpackClient } from '@codesandbox/sandpack-client';
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { Button } from '@formanywhere/ui/button';

export const PlaygroundBlock = Node.create({
  name: 'playgroundBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,

  addAttributes() {
    return {
      language: {
        default: 'javascript',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="playground"]',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'playground' }), ['pre', ['code', 0]]];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('div');
      dom.classList.add('playground-block-node');
      dom.style.border = '1px solid #e2e8f0';
      dom.style.borderRadius = '8px';
      dom.style.overflow = 'hidden';
      dom.style.margin = '1rem 0';

      const header = document.createElement('div');
      header.style.padding = '8px 16px';
      header.style.backgroundColor = '#f8fafc';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.borderBottom = '1px solid #e2e8f0';
      header.contentEditable = 'false';

      const title = document.createElement('span');
      title.textContent = 'Interactive Playground';
      title.style.fontWeight = '600';
      title.style.fontSize = '14px';
      title.style.color = '#475569';
      header.appendChild(title);

      const actionsMount = document.createElement('div');
      header.appendChild(actionsMount);
      dom.appendChild(header);

      const editorContainer = document.createElement('div');
      editorContainer.style.padding = '16px';
      editorContainer.style.backgroundColor = '#1e293b';
      editorContainer.style.color = '#f8fafc';
      editorContainer.style.fontFamily = 'monospace';
      
      const pre = document.createElement('pre');
      pre.style.margin = '0';
      const code = document.createElement('code');
      code.style.outline = 'none';
      pre.appendChild(code);
      editorContainer.appendChild(pre);
      dom.appendChild(editorContainer);

      const previewContainer = document.createElement('div');
      previewContainer.style.borderTop = '1px solid #e2e8f0';
      previewContainer.style.height = '250px';
      previewContainer.style.display = 'none';
      
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      previewContainer.appendChild(iframe);
      dom.appendChild(previewContainer);

      let client: any = null;
      const [isRunning, setIsRunning] = createSignal(false);

      const runCode = async () => {
        if (isRunning()) return;
        setIsRunning(true);
        previewContainer.style.display = 'block';
        
        const codeContent = node.textContent;
        
        if (client) {
          client.updateSandbox({
            files: {
              '/index.js': { code: codeContent }
            }
          });
        } else {
          client = await loadSandpackClient(iframe, {
            files: {
              '/index.js': { code: codeContent }
            },
            template: 'vanilla' as any
          });
        }
        setIsRunning(false);
      };

      const disposeActions = render(() => {
        return Button({
          variant: 'filled',
          size: 'sm',
          get children() { return isRunning() ? 'Running...' : 'Run Code'; },
          onClick: runCode
        });
      }, actionsMount);

      return {
        dom,
        contentDOM: code,
        stopEvent(event: Event) {
          return !code.contains(event.target as globalThis.Node);
        },
        ignoreMutation(mutation: any) {
          return !code.contains(mutation.target as globalThis.Node);
        },
        destroy() {
          disposeActions();
          if (client) {
            client.destroy();
          }
        }
      };
    };
  }
});
