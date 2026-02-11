/**
 * Sort Menu — SolidJS
 * Dropdown menu for sorting forms by name, responses, or date
 */
import { Component, createSignal, For } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Menu, MenuItem } from '@formanywhere/ui/menu';
import { sortLabels } from '../dashboard.types';
import { useDashboard } from '../DashboardProvider';
import type { SortOption } from '../dashboard.types';

const SORT_OPTIONS: SortOption[] = [
    'name-asc',
    'name-desc',
    'responses-asc',
    'responses-desc',
    'date-asc',
    'date-desc',
];

export const SortMenu: Component = () => {
    const { setSort } = useDashboard();
    const [menuOpen, setMenuOpen] = createSignal(false);
    let anchor: HTMLButtonElement | undefined;

    return (
        <div style={{ display: 'flex', gap: '12px' }}>
            <button
                ref={anchor}
                class="sort-button"
                onClick={() => setMenuOpen(true)}
            >
                <Icon name="sort" size={18} />
                Sort By
            </button>
            <Menu
                open={menuOpen()}
                onClose={() => setMenuOpen(false)}
                anchorEl={anchor}
                position="bottom-start"
            >
                <For each={SORT_OPTIONS}>
                    {(sort) => (
                        <MenuItem
                            label={sortLabels[sort]}
                            leadingIcon={
                                sort.endsWith('-asc')
                                    ? <Icon name="arrow-down" size={18} />
                                    : <Icon name="arrow-up" size={18} />
                            }
                            onClick={() => {
                                setSort(sort);
                                setMenuOpen(false);
                            }}
                        />
                    )}
                </For>
            </Menu>
        </div>
    );
};
