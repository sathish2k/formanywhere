# Contributing to FormAnywhere

Thank you for your interest in contributing to FormAnywhere! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ or **Bun** 1.0+
- **Git**
- **VS Code** (recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/formanywhere/formanywhere.git
cd formanywhere

# Install dependencies
bun install

# Start development
bun run dev
```

### Development URLs

| App | URL | Description |
|-----|-----|-------------|
| Web | http://localhost:4321 | Marketing site |
| Desktop | `bun run dev:desktop` | Tauri app |

---

## 📁 Project Structure

```
formanywhere/
├── apps/
│   ├── web/              # Astro marketing site
│   └── desktop/          # Tauri desktop app
├── packages/
│   ├── ui/               # M3 Liquid Glass components
│   ├── shared/           # Cross-app components
│   └── core/             # Form engine (future)
├── backend/              # Hono API
└── docs/                 # Documentation
```

---

## 🎨 UI Development

### Component Guidelines

All UI components live in `packages/ui/` and follow these rules:

1. **Use M3 design tokens** — No hardcoded colors
2. **SolidJS only** — No React or other frameworks
3. **Export from index** — All components exported from `packages/ui/src/index.ts`
4. **TypeScript required** — Full type definitions

### Creating a New Component

```bash
# 1. Create folder
mkdir packages/ui/src/my-component

# 2. Create component file
touch packages/ui/src/my-component/index.tsx

# 3. Export from barrel
echo "export * from './my-component';" >> packages/ui/src/index.ts
```

### Component Template

```tsx
import { JSX, ParentComponent, splitProps } from 'solid-js';

export interface MyComponentProps {
  variant?: 'primary' | 'secondary';
  class?: string;
  style?: JSX.CSSProperties;
}

export const MyComponent: ParentComponent<MyComponentProps> = (props) => {
  const [local, rest] = splitProps(props, ['variant', 'class', 'children']);
  
  return (
    <div
      class={local.class}
      style={{
        // Use M3 tokens
        background: 'var(--m3-color-surface)',
        color: 'var(--m3-color-on-surface)',
      }}
      {...rest}
    >
      {local.children}
    </div>
  );
};

export default MyComponent;
```

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific package
bun test --filter=@formanywhere/ui
```

---

## 📝 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(ui): add Button component
fix(api): resolve auth token refresh
docs(readme): update installation steps
refactor(core): simplify sync logic
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no code change) |
| `refactor` | Code restructure |
| `test` | Tests |
| `chore` | Build/tooling |

---

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create branch**: `git checkout -b feat/my-feature`
3. **Make changes** with tests
4. **Commit** using conventional commits
5. **Push**: `git push origin feat/my-feature`
6. **Open PR** against `main`

### PR Checklist

- [ ] Tests pass locally (`bun test`)
- [ ] Lint passes (`bun lint`)
- [ ] Types check (`bun typecheck`)
- [ ] Documentation updated if needed
- [ ] Screenshots for UI changes

---

## 🐛 Reporting Issues

### Bug Reports

Include:
- **Environment** (OS, browser, Node version)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots/logs** if applicable

### Feature Requests

Include:
- **Use case** — What problem does it solve?
- **Proposed solution** — How should it work?
- **Alternatives** — Other ways to solve it?

---

## 💬 Getting Help

- **GitHub Issues** — Bug reports, features
- **Discussions** — Questions, ideas
- **Discord** — Real-time chat (coming soon)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
