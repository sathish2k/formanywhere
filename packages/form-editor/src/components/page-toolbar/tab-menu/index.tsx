/**
 * TabMenu — Kebab dropdown menu for a page tab
 * Actions: Edit Page, Duplicate, Delete (with confirmation guard).
 */
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
    const act = (fn: (id: string) => void) => {
        fn(props.pageId);
        props.onClose();
    };

    return (
        <div class="page-toolbar__menu">
            <button onClick={() => act(props.onEdit)}>
                <Icon name="pencil" size={14} />
                Edit Page
            </button>
            <button onClick={() => act(props.onDuplicate)}>
                <Icon name="copy" size={14} />
                Duplicate
            </button>
            <div class="page-toolbar__menu-divider" />
            <button
                class="page-toolbar__menu-danger"
                onClick={() => act(props.onDelete)}
                disabled={!props.canDelete}
            >
                <Icon name="trash" size={14} />
                Delete
            </button>
        </div>
    );
};
