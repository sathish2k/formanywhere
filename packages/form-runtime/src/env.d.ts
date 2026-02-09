declare module '*.svg' {
    import type { Component, ComponentProps } from 'solid-js';
    const Icon: Component<ComponentProps<'svg'>>;
    export default Icon;
}
