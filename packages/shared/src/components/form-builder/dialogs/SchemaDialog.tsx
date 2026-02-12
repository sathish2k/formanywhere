/**
 * SchemaDialog — View & copy current form schema JSON
 * Migrated from AI-Powered Form Builder UI → SolidJS + M3
 */
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormSchema } from '../../../types';
import './dialogs.scss';

export interface SchemaDialogProps {
    open: boolean;
    onClose: () => void;
    schema: FormSchema | null;
}

export const SchemaDialog: Component<SchemaDialogProps> = (props) => {
    const schemaJson = () => props.schema ? JSON.stringify(props.schema, null, 2) : '{}';

    const handleCopy = () => {
        navigator.clipboard.writeText(schemaJson());
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            title="Form Schema"
            icon={<Icon name="file-text" size={20} />}
            class="schema-dialog"
            actions={
                <>
                    <Button variant="text" size="sm" onClick={handleCopy}>
                        <Icon name="copy" size={14} />
                        Copy
                    </Button>
                    <Button variant="text" size="sm" onClick={props.onClose}>Close</Button>
                </>
            }
        >
            <div class="schema-dialog__content">
                <pre class="schema-dialog__code">{schemaJson()}</pre>
            </div>
        </Dialog>
    );
};
