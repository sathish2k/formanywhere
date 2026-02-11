// @ts-check
/**
 * ESLint Flat Config — Barrel Import Guard
 * Prevents importing from barrel roots of workspace packages.
 * Enforces subpath imports for better tree-shaking and smaller bundles.
 *
 * Usage: bun add -d eslint && npx eslint .
 */
export default [
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@formanywhere/ui',
              message:
                'Use subpath imports instead: @formanywhere/ui/button, @formanywhere/ui/chip, etc.',
            },
            {
              name: '@formanywhere/shared',
              message:
                'Use subpath imports instead: @formanywhere/shared/pricing-table, @formanywhere/shared/cta-section, etc.',
            },
          ],
        },
      ],
    },
  },
];
