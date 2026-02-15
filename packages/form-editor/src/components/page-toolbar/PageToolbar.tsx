/**
 * PageToolbar — Page navigation bar
 * Matches AI-Powered Form Builder UI design:
 *   Add page | Page 1 · Page 2 … (with kebab menus) | Logic · Workflow
 *
 * Sub-components:
 *   - PageTabPill    — individual tab pill
 *   - TabMenu        — kebab dropdown menu
 *   - ToolbarActions — Logic / Workflow buttons
 *
 * Dialogs:
 *   - Edit Page      → Dialog (rename page) from @formanywhere/ui
 *   - Delete Page     → ConfirmationDialog from @formanywhere/shared
 */
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Button } from '@formanywhere/ui/button';
import { Dialog } from '@formanywhere/ui/dialog';
import { TextField } from '@formanywhere/ui/textfield';
import { Typography } from '@formanywhere/ui/typography';
import { ConfirmationDialog } from '@formanywhere/shared/confirmation-dialog';
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
    /** Rename a page — receives page id + new title */
    onRenamePage?: (id: string, title: string) => void;
    onLogic?: () => void;
    onWorkflow?: () => void;
}

export const PageToolbar: Component<PageToolbarProps> = (props) => {
    const [menuPageId, setMenuPageId] = createSignal<string | null>(null);

    /* ── Edit (rename) dialog state ── */
    const [editPageId, setEditPageId] = createSignal<string | null>(null);
    const [editPageTitle, setEditPageTitle] = createSignal('');

    /* ── Delete confirmation dialog state ── */
    const [deletePageId, setDeletePageId] = createSignal<string | null>(null);

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

    /* ── Helpers ── */

    const pageTitle = (id: string) =>
        props.pages.find((p) => p.id === id)?.title ?? '';

    const openEditDialog = (id: string) => {
        setEditPageTitle(pageTitle(id));
        setEditPageId(id);
    };

    const confirmRename = () => {
        const id = editPageId();
        const title = editPageTitle().trim();
        if (id && title) {
            props.onRenamePage?.(id, title);
        }
        setEditPageId(null);
    };

    const openDeleteDialog = (id: string) => {
        setDeletePageId(id);
    };

    const confirmDelete = () => {
        const id = deletePageId();
        if (id) {
            props.onDeletePage(id);
        }
        setDeletePageId(null);
    };

    return (
        <>
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
                                        onEdit={(id) => { openEditDialog(id); setMenuPageId(null); }}
                                        onDuplicate={(id) => { props.onDuplicatePage(id); setMenuPageId(null); }}
                                        onDelete={(id) => { openDeleteDialog(id); setMenuPageId(null); }}
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

            {/* ── Edit (rename) page dialog ── */}
            <Dialog
                open={editPageId() !== null}
                onClose={() => setEditPageId(null)}
                title="Rename Page"
                icon={<Icon name="pencil" size={24} />}
                actions={
                    <>
                        <Button variant="text" onClick={() => setEditPageId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            onClick={confirmRename}
                            disabled={editPageTitle().trim().length === 0}
                        >
                            Save
                        </Button>
                    </>
                }
            >
                <div class="page-toolbar__edit-dialog-body">
                    <Typography variant="body-medium" color="on-surface-variant">
                        Enter a new name for this page.
                    </Typography>
                    <TextField
                        label="Page name"
                        value={editPageTitle()}
                        onInput={(e) => setEditPageTitle((e.target as HTMLInputElement).value)}
                        variant="outlined"
                    />
                </div>
            </Dialog>

            {/* ── Delete page confirmation dialog ── */}
            <ConfirmationDialog
                open={deletePageId() !== null}
                onClose={() => setDeletePageId(null)}
                onConfirm={confirmDelete}
                variant="destructive"
                title="Delete Page"
                description={
                    <Typography variant="body-medium" color="on-surface-variant">
                        Are you sure you want to delete
                        {' '}<strong>{pageTitle(deletePageId() ?? '')}</strong>?
                        This action cannot be undone.
                    </Typography>
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </>
    );
};
