/**
 * ImportForm — @formanywhere/form-editor
 * Lets users paste JSON or upload a file to import an existing form schema.
 */
import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormSchema } from '@formanywhere/shared/types';
import { parseSchema } from '../../engine/schema';

export interface ImportFormProps {
    onImport: (schema: FormSchema) => void;
    onCancel: () => void;
}

export const ImportForm: Component<ImportFormProps> = (props) => {
    const [jsonInput, setJsonInput] = createSignal('');
    const [error, setError] = createSignal('');
    const [dragOver, setDragOver] = createSignal(false);

    const handleParse = () => {
        const text = jsonInput().trim();
        if (!text) {
            setError('Please paste a form JSON or upload a file.');
            return;
        }

        try {
            const schema = parseSchema(text);
            if (!schema.name || !schema.elements) {
                setError('Invalid form schema: missing "name" or "elements".');
                return;
            }
            setError('');
            props.onImport(schema);
        } catch {
            setError('Invalid JSON. Please check the format and try again.');
        }
    };

    const handleFileUpload = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            setJsonInput(text);
        };
        reader.readAsText(file);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer?.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            setJsonInput(text);
        };
        reader.readAsText(file);
    };

    return (
        <div class="import-form">
            <div class="import-form__container">
                <div class="import-form__header">
                    <Icon name="download" size={32} />
                    <Typography variant="headline-small">
                        Import Form
                    </Typography>
                    <Typography variant="body-medium" color="on-surface-variant">
                        Paste your form JSON or upload a .json file to import.
                    </Typography>
                </div>

                {/* Drop zone */}
                <div
                    class={`import-form__drop-zone ${dragOver() ? 'import-form__drop-zone--active' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <Icon name="file-text" size={40} />
                    <Typography variant="body-medium" color="on-surface-variant">
                        Drag & drop a .json file here
                    </Typography>
                    <label class="import-form__file-label">
                        <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileUpload}
                            class="import-form__file-input"
                        />
                        <span class="import-form__browse-btn">
                            <Button variant="outlined">
                                Browse Files
                            </Button>
                        </span>
                    </label>
                </div>

                {/* JSON textarea */}
                <div class="import-form__textarea-area">
                    <Typography variant="label-medium" color="on-surface-variant">
                        Or paste JSON directly:
                    </Typography>
                    <textarea
                        class="import-form__textarea"
                        placeholder='{ "name": "My Form", "elements": [...] }'
                        value={jsonInput()}
                        onInput={(e) => { setJsonInput(e.currentTarget.value); setError(''); }}
                        rows={8}
                    />
                </div>

                {/* Error */}
                {error() && (
                    <Typography variant="body-small" class="import-form__error">
                        {error()}
                    </Typography>
                )}

                {/* Actions */}
                <div class="import-form__actions">
                    <Button variant="text" onClick={props.onCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="filled"
                        onClick={handleParse}
                        disabled={!jsonInput().trim()}
                    >
                        <Icon name="download" size={18} />
                        Import
                    </Button>
                </div>
            </div>
        </div>
    );
};
