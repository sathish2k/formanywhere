/// <reference types="@solidjs/start/env" />

// Prism.js component modules don't ship types
declare module 'prismjs/components/prism-markup' {}
declare module 'prismjs/components/prism-css' {}
declare module 'prismjs/components/prism-javascript' {}
declare module 'prismjs/components/prism-typescript' {}
declare module 'prismjs/components/prism-python' {}
declare module 'prismjs/components/prism-json' {}
declare module 'prismjs/components/prism-bash' {}
declare module 'prismjs/components/prism-sql' {}

/**
 * Type declarations for SolidStart request event locals.
 * These are set by middleware.ts and read via getRequestEvent() in server functions.
 */
declare module "solid-js/web" {
  interface RequestEventLocals {
    user: { id: string; name: string; email: string; image?: string } | null;
    isAuthenticated: boolean;
    /** Theme preference parsed from request cookie by middleware */
    themeMode: 'light' | 'dark' | 'system';
    /** Color scheme parsed from request cookie by middleware */
    themeColor: 'green' | 'purple' | 'blue' | 'pink' | 'orange' | 'red';
  }
}
