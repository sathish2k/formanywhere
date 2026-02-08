# FormAnywhere

> **The Offline-First Form Builder** — Build powerful forms that work anywhere, with or without internet.

## 🎯 Vision

FormAnywhere is a next-generation form builder designed for the real world, where internet connectivity isn't guaranteed. Field workers, event organizers, retailers, and businesses in developing markets need forms that just work — online or offline.

## 🔑 Key Differentiators

| Feature | FormAnywhere | Traditional Form Builders |
|---------|--------------|---------------------------|
| **Offline Mode** | 100% offline-capable | Requires internet |
| **Data Sync** | Automatic conflict resolution | Manual or unavailable |
| **Architecture** | Local-first (privacy + speed) | Cloud-first (latency) |
| **Platform** | Web + Desktop (Tauri) | Web only |
| **File Handling** | Offline photo/file upload queue | Requires connectivity |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FormAnywhere Stack                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Astro + SolidJS (SSG + Islands)                  │
│  Desktop:  Tauri (Rust-based, lightweight)                  │
│  UI:       Material 3 Liquid Glass Design System            │
│  Storage:  IndexedDB (offline) + PostgreSQL (cloud sync)    │
│  API:      Hono (edge-ready, TypeScript)                    │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Monorepo Structure

```
formanywhere/
├── apps/
│   ├── web/          # Marketing website (Astro)
│   └── desktop/      # Tauri desktop app
├── packages/
│   ├── ui/           # M3 Liquid Glass components
│   ├── shared/       # Cross-app components
│   └── core/         # Form engine + offline sync
├── backend/          # API (Hono + PostgreSQL)
└── docs/             # Documentation
```

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development
bun run dev

# Build for production
bun run build
```

## 📚 Documentation

- [Product Overview](./docs/PRODUCT.md) — Vision, target market, features
- [Architecture](./docs/ARCHITECTURE.md) — Technical deep-dive
- [Contributing](./docs/CONTRIBUTING.md) — How to contribute
- [UI Components](./packages/ui/README.md) — Design system guide

## 🎨 Design System

FormAnywhere uses a custom **Material 3 Liquid Glass** design system that combines:
- Google's Material 3 design tokens
- Apple's glassmorphism aesthetic
- Performance-first CSS (no runtime)

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.
