/**
 * Date Range Filter — SolidJS
 * Popover-based date range picker for filtering forms
 */
import { Component, createSignal, Show } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { TextField } from '@formanywhere/ui/textfield';
import { useDashboard } from '../DashboardProvider';

export const DateRangeFilter: Component = () => {
    const { filters, updateFilter } = useDashboard();
    const [open, setOpen] = createSignal(false);

    const isActive = () => !!(filters().dateFrom || filters().dateTo);

    return (
        <div style={{ position: 'relative' }}>
            <button
                class={`filter-button ${isActive() ? 'filter-button--active' : ''}`}
                onClick={() => setOpen(!open())}
            >
                <Icon name="calendar" size={16} />
                <Show
                    when={isActive()}
                    fallback="Date Range"
                >
                    <span class="filter-chip">
                        {filters().dateFrom || '...'} — {filters().dateTo || '...'}
                    </span>
                </Show>
            </button>
            <Show when={open()}>
                <div class="filter-popover" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '12px' }}>
                        <TextField
                            label="From"
                            type="date"
                            variant="outlined"
                            value={filters().dateFrom}
                            onInput={(e) =>
                                updateFilter('dateFrom', (e.currentTarget as HTMLInputElement)?.value ?? '')
                            }
                        />
                        <TextField
                            label="To"
                            type="date"
                            variant="outlined"
                            value={filters().dateTo}
                            onInput={(e) =>
                                updateFilter('dateTo', (e.currentTarget as HTMLInputElement)?.value ?? '')
                            }
                        />
                        <Button variant="text" onClick={() => setOpen(false)}>
                            Done
                        </Button>
                    </div>
                </div>
            </Show>
        </div>
    );
};
