# FormAnywhere Audit Report

## Packages Audited

- `packages/form-editor`
- `packages/form-runtime`

**Rules checked**: 11 mandatory rules from the `formanywhere-m3-components` skill.

---

## 1. Directory Trees

### `packages/form-editor/src/`

```
src/
├── env.d.ts                               (5 lines)
├── index.tsx                              (30 lines)
├── styles.scss                         (1641 lines)
├── engine/
│   ├── logic-debugger.ts                (489 lines)
│   └── schema.ts                        (230 lines)
└── components/
    ├── FormBuilderPage.tsx              (428 lines)
    ├── FormBuilderWrapper.tsx            (32 lines)
    ├── FormEditor.tsx                   (519 lines)
    ├── form-builder.scss                 (51 lines)
    ├── ai/
    │   └── AIFormBuilder.tsx            (245 lines)
    ├── canvas/
    │   ├── Canvas.tsx                    (33 lines)
    │   ├── CanvasElement.tsx            (345 lines)
    │   ├── CanvasFieldRow.tsx           (207 lines)
    │   └── CanvasRegion.tsx             (168 lines)
    ├── dialogs/
    │   ├── index.tsx                     (12 lines)
    │   ├── dialogs.scss               (1630 lines)
    │   ├── FormSettingsDialog.tsx       (552 lines)
    │   ├── IntegrationsDialog.tsx        (68 lines)
    │   ├── LogicDebuggerDialog.tsx      (681 lines)
    │   ├── LogicDialog.tsx              (301 lines)
    │   ├── SchemaDialog.tsx              (47 lines)
    │   └── WorkflowDialog.tsx           (204 lines)
    ├── elements/
    │   ├── registry.ts                   (91 lines)
    │   ├── types.ts                      (51 lines)
    │   ├── checkbox/index.ts             (34 lines)
    │   ├── date/index.ts                 (38 lines)
    │   ├── file/index.ts                 (33 lines)
    │   ├── layout/index.ts              (156 lines)
    │   ├── radio/index.ts                (34 lines)
    │   ├── rating/index.ts               (35 lines)
    │   ├── select/index.ts               (33 lines)
    │   ├── signature/index.ts            (30 lines)
    │   ├── switch/index.ts               (31 lines)
    │   ├── text-input/index.ts          (105 lines)
    │   ├── textarea/index.ts             (36 lines)
    │   └── time/index.ts                 (32 lines)
    ├── grid-layout-picker/
    │   ├── index.tsx                     (98 lines)
    │   └── grid-layout-picker.scss      (133 lines)
    ├── header/
    │   ├── index.tsx                      (3 lines)
    │   ├── BuilderHeader.tsx            (193 lines)
    │   └── header.scss                   (85 lines)
    ├── import/
    │   └── ImportForm.tsx               (147 lines)
    ├── layout/
    │   └── FormEditorLayout.tsx         (123 lines)
    ├── page-toolbar/
    │   ├── index.tsx                      (6 lines)
    │   ├── PageToolbar.tsx              (209 lines)
    │   ├── page-toolbar.scss            (282 lines)
    │   ├── page-tab/index.tsx            (41 lines)
    │   ├── tab-menu/index.tsx            (44 lines)
    │   └── toolbar-actions/index.tsx     (49 lines)
    ├── panels/
    │   └── PropertiesPanel.tsx          (265 lines)
    └── toolbar/
        └── Toolbar.tsx                  (136 lines)
```

### `packages/form-runtime/src/`

```
src/
├── conditional.ts                        (31 lines)
├── env.d.ts                               (5 lines)
├── index.tsx                             (13 lines)
├── styles.scss                          (648 lines)
├── svg.d.ts                              (11 lines)
├── zodSchema.ts                         (372 lines)
├── validators/
│   └── index.ts                         (106 lines)
├── renderer/
│   ├── FormPreview.tsx                  (217 lines)
│   └── FormRenderer.tsx                 (700 lines)
└── components/
    └── form-preview/
        ├── index.tsx                      (1 line)
        └── FormPreviewPage.tsx           (75 lines)
```

---

## 2. Rule-by-Rule Violations

### Rule 1: `splitProps()` for components accepting HTML passthrough

**Status**: ❌ VIOLATED — `splitProps` is not used in **any** component across either package.

Neither `form-editor` nor `form-runtime` import or use `splitProps` anywhere. While many components accept only typed `props` objects (no HTML passthrough), several components do forward attributes to DOM elements or to `@formanywhere/ui` components and should use `splitProps` to separate known props from rest props.

