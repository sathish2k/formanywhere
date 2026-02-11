/**
 * Material 3 Tabs Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, createContext, useContext, createSignal, ParentComponent, Accessor, Show } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

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
