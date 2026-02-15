/**
 * PageToolbar — Page navigation bar
 * Matches AI-Powered Form Builder UI design:
 *   Add page | Page 1 · Page 2 … (with kebab menus) | Logic · Workflow
 *
 * Sub-components:
 *   - PageTabPill    — individual tab pill
 *   - TabMenu        — kebab dropdown menu
 *   - ToolbarActions — Logic / Workflow buttons
 */
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Button } from '@formanywhere/ui/button';
import { PageTab as PageTabPill } from './page-tab';
import { TabMenu } from './tab-menu';
import { ToolbarActions } from './toolbar-actions';

export interface PageTab {
    id: string;
    title: string;
}

export interface PageToolbarProps {
    pages: PageTab[];
    activePageId: string;
    onSetActivePage: (id: string) => void;
    onAddPage: () => void;
    onDuplicatePage: (id: string) => void;
    onDeletePage: (id: string) => void;
    onEditPage?: (id: string) => void;
    onLogic?: () => void;
    onWorkflow?: () => void;
}

export const PageToolbar: Component<PageToolbarProps> = (props) => {
    const [menuPageId, setMenuPageId] = createSignal<string | null>(null);
    let toolbarRef: HTMLDivElement | undefined;

    /* Close kebab menu when clicking outside */
    const handleClickOutside = (e: MouseEvent) => {
        if (menuPageId() && toolbarRef && !toolbarRef.contains(e.target as Node)) {
            setMenuPageId(null);
        }
    };

    onMount(() => document.addEventListener('click', handleClickOutside));
    onCleanup(() => document.removeEventListener('click', handleClickOutside));

    const toggleMenu = (id: string) => {
        setMenuPageId(menuPageId() === id ? null : id);
    };

    return (
        <div class="page-toolbar" ref={toolbarRef}>
            {/* ── Left: Add page + page tabs ── */}
            <div class="page-toolbar__tabs">
                <Button
                    variant="outlined"
                    size="sm"
                    class="page-toolbar__add-btn"
                    onClick={() => props.onAddPage()}
                >
                    <Icon name="plus" size={14} />
                    Add page
                </Button>

                <span class="page-toolbar__divider" />

                <For each={props.pages}>
                    {(page) => (
                        <div class="page-toolbar__tab-wrapper">
                            <PageTabPill
                                id={page.id}
                                title={page.title}
                                active={props.activePageId === page.id}
                                onSelect={props.onSetActivePage}
                                onMenuToggle={toggleMenu}
                            />

                            {/* Kebab dropdown */}
                            <Show when={menuPageId() === page.id}>
                                <TabMenu
                                    pageId={page.id}
                                    canDelete={props.pages.length > 1}
                                    onEdit={(id) => props.onEditPage?.(id)}
                                    onDuplicate={props.onDuplicatePage}
                                    onDelete={props.onDeletePage}
                                    onClose={() => setMenuPageId(null)}
                                />
                            </Show>
                        </div>
                    )}
                </For>
            </div>

            {/* ── Right: Logic · Workflow ── */}
            <ToolbarActions
                onLogic={props.onLogic}
                onWorkflow={props.onWorkflow}
            />
        </div>
    );
};
