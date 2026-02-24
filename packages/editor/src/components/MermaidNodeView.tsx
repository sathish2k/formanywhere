import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import mermaid from 'mermaid';

export const MermaidNodeView: Component<any> = (props) => {
  let containerRef!: HTMLDivElement;
  const [svg, setSvg] = createSignal('');
  const [error, setError] = createSignal('');

  createEffect(() => {
    const code = props.node.textContent;
    if (!code) return;

    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Invalid Mermaid syntax');
      }
    };

    renderDiagram();
  });

  return (
    <div class="mermaid-block my-4 p-4 border rounded-lg bg-gray-50 relative" data-node-view-wrapper="">
      <div class="absolute top-2 right-2 text-xs text-gray-400 font-mono">Mermaid Diagram</div>
      {error() ? (
        <div class="text-red-500 text-sm font-mono whitespace-pre-wrap">{error()}</div>
      ) : (
        <div ref={containerRef} innerHTML={svg()} class="flex justify-center" />
      )}
      <pre class="hidden">
        <code class="language-mermaid">{props.node.textContent}</code>
      </pre>
    </div>
  );
};
