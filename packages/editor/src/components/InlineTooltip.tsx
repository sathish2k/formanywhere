/**
 * InlineTooltip — Bubble toolbar on text selection.
 *
 * ALL formatting options in a single SegmentedButton (multiSelect).
 * No extra wrapper — the SegmentedButton IS the toolbar.
 * Uses @formanywhere/ui SegmentedButton, IconButton, Divider, Icon.
 */
import { Component, Show, createSignal } from 'solid-js';
import type { Editor } from '@tiptap/core';
import { createEditorTransaction } from 'solid-tiptap';
import { SegmentedButton } from '@formanywhere/ui/segmented-button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Divider } from '@formanywhere/ui/divider';
import { Icon } from '@formanywhere/ui/icon';
import { Stack } from '@formanywhere/ui/stack';
import { TextField } from '@formanywhere/ui/textfield';
import type { EditorActions } from '../hooks/useEditor';

interface Props {
  editor: Editor;
  actions: EditorActions;
  onLinkClick: () => void;
  onLinkModeChange?: (active: boolean) => void;
}

export const InlineTooltip: Component<Props> = (props) => {
  const [linkMode, setLinkMode] = createSignal(false);
  let linkInputRef!: HTMLInputElement;

  // Reactive isActive
  const isBold = createEditorTransaction(() => props.editor, (e) => e?.isActive('bold') ?? false);
  const isItalic = createEditorTransaction(() => props.editor, (e) => e?.isActive('italic') ?? false);
  const isUnderline = createEditorTransaction(() => props.editor, (e) => e?.isActive('underline') ?? false);
  const isStrike = createEditorTransaction(() => props.editor, (e) => e?.isActive('strike') ?? false);
  const isLink = createEditorTransaction(() => props.editor, (e) => e?.isActive('link') ?? false);
  const isHighlight = createEditorTransaction(() => props.editor, (e) => e?.isActive('highlight') ?? false);
  const isH1 = createEditorTransaction(() => props.editor, (e) => e?.isActive('heading', { level: 1 }) ?? false);
  const isH2 = createEditorTransaction(() => props.editor, (e) => e?.isActive('heading', { level: 2 }) ?? false);
  const isH3 = createEditorTransaction(() => props.editor, (e) => e?.isActive('heading', { level: 3 }) ?? false);
  const isBlockquote = createEditorTransaction(() => props.editor, (e) => e?.isActive('blockquote') ?? false);
  const isCode = createEditorTransaction(() => props.editor, (e) => e?.isActive('code') ?? false);

  // All active values in one array
  const activeValues = () => {
    const v: string[] = [];
    if (isBold()) v.push('bold');
    if (isItalic()) v.push('italic');
    if (isUnderline()) v.push('underline');
    if (isStrike()) v.push('strike');
    if (isH1()) v.push('h1');
    if (isH2()) v.push('h2');
    if (isH3()) v.push('h3');
    if (isLink()) v.push('link');
    if (isHighlight()) v.push('highlight');
    if (isBlockquote()) v.push('blockquote');
    if (isCode()) v.push('code');
    return v;
  };

  const handleChange = (value: string) => {
    switch (value) {
      case 'bold': props.actions.toggleBold(); break;
      case 'italic': props.actions.toggleItalic(); break;
      case 'underline': props.actions.toggleUnderline(); break;
      case 'strike': props.actions.toggleStrike(); break;
      case 'h1': props.actions.setHeading(1); break;
      case 'h2': props.actions.setHeading(2); break;
      case 'h3': props.actions.setHeading(3); break;
      case 'link': enableLinkMode(); break;
      case 'highlight': props.actions.toggleHighlight(); break;
      case 'blockquote': props.actions.toggleBlockquote(); break;
      case 'code': props.actions.toggleCode(); break;
    }
  };

  const enableLinkMode = () => {
    setLinkMode(true);
    props.onLinkModeChange?.(true);
    requestAnimationFrame(() => {
      if (linkInputRef) {
        linkInputRef.focus();
        const href = props.actions.getLinkHref();
        if (href) linkInputRef.value = href;
      }
    });
  };

  const confirmLink = () => {
    const url = linkInputRef?.value?.trim();
    if (!url) props.actions.unsetLink();
    else props.actions.setLink(url);
    setLinkMode(false);
    props.onLinkModeChange?.(false);
  };

  const handleLinkKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmLink(); }
    if (e.key === 'Escape') { e.preventDefault(); setLinkMode(false); props.onLinkModeChange?.(false); }
  };

  const segments = [
    { value: 'bold', label: '', icon: <Icon name="bold" size={16} /> },
    { value: 'italic', label: '', icon: <Icon name="italic" size={16} /> },
    { value: 'underline', label: '', icon: <Icon name="underline" size={16} /> },
    { value: 'strike', label: '', icon: <Icon name="strikethrough" size={16} /> },
    { value: 'h1', label: 'H1' },
    { value: 'h2', label: 'H2' },
    { value: 'h3', label: 'H3' },
    { value: 'link', label: '', icon: <Icon name="link" size={16} /> },
    { value: 'highlight', label: '', icon: <Icon name="highlight" size={16} /> },
    { value: 'blockquote', label: '', icon: <Icon name="quote" size={16} /> },
    { value: 'code', label: '', icon: <Icon name="code-inline" size={16} /> },
  ];

  return (
    <Show when={!linkMode()} fallback={
      <Stack direction="row" align="center" gap="xs" class="dante-link-input-wrap">
        <Icon name="link" size={14} class="dante-link-input-icon" />
        <Divider vertical class="dante-link-sep" />
        <TextField
          ref={(el) => {
            linkInputRef = el as HTMLInputElement;
            el.addEventListener('keydown', handleLinkKeyDown as EventListener);
          }}
          variant="outlined"
          size="sm"
          type="url"
          placeholder="Paste or type a link…"
          class="dante-link-input"
        />
        <Divider vertical class="dante-link-sep" />
        <IconButton
          variant="text" size="sm"
          icon={<Icon name="check" size={14} />}
          class="dante-tooltip-icon-btn"
          onMouseDown={(e: MouseEvent) => { e.preventDefault(); confirmLink(); }}
          aria-label="Apply link"
        />
        <IconButton
          variant="text" size="sm"
          icon={<Icon name="close" size={14} />}
          class="dante-tooltip-icon-btn"
          onMouseDown={(e: MouseEvent) => { e.preventDefault(); setLinkMode(false); }}
          aria-label="Cancel"
        />
      </Stack>
    }>
      <SegmentedButton
        segments={segments}
        value={activeValues()}
        onChange={handleChange}
        multiSelect
        showCheckmark={false}
        size="sm"
        class="dante-toolbar-segment"
      />
    </Show>
  );
};
