/**
 * FormSettingsDialog — Full-page modal for form-level settings
 *
 * Tabs:
 *   1. Theme — Primary/secondary colors, border radius, font family
 *   2. Custom CSS — Freeform CSS editor
 *   3. Header — Google Font URL, custom meta tags
 *   4. External Resources — External CSS/JS URLs
 */
import { createSignal, For, Show } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { TextField } from '@formanywhere/ui/textfield';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import './dialogs.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface FormSettings {
    /** Theme */
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    surfaceColor: string;
    borderRadius: number;
    fontFamily: string;
    /** Custom CSS */
    customCSS: string;
    /** Header/Fonts */
    googleFontUrl: string;
    customHeadTags: string;
    /** External resources */
    externalCSS: string[];
    externalJS: string[];
    /** Thank You page */
    successHeading: string;
    successMessage: string;
    successShowData: boolean;
    successButtonText: string;
    successButtonUrl: string;
    redirectUrl: string;
    redirectDelay: number;
}

export interface FormSettingsDialogProps {
    open: boolean;
    onClose: () => void;
    settings: FormSettings;
    onSave: (settings: FormSettings) => void;
}

type SettingsTab = 'theme' | 'css' | 'header' | 'resources' | 'thankyou';

const TABS: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'theme', label: 'Theme', icon: 'palette' },
    { id: 'css', label: 'Custom CSS', icon: 'code' },
    { id: 'header', label: 'Fonts & Head', icon: 'type' },
    { id: 'resources', label: 'External Resources', icon: 'link' },
    { id: 'thankyou', label: 'Thank You', icon: 'check-circle' },
];

const FONT_OPTIONS = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Nunito',
    'Raleway',
    'Source Sans 3',
    'DM Sans',
];

// ─── Component ──────────────────────────────────────────────────────────────────

