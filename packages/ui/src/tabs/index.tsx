/**
 * Material 3 Tabs Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Features:
 * - Primary & secondary tab variants
 * - Sliding indicator animation (Web Animations API, like M3 reference)
 * - Keyboard navigation (Arrow keys, Home/End, Enter/Space)
 * - Roving tabindex
 * - Reduced-motion support (fade instead of slide)
 * - Icon, icon+label, and label-only tabs
 * - Scrollable tab list
 */
import { JSX, Component, createContext, useContext, createSignal, createEffect, on, ParentComponent, Accessor, Show, onMount } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface TabsContextValue {
    activeTab: Accessor<string>;
    setActiveTab: (id: string, prevTabEl?: HTMLElement) => void;
    variant: 'primary' | 'secondary';
    glass?: boolean;
    registerTab: (id: string, el: HTMLElement) => void;
    unregisterTab: (id: string) => void;
    getTabElement: (id: string) => HTMLElement | undefined;
}

const TabsContext = createContext<TabsContextValue>();

export interface TabsProps {
    /** Controlled active tab id */
    activeTab?: string;
    /** Uncontrolled default active tab id */
    defaultActiveTab?: string;
    /** Tab variant: primary (stacked icon+label) or secondary (inline) */
    variant?: 'primary' | 'secondary';
    /** Auto-activate tabs on focus (like M3 auto-activate) */
    autoActivate?: boolean;
    /** Glass morphism style */
    glass?: boolean;
    /** Change handler */
    onChange?: (tabId: string) => void;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    children: JSX.Element;
}

export interface TabListProps {
    /** Enable horizontal scrolling for many tabs */
    scrollable?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    children: JSX.Element;
}

export interface TabProps {
    /** Unique tab identifier */
    id: string;
    /** Tab label text */
    label?: string;
    /** Tab icon */
    icon?: JSX.Element;
    /** Use inline icon layout even for primary variant */
    inlineIcon?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

export interface TabPanelProps {
    /** Tab id this panel corresponds to */
    tabId: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    children: JSX.Element;
}

// ─── Indicator animation ────────────────────────────────────────────────────────

const INDICATOR_DURATION = 250;
const INDICATOR_EASING = 'cubic-bezier(0.3, 0, 0, 1)'; // M3 emphasized

function animateIndicator(
    indicatorEl: HTMLElement,
    prevIndicatorEl: HTMLElement | null,
    variant: 'primary' | 'secondary'
) {
    if (!indicatorEl) return;

    // Check reduced-motion preference
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (!prevIndicatorEl || prefersReduced) {
        // No previous tab or reduced motion: fade in
        indicatorEl.animate?.(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: INDICATOR_DURATION, easing: INDICATOR_EASING, fill: 'none' }
        );
        return;
    }

    // Slide from previous indicator position to new
    const fromRect = prevIndicatorEl.getBoundingClientRect();
    const toRect = indicatorEl.getBoundingClientRect();

    if (fromRect.width === 0 || toRect.width === 0) return;

    const translateX = fromRect.left - toRect.left;
    const scaleX = fromRect.width / toRect.width;

    indicatorEl.animate?.(
        [
            { transform: `translateX(${translateX}px) scaleX(${scaleX})` },
            { transform: 'none' },
        ],
        { duration: INDICATOR_DURATION, easing: INDICATOR_EASING, fill: 'none' }
    );
}

// ─── Components ─────────────────────────────────────────────────────────────────

