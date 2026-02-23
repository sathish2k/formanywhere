import { render } from 'solid-js/web';
import tippy from 'tippy.js';
import { CommandList } from '../components/CommandList';

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: 'heading-1',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: 'heading-2',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: 'heading-3',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bulleted list.',
      icon: 'list',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: 'list-ordered',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      icon: 'quote',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: 'Code Block',
      description: 'Capture a code snippet.',
      icon: 'code-block',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: 'Divider',
      description: 'Visually divide blocks.',
      icon: 'divider',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: 'Interactive Playground',
      description: 'Embed a live code playground.',
      icon: 'play',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).insertContent({ type: 'playgroundBlock' }).run();
      },
    },
    {
      title: 'Embed Form',
      description: 'Embed a FormAnywhere form.',
      icon: 'layout',
      command: ({ editor, range }: any) => {
        // We can't easily open the dialog from here without passing the action down,
        // so we'll just insert a placeholder form for now or trigger a custom event
        editor.chain().focus().deleteRange(range).insertContent({ type: 'formEmbed', attrs: { formId: 'my-form' } }).run();
      },
    },
    {
      title: 'AI Assist',
      description: 'Get AI suggestions.',
      icon: 'sparkle',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).insertContent('<p><em>✨ AI Suggestion: Consider adding a personal anecdote here to increase reader engagement!</em></p>').run();
      },
    },
  ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
};

export const suggestion = {
  items: getSuggestionItems,
  render: () => {
    let component: any;
    let popup: any;
    let dispose: any;

    return {
      onStart: (props: any) => {
        const container = document.createElement('div');
        
        dispose = render(() => {
          return CommandList({
            items: props.items,
            command: (item) => {
              item.command(props);
            }
          });
        }, container);

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: container,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: any) {
        // We need to re-render the component with new items
        // In a real Solid app, we'd use a signal for items, but for this bridge we'll just recreate
        if (dispose) dispose();
        
        const container = document.createElement('div');
        dispose = render(() => {
          return CommandList({
            items: props.items,
            command: (item) => {
              item.command(props);
            }
          });
        }, container);
        
        popup[0].setContent(container);
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        
        // The CommandList component handles its own keyboard navigation via document listener
        // But we need to prevent Tiptap from handling Enter if we're showing the menu
        if (props.event.key === 'Enter' || props.event.key === 'ArrowUp' || props.event.key === 'ArrowDown') {
          return true;
        }

        return false;
      },

      onExit() {
        if (popup) {
          popup[0].destroy();
        }
        if (dispose) {
          dispose();
        }
      },
    };
  },
};
