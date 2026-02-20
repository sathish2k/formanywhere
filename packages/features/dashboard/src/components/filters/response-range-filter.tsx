/**
 * Response Range Filter — SolidJS
 * Menu-based response count range filter
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Menu, MenuItem } from '@formanywhere/ui/menu';
import { useDashboard } from '../../state/dashboard-provider';
import { RESPONSE_RANGES } from '../../config/filter-constants';

export const ResponseRangeFilter: Component = () => {
    const { filters, updateFilter } = useDashboard();
    const [menuOpen, setMenuOpen] = createSignal(false);
    let anchor: HTMLButtonElement | undefined;

    const handleToggle = (range: string) => {
        const current = filters().responseRanges;
        if (current.includes(range)) {
            updateFilter('responseRanges', current.filter((r) => r !== range));
        } else {
            updateFilter('responseRanges', [...current, range]);
        }
    };

    const isActive = () => filters().responseRanges.length > 0;

    return (
        <>
            <button
                ref={anchor}
                class={`filter-button ${isActive() ? 'filter-button--active' : ''}`}
                onClick={() => setMenuOpen(true)}
            >
                <Icon name="message-square" size={16} />
                <Show when={isActive()} fallback="Responses">
                    <For each={filters().responseRanges}>
                        {(range) => (
                            <span class="filter-chip">
                                {range}
                                <span
                                    class="filter-chip__delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(range);
                                    }}
                                >
                                    ×
                                </span>
                            </span>
                        )}
                    </For>
                </Show>
            </button>
            <Menu
                open={menuOpen()}
                onClose={() => setMenuOpen(false)}
                anchorEl={anchor}
                position="bottom-start"
            >
                <For each={[...RESPONSE_RANGES]}>
                    {(range) => (
                        <MenuItem
                            label={`${range} responses`}
                            leadingIcon={
                                filters().responseRanges.includes(range)
                                    ? <Icon name="check" size={18} />
                                    : undefined
                            }
                            onClick={() => handleToggle(range)}
                        />
                    )}
                </For>
            </Menu>
        </>
    );
};