export const Tabs: ParentComponent<TabsProps> = (props) => {
    const [internalActive, setInternalActive] = createSignal(props.defaultActiveTab ?? '');
    const activeTab = () => props.activeTab ?? internalActive();
    const variant = () => props.variant ?? 'primary';

    // Tab element registry for indicator animation & keyboard nav
    const tabRegistry = new Map<string, HTMLElement>();

    const registerTab = (id: string, el: HTMLElement) => { tabRegistry.set(id, el); };
    const unregisterTab = (id: string) => { tabRegistry.delete(id); };
    const getTabElement = (id: string) => tabRegistry.get(id);

    const setActiveTab = (id: string, prevTabEl?: HTMLElement) => {
        const prevId = activeTab();
        if (prevId === id) return;

        if (props.activeTab === undefined) {
            setInternalActive(id);
        }
        props.onChange?.(id);

        // Animate indicator from previous to new tab
        requestAnimationFrame(() => {
            const newEl = tabRegistry.get(id);
            const prevEl = prevTabEl ?? (prevId ? tabRegistry.get(prevId) : undefined);
            if (!newEl) return;

            const v = variant();
            // For primary: indicator is inside .md-tab__content; for secondary: inside the button
            const newIndicator = newEl.querySelector('.md-tab__indicator') as HTMLElement | null;
            const prevIndicator = prevEl?.querySelector('.md-tab__indicator') as HTMLElement | null;

            if (newIndicator) {
                animateIndicator(newIndicator, prevIndicator ?? null, v);
            }
        });
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, variant: variant(), glass: props.glass, registerTab, unregisterTab, getTabElement }}>
            <div style={props.style} class={props.class}>
                {props.children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabList: ParentComponent<TabListProps> = (props) => {
    let listRef: HTMLDivElement | undefined;

    const context = useContext(TabsContext);

    // ── Keyboard navigation (M3: ArrowLeft/Right, Home/End, Enter/Space) ────
    const handleKeyDown = (e: KeyboardEvent) => {
        const tabs = Array.from(listRef?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])') ?? []);
        if (tabs.length === 0) return;

        const currentIndex = tabs.findIndex(t => t === document.activeElement);
        let nextIndex = -1;

        // RTL-aware arrow direction
        const isRTL = listRef ? getComputedStyle(listRef).direction === 'rtl' : false;
        const forwardKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
        const backwardKey = isRTL ? 'ArrowRight' : 'ArrowLeft';

        switch (e.key) {
            case forwardKey:
                e.preventDefault();
                nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case backwardKey:
                e.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = tabs.length - 1;
                break;
            default:
                return;
        }

        if (nextIndex >= 0 && tabs[nextIndex]) {
            tabs[nextIndex].focus();
            // Scroll tab into view if scrollable
            tabs[nextIndex].scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
        }
    };

    const listClass = () => {
        const classes = ['md-tab-list'];
        if (props.scrollable) classes.push('scrollable');
        if (context?.glass) classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div
            ref={listRef}
            role="tablist"
            class={listClass()}
            style={props.style}
            onKeyDown={handleKeyDown}
        >
            {props.children}
        </div>
    );
};

export const Tab: Component<TabProps> = (props) => {
    const context = useContext(TabsContext);
    const isActive = () => context?.activeTab() === props.id;
    const variant = () => context?.variant ?? 'primary';
    const isIconOnly = () => !!props.icon && !props.label;

    let buttonRef: HTMLButtonElement | undefined;

    onMount(() => {
        if (buttonRef) {
            context?.registerTab(props.id, buttonRef);
        }
    });

    const handleClick = () => {
        if (props.disabled) return;
        context?.setActiveTab(props.id);
    };

    const rootClass = () => {
        const classes = ['md-tab'];
        classes.push(variant());
        if (isActive()) classes.push('active');
        if (props.disabled) classes.push('disabled');
        if (isIconOnly()) classes.push('icon-only');
        if (props.icon && props.label && variant() === 'primary' && !props.inlineIcon) classes.push('with-icon-and-label');
        if (props.inlineIcon) classes.push('inline-icon');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    // For primary variant, indicator is inside content wrapper (content-width)
    // For secondary variant, indicator is full-width (outside content)
    const isPrimary = () => variant() === 'primary';

    return (
        <button
            ref={buttonRef}
            type="button"
            role="tab"
            id={`${props.id}-tab`}
            aria-controls={`${props.id}-panel`}
            aria-selected={isActive()}
            tabIndex={isActive() ? 0 : -1}
            disabled={props.disabled}
            onClick={handleClick}
            class={rootClass()}
            style={props.style}
            data-component="tab"
        >
            <Ripple disabled={props.disabled} />
            <div class="md-tab__content">
                {props.icon && <span class="md-tab__icon">{props.icon}</span>}
                {props.label && <span class="md-tab__label">{props.label}</span>}
                {/* Primary: indicator inside content (content-width) */}
                {isPrimary() && <div class="md-tab__indicator" />}
            </div>
            {/* Secondary: indicator outside content (full-width) */}
            {!isPrimary() && <div class="md-tab__indicator" />}
        </button>
    );
};

export const TabPanel: ParentComponent<TabPanelProps> = (props) => {
    const context = useContext(TabsContext);
    const isActive = () => context?.activeTab() === props.tabId;

    return (
        <Show when={isActive()}>
            <div
                id={`${props.tabId}-panel`}
                role="tabpanel"
                aria-labelledby={`${props.tabId}-tab`}
                class={`md-tab-panel ${props.class || ''}`}
                style={props.style}
            >
                {props.children}
            </div>
        </Show>
    );
};

export default Tabs;
