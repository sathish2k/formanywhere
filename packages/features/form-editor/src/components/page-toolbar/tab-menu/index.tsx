/**
 * TabMenu — Kebab dropdown menu for a page tab
 * Actions: Edit Page, Duplicate, Delete (with confirmation guard).
 */
import { splitProps } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';

export interface TabMenuProps {
    pageId: string;
    canDelete: boolean;
    onEdit: (id: string) => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export const TabMenu: Component<TabMenuProps> = (props) => {
    const [local] = splitProps(props, ['pageId', 'onEdit', 'onDuplicate', 'onDelete', 'onClose', 'canDelete']);
    const act = (fn: (id: string) => void) => {
        fn(local.pageId);
        local.onClose();
    };

    return (
        <div class="page-toolbar__menu">
            <button onClick={() => act(local.onEdit)}>
                <Icon name="pencil" size={14} />
                Edit Page
            </button>
            <button onClick={() => act(local.onDuplicate)}>
                <Icon name="copy" size={14} />
                Duplicate
            </button>
            <div class="page-toolbar__menu-divider" />
            <button
                class="page-toolbar__menu-danger"
                onClick={() => act(local.onDelete)}
                disabled={!local.canDelete}
            >
                <Icon name="trash" size={14} />
                Delete
            </button>
        </div>
    );
};
