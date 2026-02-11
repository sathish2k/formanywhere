/**
 * Filter Bar — SolidJS
 * Composed filter bar containing all dashboard filters
 */
import { Component, Show } from 'solid-js';
import { useDashboard } from '../DashboardProvider';
import { SearchFilter } from './SearchFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { ResponseRangeFilter } from './ResponseRangeFilter';
import { StatusFilter } from './StatusFilter';

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
