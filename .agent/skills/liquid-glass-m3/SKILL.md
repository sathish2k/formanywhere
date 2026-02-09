---
name: Liquid Glass Material 3 Design System
description: A comprehensive design system combining Apple's liquid glass aesthetic with Google's Material 3 design principles for premium, modern UI components.
---

# Liquid Glass Material 3 Design System

A design system that merges the ethereal, translucent beauty of **Liquid Glass** (inspired by Apple's iOS/macOS design) with **Google Material 3's** systematic design tokens, typography, and component patterns.

> [!IMPORTANT]
> **Reference Documentation:**
>
> **Apple Liquid Glass (iOS 26+)**
> https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
>
> Liquid Glass is Apple's design language introduced in iOS 26, featuring translucent materials with depth, specular highlights, and smooth animations that respond to environmental lighting. Key principles:
> - **Specular and refractive effects**: UI surfaces refract and reflect light like physical glass
> - **Environmental awareness**: Materials adapt to content behind and around them
> - **Depth and layering**: Multiple glass layers create visual hierarchy
> - **Smooth motion**: Physics-based animations with fluid transitions
>
> **Material Web Components (M3)**
> https://github.com/material-components/material-web
>
> This is the canonical reference for M3 component behavior, animations, and state management.

---

## 7 UX Design Principles (Figma)

> [!NOTE]
> **Reference:** https://www.figma.com/resource-library/what-is-ux-design/
>
> These principles guide ALL design decisions in this project.

### 1. User-Centric
Focus on understanding users' needs, goals, and behaviors.
- Personalize experiences based on user context
- Design flows that feel natural and intuitive
- Always ask: "Does this solve the user's problem?"

### 2. Consistency
Keep design predictable across screens and devices.
- Use components from `@formanywhere/ui` exclusively
- Maintain consistent spacing, colors, and typography
- Same interaction patterns throughout the app

### 3. Hierarchy
Use visual cues to highlight important information.
- Larger, bolder elements for primary actions
- Subtle colors for secondary content
- Clear visual grouping with Card, Divider components

### 4. Usability
Make products easy to learn and use.
- Minimize clicks/taps to complete tasks
- Clear labeling and helpful error messages
- Progressive disclosure: show only what's needed

### 5. User Control
Give users the ability to control their experience.
- Undo/redo for destructive actions
- Clear cancel/back options
- Allow customization (theme, preferences)

### 6. Accessibility
Design for users of all abilities.
- Proper color contrast (WCAG AA minimum)
- Keyboard navigation support
- Semantic HTML and ARIA labels
- Focus indicators on interactive elements

### 7. Context
Consider how, when, and where users interact.
- Responsive design for mobile, tablet, desktop
- Touch-friendly targets (min 44px)
- Offline-first for FormAnywhere's core use case

---

## Shared UI Package - MANDATORY

> [!CAUTION]
> **ALL pages and components MUST use UI elements from `@formanywhere/ui`.**
> Do NOT create custom buttons, inputs, cards, or other UI primitives in `apps/web/src/components/ui/`.
> Always import from the shared package to ensure consistency and maintainability.

### Usage

```tsx
// ✅ CORRECT - Import from shared package
import { Button, TextField, Card, Checkbox } from '@formanywhere/ui';

// ❌ WRONG - Do not create local UI components
// import { Button } from '../components/ui/Button';
```

### Available Components

**Core:**
- `Button` - M3 buttons (filled/secondary/outlined/text/tonal)
- `Ripple` - M3 ripple animation for custom interactive elements
- `IconButton` - Icon buttons (standard/filled/filled-tonal/outlined)
- `FAB` - Floating Action Buttons

**Input:**
- `TextField` / `Input` - Text fields (filled/outlined) with floating labels
- `Select` - Dropdown select with M3 menu
- `Checkbox` - Checkbox with ripple and indeterminate state
- `Radio` / `RadioGroup` - Radio buttons with group context
- `Switch` - Toggle switch

**Data Display:**
- `Card` / `CardMedia` / `CardContent` / `CardHeader` / `CardActions` - Card components
- `Chip` - Chips (assist/filter/input/suggestion)
- `Divider` - Horizontal/vertical dividers
- `Avatar` / `AvatarGroup` - Avatars
- `Badge` - Notification badges
- `Tooltip` - Tooltips
- `List` / `ListItem` / `ListDivider` - List components

**Navigation:**
- `Tabs` / `TabList` / `Tab` / `TabPanel` - Tab navigation
- `Menu` / `MenuItem` / `MenuDivider` - Dropdown menus

**Feedback:**
- `Dialog` / `Modal` - Dialogs and modals
- `Snackbar` - Toast notifications
- `CircularProgress` / `LinearProgress` - Progress indicators

**Utilities:**
- `ThemeProvider` / `useTheme` - Theme management

---

## Core Visual Principles

### 1. Transparency & Depth
- Use layered translucent surfaces to create visual depth
- Background blur (`backdrop-filter: blur()`) creates the signature liquid glass effect
- Subtle gradients enhance the sense of floating surfaces

### 2. Material 3 Color System
- Use M3's tonal palettes for consistent color relationships
- Surface colors should support translucency
- Maintain proper contrast ratios for accessibility

### 3. Motion & Fluidity
- Smooth, physics-based transitions
- Micro-interactions that feel responsive and alive
- Natural easing curves (ease-out, ease-in-out)


---

## CSS Variable Foundation

```css
:root {
  /* === MATERIAL 3 COLOR TOKENS === */
  --m3-color-primary: #6366f1;
  --m3-color-on-primary: #ffffff;
  --m3-color-primary-container: rgba(99, 102, 241, 0.12);
  --m3-color-on-primary-container: #3730a3;
  
  --m3-color-secondary: #8b5cf6;
  --m3-color-on-secondary: #ffffff;
  --m3-color-secondary-container: rgba(139, 92, 246, 0.12);
  
  --m3-color-surface: rgba(255, 255, 255, 0.95);
  --m3-color-surface-dim: rgba(250, 250, 250, 0.92);
  --m3-color-surface-bright: rgba(255, 255, 255, 0.98);
  --m3-color-surface-container-lowest: rgba(255, 255, 255, 0.4);
  --m3-color-surface-container-low: rgba(255, 255, 255, 0.55);
  --m3-color-surface-container: rgba(255, 255, 255, 0.7);
  --m3-color-surface-container-high: rgba(255, 255, 255, 0.85);
  --m3-color-surface-container-highest: rgba(255, 255, 255, 0.95);
  
  --m3-color-on-surface: #1f1f1f;
  --m3-color-on-surface-variant: #4d4256;
  --m3-color-outline: rgba(120, 117, 121, 0.4);
  --m3-color-outline-variant: rgba(200, 195, 200, 0.5);
  --m3-color-scrim: rgba(0, 0, 0, 0.32);
  
  /* === LIQUID GLASS SPECIFIC === */
  --glass-blur: 20px;
  --glass-blur-strong: 40px;
  --glass-blur-subtle: 12px;
  
  --glass-tint-light: rgba(255, 255, 255, 0.7);
  --glass-tint-medium: rgba(255, 255, 255, 0.5);
  --glass-tint-subtle: rgba(255, 255, 255, 0.3);
  
  --glass-border-light: rgba(255, 255, 255, 0.6);
  --glass-border-medium: rgba(255, 255, 255, 0.4);
  --glass-border-subtle: rgba(255, 255, 255, 0.2);
  
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  --glass-shadow-elevated: 0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
  
  /* === MATERIAL 3 TYPOGRAPHY === */
  --m3-font-display: 'Google Sans', 'Inter', sans-serif;
  --m3-font-body: 'Google Sans Text', 'Inter', sans-serif;
  
  /* Display */
  --m3-display-large-size: 57px;
  --m3-display-large-line-height: 64px;
  --m3-display-large-weight: 475;
  --m3-display-medium-size: 45px;
  --m3-display-medium-line-height: 52px;
  --m3-display-small-size: 36px;
  --m3-display-small-line-height: 44px;
  
  /* Headline */
  --m3-headline-large-size: 32px;
  --m3-headline-large-line-height: 40px;
  --m3-headline-medium-size: 28px;
  --m3-headline-medium-line-height: 36px;
  --m3-headline-small-size: 24px;
  --m3-headline-small-line-height: 32px;
  
  /* Title */
  --m3-title-large-size: 22px;
  --m3-title-large-line-height: 30px;
  --m3-title-medium-size: 16px;
  --m3-title-medium-line-height: 24px;
  --m3-title-small-size: 14px;
  --m3-title-small-line-height: 20px;
  
  /* Body */
  --m3-body-large-size: 16px;
  --m3-body-large-line-height: 24px;
  --m3-body-medium-size: 14px;
  --m3-body-medium-line-height: 20px;
  --m3-body-small-size: 12px;
  --m3-body-small-line-height: 16px;
  
  /* Label */
  --m3-label-large-size: 14px;
  --m3-label-large-line-height: 20px;
  --m3-label-medium-size: 12px;
  --m3-label-medium-line-height: 16px;
  
  /* === M3 ELEVATION === */
  --m3-elevation-1: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  --m3-elevation-2: 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1);
  --m3-elevation-3: 0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.1);
  
  /* === SHAPE === */
  --m3-shape-extra-small: 4px;
  --m3-shape-small: 8px;
  --m3-shape-medium: 12px;
  --m3-shape-large: 16px;
  --m3-shape-extra-large: 28px;
  --m3-shape-full: 9999px;
  
  /* === MOTION === */
  --m3-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --m3-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --m3-motion-duration-short: 150ms;
  --m3-motion-duration-medium: 300ms;
  --m3-motion-duration-long: 450ms;
}

/* === DARK MODE === */
[data-theme="dark"], .dark {
  --m3-color-surface: rgba(30, 27, 35, 0.9);
  --m3-color-on-surface: #e6e1e3;
  --m3-color-on-surface-variant: #cac5c7;
  
  --glass-tint-light: rgba(60, 54, 70, 0.6);
  --glass-tint-medium: rgba(50, 45, 58, 0.5);
  --glass-tint-subtle: rgba(40, 36, 46, 0.4);
  
  --glass-border-light: rgba(255, 255, 255, 0.15);
  --glass-border-medium: rgba(255, 255, 255, 0.1);
  --glass-border-subtle: rgba(255, 255, 255, 0.05);
}
```

---

## Component Patterns

### 1. Top App Bar (Liquid Glass)

Per M3 guidelines, top app bars display navigation, actions, and text at the top of a screen.

```css
.lg-app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--glass-border-subtle);
  box-shadow: var(--glass-shadow);
  transition: all var(--m3-motion-duration-medium) var(--m3-motion-easing-standard);
}

.lg-app-bar__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Scrolled state - more frosted */
.lg-app-bar--scrolled {
  background: var(--glass-tint-medium);
  backdrop-filter: blur(var(--glass-blur-strong));
  box-shadow: var(--glass-shadow-elevated);
}

.lg-app-bar__title {
  font-family: var(--m3-font-display);
  font-size: var(--m3-title-large-size);
  line-height: var(--m3-title-large-line-height);
  color: var(--m3-color-on-surface);
}

.lg-app-bar__icon-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--m3-shape-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--m3-color-on-surface-variant);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-app-bar__icon-btn:hover {
  background: var(--m3-color-surface-container);
}
```

```html
<header class="lg-app-bar">
  <div class="lg-app-bar__container">
    <button class="lg-app-bar__icon-btn" aria-label="Menu">
      <svg><!-- Menu icon --></svg>
    </button>
    <h1 class="lg-app-bar__title">Page Title</h1>
    <button class="lg-app-bar__icon-btn" aria-label="Search">
      <svg><!-- Search icon --></svg>
    </button>
  </div>
</header>
```

---

### 2. Buttons

```css
/* Base button */
.lg-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 10px 24px;
  border: none;
  border-radius: var(--m3-shape-full);
  font-family: var(--m3-font-body);
  font-size: var(--m3-label-large-size);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

/* Filled (primary action) */
.lg-button--filled {
  background: linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-secondary));
  color: var(--m3-color-on-primary);
  box-shadow: var(--m3-elevation-1);
}

.lg-button--filled:hover {
  box-shadow: var(--m3-elevation-2);
  transform: translateY(-1px);
}

/* Glass Tonal */
.lg-button--glass-tonal {
  background: var(--glass-tint-medium);
  backdrop-filter: blur(var(--glass-blur-subtle));
  color: var(--m3-color-primary);
  border: 1px solid var(--glass-border-medium);
  box-shadow: var(--glass-shadow);
}

.lg-button--glass-tonal:hover {
  background: var(--glass-tint-light);
  box-shadow: var(--glass-shadow-elevated);
}

/* Outlined */
.lg-button--outlined {
  background: transparent;
  color: var(--m3-color-primary);
  border: 1px solid var(--m3-color-outline);
}

.lg-button--outlined:hover {
  background: var(--m3-color-primary-container);
}

/* Text */
.lg-button--text {
  background: transparent;
  color: var(--m3-color-primary);
  padding: 10px 12px;
}

.lg-button--text:hover {
  background: var(--m3-color-primary-container);
}

/* Icon Button */
.lg-icon-button {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: var(--m3-shape-full);
  background: transparent;
  border: none;
  color: var(--m3-color-on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lg-icon-button--glass {
  background: var(--glass-tint-subtle);
  backdrop-filter: blur(var(--glass-blur-subtle));
  border: 1px solid var(--glass-border-subtle);
}

/* FAB */
.lg-fab {
  width: 56px;
  height: 56px;
  border-radius: var(--m3-shape-large);
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-light);
  box-shadow: var(--glass-shadow-elevated);
  color: var(--m3-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lg-fab:hover {
  transform: translateY(-2px) scale(1.02);
}
```

---

### 3. Cards

```css
.lg-card {
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-medium);
  border-radius: var(--m3-shape-large);
  box-shadow: var(--glass-shadow);
  overflow: hidden;
  transition: all var(--m3-motion-duration-medium) var(--m3-motion-easing-emphasized);
}

.lg-card:hover {
  box-shadow: var(--glass-shadow-elevated);
  transform: translateY(-2px);
}

.lg-card__content {
  padding: 16px;
}

.lg-card__headline {
  font-family: var(--m3-font-display);
  font-size: var(--m3-title-medium-size);
  color: var(--m3-color-on-surface);
  margin: 0 0 8px;
}

.lg-card__body {
  font-size: var(--m3-body-medium-size);
  color: var(--m3-color-on-surface-variant);
  margin: 0;
}

.lg-card__actions {
  display: flex;
  gap: 8px;
  padding: 16px;
  padding-top: 0;
}
```

---

### 4. Dialog/Modal

```css
.lg-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: var(--m3-color-scrim);
  backdrop-filter: blur(4px);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--m3-motion-duration-medium) var(--m3-motion-easing-standard);
}

.lg-dialog-backdrop--open {
  opacity: 1;
  pointer-events: auto;
}

.lg-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--m3-shape-extra-large);
  box-shadow: var(--glass-shadow-elevated);
  min-width: 280px;
  max-width: 560px;
  z-index: 101;
  opacity: 0;
  transition: all var(--m3-motion-duration-medium) var(--m3-motion-easing-emphasized);
}

.lg-dialog--open {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.lg-dialog__headline {
  font-size: var(--m3-headline-small-size);
  color: var(--m3-color-on-surface);
  padding: 24px 24px 16px;
  margin: 0;
  text-align: center;
}

.lg-dialog__content {
  font-size: var(--m3-body-medium-size);
  color: var(--m3-color-on-surface-variant);
  padding: 0 24px 24px;
}

.lg-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px 24px;
}
```

---

### 5. Text Fields

```css
.lg-text-field {
  position: relative;
  width: 100%;
}

.lg-text-field__input {
  width: 100%;
  height: 56px;
  padding: 16px;
  font-size: var(--m3-body-large-size);
  color: var(--m3-color-on-surface);
  background: var(--glass-tint-subtle);
  backdrop-filter: blur(var(--glass-blur-subtle));
  border: 1px solid var(--m3-color-outline);
  border-radius: var(--m3-shape-extra-small);
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-text-field__input:focus {
  outline: none;
  border-color: var(--m3-color-primary);
  border-width: 2px;
}

.lg-text-field__input::placeholder {
  color: var(--m3-color-on-surface-variant);
}
```

---

### 6. Bottom Navigation

```css
.lg-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  border-top: 1px solid var(--glass-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 50;
}

.lg-bottom-nav__item {
  flex: 1;
  max-width: 90px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--m3-color-on-surface-variant);
  background: transparent;
  border: none;
  cursor: pointer;
}

.lg-bottom-nav__item--active {
  color: var(--m3-color-on-secondary-container);
}

.lg-bottom-nav__indicator {
  width: 64px;
  height: 32px;
  border-radius: var(--m3-shape-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lg-bottom-nav__item--active .lg-bottom-nav__indicator {
  background: var(--m3-color-secondary-container);
}

.lg-bottom-nav__label {
  font-size: var(--m3-label-medium-size);
  font-weight: 500;
}
```

---

### 7. Chips

```css
.lg-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 16px;
  border-radius: var(--m3-shape-small);
  font-size: var(--m3-label-large-size);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-chip--glass {
  background: var(--glass-tint-subtle);
  backdrop-filter: blur(var(--glass-blur-subtle));
  border: 1px solid var(--m3-color-outline);
  color: var(--m3-color-on-surface);
}

.lg-chip--glass:hover {
  background: var(--glass-tint-medium);
}

.lg-chip--selected {
  background: var(--m3-color-secondary-container);
  border-color: transparent;
  color: var(--m3-color-on-secondary-container);
}
```

---

### 8. Snackbar

```css
.lg-snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-medium);
  border-radius: var(--m3-shape-extra-small);
  box-shadow: var(--glass-shadow-elevated);
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 344px;
  padding: 14px 16px;
  opacity: 0;
  z-index: 120;
  transition: all var(--m3-motion-duration-medium) var(--m3-motion-easing-emphasized);
}

.lg-snackbar--visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.lg-snackbar__text {
  flex: 1;
  font-size: var(--m3-body-medium-size);
  color: var(--m3-color-on-surface);
}

.lg-snackbar__action {
  font-size: var(--m3-label-large-size);
  font-weight: 500;
  color: var(--m3-color-primary);
  background: transparent;
  border: none;
  cursor: pointer;
}
```

---

### 9. Badges

```css
.lg-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--m3-shape-full);
  background: var(--m3-color-error, #ff6240);
  color: white;
  font-size: 11px;
  font-weight: 500;
}

.lg-badge--small {
  min-width: 6px;
  height: 6px;
  padding: 0;
}

.lg-badge--large {
  min-width: 24px;
  height: 24px;
  font-size: var(--m3-label-medium-size);
}
```

---

### 10. Progress Indicators

```css
/* Linear Progress */
.lg-progress-linear {
  width: 100%;
  height: 4px;
  background: var(--m3-color-surface-container-highest);
  border-radius: var(--m3-shape-full);
  overflow: hidden;
}

.lg-progress-linear__bar {
  height: 100%;
  background: var(--m3-color-primary);
  border-radius: var(--m3-shape-full);
  transition: width var(--m3-motion-duration-medium) var(--m3-motion-easing-standard);
}

/* Indeterminate animation */
.lg-progress-linear--indeterminate .lg-progress-linear__bar {
  width: 30%;
  animation: lg-progress-indeterminate 1.5s infinite ease-in-out;
}

@keyframes lg-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

/* Circular Progress */
.lg-progress-circular {
  width: 48px;
  height: 48px;
  position: relative;
}

.lg-progress-circular__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.lg-progress-circular__track {
  fill: none;
  stroke: var(--m3-color-surface-container-highest);
  stroke-width: 4;
}

.lg-progress-circular__bar {
  fill: none;
  stroke: var(--m3-color-primary);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset var(--m3-motion-duration-medium) var(--m3-motion-easing-standard);
}
```

---

### 11. Sliders

```css
.lg-slider {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  position: relative;
}

.lg-slider__track {
  width: 100%;
  height: 4px;
  background: var(--m3-color-surface-container-highest);
  border-radius: var(--m3-shape-full);
  position: relative;
}

.lg-slider__fill {
  height: 100%;
  background: var(--m3-color-primary);
  border-radius: var(--m3-shape-full);
}

.lg-slider__thumb {
  width: 20px;
  height: 20px;
  background: var(--m3-color-primary);
  border-radius: var(--m3-shape-full);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: var(--m3-elevation-1);
  transition: box-shadow var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-slider__thumb:hover {
  box-shadow: var(--m3-elevation-2);
}

.lg-slider__thumb::before {
  content: '';
  position: absolute;
  inset: -10px;
  background: var(--m3-color-primary-container);
  border-radius: var(--m3-shape-full);
  opacity: 0;
  transition: opacity var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-slider__thumb:hover::before {
  opacity: 0.12;
}
```

---

### 12. Switches

```css
.lg-switch {
  width: 52px;
  height: 32px;
  padding: 2px;
  background: var(--m3-color-surface-container-highest);
  border: 2px solid var(--m3-color-outline);
  border-radius: var(--m3-shape-full);
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-switch__thumb {
  width: 24px;
  height: 24px;
  background: var(--m3-color-outline);
  border-radius: var(--m3-shape-full);
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-switch--checked {
  background: var(--m3-color-primary);
  border-color: var(--m3-color-primary);
}

.lg-switch--checked .lg-switch__thumb {
  background: var(--m3-color-on-primary);
  transform: translateX(20px);
}
```

---

### 13. Tabs

```css
.lg-tabs {
  display: flex;
  background: var(--glass-tint-subtle);
  backdrop-filter: blur(var(--glass-blur-subtle));
  border-bottom: 1px solid var(--m3-color-outline-variant);
}

.lg-tab {
  flex: 1;
  min-width: 90px;
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--m3-color-on-surface-variant);
  font-size: var(--m3-title-small-size);
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-tab:hover {
  background: var(--m3-color-surface-container);
}

.lg-tab--active {
  color: var(--m3-color-primary);
}

.lg-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--m3-color-primary);
  border-radius: 3px 3px 0 0;
}
```

---

### 14. Lists

```css
.lg-list {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.lg-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-list-item:hover {
  background: var(--m3-color-surface-container);
}

.lg-list-item__leading {
  width: 24px;
  height: 24px;
  color: var(--m3-color-on-surface-variant);
}

.lg-list-item__content {
  flex: 1;
  min-width: 0;
}

.lg-list-item__headline {
  font-size: var(--m3-body-large-size);
  color: var(--m3-color-on-surface);
}

.lg-list-item__supporting {
  font-size: var(--m3-body-medium-size);
  color: var(--m3-color-on-surface-variant);
}

.lg-list-item__trailing {
  color: var(--m3-color-on-surface-variant);
}
```

---

### 15. Menus

```css
.lg-menu {
  min-width: 112px;
  max-width: 280px;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-medium);
  border-radius: var(--m3-shape-extra-small);
  box-shadow: var(--glass-shadow-elevated);
  padding: 8px 0;
  opacity: 0;
  transform: scale(0.95);
  transform-origin: top left;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-menu--open {
  opacity: 1;
  transform: scale(1);
}

.lg-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 12px;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: var(--m3-body-large-size);
  color: var(--m3-color-on-surface);
  cursor: pointer;
  transition: background var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-menu-item:hover {
  background: var(--m3-color-surface-container);
}

.lg-menu-divider {
  height: 1px;
  background: var(--m3-color-outline-variant);
  margin: 8px 0;
}
```

---

### 16. Tooltips

```css
.lg-tooltip {
  position: absolute;
  padding: 4px 8px;
  background: var(--m3-color-inverse-surface);
  color: var(--m3-color-inverse-on-surface);
  font-size: var(--m3-body-small-size);
  border-radius: var(--m3-shape-extra-small);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
  z-index: 200;
}

.lg-tooltip--visible {
  opacity: 1;
}

/* Rich tooltip with glass */
.lg-tooltip--rich {
  max-width: 312px;
  padding: 12px 16px;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-medium);
  color: var(--m3-color-on-surface);
  white-space: normal;
  border-radius: var(--m3-shape-medium);
  box-shadow: var(--glass-shadow);
}
```

---

### 17. Navigation Drawer

```css
.lg-nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 360px;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur-strong));
  border-right: 1px solid var(--glass-border-subtle);
  padding: 12px;
  transform: translateX(-100%);
  transition: transform var(--m3-motion-duration-medium) var(--m3-motion-easing-emphasized);
  z-index: 60;
}

.lg-nav-drawer--open {
  transform: translateX(0);
}

.lg-nav-drawer__header {
  padding: 16px;
  margin-bottom: 8px;
}

.lg-nav-drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  border-radius: var(--m3-shape-full);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: var(--m3-label-large-size);
  font-weight: 500;
  color: var(--m3-color-on-surface-variant);
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-nav-drawer-item:hover {
  background: var(--m3-color-surface-container);
}

.lg-nav-drawer-item--active {
  background: var(--m3-color-secondary-container);
  color: var(--m3-color-on-secondary-container);
}
```

---

### 18. Search Bar

```css
.lg-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 16px;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-medium);
  border-radius: var(--m3-shape-full);
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-search-bar:focus-within {
  border-color: var(--m3-color-primary);
  box-shadow: 0 0 0 2px var(--m3-color-primary-container);
}

.lg-search-bar__icon {
  width: 24px;
  height: 24px;
  color: var(--m3-color-on-surface-variant);
}

.lg-search-bar__input {
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--m3-body-large-size);
  color: var(--m3-color-on-surface);
}

.lg-search-bar__input::placeholder {
  color: var(--m3-color-on-surface-variant);
}
```

---

### 19. Segmented Buttons

```css
.lg-segmented-buttons {
  display: inline-flex;
  border: 1px solid var(--m3-color-outline);
  border-radius: var(--m3-shape-full);
  overflow: hidden;
}

.lg-segmented-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 48px;
  height: 40px;
  padding: 0 16px;
  background: transparent;
  border: none;
  border-right: 1px solid var(--m3-color-outline);
  font-size: var(--m3-label-large-size);
  font-weight: 500;
  color: var(--m3-color-on-surface);
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-segmented-button:last-child {
  border-right: none;
}

.lg-segmented-button:hover {
  background: var(--m3-color-surface-container);
}

.lg-segmented-button--selected {
  background: var(--m3-color-secondary-container);
  color: var(--m3-color-on-secondary-container);
}
```

---

### 20. Checkboxes

```css
.lg-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--m3-color-on-surface-variant);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-checkbox--checked {
  background: var(--m3-color-primary);
  border-color: var(--m3-color-primary);
}

.lg-checkbox__icon {
  width: 14px;
  height: 14px;
  color: var(--m3-color-on-primary);
  opacity: 0;
  transform: scale(0.5);
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-checkbox--checked .lg-checkbox__icon {
  opacity: 1;
  transform: scale(1);
}
```

---

### 21. Radio Buttons

```css
.lg-radio {
  width: 20px;
  height: 20px;
  border: 2px solid var(--m3-color-on-surface-variant);
  border-radius: var(--m3-shape-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-radio--selected {
  border-color: var(--m3-color-primary);
}

.lg-radio__dot {
  width: 10px;
  height: 10px;
  background: var(--m3-color-primary);
  border-radius: var(--m3-shape-full);
  opacity: 0;
  transform: scale(0);
  transition: all var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
}

.lg-radio--selected .lg-radio__dot {
  opacity: 1;
  transform: scale(1);
}
```

---

### 22. Dividers

```css
.lg-divider {
  height: 1px;
  background: var(--m3-color-outline-variant);
}

.lg-divider--inset {
  margin-left: 16px;
}

.lg-divider--middle-inset {
  margin: 0 16px;
}

.lg-divider--vertical {
  width: 1px;
  height: auto;
  align-self: stretch;
}
```

---

### 23. Bottom Sheets

```css
.lg-bottom-sheet-scrim {
  position: fixed;
  inset: 0;
  background: var(--m3-color-scrim);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--m3-motion-duration-medium) var(--m3-motion-easing-standard);
  z-index: 80;
}

.lg-bottom-sheet-scrim--open {
  opacity: 1;
  pointer-events: auto;
}

.lg-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-light);
  border-bottom: none;
  border-radius: var(--m3-shape-extra-large) var(--m3-shape-extra-large) 0 0;
  transform: translateY(100%);
  transition: transform var(--m3-motion-duration-medium) var(--m3-motion-easing-emphasized);
  z-index: 81;
}

.lg-bottom-sheet--open {
  transform: translateY(0);
}

.lg-bottom-sheet__handle {
  width: 32px;
  height: 4px;
  background: var(--m3-color-outline-variant);
  border-radius: var(--m3-shape-full);
  margin: 16px auto;
}

.lg-bottom-sheet__content {
  padding: 0 24px 24px;
  max-height: calc(90vh - 56px);
  overflow-y: auto;
}
```

---

### 24. Side Sheets

```css
.lg-side-sheet {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 100vw;
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur-strong));
  border-left: 1px solid var(--glass-border-medium);
  transform: translateX(100%);
  transition: transform var(--m3-motion-duration-medium) var(--m3-motion-easing-emphasized);
  z-index: 70;
}

.lg-side-sheet--open {
  transform: translateX(0);
}

.lg-side-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--m3-color-outline-variant);
}

.lg-side-sheet__content {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 72px);
}
```

---

## State Layers (Interaction States)

M3 uses state layers to indicate interaction states. Apply these with pseudo-elements:

```css
/* State layer base */
.lg-state-layer {
  position: relative;
  overflow: hidden;
}

.lg-state-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity var(--m3-motion-duration-short) var(--m3-motion-easing-standard);
  pointer-events: none;
}

/* Hover: 8% opacity */
.lg-state-layer:hover::before {
  opacity: 0.08;
}

/* Focus: 10% opacity */
.lg-state-layer:focus-visible::before {
  opacity: 0.1;
}

/* Pressed: 10% opacity */
.lg-state-layer:active::before {
  opacity: 0.1;
}

/* Dragged: 16% opacity */
.lg-state-layer--dragged::before {
  opacity: 0.16;
}

/* Disabled state */
.lg-disabled {
  opacity: 0.38;
  pointer-events: none;
}
```

---

## Utility Classes

```css
/* Glass surfaces */
.lg-glass {
  background: var(--glass-tint-light);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-medium);
}

.lg-glass-subtle {
  background: var(--glass-tint-subtle);
  backdrop-filter: blur(var(--glass-blur-subtle));
  border: 1px solid var(--glass-border-subtle);
}

.lg-glass-strong {
  background: var(--glass-tint-medium);
  backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-light);
}

/* Shape */
.lg-shape-small { border-radius: var(--m3-shape-small); }
.lg-shape-medium { border-radius: var(--m3-shape-medium); }
.lg-shape-large { border-radius: var(--m3-shape-large); }
.lg-shape-full { border-radius: var(--m3-shape-full); }

/* Elevation */
.lg-elevation-1 { box-shadow: var(--m3-elevation-1); }
.lg-elevation-2 { box-shadow: var(--m3-elevation-2); }
.lg-elevation-3 { box-shadow: var(--m3-elevation-3); }
```

---

## Browser Fallback

```css
@supports not (backdrop-filter: blur(10px)) {
  .lg-glass, .lg-glass-subtle, .lg-glass-strong {
    background: rgba(255, 255, 255, 0.95);
  }
  
  [data-theme="dark"] .lg-glass {
    background: rgba(30, 27, 35, 0.95);
  }
}
```

---

## M3 Motion System

Material 3 motion creates a consistent, expressive, and responsive feel across all interactions.

### Easing Curves

```css
:root {
  /* Standard easing - most transitions */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --ease-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
  
  /* Emphasized easing - important transitions */
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
}
```

### Duration Tokens

| Token | Duration | Use Case |
|-------|----------|----------|
| `--animate-duration-short` | 150ms | Micro-interactions, hover states |
| `--animate-duration-medium` | 300ms | Standard transitions, reveals |
| `--animate-duration-long` | 450ms | Complex animations, modal entry |
| `--animate-duration-extra-long` | 600ms | Page transitions, hero animations |

### Animation Keyframes

Available keyframe animations:

- `m3-fade-in` / `m3-fade-out` - Opacity transitions
- `m3-scale-up` / `m3-scale-down` - Scale with opacity
- `m3-slide-in-up` / `m3-slide-in-down` - Vertical slides
- `m3-slide-in-left` / `m3-slide-in-right` - Horizontal slides
- `m3-ripple` - Material ripple effect
- `m3-pulse` - Continuous pulse
- `m3-shimmer` - Loading shimmer
- `m3-spin` - Continuous rotation
- `m3-bounce` - Bouncing effect
- `m3-shake` - Attention shake
- `m3-float` - Subtle floating

### Animation Utility Classes

```html
<!-- Entrance animations -->
<div class="animate-fade-in">Fades in</div>
<div class="animate-scale-up">Scales up with fade</div>
<div class="animate-slide-up">Slides up</div>
<div class="animate-slide-down">Slides down</div>
<div class="animate-slide-left">Slides from left</div>
<div class="animate-slide-right">Slides from right</div>

<!-- Continuous animations -->
<div class="animate-spin">Loading spinner</div>
<div class="animate-pulse">Pulsing element</div>
<div class="animate-bounce">Bouncing indicator</div>
<div class="animate-float">Floating element</div>
<div class="animate-shimmer">Loading skeleton</div>

<!-- Staggered animations with delays -->
<div class="animate-fade-in delay-100">First</div>
<div class="animate-fade-in delay-200">Second</div>
<div class="animate-fade-in delay-300">Third</div>

<!-- Duration modifiers -->
<div class="animate-fade-in duration-short">Fast</div>
<div class="animate-fade-in duration-long">Slow</div>

<!-- M3 transition classes -->
<button class="transition-m3">Standard transition</button>
<button class="transition-m3-fast">Quick interaction</button>
<button class="transition-m3-slow">Emphasized transition</button>
```

### Ripple Effect

```html
<button class="lg-button--filled ripple">
  Click for ripple
</button>
```

---

## Theme Color Presets

The design system supports 4 color themes that can be switched via the `data-theme` attribute on the `<html>` element.

### Available Themes

| Theme | Primary | Secondary | Best For |
|-------|---------|-----------|----------|
| **Purple** (default) | `#5B5FED` | `#8E33FF` | Creative, modern apps |
| **Blue** | `#2563EB` | `#06B6D4` | Corporate, trust-focused |
| **Green** | `#10B981` | `#14B8A6` | Finance, eco, health apps |
| **Rose** | `#F43F5E` | `#EC4899` | Fashion, lifestyle, social |

### Usage

```html
<!-- Default purple theme -->
<html>

<!-- Blue theme -->
<html data-theme="blue">

<!-- Green theme -->
<html data-theme="green">

<!-- Rose theme -->
<html data-theme="rose">
```

### Theme Switching with JavaScript

```javascript
// Set theme
document.documentElement.setAttribute('data-theme', 'blue');

// Get current theme
const theme = document.documentElement.getAttribute('data-theme') || 'purple';

// Toggle between themes
const themes = ['purple', 'blue', 'green', 'rose'];
let currentIndex = themes.indexOf(theme);
const nextTheme = themes[(currentIndex + 1) % themes.length];
document.documentElement.setAttribute('data-theme', nextTheme);
```

### Color Variables Reference

All components automatically use these theme-aware variables:

```css
/* Primary colors */
--color-primary        /* Main brand color */
--color-primary-dark   /* Hover/active state */
--color-primary-light  /* Backgrounds, tints */
--color-on-primary     /* Text on primary */

/* Secondary colors */
--color-secondary
--color-secondary-dark
--color-secondary-light

/* Tertiary colors */
--color-tertiary
--color-tertiary-dark
--color-tertiary-light

/* Semantic colors */
--color-success / --color-warning / --color-error / --color-info
```

---

## Implementation Checklist

- [ ] Include CSS variables in global styles
- [ ] Import fonts (Google Sans or Inter fallback)
- [ ] Apply glass only to floating elements (not all surfaces)
- [ ] Ensure accessibility contrast ratios
- [ ] Test blur performance on target devices
- [ ] Provide fallbacks for unsupported browsers
- [ ] Use M3 motion tokens for animations
- [ ] Follow 4px spacing grid

---

## Resources

### M3 Components
- [All Components Overview](https://m3.material.io/components)
- [App Bars (Top)](https://m3.material.io/components/app-bars/overview)
- [Bottom App Bar](https://m3.material.io/components/bottom-app-bar/overview)
- [Badges](https://m3.material.io/components/badges/overview)
- [Bottom Sheets](https://m3.material.io/components/bottom-sheets/overview)
- [Buttons](https://m3.material.io/components/buttons/overview)
- [Cards](https://m3.material.io/components/cards/overview)
- [Checkboxes](https://m3.material.io/components/checkbox/overview)
- [Chips](https://m3.material.io/components/chips/overview)
- [Dialogs](https://m3.material.io/components/dialogs/overview)
- [Dividers](https://m3.material.io/components/divider/overview)
- [FABs](https://m3.material.io/components/floating-action-button/overview)
- [Icon Buttons](https://m3.material.io/components/icon-buttons/overview)
- [Lists](https://m3.material.io/components/lists/overview)
- [Menus](https://m3.material.io/components/menus/overview)
- [Navigation Bar](https://m3.material.io/components/navigation-bar/overview)
- [Navigation Drawer](https://m3.material.io/components/navigation-drawer/overview)
- [Navigation Rail](https://m3.material.io/components/navigation-rail/overview)
- [Progress Indicators](https://m3.material.io/components/progress-indicators/overview)
- [Radio Buttons](https://m3.material.io/components/radio-button/overview)
- [Search](https://m3.material.io/components/search/overview)
- [Segmented Buttons](https://m3.material.io/components/segmented-buttons/overview)
- [Side Sheets](https://m3.material.io/components/side-sheets/overview)
- [Sliders](https://m3.material.io/components/sliders/overview)
- [Snackbar](https://m3.material.io/components/snackbar/overview)
- [Switch](https://m3.material.io/components/switch/overview)
- [Tabs](https://m3.material.io/components/tabs/overview)
- [Text Fields](https://m3.material.io/components/text-fields/overview)
- [Tooltips](https://m3.material.io/components/tooltips/overview)

### M3 Foundations
- [Color System](https://m3.material.io/styles/color/overview)
- [Typography](https://m3.material.io/styles/typography/overview)
- [Elevation](https://m3.material.io/styles/elevation/overview)
- [Shape](https://m3.material.io/styles/shape/overview)
- [Motion](https://m3.material.io/styles/motion/overview)
- [Icons](https://m3.material.io/styles/icons/overview)

### M3 Guidelines
- [Accessibility](https://m3.material.io/foundations/accessible-design/overview)
- [Interaction States](https://m3.material.io/foundations/interaction/states/overview)
- [Responsive Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
