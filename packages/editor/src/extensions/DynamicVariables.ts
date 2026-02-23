import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface DynamicVariablesOptions {
  variables: Record<string, string>;
}

export const DynamicVariables = Extension.create<DynamicVariablesOptions>({
  name: 'dynamicVariables',

  addOptions() {
    return {
      variables: {},
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    return [
      new Plugin({
        key: new PluginKey('dynamicVariables'),
        state: {
          init(_, { doc }) {
            return options?.variables || {};
          },
          apply(tr, oldState) {
            const meta = tr.getMeta('dynamicVariables');
            if (meta) {
              return { ...oldState, ...meta };
            }
            return oldState;
          },
        },
        props: {
          decorations(state) {
            const variables = this.getState(state);
            if (!variables || Object.keys(variables).length === 0) return DecorationSet.empty;

            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const text = node.text || '';
              const regex = /\[([^\]]+)\]/g;
              let match;

              while ((match = regex.exec(text)) !== null) {
                const varName = match[1];
                if (variables[varName] !== undefined) {
                  const start = pos + match.index;
                  const end = start + match[0].length;

                  decorations.push(
                    Decoration.inline(start, end, {
                      nodeName: 'span',
                      class: 'dynamic-variable',
                      'data-variable': varName,
                      style: 'background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px; color: #0f172a; font-weight: 500;',
                    }, {
                      // Add a widget to show the resolved value on hover or inline
                      // For simplicity, we just style the text itself, but we could replace it visually
                    })
                  );
                  
                  // We can also add a widget to show the actual value
                  decorations.push(
                    Decoration.widget(end, () => {
                      const span = document.createElement('span');
                      span.className = 'dynamic-variable-value';
                      span.textContent = ` = ${variables[varName]}`;
                      span.style.color = '#64748b';
                      span.style.fontSize = '0.85em';
                      span.style.marginLeft = '4px';
                      span.style.userSelect = 'none';
                      return span;
                    })
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
