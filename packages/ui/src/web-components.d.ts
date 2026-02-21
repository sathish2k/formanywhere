declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            // Allow any custom element (web component) usage
            [elemName: `${string}-${string}`]: any;
        }
    }
}

export {};