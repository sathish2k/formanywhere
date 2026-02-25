# FormAnywhere — Copilot Instructions

> This file defines project conventions, naming rules, folder structure, and component
> usage patterns that GitHub Copilot and all AI tools **must** follow when generating
> code in this workspace.

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend framework** | SolidJS + SolidStart (Vinxi) |
| **UI components** | `@formanywhere/ui` — Material Design 3 library (see §5) |
| **Routing** | SolidStart file-based routing (`apps/web/src/routes/`) |
| **State** | SolidJS primitives (`createSignal`, `createResource`, `createStore`) |
| **Backend** | ElysiaJS on Bun |
| **ORM** | Drizzle ORM + PostgreSQL |
| **AI** | `@google/genai` (Gemini 2.5 Flash) |
| **Desktop** | Tauri v2 (`apps/desktop/`) |
| **Monorepo** | Turborepo + Bun workspaces |
| **Package manager** | Bun (`bun install`, `bun run`) |

---

## 2. Monorepo Structure

```
formanywhere/
├── apps/
│   ├── web/                         # SolidStart web app
│   │   └── src/
│   │       ├── routes/              # File-based routes (pages only)
│   │       ├── components/          # App-level layout components
│   │       ├── server/              # Server-side utilities
│   │       └── styles/              # Global CSS
│   └── desktop/                     # Tauri desktop app
│
├── packages/
│   ├── ui/                          # @formanywhere/ui — MD3 component library
│   ├── shared/                      # @formanywhere/shared — cross-cutting utilities
│   ├── domain/                      # @formanywhere/domain — business logic & schemas
│   ├── editor/                      # @formanywhere/editor — Tiptap rich text editor
│   └── features/                    # Feature packages (each self-contained)
│       ├── marketing/               # @formanywhere/marketing — landing, blog, pricing
│       ├── auth/                    # @formanywhere/auth — sign-in/up, guards
│       ├── dashboard/               # @formanywhere/dashboard — user dashboard
│       ├── form-editor/             # @formanywhere/form-editor — form builder
│       └── form-runtime/            # @formanywhere/form-runtime — form renderer
│
├── backend/
│   └── api/                         # ElysiaJS + Drizzle backend
│       └── src/
│           ├── routes/              # Elysia route plugins
│           ├── controllers/         # Request handlers
│           ├── db/                  # Drizzle schema & connection
│           ├── lib/                 # Shared backend utilities
│           ├── middleware/           # Elysia middleware
│           └── services/            # Business logic services
│
├── docs/                            # Documentation (ARCHITECTURE, FEATURES, etc.)
└── scripts/                         # Build & codegen scripts
```

---

## 3. Naming Conventions

### 3.1 Folders — Always `kebab-case`

```
✅ blog/  hero-section/  form-editor/  contact-sales-card/  text-input/
❌ BlogCard/  heroSection/  FormEditor/  contactSalesCard/
```

### 3.2 Files — Always `kebab-case`

```
# Components
✅ blog-card.tsx   article-chat.tsx   podcast-player.tsx   hero-section.tsx
❌ BlogCard.tsx    ArticleChat.tsx    PodcastPlayer.tsx

# Utilities / services
✅ blog-api.ts   auth-guard.tsx   form-setup.tsx   pdf-export.ts
❌ blogApi.ts    AuthGuard.tsx

# Hooks (exception: camelCase with "use" prefix)
✅ useEditor.ts   useIdleTimeout.ts
❌ use-editor.ts  UseEditor.ts

# Styles
✅ styles.scss   form-builder.scss   global.css
❌ Styles.scss   formBuilder.scss
```

### 3.3 Exports — Always `PascalCase` for components, `camelCase` for functions

```ts
// Component exports
export const BlogCard = ...       ✅
export const ArticleChat = ...    ✅
export const PodcastPlayer = ...  ✅
export const FAB = ...            ✅  (acronyms stay uppercase)

// Function exports
export function fetchBlogs() ...  ✅
export function configureBlogApi() ... ✅
```

