# FormAnywhere — Technical Architecture

## Overview

FormAnywhere uses a **local-first architecture** where all data operations happen on-device first, with optional cloud sync. This ensures 100% offline capability while enabling team collaboration when connected.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │
│  │   Web App   │  │  Desktop    │  │    PWA      │                   │
│  │   (Astro)   │  │   (Tauri)   │  │  (Offline)  │                   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                   │
│         │                │                │                           │
│         └────────────────┼────────────────┘                           │
│                          │                                            │
│  ┌───────────────────────▼───────────────────────┐                   │
│  │              SolidJS + UI Layer               │                   │
│  │     (M3 Liquid Glass Component Library)       │                   │
│  └───────────────────────┬───────────────────────┘                   │
│                          │                                            │
│  ┌───────────────────────▼───────────────────────┐                   │
│  │              Core Form Engine                 │                   │
│  │   • Schema validation  • Conditional logic    │                   │
│  │   • Field rendering    • Calculation engine   │                   │
│  └───────────────────────┬───────────────────────┘                   │
│                          │                                            │
│  ┌───────────────────────▼───────────────────────┐                   │
│  │           Local Storage Layer                 │                   │
│  │   • IndexedDB (structured data)               │                   │
│  │   • File System API (attachments)             │                   │
│  │   • Service Worker (offline cache)            │                   │
│  └───────────────────────┬───────────────────────┘                   │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Sync Layer │
                    │  (Optional) │
                    └──────┬──────┘
                           │
┌──────────────────────────▼───────────────────────────────────────────┐
│                          CLOUD LAYER                                  │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐                     │
│  │              API Gateway (Hono)             │                     │
│  │   • REST endpoints  • Auth (JWT/OAuth)      │                     │
│  │   • Rate limiting   • Request validation    │                     │
│  └────────────────────────┬────────────────────┘                     │
│                           │                                           │
│  ┌────────────────────────▼────────────────────┐                     │
│  │              Business Logic                 │                     │
│  │   • Sync resolution  • Team permissions     │                     │
│  │   • Webhook dispatch • PDF generation       │                     │
│  └────────────────────────┬────────────────────┘                     │
│                           │                                           │
│  ┌────────────────────────▼────────────────────┐                     │
│  │              Data Layer                     │                     │
│  │   • PostgreSQL (forms, responses)           │                     │
│  │   • S3/R2 (file attachments)                │                     │
│  │   • Redis (sessions, cache)                 │                     │
│  └─────────────────────────────────────────────┘                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Package Structure

```
packages/
├── ui/                    # M3 Liquid Glass Design System
│   ├── button/           # Button component
│   ├── card/             # Card component
│   ├── typography/       # Typography component
│   ├── chip/             # Chip/Tag component
│   ├── avatar/           # Avatar component
│   ├── box/              # Layout box component
│   └── index.ts          # Barrel exports
│
├── shared/               # Cross-app Components
│   ├── feature-tabs/     # Landing page tabs
│   ├── use-cases-grid/   # Use cases section
│   └── index.ts
│
├── core/                 # Form Engine (future)
│   ├── schema/           # JSON Schema validation
│   ├── fields/           # Field type definitions
│   ├── logic/            # Conditional logic engine
│   ├── storage/          # IndexedDB adapter
│   └── sync/             # Sync engine
│
└── api-client/           # API SDK (future)
    ├── auth/
    ├── forms/
    └── responses/
```

---

## 🔄 Offline Sync Strategy

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    OFFLINE OPERATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Action ──▶ Local State ──▶ IndexedDB ──▶ Queue        │
│                      │                           │           │
│                      ▼                           │           │
│               Render UI                          │           │
│                                                  │           │
│  ┌──────────────────────────────────────────────▼──────┐    │
│  │                 SYNC QUEUE                          │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │ Create  │ │ Update  │ │ Delete  │ │ Upload  │   │    │
│  │  │ Form A  │ │ Resp 12 │ │ Form C  │ │ Photo 5 │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                    Connection Restored
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SYNC PROCESS                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Pull remote changes (since last sync)                   │
│  2. Detect conflicts (same record, different versions)      │
│  3. Resolve conflicts (last-write-wins or merge)            │
│  4. Push local queue to server                              │
│  5. Update local state with server confirmations            │
│  6. Clear synced items from queue                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Conflict Resolution

