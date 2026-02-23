import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  middleware: "./src/middleware.ts",
  server: {
    preset: "bun",
    compressPublicAssets: { gzip: true, brotli: true },
  },
  vite: {
    plugins: [
      // Auto-append ?component-solid to SVG imports inside shared package
      {
        name: "auto-solid-svg",
        enforce: "pre",
        transform(code: string, id: string) {
          if (id.includes("packages/shared") && (id.endsWith(".tsx") || id.endsWith(".ts"))) {
            return code.replace(/from\s+['"]([^'"]+\.svg)['"]/g, "from '$1?component-solid'");
          }
        },
      },
      solidSvg({
        defaultAsComponent: true,
        svgo: {
          enabled: true,
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                    cleanupIds: false,
                  },
                },
              },
              "removeXMLNS",
            ],
          },
        },
      }),
    ],
    optimizeDeps: {
      include: [
        "@tiptap/core",
        "@tiptap/starter-kit",
        "@tiptap/extension-placeholder",
        "@tiptap/extension-bubble-menu",
        "@tiptap/extension-floating-menu",
        "@tiptap/extension-image",
        "@tiptap/extension-link",
        "@tiptap/extension-youtube",
        "@tiptap/extension-underline",
        "@tiptap/extension-highlight",
        "@tiptap/extension-text-align",
        "@tiptap/extension-text-style",
        "@tiptap/extension-color",
        "@tiptap/extension-code-block-lowlight",
        "lowlight",
        "solid-tiptap",
      ],
    },
    build: {
      target: "es2022",
      cssCodeSplit: true,
      modulePreload: { polyfill: false },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    ssr: {
      noExternal: [
        "@formanywhere/ui",
        "@formanywhere/shared",
        "@formanywhere/editor",
        "@formanywhere/form-editor",
        "@formanywhere/form-runtime",
      ],
    },
  },
});
