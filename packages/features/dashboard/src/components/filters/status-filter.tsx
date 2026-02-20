/**
 * Status Filter — SolidJS
 * Menu-based form status filter (Published / Draft / Archived)
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Menu, MenuItem } from '@formanywhere/ui/menu';
import { useDashboard } from '../../state/dashboard-provider';
import { AVAILABLE_STATUSES } from '../../config/filter-constants';

export const StatusFilter: Component = () => {
    const { filters, updateFilter } = useDashboard();
    const [menuOpen, setMenuOpen] = createSignal(false);
    let anchor: HTMLButtonElement | undefined;

    const handleToggle = (status: string) => {
        const current = filters().statuses;
        if (current.includes(status)) {
            updateFilter('statuses', current.filter((s) => s !== status));
        } else {
            updateFilter('statuses', [...current, status]);
        }
    };

    const isActive = () => filters().statuses.length > 0;

    return (
        <>
            <button
                ref={anchor}
                class={`filter-button ${isActive() ? 'filter-button--active' : ''}`}
                onClick={() => setMenuOpen(true)}
            >
                <Icon name="sliders" size={16} />
                More Filters
                <Show when={isActive()}>
                    <span class="filter-chip">{filters().statuses.length}</span>
                </Show>
            </button>
            <Menu
                open={menuOpen()}
                onClose={() => setMenuOpen(false)}
                anchorEl={anchor}
                position="bottom-start"
            >
                <For each={[...AVAILABLE_STATUSES]}>
                    {(status) => (
                        <MenuItem
                            label={status.label}
                            leadingIcon={
                                filters().statuses.includes(status.value)
                                    ? <Icon name="checkbox-checked" size={18} />
                                    : <Icon name="checkbox-empty" size={18} />
                            }
                            onClick={() => handleToggle(status.value)}
                        />
                    )}
                </For>
            </Menu>
        </>
    );
};
