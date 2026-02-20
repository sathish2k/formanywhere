/**
 * SchemaDialog — View & copy current form schema JSON
 * Migrated from AI-Powered Form Builder UI → SolidJS + M3
 */
import { splitProps } from 'solid-js';
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormSchema } from '@formanywhere/shared/types';
import './dialogs.scss';

export interface SchemaDialogProps {
    open: boolean;
    onClose: () => void;
    schema: FormSchema | null;
}

export const SchemaDialog: Component<SchemaDialogProps> = (props) => {
    const [local] = splitProps(props, ['open', 'onClose', 'schema']);
    const schemaJson = () => local.schema ? JSON.stringify(local.schema, null, 2) : '{}';

    const handleCopy = () => {
        navigator.clipboard.writeText(schemaJson());
    };

    return (
        <Dialog
            open={local.open}
            onClose={local.onClose}
            title="Form Schema"
            icon={<Icon name="file-text" size={20} />}
            class="schema-dialog"
            actions={
                <>
                    <Button variant="text" size="sm" onClick={handleCopy}>
                        <Icon name="copy" size={14} />
                        Copy
                    </Button>
                    <Button variant="text" size="sm" onClick={local.onClose}>Close</Button>
                </>
            }
        >
            <div class="schema-dialog__content">
                <pre class="schema-dialog__code">{schemaJson()}</pre>
            </div>
        </Dialog>
    );
};
