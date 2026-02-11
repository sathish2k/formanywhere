// @ts-check
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import solidSvg from 'vite-plugin-solid-svg';

/**
 * Custom plugin to automatically append ?component-solid to SVG imports
 * inside the shared package, allowing clean imports.
 */
function autoSolidSvg() {
  return {
    name: 'auto-solid-svg',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('packages/shared') && (id.endsWith('.tsx') || id.endsWith('.ts'))) {
        return code.replace(/from\s+['"]([^'"]+\.svg)['"]/g, "from '$1?component-solid'");
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs({
      include: [
        '**/apps/web/src/**',
        '**/packages/ui/**',
        '**/packages/shared/**',
        '**/node_modules/@formanywhere/**',
        '**/node_modules/@modular-forms/solid/**'
      ]
    })
  ],
  vite: {
    plugins: [
      autoSolidSvg(),
      solidSvg({
        defaultAsComponent: true,
        svgo: {
          enabled: false // Disable SVGO to avoid potential issues
        }
      })
    ],
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