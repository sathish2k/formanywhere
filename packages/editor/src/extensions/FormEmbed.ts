/**
 * FormEmbed — Embeddable form block rendered with @formanywhere/ui components.
 *
 * Uses a NodeView with solid-js/web render() to mount:
 *   - Card (outlined container)
 *   - Stack (flex layout)
 *   - Icon (form icon)
 *   - Typography (title + description text)
 *   - Divider (separator)
 */
import { Node, mergeAttributes } from '@tiptap/core';
import { render } from 'solid-js/web';
import { Card } from '@formanywhere/ui/card';
import { Stack } from '@formanywhere/ui/stack';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Divider } from '@formanywhere/ui/divider';

export const FormEmbed = Node.create({
  name: 'formEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      formId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-form-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-form-embed': HTMLAttributes.formId,
        class: 'form-embed-block',
      }),
      0,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.classList.add('form-embed-block');
      dom.dataset.formEmbed = node.attrs.formId || '';
      dom.contentEditable = 'false';

      const mount = document.createElement('div');
      dom.appendChild(mount);

      const formId = node.attrs.formId || 'Select a form';

      const dispose = render(() => (
        Card({
          variant: 'outlined',
          padding: 'lg',
          direction: 'column',
          align: 'center',
          gap: 'sm',
          class: 'form-embed-card',
          children: [
            Stack({
              direction: 'row',
              align: 'center',
              gap: 'sm',
              children: [
                Icon({ name: 'layout', size: 24 }),
                Typography({
                  variant: 'title-medium',
                  color: 'primary',
                  children: `Interactive Form: ${formId}`,
                }),
              ],
            }),
            Divider({}),
            Typography({
              variant: 'body-small',
              color: 'on-surface-variant',
              align: 'center',
              children: 'Readers can fill this form directly inside the blog post!',
            }),
          ],
        })
      ), mount);

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'formEmbed') return false;
          dom.dataset.formEmbed = updatedNode.attrs.formId || '';
          return true;
        },
        destroy() {
          dispose();
        },
      };
    };
  },
});
