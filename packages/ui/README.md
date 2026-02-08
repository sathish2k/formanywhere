# FormAnywhere UI Components

> **M3 Liquid Glass Design System** — Material 3 principles + Apple's glassmorphism aesthetic

## Installation

```bash
bun add @formanywhere/ui
```

## Usage

```tsx
import { Button, Card, Typography, Chip, Box, Avatar } from '@formanywhere/ui';
```

---

## 📦 Components

### Layout

| Component | Description | Import |
|-----------|-------------|--------|
| `Box` | Generic container with spacing/styling | `@formanywhere/ui/box` |
| `Card` | Surface container with variants | `@formanywhere/ui/card` |

### Typography

| Component | Description | Import |
|-----------|-------------|--------|
| `Typography` | Text rendering with M3 scales | `@formanywhere/ui/typography` |

### Actions

| Component | Description | Import |
|-----------|-------------|--------|
| `Button` | Primary action button | `@formanywhere/ui/button` |
| `IconButton` | Icon-only button | `@formanywhere/ui/icon-button` |

### Data Display

| Component | Description | Import |
|-----------|-------------|--------|
| `Chip` | Compact labels/tags | `@formanywhere/ui/chip` |
| `Badge` | Notification indicators | `@formanywhere/ui/badge` |
| `Avatar` | User/item images | `@formanywhere/ui/avatar` |
| `Tag` | Category labels | `@formanywhere/ui/tag` |

### Navigation

| Component | Description | Import |
|-----------|-------------|--------|
| `TopAppBar` | App header bar | `@formanywhere/ui/top-app-bar` |

---

## 🎨 Design Tokens

All components use M3 CSS custom properties:

```css
/* Colors */
--m3-color-primary
--m3-color-on-primary
--m3-color-secondary
--m3-color-surface
--m3-color-on-surface
--m3-color-outline

/* Elevation */
--m3-elevation-1
--m3-elevation-2
--m3-elevation-3

/* Shape */
--m3-shape-corner-small   /* 4px */
--m3-shape-corner-medium  /* 8px */
--m3-shape-corner-large   /* 16px */
--m3-shape-corner-full    /* 9999px */
```

---

## 📖 Component API

### Button

```tsx
<Button
  variant="filled" | "tonal" | "outlined" | "text" | "ghost" | "glass"
  size="sm" | "md" | "lg"
  disabled={boolean}
  onClick={handler}
>
  Label
</Button>
```

### Card

```tsx
<Card
  variant="elevated" | "filled" | "outlined" | "glass" | "glass-strong" | "glass-subtle"
  clickable={boolean}
  padding="none" | "xs" | "sm" | "md" | "lg" | "xl"
>
  Content
</Card>
```

### Typography

```tsx
<Typography
  variant="display-large" | "display-medium" | "display-small" |
          "headline-large" | "headline-medium" | "headline-small" |
          "title-large" | "title-medium" | "title-small" |
          "body-large" | "body-medium" | "body-small" |
          "label-large" | "label-medium" | "label-small"
  color="on-surface" | "on-surface-variant" | "primary" | "secondary"
  align="left" | "center" | "right"
>
  Text content
</Typography>
```

### Box

```tsx
<Box
  padding="none" | "xs" | "sm" | "md" | "lg" | "xl"
  margin="none" | "xs" | "sm" | "md" | "lg" | "xl" | "auto"
  bg="surface" | "surface-variant" | "primary" | "secondary" | "transparent"
  rounded="none" | "sm" | "md" | "lg" | "xl" | "full"
  display="block" | "flex" | "grid" | "inline-flex"
  as="div" | "section" | "article" | "main" | "nav"
>
  Content
</Box>
```

### Chip

```tsx
<Chip
  variant="assist" | "filter" | "input" | "suggestion" | "label"
  selected={boolean}
  onClose={handler}
  icon={<Icon />}
>
  Label
</Chip>
```

### Avatar

```tsx
<Avatar
  src="/path/to/image.jpg"
  alt="User name"
  initials="JD"
  size="xs" | "sm" | "md" | "lg" | "xl"
  variant="circular" | "rounded" | "square"
/>
```

---

## 🧩 Examples

### Feature Card

```tsx
<Card variant="glass-strong" padding="lg">
  <Box display="flex" style={{ gap: '1rem', 'align-items': 'center' }}>
    <Avatar initials="AI" size="md" />
    <Box>
      <Typography variant="title-medium">AI Generation</Typography>
      <Typography variant="body-small" color="on-surface-variant">
        Build forms with natural language
      </Typography>
    </Box>
  </Box>
  <Button variant="tonal" style={{ 'margin-top': '1rem' }}>
    Try it now
  </Button>
</Card>
```

### Header with Chips

```tsx
<Box display="flex" style={{ gap: '0.5rem', 'flex-wrap': 'wrap' }}>
  <Chip variant="label" label="New" selected />
  <Chip variant="label" label="Offline" />
  <Chip variant="label" label="AI Powered" />
</Box>
<Typography variant="display-medium">
  Build Forms That Work Anywhere
</Typography>
```

---

## 📚 Related

- [Design Tokens Reference](./TOKENS.md)
- [Contributing to UI](../docs/CONTRIBUTING.md)
- [Figma Designs](https://figma.com/formanywhere) *(coming soon)*
