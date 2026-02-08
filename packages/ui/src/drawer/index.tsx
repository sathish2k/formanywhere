/**
 * Material 3 Navigation Drawer Component for SolidJS
 */
import { JSX, Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

export interface DrawerProps {
    /** Open state */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Drawer content */
    children: JSX.Element;
    /** Drawer width (default: 360px) */
    width?: string;
    /** Anchor position */
    anchor?: 'left' | 'right';
    /** Modal or Standard (inline) - simplified to just modal for now via styling overrides if needed */
    // For now we implement Modal Drawer primarily
}

export const Drawer: Component<DrawerProps> = (props) => {
    const width = props.width || '320px'; // M3 standard is often 320-360px
    const anchor = props.anchor || 'left';

    const backdropStyle = (open: boolean): JSX.CSSProperties => ({
        position: 'fixed',
        inset: 0,
        background: 'var(--m3-color-scrim, rgba(0, 0, 0, 0.32))',
        opacity: open ? '1' : '0',
        'pointer-events': open ? 'auto' : 'none',
        transition: 'opacity 300ms cubic-bezier(0.2, 0, 0, 1)',
        'z-index': '600',
    });



    const drawerStyle = (open: boolean): JSX.CSSProperties => ({
        position: 'fixed',
        top: 0,
        bottom: 0,
        [anchor]: 0,
        width: width,
        'max-width': 'calc(100vw - 56px)', // Leave room for scrim tap on mobile
        background: 'var(--m3-color-surface-container-low, #f7f2fa)', // Drawer usually low container
        'border-radius': anchor === 'left' ? '0 16px 16px 0' : '16px 0 0 16px',
        'box-shadow': 'var(--m3-elevation-1)',
        transform: open ? 'translateX(0)' : `translateX(${anchor === 'left' ? '-100%' : '100%'})`,
        transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
        'z-index': '601',
        overflow: 'hidden',
        display: 'flex',
        'flex-direction': 'column',
    });

    // Handle ESC key
    createEffect(() => {
        if (!props.open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') props.onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // Lock scroll
        onCleanup(() => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        });
    });

    return (
        <Portal>
            <div
                style={backdropStyle(props.open)}
                onClick={props.onClose}
                aria-hidden={!props.open}
            />
            <div
                style={drawerStyle(props.open)}
                role="dialog"
                aria-modal="true"
                tabindex="-1"
            >
                {props.children}
            </div>
        </Portal>
    );
};

export default Drawer;