### 3.4 Backend Files

```
# Routes — use .elysia.ts suffix for Elysia plugin files
✅ blogs.elysia.ts   blog-features.elysia.ts   forms.elysia.ts   feed.elysia.ts
❌ blogs.ts (ambiguous with non-plugin files)

# Controllers — use .controller.ts suffix
✅ auth.controller.ts   blogs.controller.ts

# Middleware — use .middleware.ts suffix
✅ auth.middleware.ts   cors.middleware.ts

# Services — plain kebab-case
✅ blog-generator.ts   cron.ts

# Database
✅ schema.ts   index.ts
```

---

## 4. Feature Package Structure

Every feature under `packages/features/` follows this pattern:

```
feature-name/
├── package.json               # name: @formanywhere/feature-name
├── tsconfig.json
└── src/
    ├── index.tsx               # Barrel export (re-exports everything)
    ├── section-name/           # Sub-feature folder (kebab-case)
    │   ├── index.ts            # Barrel for this sub-feature
    │   ├── section-name.tsx    # Main component
    │   ├── section-api.ts      # API client (if needed)
    │   └── sub-component.tsx   # Supporting components
    ├── components/             # Shared internal components
    ├── hooks/                  # Feature-specific hooks
    ├── state/                  # State management
    └── styles/                 # Feature styles
```

### Rules

1. **All UI components and API clients live in feature packages** — never in `apps/web/src/components/` or `apps/web/src/lib/`.
2. Only **page/route files** belong in `apps/web/src/routes/`.
3. Route files import from feature packages: `import { BlogCard } from '@formanywhere/marketing/blog'`.
4. Feature packages export via `package.json` `exports` map with subpath entries.

### Export Map Pattern (package.json)

```json
{
  "exports": {
    ".": {
      "solid": "./src/index.tsx",
      "import": "./src/index.tsx",
      "types": "./src/index.tsx"
    },
    "./blog": {
      "solid": "./src/blog/index.ts",
      "import": "./src/blog/index.ts",
      "types": "./src/blog/index.ts"
    }
  }
}
```

---

## 5. UI Component Library (`@formanywhere/ui`)

### 5.1 Import Pattern

Always import from **subpath exports** (tree-shakeable):

```ts
✅ import { Box } from '@formanywhere/ui/box';
✅ import { Button } from '@formanywhere/ui/button';
✅ import { Stack } from '@formanywhere/ui/stack';
✅ import { Typography } from '@formanywhere/ui/typography';
✅ import { Icon } from '@formanywhere/ui/icon';

❌ import { Box, Button, Typography } from '@formanywhere/ui';  // barrel — avoid
❌ import Box from '@formanywhere/ui/box';  // no default exports
```

### 5.2 Rules

1. **NEVER use raw HTML** for UI — no `<div>`, `<button>`, `<input>`, `<span>` with inline styles.
2. **Use `Box`** instead of `<div>` — it provides `padding`, `margin`, `rounded`, `bg`, `color`, `display`, `maxWidth`, `textAlign`, `as` props.
3. **Use `Stack`** instead of flex `<div>` — it provides `direction`, `gap`, `align`, `justify`, `wrap`. Use `direction="row"` for horizontal and default (column) for vertical.
4. **Use `Typography`** instead of `<p>`, `<h1>`–`<h6>`, `<span>` for text.
5. **Use `Card`** instead of styled `<div>` containers.
6. **Use `Icon`** with built-in icon names — never raw SVGs.
7. **Typography does NOT support `innerHTML`** — use `<Box innerHTML={...} />` for HTML content.
8. **TextField does NOT support `onKeyDown`** — use a `ref` callback to attach keydown listener.
9. **FAB is exported as `FAB`** (all caps) — not `Fab`.
10. **Box does NOT have `flexDirection` / `gap` / `alignItems`** — use Stack components for flex layouts.

