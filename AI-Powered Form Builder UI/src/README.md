# FormBuilder AI - Enterprise-Grade Form Builder

> Modern, AI-powered form builder with multi-step wizards, dynamic logic, and API-driven behavior.

## 🏗️ Project Structure

This project follows **Big Tech best practices** (Google/Facebook/Meta pattern) with a feature-first, scalable architecture:

```
/src
├── app/                    # Application shell & routing
├── features/               # Feature modules (domain-driven)
│   ├── form-builder/       # Form builder feature
│   ├── landing/            # Landing & marketing pages
│   └── auth/               # Authentication
├── shared/                 # Shared across all features
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # Shared TypeScript types
│   └── constants/          # App-wide constants
├── core/                   # Core infrastructure
│   ├── theme/              # Material-UI theme
│   ├── config/             # App configuration
│   └── services/           # API clients & services
└── styles/                 # Global styles
```

## ✨ Key Features

- ✅ **Multi-Step Forms** - Wizard-style form building with unlimited steps
- ✅ **Drag & Drop Builder** - Intuitive visual editor with nested containers
- ✅ **Conditional Logic** - Advanced rules engine for dynamic forms
- ✅ **Material-UI Components** - Minimals.cc inspired design system
- ✅ **TypeScript** - Fully typed with strict type checking
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Component Library** - 20+ form elements and layout components

## 🎨 Design System

Inspired by [Minimals.cc](https://minimals.cc) - A clean, modern, enterprise-grade design system:

- **Primary Color**: `#5B5FED` (Indigo)
- **Secondary Color**: `#8E33FF` (Purple)
- **Typography**: Public Sans
- **Spacing**: 8px grid system
- **Border Radius**: 12px (cards), 8px (buttons)

## 📦 Architecture Principles

### 1. Feature-First Organization
Each feature is self-contained with its own:
- Components
- Types
- Utils
- Hooks
- Configuration

### 2. Separation of Concerns
- `/features` - Domain-specific code
- `/shared` - Reusable across features
- `/core` - Infrastructure & configuration

### 3. Atomic Design
- `/shared/components/ui` - Atoms (basic components)
- `/shared/components/common` - Molecules (composite)
- `/features/*/components` - Organisms (feature-specific)

### 4. TypeScript Best Practices
- Path aliases (`@/features`, `@/shared`, `@/core`)
- Strict type checking
- Centralized type definitions

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Key Directories

### `/src/features/form-builder`
The main form builder feature module:
- **components/** - Form builder UI components
- **config/** - Element definitions & categories
- **engines/** - Business logic (rendering, rules)
- **types/** - Form-related TypeScript types
- **utils/** - Helper functions

### `/src/shared/components`
Reusable components used across features:
- **ui/** - Base Material-UI components
- **common/** - Composite components (AppBar, etc.)

### `/src/core`
Core infrastructure:
- **theme/** - Material-UI theme configuration
- **config/** - App-wide configuration
- **services/** - API clients & external services

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI v5** - Component library
- **Lucide React** - Icon library
- **Vite** - Build tool & dev server

## 📝 Form Builder Features

### Available Elements

**Layout Elements**
- Section, Card, 2/3 Columns
- Divider, Spacer, Heading, Logo, Text Block

**Input Elements**
- Short Text, Long Text, Email, Phone
- Number, URL, Dropdown, Radio, Checkbox
- Switch, Date, Time, File Upload, Rating

### Properties System
- **Basic Tab** - Label, placeholder, required, options
- **Style Tab** - Width, alignment, spacing, variant
- **Advanced Tab** - Validation, conditional logic, custom CSS

### Conditional Logic
- Show/hide elements based on conditions
- Enable/disable fields dynamically
- Set values programmatically
- Navigate between pages

## 🏢 Enterprise Features

- **Multi-tenant Support** - Build forms for multiple clients
- **API Integration** - Connect to external APIs
- **Custom Validation** - Advanced validation rules
- **Theming** - Customize colors, fonts, spacing
- **Export/Import** - JSON schema for portability

## 📖 Documentation

See `/PROJECT_STRUCTURE.txt` for detailed architecture documentation.

## 🤝 Contributing

This project follows strict coding standards:
- ESLint for code quality
- Prettier for formatting
- TypeScript strict mode
- Component co-location

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ following Google & Facebook engineering practices**
