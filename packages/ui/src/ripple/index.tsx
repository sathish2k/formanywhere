/**
 * Material 3 Ripple Component for SolidJS
 * Based on https://github.com/material-components/material-web/blob/main/ripple/internal/ripple.ts
 *
 * Provides authentic M3 ripple animation effects:
 * - Touch delay for distinguishing taps from scrolls
 * - Smooth scale animations with M3 easing
 * - Hover and press states
 * - Support for both mouse and touch interactions
 *
 * Uses CSS class-based styling with M3 design tokens
 */
import { createSignal, onMount, onCleanup, JSX, Component, splitProps } from 'solid-js';
import './styles.scss';

// M3 Animation constants (from material-components/material-web)
const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const TOUCH_DELAY_MS = 150;

// M3 Easing
const EASING = {
    STANDARD: 'cubic-bezier(0.2, 0, 0, 1)',
    STANDARD_ACCELERATE: 'cubic-bezier(0.3, 0, 1, 1)',
    EMPHASIZED_ACCELERATE: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    EMPHASIZED_DECELERATE: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
};

// Interaction states
enum State {
    INACTIVE,
    TOUCH_DELAY,
    HOLDING,
    WAITING_FOR_CLICK,
}

export interface RippleProps {
    /** Disables the ripple effect */
    disabled?: boolean;
    /** Custom CSS class */
    class?: string;
    /** Ripple color override */
    color?: string;
}

/**
 * Material 3 Ripple Component
 * 
 * Usage:
 * ```tsx
 * <div style={{ position: 'relative', overflow: 'hidden' }}>
 *   <Ripple />
 *   <button>Click me</button>
 * </div>
 * ```
 */
