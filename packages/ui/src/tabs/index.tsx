/**
 * Material 3 Tabs Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, createContext, useContext, createSignal, ParentComponent, Accessor, Show } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface TabsContextValue {
    activeTab: Accessor<string>;
    setActiveTab: (id: string) => void;
    variant: 'primary' | 'secondary';
}

const TabsContext = createContext<TabsContextValue>();

export interface TabsProps {
    activeTab?: string;
    defaultActiveTab?: string;
    variant?: 'primary' | 'secondary';
    onChange?: (tabId: string) => void;
    style?: JSX.CSSProperties;
    class?: string;
    children: JSX.Element;
}

export interface TabListProps {
    style?: JSX.CSSProperties;
    class?: string;
    children: JSX.Element;
}

export interface TabProps {
    id: string;
    label: string;
    icon?: JSX.Element;
    disabled?: boolean;
    style?: JSX.CSSProperties;
    class?: string;
}

export interface TabPanelProps {
    tabId: string;
    style?: JSX.CSSProperties;
    class?: string;
    children: JSX.Element;
}

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 TABS - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-tab-list {
    display: flex;
    border-bottom: 1px solid var(--m3-color-surface-variant, rgba(231, 224, 236, 0.4));
}

.md-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 16px;
    min-width: 90px;
    border: none;
    background: transparent;
    color: var(--m3-color-on-surface-variant, #49454E);
    font-size: 14px;
    font-weight: 500;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    cursor: pointer;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-tab.primary { flex-direction: column; }
.md-tab.secondary { flex-direction: row; }

.md-tab.disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

.md-tab.active {
    color: var(--m3-color-primary, #6750A4);
}

/* Hover state */
.md-tab:hover:not(.disabled) {
    color: var(--m3-color-on-surface, #1C1B1F);
}

.md-tab.active:hover:not(.disabled) {
    color: var(--m3-color-primary, #6750A4);
}

/* Focus ring */
.md-tab:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: -2px;
}

/* Active indicator (underline) */
.md-tab__indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: transparent;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-tab.active .md-tab__indicator {
    background: var(--m3-color-primary, #6750A4);
}

/* Tab panel */
.md-tab-panel {
    padding: 16px;
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-tab-list.glass {
    background: var(--glass-tint, rgba(255, 255, 255, 0.4));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.25));
    border-radius: var(--m3-shape-medium, 12px);
    border-bottom-color: var(--glass-border, rgba(255, 255, 255, 0.25));
}

.md-tab-list.glass .md-tab:hover:not(.disabled) {
    background: var(--glass-hover, rgba(255, 255, 255, 0.15));
}

.md-tab-list.glass .md-tab.active .md-tab__indicator {
    background: var(--m3-color-primary, rgba(103, 80, 164, 0.9));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-tabs', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Components ─────────────────────────────────────────────────────────────────

export const Tabs: ParentComponent<TabsProps> = (props) => {
    const [internalActive, setInternalActive] = createSignal(props.defaultActiveTab ?? '');
    const activeTab = () => props.activeTab ?? internalActive();
    const variant = props.variant ?? 'primary';

    const setActiveTab = (id: string) => {
        if (props.activeTab === undefined) {
            setInternalActive(id);
        }
        props.onChange?.(id);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
            <div style={props.style} class={props.class}>
                {props.children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabList: ParentComponent<TabListProps> = (props) => {
    injectStyles();
    return (
        <div role="tablist" class={`md-tab-list ${props.class || ''}`} style={props.style}>
            {props.children}
        </div>
    );
};

export const Tab: Component<TabProps> = (props) => {
    const context = useContext(TabsContext);
    const isActive = () => context?.activeTab() === props.id;
    const variant = () => context?.variant ?? 'primary';

    injectStyles();

    const handleClick = () => {
        if (props.disabled) return;
        context?.setActiveTab(props.id);
    };

    const rootClass = () => {
        const classes = ['md-tab'];
        classes.push(variant());
        if (isActive()) classes.push('active');
        if (props.disabled) classes.push('disabled');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive()}
            disabled={props.disabled}
            onClick={handleClick}
            class={rootClass()}
            style={props.style}
            data-component="tab"
        >
            <Ripple disabled={props.disabled} />
            {props.icon && <span style={{ display: 'flex' }}>{props.icon}</span>}
            <span>{props.label}</span>
            <div class="md-tab__indicator" />
        </button>
    );
};

export const TabPanel: ParentComponent<TabPanelProps> = (props) => {
    const context = useContext(TabsContext);
    const isActive = () => context?.activeTab() === props.tabId;

    injectStyles();

    return (
        <Show when={isActive()}>
            <div
                role="tabpanel"
                aria-labelledby={props.tabId}
                class={`md-tab-panel ${props.class || ''}`}
                style={props.style}
            >
                {props.children}
            </div>
        </Show>
    );
};

export default Tabs;
