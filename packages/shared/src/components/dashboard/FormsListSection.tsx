/**
 * Forms List Section — SolidJS
 * All Forms grid — delegates filters, sorting, and pagination
 * to dedicated sub-components that read from DashboardProvider.
 */
import { Component, For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { FormCard } from './cards';
import { useDashboard } from './DashboardProvider';
import { FilterBar } from './filters';
import { SortMenu } from './sort';
import { Pagination } from './pagination';

export const FormsListSection: Component = () => {
    const {
        forms,
        handleEditForm,
        handleDuplicateForm,
        handleDeleteForm,
        handleViewForm,
    } = useDashboard();

    return (
        <div class="forms-list-section">
            {/* Header */}
            <div class="forms-list-section__header">
                <Typography variant="headline-small">
                    All Forms
                </Typography>
                <SortMenu />
            </div>

            {/* Filter Bar */}
            <FilterBar />

            {/* Forms Grid */}
            <Show
                when={forms().length > 0}
                fallback={
                    <div class="forms-empty-state">
                        <Typography variant="title-large" color="on-surface-variant">
                            No forms found
                        </Typography>
                        <Typography variant="body-medium" color="on-surface-variant">
                            Try adjusting your filters or create a new form
                        </Typography>
                    </div>
                }
            >
                <div class="forms-grid">
                    <For each={forms()}>
                        {(form) => (
                            <FormCard
                                form={form}
                                onEdit={handleEditForm}
                                onDuplicate={handleDuplicateForm}
                                onDelete={handleDeleteForm}
                                onView={handleViewForm}
                            />
                        )}
                    </For>
                </div>

                {/* Pagination */}
                <Pagination />
            </Show>
        </div>
    );
};
