/**
 * Material 3 Bottom Sheet Component for SolidJS
 */
import { JSX, Component, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

export interface BottomSheetProps {
    /** Open state */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Content */
    children: JSX.Element;
    /** Custom styles */
    style?: JSX.CSSProperties;
}

export const BottomSheet: Component<BottomSheetProps> = (props) => {
    const backdropStyle = (open: boolean): JSX.CSSProperties => ({
        position: 'fixed',
        inset: 0,
        background: 'var(--m3-color-scrim, rgba(0, 0, 0, 0.32))',
        opacity: open ? '1' : '0',
        'pointer-events': open ? 'auto' : 'none',
        transition: 'opacity 300ms cubic-bezier(0.2, 0, 0, 1)',
        'z-index': '600',
    });

    const sheetStyle = (open: boolean): JSX.CSSProperties => ({
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        'max-height': '90vh', // M3 spec
        background: 'var(--m3-color-surface-container-low, #f7f2fa)',
        'border-radius': '28px 28px 0 0',
        'box-shadow': 'var(--m3-elevation-1)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
        display: 'flex',
        'z-index': '601',
        'flex-direction': 'column',
    });

    const dragHandleStyle: JSX.CSSProperties = {
        width: '32px',
        height: '4px',
        'background-color': 'var(--m3-color-on-surface-variant, #79747E)',
        opacity: '0.4',
        'border-radius': '2px',
        'margin': '22px auto 0', // M3 spec spacing
        'flex-shrink': 0,
    };

    // simplified internal close for now
    const handleBackdropClick = () => props.onClose();

    createEffect(() => {
        if (!props.open) return;
        document.body.style.overflow = 'hidden';
        onCleanup(() => {
            document.body.style.overflow = '';
        });
    });

    return (
        <Portal>
            <div
                style={backdropStyle(props.open)}
                onClick={handleBackdropClick}
            />
            <div
                style={sheetStyle(props.open)}
                role="dialog"
                aria-modal="true"
            >
                {/* Drag Handle Area */}
                <div style={dragHandleStyle} />

                <div style={{ padding: '0 24px 24px 24px', 'overflow-y': 'auto', ...props.style }}>
                    {props.children}
                </div>
            </div>
        </Portal>
    );
};

export default BottomSheet;
