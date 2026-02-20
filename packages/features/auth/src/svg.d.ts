declare module '*.svg?component-solid' {
    import type { Component, JSX } from 'solid-js';
    const component: Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
    export default component;
}
