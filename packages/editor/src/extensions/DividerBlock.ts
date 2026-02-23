/**
 * DividerBlock — Custom HorizontalRule that renders using @formanywhere/ui Divider.
 *
 * Replaces the default <hr> with the M3 Divider component from our UI library.
 * Uses solid-js/web render() to mount the Divider into the NodeView.
 */
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { render } from 'solid-js/web';
import { Divider } from '@formanywhere/ui/divider';

export const DividerBlock = HorizontalRule.extend({
  addNodeView() {
    return () => {
      const dom = document.createElement('div');
      dom.classList.add('divider-block');
      dom.contentEditable = 'false';

      const dispose = render(() => Divider({ class: 'divider-block-line' }), dom);

      return {
        dom,
        stopEvent: () => true,
        destroy() {
          dispose();
        },
      };
    };
  },
});
