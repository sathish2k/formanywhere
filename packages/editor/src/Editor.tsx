/**
 * RichTextEditor — Medium-style editor using solid-tiptap.
 *
 * No fixed toolbar. Content-first design:
 * - InlineTooltip (dark bubble) appears on text selection for formatting
 * - AddButton (+) appears on empty lines for block insertion
 * - LinkDialog for URL entry
 * - File picker for image upload (Medium/Dante3 style)
 *
 * Uses solid-tiptap's createTiptapEditor for proper SolidJS reactive integration.
 */
import { Component, createSignal, Show, createEffect, onCleanup } from 'solid-js';
import './styles/editor.css';
import { useEditor } from './hooks/useEditor';
import { InlineTooltip } from './components/InlineTooltip';
import { AddButton } from './components/AddButton';
import { LinkDialog } from './components/LinkDialog';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { TextField } from '@formanywhere/ui/textfield';
import { Icon } from '@formanywhere/ui/icon';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Divider } from '@formanywhere/ui/divider';

export interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: Component<RichTextEditorProps> = (props) => {
  const [editorEl, setEditorEl] = createSignal<HTMLDivElement>();
  let fileInputRef!: HTMLInputElement;
  let bubbleRef!: HTMLDivElement;
  let floatRef!: HTMLDivElement;

  const [linkOpen, setLinkOpen] = createSignal(false);
  const [linkInitial, setLinkInitial] = createSignal('');

  const [videoOpen, setVideoOpen] = createSignal(false);
  const [videoUrl, setVideoUrl] = createSignal('');

  const [formOpen, setFormOpen] = createSignal(false);
  const [formId, setFormId] = createSignal('my-form');

  // Track whether InlineTooltip is in link-input mode
  const [linkModeActive, setLinkModeActive] = createSignal(false);

  // Visibility signals driven by editor events
  const [showBubble, setShowBubble] = createSignal(false);
  const [showFloat, setShowFloat] = createSignal(false);

  const [editor, actions] = useEditor({
    content: props.content,
    placeholder: props.placeholder,
    onChange: props.onChange,
    editorEl,
  });

  // ── Use editor events for positioning (more reliable than createEditorTransaction) ──
  createEffect(() => {
    const ed = editor();
    if (!ed) return;

    const updatePositions = () => {
      const { from, to } = ed.state.selection;
      const hasTextSelection = from !== to;

      // Bubble menu: show on text selection (or link mode), not on images/videos/code
      if ((hasTextSelection || linkModeActive()) && !ed.isActive('image') && !ed.isActive('youtube') && !ed.isActive('codeBlock')) {
        try {
          const start = ed.view.coordsAtPos(from);
          const end = ed.view.coordsAtPos(to);
          const top = Math.min(start.top, end.top);
          const centerX = (start.left + end.right) / 2;
          const h = bubbleRef?.offsetHeight || 44;

          if (bubbleRef) {
            bubbleRef.style.top = `${top - h - 8}px`;
            bubbleRef.style.left = `${centerX}px`;
          }
          setShowBubble(true);
        } catch {
          setShowBubble(false);
        }
      } else {
        setShowBubble(false);
      }

      // Floating menu: show on empty paragraphs (cursor, no selection)
      const { $head } = ed.state.selection;
      const isEmptyParagraph = from === to
        && $head.parent.type.name === 'paragraph'
        && $head.parent.content.size === 0
        && ed.isEditable;

      if (isEmptyParagraph) {
        try {
          const coords = ed.view.coordsAtPos(from);
          const lineHeight = coords.bottom - coords.top;
          if (floatRef) {
            // Center the FAB vertically with the text line
            const fabH = floatRef.offsetHeight || 32;
            floatRef.style.top = `${coords.top + (lineHeight - fabH) / 2}px`;
            floatRef.style.left = `${coords.left - 48}px`;
          }
          setShowFloat(true);
        } catch {
          setShowFloat(false);
        }
      } else {
        setShowFloat(false);
      }
    };

    ed.on('selectionUpdate', updatePositions);
    ed.on('transaction', updatePositions);
    // Also update on focus/blur
    ed.on('focus', updatePositions);
    ed.on('blur', () => {
      // Small delay so toolbar button clicks register before hiding
      setTimeout(() => {
        if (!ed.isFocused && !linkModeActive()) {
          setShowBubble(false);
          setShowFloat(false);
        }
      }, 200);
    });

    onCleanup(() => {
      ed.off('selectionUpdate', updatePositions);
      ed.off('transaction', updatePositions);
    });
  });

  // ── Link dialog helpers ──
  const openLink = () => {
    setLinkInitial(actions.getLinkHref());
    setLinkOpen(true);
  };

  const confirmLink = (url: string) => {
    if (!url) actions.unsetLink();
    else actions.setLink(url);
    setLinkOpen(false);
  };

  // ── Image upload — Medium/Dante3 style via file picker ──
  const handleImageClick = () => {
    fileInputRef?.click();
  };

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type.startsWith('image/')) {
      actions.insertImageFile(file);
    }
    input.value = '';
  };

  // ── Video embed via Dialog ──
  const openVideoDialog = () => {
    setVideoUrl('');
    setVideoOpen(true);
  };

  const confirmVideo = () => {
    const url = videoUrl().trim();
    if (!url) return;
    const w = editorEl()?.clientWidth ?? 640;
    actions.insertVideo(url, w, Math.round(w * 9 / 16));
    setVideoOpen(false);
  };

  // ── Form embed via Dialog ──
  const openFormDialog = () => {
    setFormId('my-form');
    setFormOpen(true);
  };

  const confirmForm = () => {
    const id = formId().trim();
    if (id) actions.insertForm(id);
    setFormOpen(false);
  };

  return (
    <Box class="dante-editor">
      {/* Hidden file input for image upload (no UI component for type=file) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Bubble menu — positioned above text selection */}
      <Box
        ref={(el: HTMLDivElement) => { bubbleRef = el; }}
        class={`dante-bubble-wrap ${showBubble() ? 'is-visible' : ''}`}
      >
        <Show when={editor()}>
          {(instance) => (
            <InlineTooltip
              editor={instance()}
              actions={actions}
              onLinkClick={openLink}
              onLinkModeChange={setLinkModeActive}
            />
          )}
        </Show>
      </Box>

      {/* Floating "+" menu on empty lines */}
      <Box
        ref={(el: HTMLDivElement) => { floatRef = el; }}
        class={`dante-float-wrap ${showFloat() ? 'is-visible' : ''}`}
      >
        <Show when={editor()}>
          {(instance) => (
            <AddButton
              editor={instance()}
              actions={actions}
              onImageClick={handleImageClick}
              onVideoClick={openVideoDialog}
              onFormClick={openFormDialog}
            />
          )}
        </Show>
      </Box>

      {/* Link dialog (ui/Dialog + ui/TextField) */}
      <LinkDialog
        open={linkOpen()}
        initialUrl={linkInitial()}
        onConfirm={confirmLink}
        onClose={() => setLinkOpen(false)}
      />

      {/* Video embed dialog */}
      <Dialog
        open={videoOpen()}
        onClose={() => setVideoOpen(false)}
        title="Embed Video"
        icon={<Icon name="video" />}
        actions={
          <>
            <Button variant="text" onClick={() => setVideoOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={confirmVideo}>Embed</Button>
          </>
        }
      >
        <Box padding="md">
          <TextField
            variant="outlined"
            label="Video URL"
            placeholder="https://youtube.com/watch?v=... or Vimeo URL"
            value={videoUrl()}
            onInput={(e: InputEvent) => setVideoUrl((e.target as HTMLInputElement).value)}
            leadingIcon={<Icon name="link" />}
          />
        </Box>
      </Dialog>

      {/* Form embed dialog */}
      <Dialog
        open={formOpen()}
        onClose={() => setFormOpen(false)}
        title="Embed Form"
        icon={<Icon name="layout" />}
        actions={
          <>
            <Button variant="text" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={confirmForm}>Embed</Button>
          </>
        }
      >
        <Box padding="md">
          <TextField
            variant="outlined"
            label="Form ID"
            placeholder="my-form"
            value={formId()}
            onInput={(e: InputEvent) => setFormId((e.target as HTMLInputElement).value)}
            leadingIcon={<Icon name="sparkle" />}
          />
        </Box>
      </Dialog>

      {/* The ProseMirror editable area */}
      <Box ref={setEditorEl} />
    </Box>
  );
};

export default RichTextEditor;
