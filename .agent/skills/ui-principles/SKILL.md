---
name: ui-principles
description: UI guardrails and design principles for the Anti Gravity form builder. Use for any UI work in this monorepo (Astro/SolidJS screens, panels, builder controls, interactions, or styling). Enforce Material 3 Liquid Glass design with performance-first constraints; require all UI elements to live in packages/ui and be consumed from there; require reusable logic/components to live in packages/shared. Follow references/design-basics.md.
---

# UI Principles

## Overview

Enforce packages/ui as the single source of UI elements while applying Material 3 Liquid Glass design and performance-first practices so new UI stays consistent, accessible, and lightweight.

## Non-Negotiable Guardrails

- Treat any visible component (buttons, inputs, panels, layouts, icons, affordances) as a UI element.
- Build or modify base UI primitives only in `packages/ui`.
- If a needed primitive does not exist, add it to `packages/ui` first, then consume it from `@formanywhere/ui`.
- Shared composite UI (sections, complex widgets reused across pages) lives in `packages/shared`.
- Do not create bespoke UI components or styling inside apps or feature packages (no UI elements in `apps/`, `packages/form-editor`, etc.).
- Place reusable logic or shared (non-UI) components only in `packages/shared`, then import from there.
- Use design tokens and theme variables from `packages/ui/src/styles/theme.css` and typography from `packages/ui/src/styles/typography.css`.
- Follow Material 3 Liquid Glass styling (tokens, elevation, shape, motion) already defined in `packages/ui`.
- Prioritize lightweight, high-performance UI over heavy abstractions or excessive re-rendering.
- Follow the existing monorepo structure; do not introduce new top-level folders or relocate packages.
- Co-locate styles, types, and tests with their component in that component's folder (both in `packages/ui` and `packages/shared`).
- Apply these guardrails by default for any request in this repo; if the task is non-UI, ensure no UI is introduced outside `packages/ui`.

## Workflow

1. Identify the UI need and where it will be used.
2. Search `packages/ui/src` for an existing component.
3. If it exists, consume it from `@formanywhere/ui` and avoid local UI code.
4. If it does not exist, implement it in `packages/ui/src/<component>/index.tsx`.
5. Export the new component in `packages/ui/src/index.ts`.
6. Add or adjust shared styles in `packages/ui/src/styles/` (prefer tokens over hard-coded values).
7. Apply design basics from `references/design-basics.md` before finalizing layout, spacing, color, or typography.
8. If you are extracting reusable logic or non-UI shared components, place them in `packages/shared` and keep them framework-agnostic.

## Performance Principles

- Keep components lean: avoid unnecessary state, effects, and deep prop drilling.
- Prefer composition over duplication: reuse existing `packages/ui` components.
- Avoid heavy dependencies for UI styling or animation; use existing CSS and tokens.
- Limit DOM depth in builder UI; keep layout structure flat where possible.
- Minimize reflows: use consistent spacing tokens and avoid layout thrash.
- Validate Lighthouse scores for all pages; target 100 across Performance, Accessibility, Best Practices, and SEO.

## Design Checks (Use Before Final Output)

- Hierarchy is clear and the primary action is visually dominant.
- Progressive disclosure hides advanced options until needed.
- Spacing, alignment, and proximity create logical grouping.
- Contrast and typography support legibility.
- Accessibility is respected (labels, focus states, keyboard behavior, touch targets).
- Responsive behavior is verified for mobile, tablet, and desktop breakpoints.
- Consistency with existing `packages/ui` components and tokens is preserved.

## Trigger Examples

- "Design the form builder properties panel UI."
- "Add a new toolbar button style for the builder."
- "Create a new field configuration card."
- "Build the empty-state layout for the form canvas."

## Resources

- `references/design-basics.md` for design principles and visual hierarchy guidance.
- `packages/ui/src/styles/theme.css` for color, elevation, shape, and motion tokens.
- `packages/ui/src/styles/typography.css` for typography scales and defaults.
- `packages/ui/src/theme/index.tsx` for ThemeProvider usage.

## Shared Components (packages/shared)

Composite UI sections reused across pages live in `packages/shared/src/components/`. These components compose base primitives from `@formanywhere/ui`.

### Available Shared Components

- **Header** - Sticky header with nav, logo, theme toggle
- **Footer** - Footer with links and social icons
- **PricingTable** - Complete pricing section with cards and billing toggle
- **FAQSection** - Accordion FAQ list
- **ContactSalesCard** - Enterprise contact card
- **CTASection** - Call-to-action banner with gradient background
- **TemplateBrowser** - Template browsing with filters
- **TemplateCard** - Individual template card

### Sub-Component Folder Structure

Complex components follow a sub-component folder pattern:

```
packages/shared/src/components/
└── pricing-table/
    ├── index.tsx           # Main component, re-exports sub-components
    ├── pricing-card/
    │   └── index.tsx       # Price card sub-component
    ├── billing-toggle/
    │   └── index.tsx       # Billing period toggle
    └── feature-list/
        └── index.tsx       # Feature list with icons
```

**Pattern rules:**
- Main `index.tsx` imports and re-exports all sub-components
- Sub-components in their own folders for co-location of styles/tests
- Import sub-components from main index in consuming apps

## Asset Utilities

Use the asset utilities from `@formanywhere/shared` for optimized SVG/image loading:

```tsx
import { getIconPath, getAssetPath, ICON_NAMES, ICON_FILTERS } from '@formanywhere/shared';

// Get icon path
<img src={getIconPath('arrow-right')} alt="" />

// Type-safe icon names
<img src={getIconPath(ICON_NAMES.arrowRight)} alt="" />

// Icon filters for dark backgrounds
<img src={getIconPath('check')} style={{ filter: ICON_FILTERS.invert }} />
```

### SVG Icons (public/icons/)

All icon SVGs live in `apps/web/public/icons/`. Common icons:
- Navigation: `arrow-right`, `chevron-down`, `menu-hamburger`, `menu-close`
- Status: `check`, `check-circle`, `cross`
- Features: `ai`, `lightning`, `rocket`, `sparkle`, `heart`
- Branding: `logo-icon`, `github`, `twitter`

### Best Practices for Assets

- Use `loading="lazy"` and `decoding="async"` for images
- Store all SVGs in `public/icons/` for consistent paths
- Use `filter: brightness(0) invert(1)` for white icons on dark backgrounds
- Prefer SVG icons over inline SVG for better caching

