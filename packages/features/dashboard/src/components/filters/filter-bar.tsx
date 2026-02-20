/**
 * Filter Bar — SolidJS
 * Composed filter bar containing all dashboard filters
 */
import { Component, Show } from 'solid-js';
import { useDashboard } from '../../state/dashboard-provider';
import { SearchFilter } from './search-filter';
import { DateRangeFilter } from './date-range-filter';
import { ResponseRangeFilter } from './response-range-filter';
import { StatusFilter } from './status-filter';

export const FilterBar: Component = () => {
    const { hasActiveFilters, clearAllFilters } = useDashboard();

    return (
        <div class="forms-filter-bar">
            <div class="forms-filter-bar__row">
                <SearchFilter />
                <DateRangeFilter />
                <ResponseRangeFilter />
                <StatusFilter />

                <Show when={hasActiveFilters()}>
                    <button class="clear-filters-button" onClick={clearAllFilters}>
                        Clear All Filters
                    </button>
                </Show>
            </div>
        </div>
    );
};