### 5.3 Available Components — Quick Reference

| Import Path | Components | Key Props |
|------------|------------|-----------|
| `@formanywhere/ui/box` | `Box` | `padding`, `margin`, `rounded`, `bg`, `color`, `display`, `maxWidth`, `textAlign`, `as` |
| `@formanywhere/ui/stack` | `Stack` | `direction`, `gap`, `align`, `justify`, `wrap`, `fullWidth`, `as` |
| `@formanywhere/ui/card` | `Card` | `variant` (elevated/filled/outlined/glass), `padding`, `gap`, `direction`, `clickable` |
| `@formanywhere/ui/typography` | `Typography` | `variant` (display/headline/title/body/label × large/medium/small), `color`, `align`, `noWrap` |
| `@formanywhere/ui/button` | `Button` | `variant` (filled/tonal/elevated/outlined/text/ghost/danger/glass), `size`, `icon`, `trailingIcon`, `loading`, `href` |
| `@formanywhere/ui/icon-button` | `IconButton` | `variant` (standard/filled/filled-tonal/outlined/glass), `icon`, `size`, `toggle`, `selected` |
| `@formanywhere/ui/fab` | `FAB` | `variant` (surface/primary/secondary/tertiary/glass), `size`, `icon`, `label`, `lowered` |
| `@formanywhere/ui/chip` | `Chip` | `variant` (assist/filter/input/suggestion/label/glass), `label`, `selected`, `icon`, `onRemove`, `color` |
| `@formanywhere/ui/textfield` | `TextField` | `variant` (filled/outlined/glass), `size`, `label`, `placeholder`, `leadingIcon`, `trailingIcon`, `error`, `errorText`, `supportingText`, `type`, `onInput`, `onFocus`, `onBlur` |
| `@formanywhere/ui/input` | `Input` (alias) | Same as TextField |
| `@formanywhere/ui/select` | `Select` | `variant`, `options`, `label`, `placeholder`, `onChange`, `error` |
| `@formanywhere/ui/checkbox` | `Checkbox` | `checked`, `label`, `onChange`, `indeterminate`, `error` |
| `@formanywhere/ui/radio` | `Radio`, `RadioGroup` | `value`, `label`, `onChange`, `name` |
| `@formanywhere/ui/switch` | `Switch` | `checked`, `onChange`, `icons`, `size` |
| `@formanywhere/ui/tabs` | `Tabs`, `TabList`, `Tab`, `TabPanel` | `activeTab`, `onChange`, `variant` (primary/secondary), `Tab.id`, `Tab.label`, `TabPanel.tabId` |
| `@formanywhere/ui/progress` | `CircularProgress`, `LinearProgress` | `indeterminate`, `value`, `size` (circular), `buffer` (linear) |
| `@formanywhere/ui/badge` | `Badge` | `content`, `dot`, `color`, `position`, `max` |
| `@formanywhere/ui/tag` | `Tag` | `label`, `tone` (neutral/primary/success/warning/error), `size`, `icon` |
| `@formanywhere/ui/snackbar` | `Snackbar` | `open`, `onClose`, `message`, `action`, `duration`, `position` |
| `@formanywhere/ui/divider` | `Divider` | `inset`, `vertical` |
| `@formanywhere/ui/list` | `List`, `ListItem` | `ListItem.headline`, `.supportingText`, `.start`, `.end`, `.interactive`, `.href` |
| `@formanywhere/ui/avatar` | `Avatar` | `src`, `alt`, `initials`, `size`, `variant` (circular/rounded/square) |
| `@formanywhere/ui/icon` | `Icon` | `name`, `size`, `color` |
| `@formanywhere/ui/dialog` | `Dialog` | `open`, `onClose`, `title`, `icon`, `actions`, `glass` |
| `@formanywhere/ui/modal` | `Modal` (alias) | Same as Dialog |
| `@formanywhere/ui/drawer` | `Drawer` | `open`, `onClose`, `anchor` (left/right), `width` |
| `@formanywhere/ui/menu` | `Menu`, `MenuItem` | `open`, `onClose`, `anchorEl`, `position`; `MenuItem.label`, `.leadingIcon` |
| `@formanywhere/ui/tooltip` | `Tooltip` | `text`, `position`, `rich` |
| `@formanywhere/ui/elevation` | `Elevation` | `level` (0–5) |
| `@formanywhere/ui/search` | `SearchBar` | `value`, `placeholder`, `onChange`, `onSearch` |
| `@formanywhere/ui/slider` | `Slider` | `value`, `min`, `max`, `step`, `onChange`, `label` |
| `@formanywhere/ui/date-picker` | `DatePicker` | (date selection component) |
| `@formanywhere/ui/bottom-sheet` | `BottomSheet` | (mobile bottom sheet) |
| `@formanywhere/ui/navigation-bar` | `NavigationBar` | (mobile bottom nav) |
| `@formanywhere/ui/navigation-rail` | `NavigationRail` | (desktop side nav) |
| `@formanywhere/ui/top-app-bar` | `TopAppBar` | (app bar with title/actions) |
| `@formanywhere/ui/segmented-button` | `SegmentedButton` | (segmented toggle) |
| `@formanywhere/ui/ripple` | `Ripple` | (touch ripple effect) |
| `@formanywhere/ui/focus-ring` | `FocusRing` | (focus indicator) |

