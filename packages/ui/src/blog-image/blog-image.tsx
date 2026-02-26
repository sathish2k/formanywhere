// ─── BlogImage — Progressive Image Loading ─────────────────────────────────
// Shows a shimmer gradient placeholder instantly, then fades in the full
// image when loaded. Uses <picture> for AVIF + WebP fallback.

import { createSignal, Show, type JSX } from 'solid-js';

export interface BlogImageProps {
    /** Full-size image URL (primary source) */
    src: string;
    /** WebP fallback URL (optional — browser picks best format) */
    webpSrc?: string;
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
                "border-radius": 'var(--m3-shape-medium, 12px)',
                "aspect-ratio": aspectRatio(),
                "background-color": 'var(--m3-color-surface-container-low)',
                ...props.style,
            }}
        >
            {/* Shimmer placeholder — shows while image loads */}
            <Show when={!loaded() && !error()}>
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: '0',
                        background: `linear-gradient(90deg,
                            var(--m3-color-surface-container-lowest) 25%,
                            var(--m3-color-surface-container-low) 50%,
                            var(--m3-color-surface-container-lowest) 75%)`,
                        "background-size": '200% 100%',
                        animation: 'blogImageShimmer 1.5s ease-in-out infinite',
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
                    color: 'var(--m3-color-on-surface-variant)',
                    "font-size": '14px',
                }}>
                    ⚠️ Image failed to load
                </div>
            }>
                <picture>
                    {/* WebP fallback if provided */}
                    <Show when={props.webpSrc}>
                        <source srcset={props.webpSrc} type="image/webp" />
                    </Show>
                    {/* Primary img tag */}
                    <img
                        src={props.src}
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
                            transition: `opacity var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-standard, ease)`,
                            opacity: loaded() ? '1' : '0',
                        }}
                    />
                </picture>
            </Show>

            {/* Shimmer animation keyframes (injected once) */}
            <style>{`
                @keyframes blogImageShimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}

export default BlogImage;
