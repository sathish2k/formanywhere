/**
 * @formanywhere/dashboard — Feature Module
 *
 * Dashboard components, hooks, state management, and services.
 */

// Main component
export { Dashboard } from './components/dashboard';
export type { DashboardProps } from './components/dashboard';

// State / Provider
export { DashboardProvider, useDashboard } from './state/dashboard-provider';
export type { DashboardContextValue, DashboardProviderProps } from './state/dashboard-provider';

// Components
export { DashboardAppBar } from './components/header/dashboard-app-bar';
export type { DashboardAppBarProps } from './components/header/dashboard-app-bar';
export { CreateFormSection } from './components/cards/create-form-section';
export type { CreateFormSectionProps } from './components/cards/create-form-section';
export { FormsListSection } from './components/forms-list-section';
export { FormCard } from './components/cards/form-card';
export type { FormCardProps } from './components/cards/form-card';
export { FilterBar } from './components/filters/filter-bar';
export { SearchFilter } from './components/filters/search-filter';
export { DateRangeFilter } from './components/filters/date-range-filter';
export { ResponseRangeFilter } from './components/filters/response-range-filter';
export { StatusFilter } from './components/filters/status-filter';
export { SortMenu } from './components/sort/sort-menu';
export { Pagination } from './components/pagination/pagination';

// Services
export { fetchForms, createForm, deleteForm, duplicateForm, updateForm, getForm } from './services/dashboard-datasource';
export type { FormData, FetchFormsOptions, FetchFormsResult } from './services/dashboard-datasource';

// Types & Config
export type {
    DashboardFormData,
    FormCardData,
    CreateFormOption,
    SortOption,
    FilterState,
} from './config/dashboard-types';
export {
    sortLabels,
    createFormOptions,
    formCardColors,
    defaultFilters,
    itemsPerPage,
} from './config/dashboard-types';
export { RESPONSE_RANGES, AVAILABLE_STATUSES } from './config/filter-constants';
