import { Component, createSignal, onCleanup, onMount, For } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Icon } from '@formanywhere/ui/icon';

interface CommandItem {
  title: string;
  description: string;
  icon: string;
  command: (props: { editor: any; range: any }) => void;
}

interface Props {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export const CommandList: Component<Props> = (props) => {
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      setSelectedIndex((selectedIndex() + props.items.length - 1) % props.items.length);
      return true;
    }

    if (event.key === 'ArrowDown') {
      setSelectedIndex((selectedIndex() + 1) % props.items.length);
      return true;
    }

    if (event.key === 'Enter') {
      selectItem(selectedIndex());
      return true;
    }

    return false;
  };

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  onMount(() => {
    document.addEventListener('keydown', onKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', onKeyDown);
  });

  return (
    <Box
      class="command-list"
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        'border-radius': '8px',
        'box-shadow': '0 4px 20px rgba(0,0,0,0.1)',
        padding: '8px',
        width: '280px',
        'max-height': '320px',
        'overflow-y': 'auto',
      }}
    >
      <For each={props.items}>
        {(item, index) => (
          <div
            class={`command-item ${index() === selectedIndex() ? 'is-selected' : ''}`}
            onClick={() => selectItem(index())}
            style={{
              display: 'flex',
              'align-items': 'center',
              gap: '12px',
              padding: '8px 12px',
              'border-radius': '6px',
              cursor: 'pointer',
              background: index() === selectedIndex() ? '#f1f5f9' : 'transparent',
            }}
          >
            <div style={{
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              width: '32px',
              height: '32px',
              background: 'white',
              border: '1px solid #e2e8f0',
              'border-radius': '6px',
            }}>
              <Icon name={item.icon} size={16} />
            </div>
            <div>
              <div style={{ 'font-weight': '500', 'font-size': '14px', color: '#0f172a' }}>
                {item.title}
              </div>
              <div style={{ 'font-size': '12px', color: '#64748b' }}>
                {item.description}
              </div>
            </div>
          </div>
        )}
      </For>
    </Box>
  );
};
