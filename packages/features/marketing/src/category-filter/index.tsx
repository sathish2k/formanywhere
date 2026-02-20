import { Component, For } from 'solid-js';

export interface Category {
    id: string;
    label: string;
    icon: string;
}

export interface CategoryFilterProps {
    categories: Category[];
    selected: string;
    onSelect: (id: string) => void;
    iconPaths: Record<string, string>;
}

export const CategoryFilter: Component<CategoryFilterProps> = (props) => {
    return (
        <div style={{ display: 'flex', gap: '12px', 'overflow-x': 'auto', 'padding-bottom': '8px', 'scrollbar-width': 'none' }}>
            <For each={props.categories}>
                {(cat) => (
                    <button
                        onClick={() => props.onSelect(cat.id)}
                        style={{
                            height: '40px',
                            padding: '0 16px',
                            'border-radius': '100px',
                            'font-weight': '500',
                            'white-space': 'nowrap',
                            transition: 'all 200ms ease',
                            display: 'flex',
                            'align-items': 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            // Conditional Styles
                            background: props.selected === cat.id
                                ? 'var(--m3-color-primary)'
                                : 'transparent',
                            color: props.selected === cat.id
                                ? 'var(--m3-color-on-primary)'
                                : 'var(--m3-color-on-surface-variant)',
                            border: props.selected === cat.id
                                ? 'none'
                                : '1px solid var(--m3-color-outline-variant)'
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            style={{
                                color: props.selected === cat.id ? 'currentColor' : 'var(--m3-color-primary)'
                            }}
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d={props.iconPaths[cat.icon]}></path>
                        </svg>
                        {cat.label}
                    </button>
                )}
            </For>
        </div>
    );
};
