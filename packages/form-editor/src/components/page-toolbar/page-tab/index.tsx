/**
 * PageTab — Individual page tab pill
 * Displays page title with kebab menu trigger button.
 * Active state uses primary fill with white text.
 *
 * Uses IconButton (size sm) for the kebab trigger with a SCSS
 * override to fit within the compact pill tab.
 */
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';

export interface PageTabProps {
    id: string;
    title: string;
    active: boolean;
    onSelect: (id: string) => void;
    onMenuToggle: (id: string) => void;
}

export const PageTab: Component<PageTabProps> = (props) => {
    return (
        <div
            class={`page-toolbar__tab ${props.active ? 'page-toolbar__tab--active' : ''}`}
            onClick={() => props.onSelect(props.id)}
        >
            <span class="page-toolbar__tab-label">{props.title}</span>
            <IconButton
                variant="standard"
                size="sm"
                class="page-toolbar__kebab"
                icon={<Icon name="more-vert" size={14} />}
                aria-label={`Options for ${props.title}`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    props.onMenuToggle(props.id);
                }}
            />
        </div>
    );
};