**Components that accept external props and should use `splitProps`:**

| # | File | Component | Reason |
|---|------|-----------|--------|
| 1 | `packages/form-editor/src/components/canvas/Canvas.tsx` | `Canvas` | Wraps a `<div>` but doesn't forward unknown props |
| 2 | `packages/form-editor/src/components/canvas/CanvasRegion.tsx` | `CanvasRegion` | Wraps a `<div>` |
| 3 | `packages/form-editor/src/components/grid-layout-picker/index.tsx` | `GridLayoutPicker` | Wraps a `<div>` |
| 4 | `packages/form-runtime/src/renderer/FormPreview.tsx` | `FormPreview` | Has `props.schema`, could benefit from rest-spreading |
| 5 | `packages/form-runtime/src/renderer/FormRenderer.tsx` | `FormRenderer` | Has `props.schema` + `props.onSubmit` |

> **Note**: Most other components use closed `props` interfaces (no `& ComponentProps<'div'>`), so `splitProps` is technically optional for them. However, the project convention mandates it for all components.

---

### Rule 2: Always use subpath imports from `@formanywhere/ui`

**Status**: ✅ PASS — No barrel imports from `@formanywhere/ui` detected.

All imports use subpath form: `@formanywhere/ui/button`, `@formanywhere/ui/textfield`, `@formanywhere/ui/typography`, etc.

---

### Rule 3: Every component MUST have a companion `.scss` file

**Status**: ❌ VIOLATED — Multiple component directories lack companion SCSS files.

Instead of per-component SCSS files, the packages use a monolithic approach:
- `form-editor` uses `src/styles.scss` (1641 lines) and `src/components/dialogs/dialogs.scss` (1630 lines) as mega-files.
- `form-runtime` uses `src/styles.scss` (648 lines) as a single mega-file.

**Components missing companion SCSS files:**

| # | Component Directory | Status |
|---|---------------------|--------|
| 1 | `form-editor/src/components/ai/` | No `ai.scss` / `ai-form-builder.scss` — styles in `src/styles.scss` |
| 2 | `form-editor/src/components/canvas/` | No `canvas.scss` — styles in `src/styles.scss` |
| 3 | `form-editor/src/components/import/` | No `import.scss` — styles in `src/styles.scss` |
| 4 | `form-editor/src/components/layout/` | No `layout.scss` — styles in `src/styles.scss` |
| 5 | `form-editor/src/components/panels/` | No `panels.scss` / `properties-panel.scss` — styles in `src/styles.scss` |
| 6 | `form-editor/src/components/toolbar/` | No `toolbar.scss` — styles in `src/styles.scss` |
| 7 | `form-editor/src/components/page-toolbar/page-tab/` | No SCSS companion |
| 8 | `form-editor/src/components/page-toolbar/tab-menu/` | No SCSS companion |
| 9 | `form-editor/src/components/page-toolbar/toolbar-actions/` | No SCSS companion |
| 10 | `form-runtime/src/renderer/` | No per-component SCSS — styles in `src/styles.scss` |
| 11 | `form-runtime/src/components/form-preview/` | No SCSS — styles in `src/styles.scss` |

**Directories that DO have companion SCSS correctly:**
- `form-editor/src/components/form-builder.scss` ✅
- `form-editor/src/components/header/header.scss` ✅
- `form-editor/src/components/grid-layout-picker/grid-layout-picker.scss` ✅
- `form-editor/src/components/page-toolbar/page-toolbar.scss` ✅
- `form-editor/src/components/dialogs/dialogs.scss` ✅

---

### Rule 4: Never use `transition: all`

**Status**: ❌ VIOLATED — 6 occurrences found in `form-editor`.

| # | File | Line | Code |
|---|------|------|------|
| 1 | `packages/form-editor/src/styles.scss` | L268 | `transition: all 0.3s ease !important;` |
| 2 | `packages/form-editor/src/components/page-toolbar/page-toolbar.scss` | L51 | `transition: all var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, ...);` |
| 3 | `packages/form-editor/src/components/page-toolbar/page-toolbar.scss` | L97 | `transition: all var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, ...);` |
| 4 | `packages/form-editor/src/components/page-toolbar/page-toolbar.scss` | L262 | `transition: all var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, ...);` |
| 5 | `packages/form-editor/src/components/grid-layout-picker/grid-layout-picker.scss` | L71 | `transition: all 0.2s ease;` |
| 6 | `packages/form-editor/src/components/grid-layout-picker/grid-layout-picker.scss` | L100 | `transition: all 0.2s ease;` |

