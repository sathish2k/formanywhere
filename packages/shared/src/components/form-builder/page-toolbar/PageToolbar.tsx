/**
 * PageToolbar — Page navigation bar
 * Matches AI-Powered Form Builder UI design:
 *   Add page | Page 1 · Page 2 … (with kebab menus) | Logic · Workflow
 */
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';

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

    return (
        <div class="page-toolbar" ref={toolbarRef}>
            {/* ── Left: Add page + page tabs ── */}
            <div class="page-toolbar__tabs">
                <button class="page-toolbar__add-btn" onClick={() => props.onAddPage()}>
                    <Icon name="plus" size={14} />
                    Add page
                </button>

                <span class="page-toolbar__divider" />

                <For each={props.pages}>
                    {(page) => (
                        <div class="page-toolbar__tab-wrapper">
                            <div
                                class={`page-toolbar__tab ${props.activePageId === page.id ? 'page-toolbar__tab--active' : ''}`}
                                onClick={() => props.onSetActivePage(page.id)}
                            >
                                <span class="page-toolbar__tab-label">{page.title}</span>
                                <button
                                    class="page-toolbar__kebab"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuPageId(menuPageId() === page.id ? null : page.id);
                                    }}
                                >
                                    <Icon name="more-vert" size={14} />
                                </button>
                            </div>

                            {/* Kebab dropdown */}
                            <Show when={menuPageId() === page.id}>
                                <div class="page-toolbar__menu">
                                    <button onClick={() => { props.onEditPage?.(page.id); setMenuPageId(null); }}>
                                        <Icon name="pencil" size={14} />
                                        Edit Page
                                    </button>
                                    <button onClick={() => { props.onDuplicatePage(page.id); setMenuPageId(null); }}>
                                        <Icon name="copy" size={14} />
                                        Duplicate
                                    </button>
                                    <div class="page-toolbar__menu-divider" />
                                    <button
                                        class="page-toolbar__menu-danger"
                                        onClick={() => { props.onDeletePage(page.id); setMenuPageId(null); }}
                                        disabled={props.pages.length <= 1}
                                    >
                                        <Icon name="trash" size={14} />
                                        Delete
                                    </button>
                                </div>
                            </Show>
                        </div>
                    )}
                </For>
            </div>

            {/* ── Right: Logic · Workflow ── */}
            <div class="page-toolbar__actions">
                <span class="page-toolbar__divider" />
                <button class="page-toolbar__action-btn" onClick={() => props.onLogic?.()}>
                    <Icon name="git-branch" size={16} />
                    Logic
                </button>
                <button class="page-toolbar__action-btn" onClick={() => props.onWorkflow?.()}>
                    <Icon name="workflow" size={16} />
                    Workflow
                </button>
            </div>
        </div>
    );
};