### 5.4 Built-in Icon Names (90+)

**Navigation:** `arrow-right`, `arrow-down`, `arrow-up`, `arrow-left`, `chevron-down`, `chevron-right`, `chevron-left`, `menu-hamburger`, `close`

**Actions:** `plus`, `edit`, `trash`, `copy`, `share`, `comment`, `download`, `more-vert`, `bookmark`, `pause`, `headset`, `favorite`, `search`, `sparkle`, `sort`, `eye`, `eye-off`, `save`, `play`, `undo`, `redo`, `upload`, `move`, `refresh-cw`

**People & Settings:** `person`, `bell`, `settings`, `logout`

**Content:** `file-text`, `help-circle`, `info`, `image`, `video`

**Data:** `calendar`, `message-square`, `mail`, `sliders`, `checkbox-checked`, `checkbox-empty`

**Status:** `check`, `check-circle`, `cross`, `minus`

**Features:** `lightning`, `sparkle-alt`, `heart`, `rocket`, `ai`, `star`, `bug`, `activity`, `bar-chart`

**Theme:** `theme-sun`

**Editor:** `pencil`, `grip-vertical`, `layers`, `type`, `at-sign`, `hash`, `align-left`, `align-center`, `align-right`, `list`, `list-ordered`, `toggle-left`, `radio`, `pen-tool`, `text-cursor`, `heading`, `bold`, `italic`, `underline`, `strikethrough`, `code-inline`, `code-block`, `quote`, `highlight`, `divider`

**Layout:** `columns`, `grid-3x3`, `square`, `layout`, `box`, `workflow`

**Form:** `phone`, `link`, `credit-card`, `mouse-pointer`, `search-alt`, `clock`, `move-vertical`

**Device:** `monitor`, `tablet`, `smartphone`

**Media:** `skip-forward`, `fast-forward`, `git-branch`

---

## 6. Route Files (apps/web)

### Structure

```
routes/
├── (auth).tsx                 # Auth layout wrapper
├── (auth)/
│   ├── signin.tsx
│   ├── signup.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
├── (marketing).tsx            # Marketing layout wrapper
├── (marketing)/
│   ├── index.tsx              # Home page
│   ├── about.tsx
│   ├── pricing.tsx
│   ├── templates.tsx
│   └── blog/
│       ├── index.tsx          # Blog list
│       └── [slug].tsx         # Blog detail
├── admin/
│   └── blog/
│       └── write.tsx
├── dashboard.tsx
├── form-setup.tsx
├── preview.tsx
├── app.tsx
└── [...404].tsx               # Catch-all 404
```

