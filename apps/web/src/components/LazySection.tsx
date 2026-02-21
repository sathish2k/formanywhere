/**
 * LazySection — Intersection Observer wrapper for progressive loading.
 * Renders children only when scrolled into view (or near viewport).
 * Use with clientOnly() components for maximum initial load reduction.
 */
import { createSignal, onMount, onCleanup, Show, type JSX } from "solid-js";

export function LazySection(props: {
  children: JSX.Element;
  fallback?: JSX.Element;
  rootMargin?: string;
  minHeight?: string;
}) {
  const [visible, setVisible] = createSignal(false);
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    if (!ref) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: props.rootMargin ?? "200px" }
    );
    io.observe(ref);
    onCleanup(() => io.disconnect());
  });

  return (
    <div ref={ref} style={{ "min-height": visible() ? "auto" : (props.minHeight ?? "100px") }}>
      <Show when={visible()} fallback={props.fallback}>
        {props.children}
      </Show>
    </div>
  );
}
