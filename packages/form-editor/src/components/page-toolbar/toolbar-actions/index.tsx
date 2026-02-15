/**
 * ToolbarActions — Right-side action buttons (Logic / Workflow / Debug)
 * Grouped with a leading vertical divider.
 * Uses Button from @formanywhere/ui for M3 consistency.
 */
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Button } from '@formanywhere/ui/button';

export interface ToolbarActionsProps {
    onLogic?: () => void;
    onWorkflow?: () => void;
    onDebug?: () => void;
}

export const ToolbarActions: Component<ToolbarActionsProps> = (props) => {
    return (
        <div class="page-toolbar__actions">
            <span class="page-toolbar__divider" />
            <Button
                variant="outlined"
                size="sm"
                class="page-toolbar__action-btn"
                onClick={() => props.onLogic?.()}
            >
                <Icon name="git-branch" size={16} />
                Logic
            </Button>
            <Button
                variant="outlined"
                size="sm"
                class="page-toolbar__action-btn"
                onClick={() => props.onWorkflow?.()}
            >
                <Icon name="workflow" size={16} />
                Workflow
            </Button>
            <Button
                variant="outlined"
                size="sm"
                class="page-toolbar__action-btn"
                onClick={() => props.onDebug?.()}
            >
                <Icon name="bug" size={16} />
                Debug
            </Button>
        </div>
    );
};
