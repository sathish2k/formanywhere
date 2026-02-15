/**
 * Layout Builder — Properties Panel
 * Right-side panel for editing element properties.
 * Reuses .form-properties__* class names from form-editor for visual consistency.
 */
import { Component, Show, Switch, Match } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { TextField } from '@formanywhere/ui/input';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import type { LayoutElement, PageData } from './types';

export interface PropertiesPanelProps {
    selectedElement: LayoutElement | null;
    onUpdateElement: (updates: Partial<LayoutElement>) => void;
    onCloseElement: () => void;
    layoutName: string;
    layoutDescription: string;
    onLayoutNameChange: (name: string) => void;
    onLayoutDescriptionChange: (desc: string) => void;
    pages?: PageData[];
}

export const PropertiesPanel: Component<PropertiesPanelProps> = (props) => {
    return (
        <div class="form-properties">
            <div class="form-properties__header">
                <Icon name="settings" size={18} />
                <Typography variant="title-small">Properties</Typography>
            </div>

            <Show
                when={props.selectedElement}
                fallback={
                    <div class="form-properties__empty">
                        <div class="form-properties__empty-icon">
                            <Icon name="sliders" size={36} />
                        </div>
                        <Typography variant="body-medium" color="on-surface-variant">
                            Select an element to edit its properties
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant" style={{ opacity: 0.7 }}>
                            Drag elements from the sidebar and drop them into the header or footer zones
                        </Typography>
                    </div>
                }
            >
                <div class="form-properties__content">
                    {/* Type badge */}
                    <div class="form-properties__type-badge">
                        <Icon name="layers" size={16} />
                        <Typography variant="label-medium">
                            {props.selectedElement!.type.charAt(0).toUpperCase() + props.selectedElement!.type.slice(1)}
                        </Typography>
                    </div>

                    {/* Close button */}
                    <div style={{ display: 'flex', "justify-content": 'flex-end', "margin-top": '-8px' }}>
                        <IconButton
                            variant="standard"
                            size="sm"
                            icon={<Icon name="x" size={16} />}
                            onClick={() => props.onCloseElement()}
                            aria-label="Close"
                        />
                    </div>

                    <ElementProperties
                        element={props.selectedElement!}
                        onUpdate={props.onUpdateElement}
                        pages={props.pages}
                    />
                </div>
            </Show>
        </div>
    );
};

// ── Element-specific properties ────────────────────────────────

interface ElementPropertiesInnerProps {
    element: LayoutElement;
    onUpdate: (updates: Partial<LayoutElement>) => void;
    pages?: PageData[];
}

