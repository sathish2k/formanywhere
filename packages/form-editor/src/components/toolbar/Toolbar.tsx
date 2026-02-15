/**
 * Toolbar — Element palette (reads from element registry)
 * Tiles are draggable via native HTML5 drag-and-drop.
 */
import { For, createSignal, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { getElementsByCategory } from '../elements/registry';
import type { ElementDefinition } from '../elements/types';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

/** A single draggable toolbar tile */
const DraggableTile: Component<{
    item: ElementDefinition;
    onClickAdd: (type: string) => void;
    onDragStart?: (type: string) => void;
}> = (props) => {
    const handleDragStart = (e: DragEvent) => {
        // Use custom MIME type to distinguish new elements from existing ones (IDs)
        e.dataTransfer?.setData('application/x-form-type', props.item.type);
        e.dataTransfer!.effectAllowed = 'copy';
        props.onDragStart?.(props.item.type);
    };

    return (
        <button
            class="form-toolbar__tile"
            draggable={true}
            onDragStart={handleDragStart}
            onClick={() => props.onClickAdd(props.item.type)}
            title={`Add ${props.item.label}`}
            style={{ '--tile-color': props.item.color } as any}
        >
            <div
                class="form-toolbar__tile-icon"
                style={{ background: `${props.item.color}18`, color: props.item.color }}
            >
                <Icon name={props.item.icon} size={20} />
            </div>
            <span class="form-toolbar__tile-label">{props.item.label}</span>
        </button>
    );
};

export const Toolbar: Component<{ onDragStart?: (type: string) => void }> = (props) => {
    const { addElement } = useFormEditor();
    const [searchQuery, setSearchQuery] = createSignal('');

    const categories = getElementsByCategory();

    const [expandedCategories, setExpandedCategories] = createSignal<Record<string, boolean>>(
        Object.fromEntries(categories.map((c) => [c.key, true]))
    );

    const toggleCategory = (key: string) => {
        setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredCategories = createMemo(() => {
        const query = searchQuery().toLowerCase().trim();
        if (!query) return categories;

        return categories.map((cat) => ({
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
                        const isExpanded = () => expandedCategories()[category.key] !== false;

                        return (
                            <div class="form-toolbar__category">
                                <button
                                    class="form-toolbar__category-header"
                                    onClick={() => toggleCategory(category.key)}
                                >
                                    <Icon
                                        name="chevron-right"
                                        size={16}
                                        class={`form-toolbar__category-chevron ${isExpanded() ? 'form-toolbar__category-chevron--expanded' : ''}`}
                                    />
                                    <span class="form-toolbar__category-title">{category.title}</span>
                                    <span class="form-toolbar__category-count">{category.items.length}</span>
                                </button>

                                <div class={`form-toolbar__grid-wrapper ${isExpanded() ? 'form-toolbar__grid-wrapper--expanded' : ''}`}>
                                    <div class="form-toolbar__grid">
                                        <For each={category.items}>
                                            {(item) => (
                                                <DraggableTile
                                                    item={item}
                                                    onClickAdd={(type) => addElement(type as any)}
                                                    onDragStart={props.onDragStart}
                                                />
                                            )}
                                        </For>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