| Scenario | Resolution Strategy |
|----------|---------------------|
| Same field edited | Last-write-wins (with timestamp) |
| Record deleted + edited | Deletion wins (with undo option) |
| File re-uploaded | Keep newer version, archive old |
| Schema changed during offline | Migrate on sync, validate |

---

## 🛠️ Technology Stack

### Frontend

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | **Astro** | SSG + Islands, zero JS by default |
| UI Library | **SolidJS** | Fine-grained reactivity, small bundle |
| Styling | **Tailwind CSS** | Utility-first, tree-shaking |
| Components | **Custom M3** | Liquid Glass design system |
| State | **SolidJS Stores** | Native reactivity |

### Desktop

| Layer | Technology | Why |
|-------|------------|-----|
| Runtime | **Tauri** | Rust backend, 10x smaller than Electron |
| Storage | **SQLite** | Embedded database for desktop |
| Updates | **Tauri Updater** | Delta updates, auto-update |

### Backend

| Layer | Technology | Why |
|-------|------------|-----|
| API | **Hono** | Edge-ready, TypeScript, <15kb |
| Database | **PostgreSQL** | Reliable, full-text search |
| Cache | **Redis** | Sessions, rate limiting |
| Files | **Cloudflare R2** | S3-compatible, cheap egress |
| Auth | **Lucia** | Type-safe auth library |

### Infrastructure

| Service | Provider | Why |
|---------|----------|-----|
| Hosting | **Cloudflare Pages** | Edge, free tier |
| API | **Cloudflare Workers** | Edge compute, global |
| Database | **Neon** | Serverless PostgreSQL |
| Files | **Cloudflare R2** | Zero egress fees |

---

## 🔐 Security

### Data Protection

- **At Rest**: AES-256 encryption (IndexedDB + PostgreSQL)
- **In Transit**: TLS 1.3 for all API calls
- **Local**: Optional password protection for offline data
- **Keys**: User-derived keys, not stored server-side

### Authentication

- **JWT tokens** with short expiry (15 min access, 7 day refresh)
- **OAuth providers**: Google, Microsoft, Apple
- **Magic links**: Passwordless email login
- **API keys**: For integrations (scoped permissions)

### Compliance

- **GDPR**: Data export, deletion on request
- **SOC2**: Audit logging, access controls (Enterprise)
- **HIPAA**: BAA available (Enterprise, self-hosted)

---

## 📁 File Handling

### Offline Upload Queue

```typescript
interface UploadQueueItem {
  id: string;
  file: Blob;
  metadata: {
    formId: string;
    fieldId: string;
    responseId: string;
    capturedAt: Date;
    gpsLocation?: { lat: number; lng: number };
  };
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  retryCount: number;
}
```

### Compression Pipeline

1. **Photos**: Resize to max 2048px, JPEG quality 85%
2. **Documents**: Keep original (user choice to compress)
3. **Signatures**: PNG with transparency, max 800px width
4. **Attachments**: Chunked upload for large files

---

## 📊 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| FCP | <1.0s | Lighthouse |
| TTI | <2.0s | Lighthouse |
| Bundle size | <100kb | Gzip |
| Offline boot | <500ms | Custom |
| Sync latency | <2s | P95 |
| Form render | <100ms | Custom |

---

## 🧪 Testing Strategy

| Level | Tools | Coverage Target |
|-------|-------|-----------------|
| Unit | Vitest | 80% |
| Component | Testing Library | 70% |
| E2E | Playwright | Critical paths |
| Offline | Custom harness | All sync scenarios |
| Performance | Lighthouse CI | Every PR |

---

## 📚 Related Documentation

- [Product Overview](./PRODUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [API Reference](./API.md)
- [UI Component Guide](../packages/ui/README.md)
