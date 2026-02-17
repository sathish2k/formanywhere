// @ts-check
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import solidSvg from 'vite-plugin-solid-svg';
import node from '@astrojs/node';

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
  output: 'server',
  compressHTML: true,
  build: {
    // Inline all stylesheets to eliminate render-blocking CSS requests
    // Combined with server compression, this is optimal (246KB inlined → ~35KB gzipped)
    inlineStylesheets: 'always',
  },
  adapter: node({
    mode: 'middleware',
  }),
  integrations: [
    solidJs({
      include: [
        '**/apps/web/src/**',
        '**/packages/ui/**',
        '**/packages/shared/**',
        '**/packages/form-editor/**',
        '**/packages/form-runtime/**',
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
          enabled: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    // Keep viewBox for proper scaling
                    removeViewBox: false,
                    // Keep IDs to avoid clashes with gradients/masks
                    cleanupIds: false,
                  },
                },
              },
              // Remove unnecessary metadata
              'removeXMLNS',
            ],
          },
        }
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Isolate heavy vendor libs into their own chunks
            if (id.includes('node_modules/solid-js')) return 'vendor-solid';
            if (id.includes('node_modules/@floating-ui')) return 'vendor-floating-ui';
            if (id.includes('node_modules/@modular-forms')) return 'vendor-modular-forms';
            if (id.includes('node_modules/better-auth') || id.includes('node_modules/@better-auth')) return 'auth-client';
            if (id.includes('node_modules/zod') || id.includes('node_modules/valibot')) return 'vendor-validation';
          }
        }
      },
      // Enable CSS code splitting for per-route loading
      cssCodeSplit: true,
      // Target modern browsers only
      target: 'es2022',
    },
    ssr: {
      // Ensure workspace packages are bundled and transformed properly
      // See: https://docs.astro.build/en/guides/troubleshooting/#adding-dependencies-to-astro-in-a-monorepo
      noExternal: [
        '@formanywhere/ui',
        '@formanywhere/shared',
        '@formanywhere/form-editor',
        '@formanywhere/form-runtime'
      ]
    }
  }
});