export const FormSettingsDialog: Component<FormSettingsDialogProps> = (props) => {
    const [activeTab, setActiveTab] = createSignal<SettingsTab>('theme');

    // Local editable copies
    const [primaryColor, setPrimaryColor] = createSignal(props.settings.primaryColor);
    const [secondaryColor, setSecondaryColor] = createSignal(props.settings.secondaryColor);
    const [backgroundColor, setBackgroundColor] = createSignal(props.settings.backgroundColor);
    const [surfaceColor, setSurfaceColor] = createSignal(props.settings.surfaceColor);
    const [borderRadius, setBorderRadius] = createSignal(props.settings.borderRadius);
    const [fontFamily, setFontFamily] = createSignal(props.settings.fontFamily);
    const [customCSS, setCustomCSS] = createSignal(props.settings.customCSS);
    const [googleFontUrl, setGoogleFontUrl] = createSignal(props.settings.googleFontUrl);
    const [customHeadTags, setCustomHeadTags] = createSignal(props.settings.customHeadTags);
    const [externalCSS, setExternalCSS] = createSignal<string[]>([...props.settings.externalCSS]);
    const [externalJS, setExternalJS] = createSignal<string[]>([...props.settings.externalJS]);
    const [successHeading, setSuccessHeading] = createSignal(props.settings.successHeading || 'Thank You!');
    const [successMessage, setSuccessMessage] = createSignal(props.settings.successMessage || 'Your response has been recorded.');
    const [successShowData, setSuccessShowData] = createSignal(props.settings.successShowData ?? false);
    const [successButtonText, setSuccessButtonText] = createSignal(props.settings.successButtonText || '');
    const [successButtonUrl, setSuccessButtonUrl] = createSignal(props.settings.successButtonUrl || '');
    const [redirectUrl, setRedirectUrl] = createSignal(props.settings.redirectUrl || '');
    const [redirectDelay, setRedirectDelay] = createSignal(props.settings.redirectDelay || 0);

    const handleSave = () => {
        props.onSave({
            primaryColor: primaryColor(),
            secondaryColor: secondaryColor(),
            backgroundColor: backgroundColor(),
            surfaceColor: surfaceColor(),
            borderRadius: borderRadius(),
            fontFamily: fontFamily(),
            customCSS: customCSS(),
            googleFontUrl: googleFontUrl(),
            customHeadTags: customHeadTags(),
            externalCSS: externalCSS(),
            externalJS: externalJS(),
            successHeading: successHeading(),
            successMessage: successMessage(),
            successShowData: successShowData(),
            successButtonText: successButtonText(),
            successButtonUrl: successButtonUrl(),
            redirectUrl: redirectUrl(),
            redirectDelay: redirectDelay(),
        });
        props.onClose();
    };

    // Resource list helpers
    const addCSS = () => setExternalCSS((prev) => [...prev, '']);
    const removeCSS = (i: number) => setExternalCSS((prev) => prev.filter((_, idx) => idx !== i));
    const updateCSS = (i: number, val: string) =>
        setExternalCSS((prev) => prev.map((v, idx) => (idx === i ? val : v)));

    const addJS = () => setExternalJS((prev) => [...prev, '']);
    const removeJS = (i: number) => setExternalJS((prev) => prev.filter((_, idx) => idx !== i));
    const updateJS = (i: number, val: string) =>
        setExternalJS((prev) => prev.map((v, idx) => (idx === i ? val : v)));

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            class="form-settings-dialog"
            closeOnBackdropClick={false}
        >
            {/* Full-page header */}
            <div class="form-settings-dialog__header">
                <div class="form-settings-dialog__header-left">
                    <IconButton
                        variant="standard"
                        size="sm"
                        icon={<Icon name="x" size={18} />}
                        onClick={props.onClose}
                    />
                    <Typography variant="title-medium">Form Settings</Typography>
                </div>
                <Button variant="filled" size="sm" onClick={handleSave}>
                    <Icon name="check" size={14} />
                    Save
                </Button>
            </div>

            {/* Tab navigation */}
            <div class="form-settings-dialog__tabs">
                <For each={TABS}>
                    {(tab) => (
                        <button
                            class="form-settings-dialog__tab"
                            classList={{ 'form-settings-dialog__tab--active': activeTab() === tab.id }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon name={tab.icon} size={16} />
                            {tab.label}
                        </button>
                    )}
                </For>
            </div>

            <Divider />

            {/* Tab content */}
            <div class="form-settings-dialog__content">
                {/* ── Theme ─────────────────────────────────── */}
                <Show when={activeTab() === 'theme'}>
                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">Colors</Typography>
                        <div class="form-settings-dialog__color-grid">
                            <ColorField label="Primary" value={primaryColor()} onChange={setPrimaryColor} />
                            <ColorField label="Secondary" value={secondaryColor()} onChange={setSecondaryColor} />
                            <ColorField label="Background" value={backgroundColor()} onChange={setBackgroundColor} />
                            <ColorField label="Surface" value={surfaceColor()} onChange={setSurfaceColor} />
                        </div>
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">Shape</Typography>
                        <div class="form-settings-dialog__range-row">
                            <Typography variant="body-small" color="on-surface-variant">Border Radius</Typography>
                            <span class="form-settings-dialog__range-value">{borderRadius()}px</span>
                        </div>
                        <input
                            type="range"
                            class="form-settings-dialog__range-input"
                            min={0}
                            max={28}
                            step={2}
                            value={borderRadius()}
                            onInput={(e) => setBorderRadius(Number(e.currentTarget.value))}
                        />
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">Typography</Typography>
                        <label class="form-settings-dialog__select-label">
                            <Typography variant="body-small" color="on-surface-variant">Font Family</Typography>
                            <select
                                class="form-settings-dialog__select"
                                value={fontFamily()}
                                onChange={(e) => setFontFamily(e.currentTarget.value)}
                            >
                                <For each={FONT_OPTIONS}>
                                    {(font) => <option value={font}>{font}</option>}
                                </For>
                            </select>
                        </label>
                    </div>

                    {/* Live preview */}
                    <Divider />
                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">Preview</Typography>
                        <div
                            class="form-settings-dialog__theme-preview"
                            style={{
                                'background': backgroundColor(),
                                'border-radius': `${borderRadius()}px`,
                                'font-family': `'${fontFamily()}', sans-serif`,
                            }}
                        >
                            <div
                                class="form-settings-dialog__preview-card"
                                style={{
                                    'background': surfaceColor(),
                                    'border-radius': `${Math.max(borderRadius() - 4, 0)}px`,
                                }}
                            >
                                <div
                                    class="form-settings-dialog__preview-btn"
                                    style={{ background: primaryColor() }}
                                >
                                    Submit
                                </div>
                                <div
                                    class="form-settings-dialog__preview-btn form-settings-dialog__preview-btn--secondary"
                                    style={{ color: secondaryColor(), 'border-color': secondaryColor() }}
                                >
                                    Cancel
                                </div>
                            </div>
                        </div>
                    </div>
                </Show>

                {/* ── Custom CSS ─────────────────────────────── */}
                <Show when={activeTab() === 'css'}>
                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Custom CSS
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            Write CSS to customize the form's appearance. This will be injected into the form runtime.
                        </Typography>
                        <textarea
                            class="form-settings-dialog__code-editor"
                            placeholder={`/* Custom CSS */\n.form-field {\n  border-radius: 8px;\n}`}
                            rows={18}
                            value={customCSS()}
                            onInput={(e) => setCustomCSS(e.currentTarget.value)}
                            spellcheck={false}
                        />
                    </div>
                </Show>

                {/* ── Header / Fonts ─────────────────────────── */}
                <Show when={activeTab() === 'header'}>
                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Google Fonts
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            Paste a Google Fonts embed URL to load custom fonts in the form.
                        </Typography>
                        <TextField
                            variant="outlined"
                            label="Google Font URL"
                            placeholder="https://fonts.googleapis.com/css2?family=..."
                            value={googleFontUrl()}
                            onInput={(e: InputEvent) =>
                                setGoogleFontUrl((e.target as HTMLInputElement).value)
                            }
                        />
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Custom Head Tags
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            Add custom HTML tags to the {'<head>'} section (meta tags, link tags, etc.)
                        </Typography>
                        <textarea
                            class="form-settings-dialog__code-editor form-settings-dialog__code-editor--sm"
                            placeholder={`<meta name="description" content="...">\n<link rel="icon" href="...">`}
                            rows={8}
                            value={customHeadTags()}
                            onInput={(e) => setCustomHeadTags(e.currentTarget.value)}
                            spellcheck={false}
                        />
                    </div>
                </Show>

                {/* ── External Resources ─────────────────────── */}
                <Show when={activeTab() === 'resources'}>
                    <div class="form-settings-dialog__section">
                        <div class="form-settings-dialog__section-header">
                            <Typography variant="title-small">External CSS</Typography>
                            <Button variant="text" size="sm" onClick={addCSS}>
                                <Icon name="plus" size={14} />
                                Add CSS
                            </Button>
                        </div>
                        <Typography variant="body-small" color="on-surface-variant">
                            Add external stylesheet URLs to load in the form runtime.
                        </Typography>
                        <div class="form-settings-dialog__resource-list">
                            <For each={externalCSS()}>
                                {(url, i) => (
                                    <div class="form-settings-dialog__resource-row">
                                        <TextField
                                            variant="outlined"
                                            label={`CSS URL ${i() + 1}`}
                                            placeholder="https://cdn.example.com/styles.css"
                                            value={url}
                                            onInput={(e: InputEvent) =>
                                                updateCSS(i(), (e.target as HTMLInputElement).value)
                                            }
                                        />
                                        <IconButton
                                            variant="standard"
                                            size="sm"
                                            icon={<Icon name="trash" size={14} />}
                                            onClick={() => removeCSS(i())}
                                        />
                                    </div>
                                )}
                            </For>
                            <Show when={externalCSS().length === 0}>
                                <Typography variant="body-small" color="on-surface-variant" style={{ 'text-align': 'center', padding: '16px' }}>
                                    No external CSS files added yet.
                                </Typography>
                            </Show>
                        </div>
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <div class="form-settings-dialog__section-header">
                            <Typography variant="title-small">External JavaScript</Typography>
                            <Button variant="text" size="sm" onClick={addJS}>
                                <Icon name="plus" size={14} />
                                Add JS
                            </Button>
                        </div>
                        <Typography variant="body-small" color="on-surface-variant">
                            Add external JavaScript URLs to load in the form runtime.
                        </Typography>
                        <div class="form-settings-dialog__resource-list">
                            <For each={externalJS()}>
                                {(url, i) => (
                                    <div class="form-settings-dialog__resource-row">
                                        <TextField
                                            variant="outlined"
                                            label={`JS URL ${i() + 1}`}
                                            placeholder="https://cdn.example.com/script.js"
                                            value={url}
                                            onInput={(e: InputEvent) =>
                                                updateJS(i(), (e.target as HTMLInputElement).value)
                                            }
                                        />
                                        <IconButton
                                            variant="standard"
                                            size="sm"
                                            icon={<Icon name="trash" size={14} />}
                                            onClick={() => removeJS(i())}
                                        />
                                    </div>
                                )}
                            </For>
                            <Show when={externalJS().length === 0}>
                                <Typography variant="body-small" color="on-surface-variant" style={{ 'text-align': 'center', padding: '16px' }}>
                                    No external JavaScript files added yet.
                                </Typography>
                            </Show>
                        </div>
                    </div>
                </Show>

                {/* ── Thank You Page ──────────────────────────── */}
                <Show when={activeTab() === 'thankyou'}>
                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Success Message
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            Customize what users see after submitting the form.
                        </Typography>

                        <TextField
                            variant="outlined"
                            label="Heading"
                            placeholder="Thank You!"
                            value={successHeading()}
                            onInput={(e: InputEvent) =>
                                setSuccessHeading((e.target as HTMLInputElement).value)
                            }
                        />
                        <TextField
                            variant="outlined"
                            label="Body Message"
                            placeholder="Your response has been recorded."
                            value={successMessage()}
                            onInput={(e: InputEvent) =>
                                setSuccessMessage((e.target as HTMLInputElement).value)
                            }
                        />
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Custom Button
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            Optionally show a button that links to an external page.
                        </Typography>
                        <TextField
                            variant="outlined"
                            label="Button Label"
                            placeholder="Visit our website"
                            value={successButtonText()}
                            onInput={(e: InputEvent) =>
                                setSuccessButtonText((e.target as HTMLInputElement).value)
                            }
                        />
                        <TextField
                            variant="outlined"
                            label="Button URL"
                            placeholder="https://example.com"
                            value={successButtonUrl()}
                            onInput={(e: InputEvent) =>
                                setSuccessButtonUrl((e.target as HTMLInputElement).value)
                            }
                        />
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Redirect
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            Redirect users to another page after submission.
                        </Typography>
                        <TextField
                            variant="outlined"
                            label="Redirect URL"
                            placeholder="https://example.com/thank-you"
                            value={redirectUrl()}
                            onInput={(e: InputEvent) =>
                                setRedirectUrl((e.target as HTMLInputElement).value)
                            }
                        />
                        <div class="form-settings-dialog__range-row">
                            <Typography variant="body-small" color="on-surface-variant">Redirect Delay</Typography>
                            <span class="form-settings-dialog__range-value">{redirectDelay()}s</span>
                        </div>
                        <input
                            type="range"
                            class="form-settings-dialog__range-input"
                            min={0}
                            max={15}
                            step={1}
                            value={redirectDelay()}
                            onInput={(e) => setRedirectDelay(Number(e.currentTarget.value))}
                        />
                    </div>

                    <Divider />

                    <div class="form-settings-dialog__section">
                        <Typography variant="title-small" class="form-settings-dialog__section-title">
                            Display Options
                        </Typography>
                        <label class="form-settings-dialog__checkbox-row">
                            <input
                                type="checkbox"
                                checked={successShowData()}
                                onChange={(e) => setSuccessShowData(e.currentTarget.checked)}
                            />
                            <Typography variant="body-medium">Show submitted data on success page</Typography>
                        </label>
                    </div>
                </Show>
            </div>
        </Dialog>
    );
};

/** Mini color field with swatch + hex input */
const ColorField: Component<{
    label: string;
    value: string;
    onChange: (val: string) => void;
}> = (props) => (
    <div class="form-settings-dialog__color-field">
        <Typography variant="body-small" color="on-surface-variant">{props.label}</Typography>
        <div class="form-settings-dialog__color-input-row">
            <input
                type="color"
                class="form-settings-dialog__color-swatch"
                value={props.value}
                onInput={(e) => props.onChange(e.currentTarget.value)}
            />
            <input
                type="text"
                class="form-settings-dialog__color-hex"
                value={props.value}
                onInput={(e) => props.onChange(e.currentTarget.value)}
                maxLength={7}
            />
        </div>
    </div>
);
