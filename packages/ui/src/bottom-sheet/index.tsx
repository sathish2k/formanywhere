/**
 * Material 3 Bottom Sheet Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, ParentComponent, Show, createEffect, onCleanup } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BottomSheetProps {
    /** Whether the bottom sheet is open */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Show a drag handle */
    dragHandle?: boolean;
    /** Whether clicking the backdrop closes the sheet */
    dismissible?: boolean;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Sheet content */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const BottomSheet: ParentComponent<BottomSheetProps> = (props) => {

    const dismissible = () => props.dismissible ?? true;

    // Lock body scroll when open
    createEffect(() => {
        if (typeof document === 'undefined') return;
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    onCleanup(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    });

    const handleBackdropClick = () => {
        if (dismissible()) props.onClose();
    };

    const backdropClass = () => {
        const classes = ['md-bottom-sheet-backdrop'];
        if (props.open) classes.push('open');
        return classes.join(' ');
    };

    const sheetClass = () => {
        const classes = ['md-bottom-sheet'];
        if (props.open) classes.push('open');
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <>
            <div class={backdropClass()} onClick={handleBackdropClick} />
            <div class={sheetClass()} style={props.style} role="dialog" aria-modal="true">
                <Show when={props.dragHandle !== false}>
                    <div class="md-bottom-sheet__drag-handle" />
                </Show>
                <div class="md-bottom-sheet__content">
                    {props.children}
                </div>
            </div>
        </>
    );
};

export default BottomSheet;
