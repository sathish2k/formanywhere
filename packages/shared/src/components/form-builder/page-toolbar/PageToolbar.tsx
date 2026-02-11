/**
 * PageToolbar — Page navigation bar
 * Add page, page tab pills, per-page menu, Logic & Workflow buttons
 */
import { For, Show, createSignal } from 'solid-js';
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
}

export const PageToolbar: Component<PageToolbarProps> = (props) => {
    const [menuPageId, setMenuPageId] = createSignal<string | null>(null);

    return (
        <div class="form-builder-page__page-bar">
            <div class="form-builder-page__page-tabs">
                <button class="form-builder-page__add-page" onClick={() => props.onAddPage()}>
                    <Icon name="plus" size={16} />
                    Add page
                </button>

                <span class="form-builder-page__page-divider" />

                <For each={props.pages}>
                    {(page) => (
                        <div class="form-builder-page__page-tab-wrapper">
                            <button
                                class={`form-builder-page__page-tab ${props.activePageId === page.id ? 'form-builder-page__page-tab--active' : ''}`}
                                onClick={() => props.onSetActivePage(page.id)}
                            >
                                {page.title}
                            </button>
                            <button
                                class="form-builder-page__page-menu-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuPageId(menuPageId() === page.id ? null : page.id);
                                }}
                            >
                                <Icon name="more-vert" size={14} />
                            </button>

                            {/* Page context menu */}
                            <Show when={menuPageId() === page.id}>
                                <div class="form-builder-page__page-menu">
                                    <button onClick={() => { props.onDuplicatePage(page.id); setMenuPageId(null); }}>
                                        <Icon name="copy" size={14} />
                                        Duplicate
                                    </button>
                                    <button
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

            <div class="form-builder-page__page-bar-actions">
                <span class="form-builder-page__page-divider" />
                <button class="form-builder-page__bar-btn">
                    <Icon name="git-branch" size={16} />
                    Logic
                </button>
                <button class="form-builder-page__bar-btn">
                    <Icon name="workflow" size={16} />
                    Workflow
                </button>
            </div>
        </div>
    );
};
