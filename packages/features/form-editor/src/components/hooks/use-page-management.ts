/**
 * usePageManagement — Multi-page management for FormBuilderPage.
 *
 * Handles page tabs: creation, duplication, deletion, renaming,
 * and synchronisation between the page signal and schema.settings.pages.
 */
import { createSignal } from 'solid-js';
import type { Accessor, Setter } from 'solid-js';
import type { FormSchema } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';
import type { PageTab } from '../page-toolbar/PageToolbar';

export type { PageTab };

export interface UsePageManagementOptions {
    initialPages?: Array<{ id: string; title: string }>;
    setSchema: Setter<FormSchema | null>;
}

export interface PageManagementState {
    pages: Accessor<PageTab[]>;
    setPages: Setter<PageTab[]>;
    activePageId: Accessor<string>;
    setActivePageId: Setter<string>;
    addPage: () => void;
    duplicatePage: (pageId: string) => void;
    deletePage: (pageId: string) => void;
    editPage: (pageId: string) => void;
    renamePage: (pageId: string, newTitle: string) => void;
    /** Push page tabs into schema.settings.pages */
    syncPagesToSchema: () => void;
    /** Pull page tabs from schema.settings.pages */
    syncPagesFromSchema: (s: FormSchema) => void;
}

export function usePageManagement(opts: UsePageManagementOptions): PageManagementState {
    const seedPages = (): PageTab[] =>
        opts.initialPages && opts.initialPages.length > 0
            ? opts.initialPages.map((p) => ({ id: p.id, title: p.title }))
            : [{ id: generateId(), title: 'Page 1' }];

    const [pages, setPages] = createSignal<PageTab[]>(seedPages());
    const [activePageId, setActivePageId] = createSignal<string>('');

    /** Push the current pages[] into schema.settings.pages */
    const syncPagesToSchema = () => {
        opts.setSchema((prev) => {
            if (!prev) return prev;
            const formPages = pages().map((p) => {
                const existing = prev.settings.pages?.find((ep) => ep.id === p.id);
                return { id: p.id, title: p.title, elements: existing?.elements ?? [] };
            });
            return { ...prev, settings: { ...prev.settings, pages: formPages, multiPage: pages().length > 1 } };
        });
    };

    /** Pull page tabs from schema.settings.pages (after loading existing form or draft) */
    const syncPagesFromSchema = (s: FormSchema) => {
        const schemaPgs = s.settings.pages;
        if (schemaPgs && schemaPgs.length > 0) {
            const tabs: PageTab[] = schemaPgs.map((p) => ({ id: p.id, title: p.title }));
            setPages(tabs);
            setActivePageId(tabs[0].id);
        }
    };

    const addPage = () => {
        const p: PageTab = { id: generateId(), title: `Page ${pages().length + 1}` };
        setPages((prev) => [...prev, p]);
        setActivePageId(p.id);
        syncPagesToSchema();
    };

    const duplicatePage = (pageId: string) => {
        const page = pages().find((p) => p.id === pageId);
        if (!page) return;
        const dup: PageTab = { id: generateId(), title: `${page.title} (Copy)` };
        const idx = pages().findIndex((p) => p.id === pageId);
        setPages((prev) => [...prev.slice(0, idx + 1), dup, ...prev.slice(idx + 1)]);
        setActivePageId(dup.id);
        syncPagesToSchema();
    };

    const deletePage = (pageId: string) => {
        if (pages().length <= 1) return;
        const idx = pages().findIndex((p) => p.id === pageId);
        setPages((prev) => prev.filter((p) => p.id !== pageId));
        if (activePageId() === pageId) {
            const remaining = pages().filter((p) => p.id !== pageId);
            setActivePageId(remaining[Math.min(idx, remaining.length - 1)]?.id ?? '');
        }
        syncPagesToSchema();
    };

    const editPage = (_pageId: string) => {
        // Legacy fallback — handled by PageToolbar's onRenamePage dialog now
    };

    const renamePage = (pageId: string, newTitle: string) => {
        if (newTitle.trim()) {
            setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, title: newTitle.trim() } : p));
            syncPagesToSchema();
        }
    };

    return {
        pages, setPages, activePageId, setActivePageId,
        addPage, duplicatePage, deletePage, editPage, renamePage,
        syncPagesToSchema, syncPagesFromSchema,
    };
}
