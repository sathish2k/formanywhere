/**
 * Feature 2: Mermaid Diagram Renderer — Renders Mermaid diagrams
 * embedded in blog HTML content. Finds <code class="language-mermaid">
 * blocks and replaces them with rendered SVG diagrams.
 */
import { Component, createEffect, createSignal } from 'solid-js';

export const MermaidRenderer: Component<{
  containerRef: HTMLElement | undefined;
}> = (props) => {
  const [rendered, setRendered] = createSignal(false);

  const renderDiagrams = async () => {
    const container = props.containerRef;
    if (!container || rendered()) return;

    const mermaidBlocks = container.querySelectorAll(
      'code.language-mermaid, pre > code.language-mermaid',
    );

    if (mermaidBlocks.length === 0) return;

    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });

      for (let i = 0; i < mermaidBlocks.length; i++) {
        const codeEl = mermaidBlocks[i] as HTMLElement;
        const markup = codeEl.textContent?.trim();
        if (!markup) continue;

        try {
          const id = `mermaid-blog-${Date.now()}-${i}`;
          const { svg } = await mermaid.render(id, markup);

          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-diagram';
          wrapper.innerHTML = svg;

          const preEl = codeEl.closest('pre');
          if (preEl) {
            preEl.replaceWith(wrapper);
          } else {
            codeEl.replaceWith(wrapper);
          }
        } catch (err) {
          console.warn(`Failed to render mermaid diagram ${i}:`, err);
        }
      }

      setRendered(true);
    } catch (err) {
      console.warn('Failed to load mermaid library:', err);
    }
  };

  createEffect(() => {
    if (props.containerRef) {
      renderDiagrams();
    }
  });

  // No visual output — this component only processes the container
  return null;
};