export const Ripple: Component<RippleProps> = (props) => {
    const [local] = splitProps(props, ['disabled', 'class', 'color']);

    let surfaceRef: HTMLDivElement | undefined;
    let growAnimation: Animation | undefined;
    let rippleStartEvent: PointerEvent | undefined;

    const [hovered, setHovered] = createSignal(false);
    const [pressed, setPressed] = createSignal(false);
    const [state, setState] = createSignal(State.INACTIVE);

    // Ripple sizing
    let initialSize = 0;
    let rippleScale = '';
    let rippleSize = '';

    const shouldReactToEvent = (event: PointerEvent, checkButton = false) => {
        if (local.disabled) return false;
        if (checkButton && event.button !== 0) return false; // Only primary button
        return true;
    };

    const isTouch = (event: PointerEvent) => event.pointerType === 'touch';

    const determineRippleSize = () => {
        if (!surfaceRef?.parentElement) return;

        const { height, width } = surfaceRef.parentElement.getBoundingClientRect();
        const maxDim = Math.max(height, width);
        const softEdgeSize = Math.max(
            SOFT_EDGE_CONTAINER_RATIO * maxDim,
            SOFT_EDGE_MINIMUM_SIZE
        );

        initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
        const maxRadius = hypotenuse + PADDING;

        rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
        rippleSize = `${initialSize}px`;
    };

    const getNormalizedPointerEventCoords = (event: PointerEvent) => {
        if (!surfaceRef?.parentElement) return { x: 0, y: 0 };

        const { scrollX, scrollY } = window;
        const { left, top } = surfaceRef.parentElement.getBoundingClientRect();
        const documentX = scrollX + left;
        const documentY = scrollY + top;

        return {
            x: event.pageX - documentX,
            y: event.pageY - documentY,
        };
    };

    const getTranslationCoordinates = (positionEvent?: PointerEvent) => {
        if (!surfaceRef?.parentElement) return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } };

        const { height, width } = surfaceRef.parentElement.getBoundingClientRect();

        // End in the center
        const endPoint = {
            x: (width - initialSize) / 2,
            y: (height - initialSize) / 2,
        };

        let startPoint;
        if (positionEvent) {
            startPoint = getNormalizedPointerEventCoords(positionEvent);
        } else {
            startPoint = { x: width / 2, y: height / 2 };
        }

        // Center around start point
        startPoint = {
            x: startPoint.x - initialSize / 2,
            y: startPoint.y - initialSize / 2,
        };

        return { startPoint, endPoint };
    };

    const startPressAnimation = (positionEvent?: PointerEvent) => {
        if (!surfaceRef) return;

        setPressed(true);
        growAnimation?.cancel();
        determineRippleSize();

        const { startPoint, endPoint } = getTranslationCoordinates(positionEvent);

        // Animate using Web Animations API for smooth M3 motion
        growAnimation = surfaceRef.animate(
            {
                top: [0, 0],
                left: [0, 0],
                height: [rippleSize, rippleSize],
                width: [rippleSize, rippleSize],
                transform: [
                    `translate(${startPoint.x}px, ${startPoint.y}px) scale(1)`,
                    `translate(${endPoint.x}px, ${endPoint.y}px) scale(${rippleScale})`,
                ],
            },
            {
                pseudoElement: '::after',
                duration: PRESS_GROW_MS,
                easing: EASING.STANDARD,
                fill: 'forwards',
            }
        );
    };

    const endPressAnimation = async () => {
        setState(State.INACTIVE);

        const animation = growAnimation;
        let pressAnimationPlayState = Infinity;

        if (typeof animation?.currentTime === 'number') {
            pressAnimationPlayState = animation.currentTime;
        } else if (animation?.currentTime) {
            pressAnimationPlayState = animation.currentTime.to('ms').value;
        }

        if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
            setPressed(false);
            return;
        }

        await new Promise((resolve) => {
            setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
        });

        if (growAnimation !== animation) {
            // A new press animation started
            return;
        }

        setPressed(false);
    };

    // Event handlers
    const handlePointerenter = (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return;
        setHovered(true);
    };

    const handlePointerleave = (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return;
        setHovered(false);

        if (state() !== State.INACTIVE) {
            endPressAnimation();
        }
    };

    const handlePointerdown = async (event: PointerEvent) => {
        if (!shouldReactToEvent(event, true)) return;

        rippleStartEvent = event;

        if (!isTouch(event)) {
            setState(State.WAITING_FOR_CLICK);
            startPressAnimation(event);
            return;
        }

        // Touch: wait for delay
        setState(State.TOUCH_DELAY);
        await new Promise((resolve) => setTimeout(resolve, TOUCH_DELAY_MS));

        if (state() !== State.TOUCH_DELAY) return;

        setState(State.HOLDING);
        startPressAnimation(event);
    };

    const handlePointerup = (event: PointerEvent) => {
        if (!shouldReactToEvent(event, true)) return;

        if (state() === State.HOLDING) {
            setState(State.WAITING_FOR_CLICK);
            return;
        }

        if (state() === State.TOUCH_DELAY) {
            setState(State.WAITING_FOR_CLICK);
            startPressAnimation(rippleStartEvent);
            return;
        }
    };

    const handleClick = () => {
        if (local.disabled) return;

        if (state() === State.WAITING_FOR_CLICK) {
            endPressAnimation();
            return;
        }

        if (state() === State.INACTIVE) {
            // Keyboard synthesized click
            startPressAnimation();
            endPressAnimation();
        }
    };

    const handlePointercancel = (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return;
        endPressAnimation();
    };

    // Setup event listeners on parent
    onMount(() => {
        const parent = surfaceRef?.parentElement;
        if (!parent) return;

        // Make parent position relative if not already
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.position === 'static') {
            parent.style.position = 'relative';
        }
        parent.style.overflow = 'hidden';

        parent.addEventListener('pointerenter', handlePointerenter);
        parent.addEventListener('pointerleave', handlePointerleave);
        parent.addEventListener('pointerdown', handlePointerdown);
        parent.addEventListener('pointerup', handlePointerup);
        parent.addEventListener('pointercancel', handlePointercancel);
        parent.addEventListener('click', handleClick);

        onCleanup(() => {
            parent.removeEventListener('pointerenter', handlePointerenter);
            parent.removeEventListener('pointerleave', handlePointerleave);
            parent.removeEventListener('pointerdown', handlePointerdown);
            parent.removeEventListener('pointerup', handlePointerup);
            parent.removeEventListener('pointercancel', handlePointercancel);
            parent.removeEventListener('click', handleClick);
        });
    });

    const rootClass = () => {
        const classes = ['m3-ripple-surface'];
        if (hovered()) classes.push('hovered');
        if (pressed()) classes.push('pressed');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <div
            ref={surfaceRef}
            aria-hidden="true"
            class={rootClass()}
            style={local.color ? { '--ripple-color': local.color } as JSX.CSSProperties : undefined}
        />
    );
};

export default Ripple;
