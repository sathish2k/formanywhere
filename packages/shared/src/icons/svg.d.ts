declare module '*.svg' {
    import type { Component, ComponentProps } from 'solid-js';
    const Icon: Component<ComponentProps<'svg'>>;
    export default Icon;
}

declare module '*.svg?component-solid' {
    import type { Component, ComponentProps } from 'solid-js';
    const Icon: Component<ComponentProps<'svg'>>;
    export default Icon;
}
