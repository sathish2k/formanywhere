/**
 * Pagination — SolidJS
 * Page navigation with numbered buttons and prev/next controls
 */
import { Component, createMemo, For, Show } from 'solid-js';
import { useDashboard } from '../DashboardProvider';

/** Maximum page buttons to render before truncating with ellipsis */
const MAX_VISIBLE_PAGES = 7;

export const Pagination: Component = () => {
    const { page, totalPages, setPage, goToNextPage, goToPrevPage } = useDashboard();

    // Generate page numbers with ellipsis for large ranges
    const pageNumbers = createMemo(() => {
        const total = totalPages();
        const current = page();

        if (total <= MAX_VISIBLE_PAGES) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const pages: (number | '...')[] = [1];

        let start = Math.max(2, current - 1);
        let end = Math.min(total - 1, current + 1);

        // Adjust window near edges
        if (current <= 3) {
            end = Math.min(total - 1, 4);
        }
        if (current >= total - 2) {
            start = Math.max(2, total - 3);
        }

        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push('...');
        pages.push(total);

        return pages;
    });

    return (
        <Show when={totalPages() > 1}>
            <div class="forms-pagination">
                <button
                    class="forms-pagination__button forms-pagination__nav"
                    disabled={page() <= 1}
                    onClick={goToPrevPage}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                <For each={pageNumbers()}>
                    {(item) => (
                        <Show
                            when={typeof item === 'number'}
                            fallback={
                                <span class="forms-pagination__ellipsis">…</span>
                            }
                        >
                            <button
                                class={`forms-pagination__button ${item === page() ? 'forms-pagination__button--active' : ''}`}
                                onClick={() => setPage(item as number)}
                            >
                                {item}
                            </button>
                        </Show>
                    )}
                </For>

                <button
                    class="forms-pagination__button forms-pagination__nav"
                    disabled={page() >= totalPages()}
                    onClick={goToNextPage}
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>
        </Show>
    );
};