const ElementProperties: Component<ElementPropertiesInnerProps> = (props) => {
    return (
        <div class="form-properties__section">
            <Switch fallback={
                <Typography variant="body-small" color="on-surface-variant">
                    No editable properties for this element
                </Typography>
            }>
                {/* Heading properties */}
                <Match when={props.element.type === 'heading'}>
                    <div class="form-properties__section">
                        <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                            General
                        </Typography>
                        <div class="form-properties__field">
                            <TextField
                                label="Label"
                                value={props.element.label || ''}
                                onInput={(e) => props.onUpdate({ label: (e.target as HTMLInputElement).value })}
                                size="sm"
                            />
                        </div>
                        <div class="form-properties__field">
                            <label class="form-properties__select-label">
                                <Typography variant="body-small" color="on-surface-variant">Variant</Typography>
                                <select
                                    class="form-properties__select"
                                    value={props.element.typographyVariant || 'headline-medium'}
                                    onChange={(e) => props.onUpdate({ typographyVariant: (e.target as HTMLSelectElement).value as LayoutElement['typographyVariant'] })}
                                >
                                    <option value="display-large">Display Large</option>
                                    <option value="display-medium">Display Medium</option>
                                    <option value="display-small">Display Small</option>
                                    <option value="headline-large">Headline Large</option>
                                    <option value="headline-medium">Headline Medium</option>
                                    <option value="headline-small">Headline Small</option>
                                    <option value="title-large">Title Large</option>
                                    <option value="title-medium">Title Medium</option>
                                    <option value="title-small">Title Small</option>
                                </select>
                            </label>
                        </div>

                        <Divider />
                        <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                            Alignment
                        </Typography>
                        <div class="form-properties__field" style={{ "flex-direction": "row", gap: "4px" }}>
                            <Button variant={props.element.align === 'left' ? 'filled' : 'outlined'} size="sm" onClick={() => props.onUpdate({ align: 'left' })}>
                                <Icon name="align-left" size={16} />
                            </Button>
                            <Button variant={props.element.align === 'center' || !props.element.align ? 'filled' : 'outlined'} size="sm" onClick={() => props.onUpdate({ align: 'center' })}>
                                <Icon name="align-center" size={16} />
                            </Button>
                            <Button variant={props.element.align === 'right' ? 'filled' : 'outlined'} size="sm" onClick={() => props.onUpdate({ align: 'right' })}>
                                <Icon name="align-right" size={16} />
                            </Button>
                        </div>
                    </div>
                </Match>

                {/* Button / Arrow properties */}
                <Match when={['nextButton', 'backButton', 'nextArrow', 'backArrow'].includes(props.element.type)}>
                    <div class="form-properties__section">
                        <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                            General
                        </Typography>
                        <div class="form-properties__field">
                            <TextField
                                label="Label"
                                value={props.element.label || ''}
                                onInput={(e) => props.onUpdate({ label: (e.target as HTMLInputElement).value })}
                                size="sm"
                            />
                        </div>
                        <div class="form-properties__field">
                            <label class="form-properties__select-label">
                                <Typography variant="body-small" color="on-surface-variant">Variant</Typography>
                                <select
                                    class="form-properties__select"
                                    value={props.element.variant || 'filled'}
                                    onChange={(e) => props.onUpdate({ variant: (e.target as HTMLSelectElement).value as LayoutElement['variant'] })}
                                >
                                    <option value="filled">Filled</option>
                                    <option value="outlined">Outlined</option>
                                    <option value="text">Text</option>
                                </select>
                            </label>
                        </div>

                        <Divider />
                        <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                            Position
                        </Typography>
                        <div class="form-properties__field" style={{ "flex-direction": "row", gap: "4px" }}>
                            <Button variant={props.element.position === 'left' ? 'filled' : 'outlined'} size="sm" onClick={() => props.onUpdate({ position: 'left' })}>Left</Button>
                            <Button variant={props.element.position === 'center' ? 'filled' : 'outlined'} size="sm" onClick={() => props.onUpdate({ position: 'center' })}>Center</Button>
                            <Button variant={props.element.position === 'right' || !props.element.position ? 'filled' : 'outlined'} size="sm" onClick={() => props.onUpdate({ position: 'right' })}>Right</Button>
                        </div>
                    </div>
                </Match>

                {/* Stepper properties */}
                <Match when={props.element.type === 'stepper'}>
                    <div class="form-properties__section">
                        <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                            Stepper
                        </Typography>
                        <div class="form-properties__field">
                            <label class="form-properties__select-label">
                                <Typography variant="body-small" color="on-surface-variant">Variant</Typography>
                                <select
                                    class="form-properties__select"
                                    value={props.element.stepperVariant || 'dots'}
                                    onChange={(e) => props.onUpdate({ stepperVariant: (e.target as HTMLSelectElement).value as LayoutElement['stepperVariant'] })}
                                >
                                    <option value="dots">Dots</option>
                                    <option value="numbers">Numbers</option>
                                    <option value="progress">Progress</option>
                                    <option value="text">Text</option>
                                </select>
                            </label>
                        </div>
                        <Show when={props.element.stepperVariant === 'numbers'}>
                            <div class="form-properties__field">
                                <label class="form-properties__select-label">
                                    <Typography variant="body-small" color="on-surface-variant">Orientation</Typography>
                                    <select
                                        class="form-properties__select"
                                        value={props.element.orientation || 'horizontal'}
                                        onChange={(e) => props.onUpdate({ orientation: (e.target as HTMLSelectElement).value as LayoutElement['orientation'] })}
                                    >
                                        <option value="horizontal">Horizontal</option>
                                        <option value="vertical">Vertical</option>
                                    </select>
                                </label>
                            </div>
                        </Show>
                    </div>
                </Match>

                {/* Column properties */}
                <Match when={['twoColumn', 'threeColumn'].includes(props.element.type)}>
                    <div class="form-properties__section">
                        <Typography variant="label-medium" color="on-surface-variant" class="form-properties__section-title">
                            Layout
                        </Typography>
                        <div class="form-properties__field">
                            <label class="form-properties__select-label">
                                <Typography variant="body-small" color="on-surface-variant">Gap</Typography>
                                <select
                                    class="form-properties__select"
                                    value={props.element.columnGap || 'medium'}
                                    onChange={(e) => props.onUpdate({ columnGap: (e.target as HTMLSelectElement).value as LayoutElement['columnGap'] })}
                                >
                                    <option value="none">None</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </label>
                        </div>
                        <div class="form-properties__field">
                            <label class="form-properties__select-label">
                                <Typography variant="body-small" color="on-surface-variant">Alignment</Typography>
                                <select
                                    class="form-properties__select"
                                    value={props.element.columnAlignment || 'center'}
                                    onChange={(e) => props.onUpdate({ columnAlignment: (e.target as HTMLSelectElement).value as LayoutElement['columnAlignment'] })}
                                >
                                    <option value="top">Top</option>
                                    <option value="center">Center</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="stretch">Stretch</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </Match>
            </Switch>
        </div>
    );
};