**`form-runtime`**: ✅ No `transition: all` in SCSS files.

However, `form-runtime` has an inline transition in TSX:

| # | File | Line | Code |
|---|------|------|------|
| 1 | `packages/form-runtime/src/renderer/FormPreview.tsx` | L125 | `transition: 'max-width 0.3s ease'` (inline style — this is specific, NOT `all`, so technically OK) |

---

### Rule 5: Never hardcode hex color values — always use `var(--m3-*)`

**Status**: ❌ VIOLATED — Multiple bare hex colors found.

#### In SCSS files:

| # | File | Line | Code |
|---|------|------|------|
| 1 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L125 | `background: #fff;` |
| 2 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L500 | `background: #1E1E1E;` |
| 3 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L501 | `color: #D4D4D4;` |
| 4 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L780 | `color: #fff;` |
| 5 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1064 | `background: #C8E6C9;` |
| 6 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1065 | `color: #1B5E20;` |
| 7 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1147 | `color: #fff;` |
| 8 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1237 | `color: #1B5E20;` |
| 9 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1238 | `background: #E8F5E9;` |
| 10 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1241 | `color: #B71C1C;` |
| 11 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1242 | `background: #FFEBEE;` |
| 12 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1320 | `color: #2E7D32;` |
| 13 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1332 | `background: #FFF3F0;` |
| 14 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1422 | `&--pass { background: #E8F5E9; }` |
| 15 | `packages/form-editor/src/components/dialogs/dialogs.scss` | L1423 | `&--fail { background: #FFEBEE; }` |
| 16 | `packages/form-editor/src/styles.scss` | L1531 | `color: #fff;` |
| 17 | `packages/form-runtime/src/styles.scss` | L259 | `color: #FAAF00;` (star rating filled color) |

#### In TSX files (data defaults, less critical):

| # | File | Line | Code |
|---|------|------|------|
| 1 | `packages/form-editor/src/components/FormBuilderPage.tsx` | L67 | `primaryColor: '#6750A4'` |
| 2 | `packages/form-editor/src/components/FormBuilderPage.tsx` | L68 | `secondaryColor: '#625B71'` |
| 3 | `packages/form-editor/src/components/FormBuilderPage.tsx` | L69 | `backgroundColor: '#FFFBFE'` |
| 4 | `packages/form-editor/src/components/FormBuilderPage.tsx` | L70 | `surfaceColor: '#FFFFFF'` |

> These are data model defaults for form theme settings, not CSS declarations, so they are borderline acceptable.

---

### Rule 6: Never inject CSS at runtime via JS

**Status**: ⚠️ PARTIAL VIOLATION

| # | File | Line | Code |
|---|------|------|------|
| 1 | `packages/form-runtime/src/renderer/FormPreview.tsx` | L116 | `<style>{props.schema.settings.customCSS}</style>` |

This injects user-authored CSS into the DOM at runtime. While this is a legitimate "custom CSS" feature for end-users, it still violates the literal rule. Consider using a sandboxed `<iframe>` or CSS containment.

---

### Rule 7: SSR-safe — guard all browser API access

**Status**: ✅ PASS — All browser API usage is properly guarded.

All `document.*`, `window.*`, `navigator.*`, and `localStorage.*` calls are wrapped in `onMount()`, `onCleanup()`, or event handlers:

- `BuilderHeader.tsx` L65-66: `document.addEventListener` inside `onMount`/`onCleanup` ✅
- `PageToolbar.tsx` L66-67: `document.addEventListener` inside `onMount`/`onCleanup` ✅
- `FormEditorLayout.tsx` L103-104: `document.addEventListener` inside `onMount`/`onCleanup` ✅
- `FormBuilderWrapper.tsx` L17: `window.location.search` inside `onMount` ✅
- `FormBuilderPage.tsx` L101-138: `localStorage` inside `createEffect`/`onMount` ✅
- `SchemaDialog.tsx` L22: `navigator.clipboard` inside click handler ✅
- `FormPreviewPage.tsx` L19: `window.location.search` inside `onMount` ✅
- `FormRenderer.tsx` L238-240: `window.devicePixelRatio` inside a `ref` callback (runs client-side) ✅

---

### Rule 8: Access reactive props via accessors, never destructure

**Status**: ✅ PASS — No destructuring of props found.

