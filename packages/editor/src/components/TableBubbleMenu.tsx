/**
 * TableBubbleMenu — Contextual toolbar that appears when cursor is inside a table.
 *
 * Actions: add/delete rows & columns, merge/split cells, toggle headers, delete table.
 * Uses @formanywhere/ui components for M3 styling.
 */
import { Component, Show } from 'solid-js';
import type { Editor } from '@tiptap/core';
import { createEditorTransaction } from 'solid-tiptap';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import { Tooltip } from '@formanywhere/ui/tooltip';
import type { EditorActions } from '../hooks/useEditor';

interface TableBubbleMenuProps {
  editor: Editor;
  actions: EditorActions;
}

export const TableBubbleMenu: Component<TableBubbleMenuProps> = (props) => {
  const canMerge = createEditorTransaction(
    () => props.editor,
    (e) => e?.can().mergeCells() ?? false,
  );

  const canSplit = createEditorTransaction(
    () => props.editor,
    (e) => e?.can().splitCell() ?? false,
  );

  return (
    <div class="dante-table-bubble">
        {/* Row operations */}
        <Tooltip text="Add row above">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="arrow-up" size={16} />}
            onClick={() => props.actions.addRowBefore()}
          />
        </Tooltip>
        <Tooltip text="Add row below">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="arrow-down" size={16} />}
            onClick={() => props.actions.addRowAfter()}
          />
        </Tooltip>
        <Tooltip text="Delete row">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="minus" size={16} />}
            onClick={() => props.actions.deleteRow()}
          />
        </Tooltip>

        <Divider vertical />

        {/* Column operations */}
        <Tooltip text="Add column before">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="arrow-left" size={16} />}
            onClick={() => props.actions.addColumnBefore()}
          />
        </Tooltip>
        <Tooltip text="Add column after">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="arrow-right" size={16} />}
            onClick={() => props.actions.addColumnAfter()}
          />
        </Tooltip>
        <Tooltip text="Delete column">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="cross" size={16} />}
            onClick={() => props.actions.deleteColumn()}
          />
        </Tooltip>

        <Divider vertical />

        {/* Merge / Split */}
        <Show when={canMerge()}>
          <Tooltip text="Merge cells">
            <IconButton
              variant="standard"
              size="sm"
              icon={<Icon name="columns" size={16} />}
              onClick={() => props.actions.mergeCells()}
            />
          </Tooltip>
        </Show>
        <Show when={canSplit()}>
          <Tooltip text="Split cell">
            <IconButton
              variant="standard"
              size="sm"
              icon={<Icon name="layout" size={16} />}
              onClick={() => props.actions.splitCell()}
            />
          </Tooltip>
        </Show>

        {/* Header toggles */}
        <Tooltip text="Toggle header row">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="heading" size={16} />}
            onClick={() => props.actions.toggleHeaderRow()}
          />
        </Tooltip>

        <Divider vertical />

        {/* Delete table */}
        <Tooltip text="Delete table">
          <IconButton
            variant="standard"
            size="sm"
            icon={<Icon name="trash" size={16} />}
            onClick={() => props.actions.deleteTable()}
            style={{ color: 'var(--m3-color-error, #FF5630)' }}
          />
        </Tooltip>
      </div>
  );
};
