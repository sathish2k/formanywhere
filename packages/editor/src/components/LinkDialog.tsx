/**
 * LinkDialog — uses @formanywhere/ui Dialog + TextField for inserting/editing links.
 */
import { Component, createEffect } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { TextField } from '@formanywhere/ui/textfield';
import { Box } from '@formanywhere/ui/box';

interface Props {
  open: boolean;
  initialUrl: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}

export const LinkDialog: Component<Props> = (props) => {
  let inputRef!: HTMLInputElement | HTMLTextAreaElement;

  createEffect(() => {
    if (props.open) {
      requestAnimationFrame(() => {
        if (inputRef) {
          inputRef.focus();
          (inputRef as HTMLInputElement).value = props.initialUrl;
          inputRef.addEventListener('keydown', handleKey as EventListener);
        }
      });
    }
  });

  const confirm = () => {
    props.onConfirm((inputRef as HTMLInputElement).value.trim());
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); confirm(); }
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.onClose()}
      title="Insert link"
      icon={<Icon name="link" size={20} />}
      actions={
        <>
          <Button variant="text" onClick={props.onClose}>Cancel</Button>
          <Button variant="filled" onClick={confirm}>Apply</Button>
        </>
      }
    >
      <Box padding="md">
        <TextField
          ref={(el) => { inputRef = el; }}
          variant="outlined"
          label="URL"
          placeholder="https://example.com"
          type="url"
          leadingIcon={<Icon name="link" size={18} />}
        />
      </Box>
    </Dialog>
  );
};