All components access props via `props.X` pattern. No `const { x, y } = props` patterns detected.

---

### Rule 9: `sideEffects` in `package.json`

**Status**: ✅ PASS

Both packages correctly declare:
```json
"sideEffects": ["**/*.css", "**/*.scss"]
```

---

### Rule 10: `exports` map in `package.json`

**Status**: ✅ PASS

**`form-editor/package.json`:**
```json
"exports": {
    ".": { "import": "./src/index.tsx", "types": "./src/index.tsx" },
    "./styles": "./src/styles.scss"
}
```

**`form-runtime/package.json`:**
```json
"exports": {
    ".": { "import": "./src/index.tsx", "types": "./src/index.tsx" },
    "./styles": "./src/styles.scss",
    "./preview": { "import": "./src/components/form-preview/index.tsx", "types": "./src/components/form-preview/index.tsx" }
}
```

---

### Rule 11: Component directory structure

**Status**: ❌ PARTIALLY VIOLATED

Expected structure per component:
```
component-name/
  ├── index.tsx
  ├── component-name.tsx
  └── component-name.scss
```

**Violations:**

| # | Directory | Issue |
|---|-----------|-------|
| 1 | `form-editor/src/components/ai/` | Only `AIFormBuilder.tsx`, no `index.tsx`, no SCSS |
| 2 | `form-editor/src/components/canvas/` | 4 TSX files, no `index.tsx`, no SCSS |
| 3 | `form-editor/src/components/import/` | Only `ImportForm.tsx`, no `index.tsx`, no SCSS |
| 4 | `form-editor/src/components/layout/` | Only `FormEditorLayout.tsx`, no `index.tsx`, no SCSS |
| 5 | `form-editor/src/components/panels/` | Only `PropertiesPanel.tsx`, no `index.tsx`, no SCSS |
| 6 | `form-editor/src/components/toolbar/` | Only `Toolbar.tsx`, no `index.tsx`, no SCSS |
| 7 | `form-runtime/src/renderer/` | 2 TSX files, no `index.tsx`, no per-component SCSS |

**Directories that follow the convention correctly:**
- `form-editor/src/components/header/` ✅ (`index.tsx`, `BuilderHeader.tsx`, `header.scss`)
- `form-editor/src/components/grid-layout-picker/` ✅ (`index.tsx`, `grid-layout-picker.scss`)
- `form-editor/src/components/page-toolbar/` ✅ (`index.tsx`, `PageToolbar.tsx`, `page-toolbar.scss`)
- `form-editor/src/components/dialogs/` ✅ (`index.tsx`, `dialogs.scss`, multiple dialog TSX files)
- `form-runtime/src/components/form-preview/` ✅ (`index.tsx`, `FormPreviewPage.tsx` — but no SCSS)

---

## 3. Summary

| Rule | form-editor | form-runtime |
|------|-------------|--------------|
| 1. `splitProps()` | ❌ Never used | ❌ Never used |
| 2. Subpath imports | ✅ | ✅ |
| 3. Companion `.scss` | ❌ 9 dirs missing | ❌ 2 dirs missing |
| 4. No `transition: all` | ❌ 6 occurrences | ✅ |
| 5. No hardcoded hex | ❌ 17 in SCSS, 4 in TSX | ❌ 1 in SCSS |
| 6. No runtime CSS injection | ✅ | ⚠️ 1 (`customCSS` feature) |
| 7. SSR-safe | ✅ | ✅ |
| 8. No prop destructuring | ✅ | ✅ |
| 9. `sideEffects` | ✅ | ✅ |
| 10. `exports` map | ✅ | ✅ |
| 11. Directory structure | ❌ 6 dirs non-compliant | ❌ 1 dir non-compliant |

### Total Violations: **~42**

- **Critical** (affects tree-shaking / SSR / reactivity): 0
- **High** (style consistency / maintainability): ~35 (splitProps, hardcoded hex, missing SCSS)
- **Medium** (`transition: all`, directory structure): ~13
- **Low** (runtime CSS injection for user feature): 1

### Recommended Priority

1. **Add companion SCSS files** and decompose the monolithic `styles.scss` files (3000+ combined lines)
2. **Replace all bare hex colors** with `var(--m3-color-*, #fallback)` tokens
3. **Replace `transition: all`** with explicit property lists (`transition: background-color, border-color, ...`)
4. **Add `splitProps()`** to components that forward props to DOM elements
5. **Add `index.tsx` barrel files** to component directories missing them
