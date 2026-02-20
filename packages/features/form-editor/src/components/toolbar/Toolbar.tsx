/**
 * Toolbar — Element palette (reads from element registry)
 * Tiles are draggable via native HTML5 drag-and-drop.
 */
import { splitProps, For, createSignal, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { getElementsByCategory } from '../elements/registry';
import { useFormEditor } from '../FormEditor';
import './styles.scss';

/** Category shape for the toolbar (for standalone usage) */
export interface ToolbarCategory {
    key: string;
    title: string;
    items: Array<{ type: string; label: string; icon: string; color: string }>;
}

export interface ToolbarProps {
    /** Called when a tile drag starts */
    onDragStart?: (type: string) => void;
    /** External categories — when provided, bypasses element registry */
    categories?: ToolbarCategory[];
    /** Click handler — when provided, bypasses useFormEditor().addElement */
    onClickAdd?: (type: string) => void;
    /** Header title (default: "Elements") */
    headerTitle?: string;
    /** Header icon (default: "layers") */
    headerIcon?: string;
}

/** A single draggable toolbar tile */
const DraggableTile: Component<{
    item: { type: string; label: string; icon: string; color: string };
    onClickAdd: (type: string) => void;
    onDragStart?: (type: string) => void;
}> = (props) => {
    const [local] = splitProps(props, ['item', 'onClickAdd', 'onDragStart']);
    const handleDragStart = (e: DragEvent) => {
        // Use custom MIME type to distinguish new elements from existing ones (IDs)
        e.dataTransfer?.setData('application/x-form-type', local.item.type);
        e.dataTransfer!.effectAllowed = 'copy';
        local.onDragStart?.(local.item.type);
    };

    return (
        <button
            class="form-toolbar__tile"
            draggable={true}
            onDragStart={handleDragStart}
            onClick={() => local.onClickAdd(local.item.type)}
            title={`Add ${local.item.label}`}
            style={{ '--tile-color': local.item.color } as any}
        >
            <div
                class="form-toolbar__tile-icon"
                style={{ background: `${local.item.color}18`, color: local.item.color }}
            >
                <Icon name={local.item.icon} size={20} />
            </div>
            <span class="form-toolbar__tile-label">{local.item.label}</span>
        </button>
    );
};

export const Toolbar: Component<ToolbarProps> = (props) => {
    const [local] = splitProps(props, ['onDragStart', 'categories', 'onClickAdd', 'headerTitle', 'headerIcon']);

    // Standalone mode: categories + onClickAdd from props
    // Context mode: element registry + FormEditor context
    const isStandalone = !!local.categories;
    const ctx = isStandalone ? null : useFormEditor();
    const allCategories = isStandalone ? local.categories! : getElementsByCategory();

    const handleAdd = (type: string) => {
        if (local.onClickAdd) {
            local.onClickAdd(type);
        } else {
            ctx?.addElement(type as any);
        }
    };

    const [searchQuery, setSearchQuery] = createSignal('');

    const [expandedCategories, setExpandedCategories] = createSignal<Record<string, boolean>>(
        Object.fromEntries(allCategories.map((c) => [c.key, true]))
    );

    const toggleCategory = (key: string) => {
        setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredCategories = createMemo(() => {
        const query = searchQuery().toLowerCase().trim();
        if (!query) return allCategories;

        return allCategories.map((cat) => ({
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
                <Icon name={local.headerIcon ?? 'layers'} size={20} />
                <Typography variant="title-small">{local.headerTitle ?? 'Elements'}</Typography>
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
                                                    onClickAdd={handleAdd}
                                                    onDragStart={local.onDragStart}
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
