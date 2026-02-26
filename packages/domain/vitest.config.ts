import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: [
            // Self-contained shim that breaks the circular @formanywhere/shared/types ↔ @formanywhere/domain/form chain
            { find: '@formanywhere/shared/types', replacement: resolve(__dirname, './form/__tests__/shared-types-shim.ts') },
            { find: '@formanywhere/shared', replacement: resolve(__dirname, '../shared/src/index.ts') },
        ],
        conditions: ['import', 'module', 'default'],
    },
    test: {
        include: ['form/**/*.test.ts'],
        testTimeout: 15000,
    },
});
