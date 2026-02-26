/**
 * SignatureField — canvas-based signature pad.
 * Works in both 'editor' and 'runtime' modes.
 * Uses @formanywhere/ui components + inline styles for M3 styling.
 */
import type { Component } from 'solid-js';
import { Show, onMount, onCleanup } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import { Button } from '@formanywhere/ui/button';
import type { FieldProps } from '../field-types';

export const SignatureField: Component<FieldProps> = (props) => {
    let canvasRef: HTMLCanvasElement | undefined;
    let isDrawing = false;

    const setupCanvas = (canvas: HTMLCanvasElement) => {
        canvasRef = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * (window.devicePixelRatio || 1);
        canvas.height = rect.height * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle =
            getComputedStyle(canvas).getPropertyValue('--m3-color-on-surface').trim() || '#1C1B1F';

        const existing = props.value();
        if (existing) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
            img.src = existing;
        }

        const getPos = (e: MouseEvent | TouchEvent) => {
            const r = canvas.getBoundingClientRect();
            if ('touches' in e) {
                return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
            }
            return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
        };

        const startDraw = (e: MouseEvent | TouchEvent) => {
            isDrawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };
        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };
        const endDraw = () => {
            if (!isDrawing) return;
            isDrawing = false;
            props.onValue(canvas.toDataURL('image/png'));
        };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseleave', endDraw);
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', endDraw);

        onCleanup(() => {
            canvas.removeEventListener('mousedown', startDraw);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', endDraw);
            canvas.removeEventListener('mouseleave', endDraw);
            canvas.removeEventListener('touchstart', startDraw);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', endDraw);
        });
    };

    const clearSignature = () => {
        if (!canvasRef) return;
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        props.onValue('');
    };

    return (
        <Stack gap="xs">
            <Typography variant="body-medium" style={{ 'font-weight': '500' }}>
                {props.element.label}
                <Show when={props.mode === 'runtime' && props.element.required}>
                    <span style={{ color: 'var(--m3-color-error, #B3261E)', 'margin-left': '4px' }}>*</span>
                </Show>
            </Typography>
            <div style={{
                position: 'relative',
                border: '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                'border-radius': 'var(--m3-shape-medium, 12px)',
                overflow: 'hidden',
                background: 'var(--m3-color-surface, #FFFBFE)',
            }}>
                <canvas
                    ref={(el) => onMount(() => setupCanvas(el))}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '120px',
                        cursor: 'crosshair',
                        'touch-action': 'none',
                    }}
                />
                <Button
                    variant="text"
                    size="sm"
                    icon="cross"
                    onClick={clearSignature}
                    style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                    }}
                >
                    Clear
                </Button>
            </div>
            <Show when={props.mode === 'runtime' && props.error}>
                <Typography variant="body-small" color="error">{props.error}</Typography>
            </Show>
        </Stack>
    );
};
