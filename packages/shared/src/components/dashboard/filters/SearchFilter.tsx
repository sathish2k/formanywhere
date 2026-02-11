/**
 * Search Filter — SolidJS
 * Search input for filtering forms by name
 */
import { Component } from 'solid-js';
import { SearchBar } from '@formanywhere/ui/search';
import { useDashboard } from '../DashboardProvider';

export const SearchFilter: Component = () => {
    const { filters, updateFilter } = useDashboard();

    return (
        <SearchBar
            value={filters().searchQuery}
            placeholder="Search forms..."
            onChange={(value) => updateFilter('searchQuery', value)}
            style={{ 'max-width': '220px', height: '40px', 'font-size': '13px' }}
        />
    );
};