### Rules

1. Route files contain **only page-level orchestration** — importing and composing feature components.
2. All reusable UI, logic, and API clients live in **feature packages**.
3. Use SolidStart conventions: `(group)/` for route groups, `[param]` for dynamic segments, `[...catchall]` for catch-all.
4. Layout files share the group name: `(marketing).tsx` wraps all `(marketing)/*.tsx` routes.

---

## 7. Domain Package (`@formanywhere/domain`)

### Structure

```
domain/
├── form/
│   ├── index.ts               # Barrel
│   ├── elements/              # Form field types
│   │   ├── index.ts
│   │   ├── field-types.ts
│   │   ├── registry.ts
│   │   ├── types.ts
│   │   └── text-input/        # Each element: kebab-case folder
│   │       ├── text-input.tsx
│   │       └── text-input.properties.ts
│   ├── schema/                # Zod schemas & engine
│   ├── rules/                 # Business rules
│   ├── validators/            # Validation logic
│   └── workflow/              # Form workflow engine
└── submission/
    └── index.ts
```

### Element Pattern

Each form element lives in its own folder with exactly:
- `<name>.tsx` — Component
- `<name>.properties.ts` — Property definitions

---

## 8. Backend Conventions

### File Naming

```
routes/           → *.elysia.ts    (Elysia plugin routes)
controllers/      → *.controller.ts
middleware/        → *.middleware.ts
services/         → *.ts           (kebab-case, plain)
db/               → schema.ts, index.ts
lib/              → *.ts           (kebab-case, plain)
```

### Route Plugin Pattern

```ts
// routes/blogs.elysia.ts
import { Elysia } from 'elysia';

export const blogsRoutes = new Elysia({ prefix: '/api/blogs' })
  .get('/', handler)
  .get('/:slug', handler)
  .post('/', handler);
```

### Registering Routes

```ts
// index.ts
import { blogsRoutes } from './routes/blogs.elysia';
app.use(blogsRoutes);
```

---

## 9. Common Patterns

### API Client Pattern (in feature packages)

```ts
// src/blog/blog-api.ts
let _apiUrl = '';

export function configureBlogApi(apiUrl: string) {
  _apiUrl = apiUrl.replace(/\/$/, '');
}

function getApiUrl(): string {
  if (!_apiUrl) {
    try { _apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'; }
    catch { _apiUrl = 'http://localhost:3001'; }
  }
  return _apiUrl;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await fetch(`${getApiUrl()}/api/blogs`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}
```

### Component Pattern (SolidJS)

```tsx
import { Component, createSignal, Show, For } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Card } from '@formanywhere/ui/card';

export const MyComponent: Component<MyComponentProps> = (props) => {
  const [state, setState] = createSignal(false);

  return (
    <Card variant="outlined" padding="md">
      <Typography variant="title-medium">Title</Typography>
      <Show when={state()}>
        <Box padding="sm">Content</Box>
      </Show>
    </Card>
  );
};
```

### Data Fetching Pattern

```tsx
import { createResource } from 'solid-js';

const [data] = createResource(fetchData);
// Use data(), data.loading, data.error
```

---

## 10. Do NOT

- ❌ Put components or API clients in `apps/web/src/components/` or `apps/web/src/lib/`
- ❌ Use raw HTML elements (`<div>`, `<button>`, `<input>`, `<span>`) with inline styles
- ❌ Import from `@formanywhere/ui` barrel — use subpath imports
- ❌ Use `camelCase` or `PascalCase` for file names (except hooks with `use` prefix)
- ❌ Create default exports for components — always use named exports
- ❌ Access `import.meta.env` directly in packages — use configurable functions
- ❌ Add external icon libraries — use built-in `Icon` component
- ❌ Skip barrel exports (`index.ts`) in feature subfolders
