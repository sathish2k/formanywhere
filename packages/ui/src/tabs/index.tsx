/**
 * Material 3 Tabs Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides:
 * - Tabs: Tab container
 * - Tab: Individual tab
 * - TabPanel: Tab content panel
 */
import { JSX, Component, createContext, useContext, createSignal, For, ParentComponent, Accessor, Show } from 'solid-js';
import { Ripple } from '../ripple';

// Tabs Context
interface TabsContextValue {
    activeTab: Accessor<string>;
    setActiveTab: (id: string) => void;
    variant: 'primary' | 'secondary';
}

const TabsContext = createContext<TabsContextValue>();

export interface TabsProps {
    /** Active tab ID */
    activeTab?: string;
    /** Default active tab ID */
    defaultActiveTab?: string;
    /** Tab variant */
    variant?: 'primary' | 'secondary';
    /** Change handler */
    onChange?: (tabId: string) => void;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children */
    children: JSX.Element;
}

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
            <div style={props.style}>
                {props.children}
            </div>
        </TabsContext.Provider>
    );
};

export interface TabListProps {
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children tabs */
    children: JSX.Element;
}

export const TabList: ParentComponent<TabListProps> = (props) => {
    const context = useContext(TabsContext);

    return (
        <div
            role="tablist"
            style={{
                display: 'flex',
                'border-bottom': '1px solid var(--m3-color-surface-variant, rgba(231, 224, 236, 0.4))',
                ...props.style,
            }}
        >
            {props.children}
        </div>
    );
};

export interface TabProps {
    /** Tab ID */
    id: string;
    /** Tab label */
    label: string;
    /** Tab icon */
    icon?: JSX.Element;
    /** Disabled state */
    disabled?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
}

const tabStyles = (active: boolean, variant: string, disabled: boolean): JSX.CSSProperties => ({
    position: 'relative',
    display: 'inline-flex',
    'flex-direction': variant === 'secondary' ? 'row' : 'column',
    'align-items': 'center',
    'justify-content': 'center',
    gap: '4px',
    padding: '12px 16px',
    'min-width': '90px',
    border: 'none',
    background: 'transparent',
    color: active
        ? 'var(--m3-color-primary, #5B5FED)'
        : 'var(--m3-color-on-surface-variant, #49454E)',
    'font-size': '14px',
    'font-weight': '500',
    'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.38' : '1',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
    overflow: 'hidden',
});

const indicatorStyles = (active: boolean): JSX.CSSProperties => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    'border-radius': '3px 3px 0 0',
    background: active ? 'var(--m3-color-primary, #5B5FED)' : 'transparent',
    transition: 'background 150ms cubic-bezier(0.2, 0, 0, 1)',
});

export const Tab: Component<TabProps> = (props) => {
    const context = useContext(TabsContext);
    const isActive = () => context?.activeTab() === props.id;
    const variant = context?.variant ?? 'primary';

    const handleClick = () => {
        if (props.disabled) return;
        context?.setActiveTab(props.id);
    };

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive()}
            disabled={props.disabled}
            onClick={handleClick}
            style={{ ...tabStyles(isActive(), variant, !!props.disabled), ...props.style }}
        >
            <Ripple disabled={props.disabled} />
            {props.icon && <span style={{ display: 'flex' }}>{props.icon}</span>}
            <span>{props.label}</span>
            <div style={indicatorStyles(isActive())} />
        </button>
    );
};

export interface TabPanelProps {
    /** Tab ID this panel belongs to */
    tabId: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children */
    children: JSX.Element;
}

export const TabPanel: ParentComponent<TabPanelProps> = (props) => {
    const context = useContext(TabsContext);
    const isActive = () => context?.activeTab() === props.tabId;

    return (
        <Show when={isActive()}>
            <div
                role="tabpanel"
                aria-labelledby={props.tabId}
                style={{ padding: '16px', ...props.style }}
            >
                {props.children}
            </div>
        </Show>
    );
};

export default Tabs;
