// ─── BlogImage — Progressive Image Loading ─────────────────────────────────
// Shows a tiny blurred LQIP placeholder instantly, then fades in the full
// AVIF image when loaded. Uses <picture> for AVIF + WebP fallback.

import { createSignal, onMount, Show, type JSX, splitProps } from 'solid-js';

export interface BlogImageProps {
    /** Full-size AVIF image URL */
    src: string;
    /** WebP fallback URL (optional — browser picks best format) */
    webpSrc?: string;
    /** Base64-encoded LQIP data URI (e.g. "data:image/webp;base64,...") */
    lqip?: string;
    /** Alt text for accessibility */
    alt: string;
    /** Image width in pixels */
    width?: number;
    /** Image height in pixels */
    height?: number;
    /** CSS class name */
    class?: string;
    /** Inline styles */
    style?: JSX.CSSProperties;
    /** Loading strategy — 'lazy' (default) or 'eager' (above the fold) */
    loading?: 'lazy' | 'eager';
}

export function BlogImage(props: BlogImageProps) {
    const [loaded, setLoaded] = createSignal(false);
    const [error, setError] = createSignal(false);

    const aspectRatio = () => {
        if (props.width && props.height) {
            return `${props.width} / ${props.height}`;
        }
        return '16 / 9'; // default
    };

    return (
        <div
            class={props.class}
            style={{
                position: 'relative',
                overflow: 'hidden',
                "border-radius": '8px',
                "aspect-ratio": aspectRatio(),
                "background-color": '#1a1a2e',
                ...props.style,
            }}
        >
            {/* LQIP placeholder — shows instantly */}
            <Show when={props.lqip && !loaded()}>
                <img
                    src={props.lqip}
                    alt=""
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: '0',
                        width: '100%',
                        height: '100%',
                        "object-fit": 'cover',
                        filter: 'blur(20px)',
                        transform: 'scale(1.1)',
                        transition: 'opacity 0.3s ease',
                        opacity: loaded() ? '0' : '1',
                    }}
                />
            </Show>

            {/* Full image with <picture> for format fallback */}
            <Show when={!error()} fallback={
                <div style={{
                    display: 'flex',
                    "align-items": 'center',
                    "justify-content": 'center',
                    height: '100%',
                    color: 'var(--md-sys-color-on-surface-variant, #999)',
                    "font-size": '14px',
                }}>
                    ⚠️ Image failed to load
                </div>
            }>
                <picture>
                    {/* AVIF source (best compression, modern browsers) */}
                    <source srcset={props.src} type="image/avif" />
                    {/* WebP fallback */}
                    <Show when={props.webpSrc}>
                        <source srcset={props.webpSrc} type="image/webp" />
                    </Show>
                    {/* Fallback img tag */}
                    <img
                        src={props.webpSrc || props.src}
                        alt={props.alt}
                        width={props.width}
                        height={props.height}
                        loading={props.loading || 'lazy'}
                        decoding="async"
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                        style={{
                            width: '100%',
                            height: '100%',
                            "object-fit": 'cover',
                            transition: 'opacity 0.5s ease',
                            opacity: loaded() ? '1' : '0',
                        }}
                    />
                </picture>
            </Show>
        </div>
    );
}

export default BlogImage;
