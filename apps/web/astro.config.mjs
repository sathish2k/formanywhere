// @ts-check
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs({
      include: [
        '**/packages/ui/**',
        '**/packages/shared/**',
        '**/node_modules/@formanywhere/**'
      ]
    })
  ],
  vite: {
    ssr: {
      // Ensure workspace packages are bundled and transformed properly
      // See: https://docs.astro.build/en/guides/troubleshooting/#adding-dependencies-to-astro-in-a-monorepo
      noExternal: [
        '@formanywhere/ui',
        '@formanywhere/shared'
      ]
    }
  }
});