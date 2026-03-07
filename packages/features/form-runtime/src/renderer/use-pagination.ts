/**
 * usePagination — Multi-page form navigation logic for FormRenderer.
 *
 * Manages current page index, page list, navigation (next/prev),
 * and computes the visible elements for the active page.
 */
import { createSignal, createMemo } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';

export interface UsePaginationOptions {
    schema: () => FormSchema;
}

export interface PaginationState {
    isMultiPage: () => boolean;
    pages: () => Array<{ id: string; title: string; elements: string[] }>;
    currentPageIndex: () => number;
    totalPages: () => number;
    isFirstPage: () => boolean;
    isLastPage: () => boolean;
    /** Elements visible on the current page (all elements if single-page). */
    visibleElements: () => FormElement[];
    goNext: () => void;
    goPrev: () => void;
    setCurrentPageIndex: (i: number) => void;
}

export function usePagination(opts: UsePaginationOptions): PaginationState {
    const isMultiPage = () => !!opts.schema().settings.multiPage && !!opts.schema().settings.pages?.length;
    const pages = () => opts.schema().settings.pages ?? [];
    const [currentPageIndex, setCurrentPageIndex] = createSignal(0);
    const totalPages = () => pages().length;
    const isFirstPage = () => currentPageIndex() === 0;
    const isLastPage = () => currentPageIndex() === totalPages() - 1;

    const visibleElements = createMemo(() => {
        if (!isMultiPage()) return opts.schema().elements;
        const page = pages()[currentPageIndex()];
        if (!page) return [];
        const idSet = new Set(page.elements);
        return opts.schema().elements.filter((el) => idSet.has(el.id));
    });

    const goNext = () => {
        if (!isLastPage()) setCurrentPageIndex((i) => i + 1);
    };
    const goPrev = () => {
        if (!isFirstPage()) setCurrentPageIndex((i) => i - 1);
    };

    return {
        isMultiPage,
        pages,
        currentPageIndex,
        totalPages,
        isFirstPage,
        isLastPage,
        visibleElements,
        goNext,
        goPrev,
        setCurrentPageIndex,
    };
}
