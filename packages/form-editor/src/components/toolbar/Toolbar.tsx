import { For, createSignal, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import type { FormElementType } from '@formanywhere/shared/types';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

interface ElementDef {
    type: FormElementType;
    icon: string;
    label: string;
    color: string;
}

interface ElementCategory {
    title: string;
    items: ElementDef[];
}

const ELEMENT_CATEGORIES: ElementCategory[] = [
    {
        title: 'Layout',
        items: [
            { type: 'container', icon: 'box', label: 'Container', color: '#7C4DFF' },
            { type: 'grid', icon: 'grid-3x3', label: 'Grid', color: '#536DFE' },
            { type: 'section', icon: 'layout', label: 'Section', color: '#448AFF' },
            { type: 'card', icon: 'credit-card', label: 'Card', color: '#40C4FF' },
            { type: 'divider', icon: 'minus', label: 'Divider', color: '#64FFDA' },
            { type: 'spacer', icon: 'move-vertical', label: 'Spacer', color: '#69F0AE' },
            { type: 'heading', icon: 'heading', label: 'Heading', color: '#B388FF' },
            { type: 'logo', icon: 'image', label: 'Logo', color: '#FF80AB' },
            { type: 'text-block', icon: 'align-left', label: 'Text Block', color: '#EA80FC' },
        ],
    },
    {
        title: 'Text Inputs',
        items: [
            { type: 'text', icon: 'type', label: 'Short Text', color: '#2196F3' },
            { type: 'textarea', icon: 'align-left', label: 'Long Text', color: '#03A9F4' },
            { type: 'email', icon: 'at-sign', label: 'Email', color: '#00BCD4' },
            { type: 'phone', icon: 'phone', label: 'Phone', color: '#009688' },
            { type: 'number', icon: 'hash', label: 'Number', color: '#4CAF50' },
            { type: 'url', icon: 'link', label: 'URL', color: '#8BC34A' },
        ],
    },
    {
        title: 'Choice',
        items: [
            { type: 'select', icon: 'list', label: 'Dropdown', color: '#FF9800' },
            { type: 'radio', icon: 'radio', label: 'Radio', color: '#FF5722' },
            { type: 'checkbox', icon: 'checkbox-checked', label: 'Checkbox', color: '#F44336' },
            { type: 'switch', icon: 'toggle-left', label: 'Switch', color: '#E91E63' },
        ],
    },
    {
        title: 'Date & Time',
        items: [
            { type: 'date', icon: 'calendar', label: 'Date', color: '#9C27B0' },
            { type: 'time', icon: 'clock', label: 'Time', color: '#673AB7' },
        ],
    },
    {
        title: 'Advanced',
        items: [
            { type: 'file', icon: 'upload', label: 'File Upload', color: '#795548' },
            { type: 'rating', icon: 'star', label: 'Rating', color: '#FFC107' },
            { type: 'signature', icon: 'pen-tool', label: 'Signature', color: '#607D8B' },
        ],
    },
];

export const Toolbar: Component = () => {
    const { addElement } = useFormEditor();
    const [searchQuery, setSearchQuery] = createSignal('');
    const [expandedCategories, setExpandedCategories] = createSignal<Record<string, boolean>>(
        Object.fromEntries(ELEMENT_CATEGORIES.map((c) => [c.title, true]))
    );

    const toggleCategory = (title: string) => {
        setExpandedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const filteredCategories = createMemo(() => {
        const query = searchQuery().toLowerCase().trim();
        if (!query) return ELEMENT_CATEGORIES;

        return ELEMENT_CATEGORIES.map((cat) => ({
            ...cat,
            items: cat.items.filter(
                (item) =>
                    item.label.toLowerCase().includes(query) ||
                    item.type.toLowerCase().includes(query)
            ),
        })).filter((cat) => cat.items.length > 0);
    });

    return (
        <div class="form-toolbar">
            {/* Header */}
            <div class="form-toolbar__header">
                <Icon name="layers" size={20} />
                <Typography variant="title-small">Elements</Typography>
            </div>

            {/* Search */}
            <div class="form-toolbar__search">
                <Icon name="search" size={16} class="form-toolbar__search-icon" />
                <input
                    type="text"
                    class="form-toolbar__search-input"
                    placeholder="Search elements..."
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                />
            </div>

            {/* Categories */}
            <div class="form-toolbar__categories">
                <For each={filteredCategories()}>
                    {(category) => {
                        const isExpanded = () => expandedCategories()[category.title] !== false;

                        return (
                            <div class="form-toolbar__category">
                                <button
                                    class="form-toolbar__category-header"
                                    onClick={() => toggleCategory(category.title)}
                                >
                                    <Icon
                                        name={isExpanded() ? 'chevron-down' : 'chevron-right'}
                                        size={16}
                                        class="form-toolbar__category-chevron"
                                    />
                                    <span class="form-toolbar__category-title">{category.title}</span>
                                    <span class="form-toolbar__category-count">{category.items.length}</span>
                                </button>

                                {isExpanded() && (
                                    <div class="form-toolbar__grid">
                                        <For each={category.items}>
                                            {(item) => (
                                                <button
                                                    class="form-toolbar__tile"
                                                    onClick={() => addElement(item.type)}
                                                    title={`Add ${item.label}`}
                                                >
                                                    <div
                                                        class="form-toolbar__tile-icon"
                                                        style={{ background: `${item.color}18`, color: item.color }}
                                                    >
                                                        <Icon name={item.icon} size={20} />
                                                    </div>
                                                    <span class="form-toolbar__tile-label">{item.label}</span>
                                                </button>
                                            )}
                                        </For>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
