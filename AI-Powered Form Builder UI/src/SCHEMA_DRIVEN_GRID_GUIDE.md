# Schema-Driven Grid System Guide

## 📐 MUI-Native Grid Schema

This form builder now supports a **schema-driven grid system** that follows Material-UI's native Grid structure with built-in validation.

---

## ✅ Valid Schema Structure

```json
{
  "type": "container",
  "maxWidth": "md",
  "children": [
    {
      "type": "grid-container",
      "container": true,
      "spacing": 2,
      "children": [
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12, "md": 6 },
          "children": [
            { "type": "short-text", "name": "firstName", "label": "First Name" }
          ]
        },
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12, "md": 6 },
          "children": [
            { "type": "short-text", "name": "lastName", "label": "Last Name" }
          ]
        },
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12 },
          "children": [
            { "type": "email", "name": "email", "label": "Email" }
          ]
        }
      ]
    }
  ]
}
```

---

## 🎯 Element Types

### **1. Container** (`type: "container"`)
- **Purpose:** MUI Container wrapper with maxWidth constraints
- **Properties:**
  - `maxWidth`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  - `children`: Array of child elements

**Example:**
```json
{
  "type": "container",
  "maxWidth": "lg",
  "children": [...]
}
```

---

### **2. Grid Container** (`type": "grid-container"`)
- **Purpose:** MUI Grid with `container: true`
- **Properties:**
  - `container`: true (required)
  - `spacing`: 0-10 (uniform spacing)
  - `children`: Array of grid items

**Example:**
```json
{
  "type": "grid-container",
  "container": true,
  "spacing": 3,
  "children": [...]
}
```

---

### **3. Grid Item** (`type: "grid-item"`)
- **Purpose:** MUI Grid with `item: true`
- **Properties:**
  - `item`: true (required)
  - `cols`: Responsive breakpoint configuration
    - `xs`: 0-12 columns
    - `sm`: 0-12 columns
    - `md`: 0-12 columns
    - `lg`: 0-12 columns
    - `xl`: 0-12 columns
  - `children`: Array of child elements (fields, containers, etc.)

**Example:**
```json
{
  "type": "grid-item",
  "item": true,
  "cols": {
    "xs": 12,
    "sm": 6,
    "md": 4,
    "lg": 3,
    "xl": 2
  },
  "children": [...]
}
```

---

## ✅ Validation Rules

### **Rule 1: Grid Item Must Have Container Parent**
❌ **Invalid:**
```json
{
  "type": "grid-item",
  "item": true,
  "cols": { "xs": 12 }
}
```

✅ **Valid:**
```json
{
  "type": "grid-container",
  "container": true,
  "children": [
    {
      "type": "grid-item",
      "item": true,
      "cols": { "xs": 12 }
    }
  ]
}
```

---

### **Rule 2: Total Columns ≤ 12 Per Row**
❌ **Invalid:**
```json
{
  "type": "grid-container",
  "container": true,
  "children": [
    { "type": "grid-item", "item": true, "cols": { "md": 8 } },
    { "type": "grid-item", "item": true, "cols": { "md": 6 } }
  ]
}
```
Total at MD breakpoint: 8 + 6 = 14 > 12 ❌

✅ **Valid:**
```json
{
  "type": "grid-container",
  "container": true,
  "children": [
    { "type": "grid-item", "item": true, "cols": { "md": 6 } },
    { "type": "grid-item", "item": true, "cols": { "md": 6 } }
  ]
}
```
Total at MD breakpoint: 6 + 6 = 12 ✅

---

### **Rule 3: No Arbitrary CSS Layout**
❌ **Invalid:**
```json
{
  "type": "grid-item",
  "item": true,
  "customStyle": "display: flex; position: absolute;"
}
```

✅ **Valid:** Use MUI Grid props only
```json
{
  "type": "grid-container",
  "container": true,
  "gridJustifyContent": "center",
  "gridAlignItems": "center"
}
```

---

### **Rule 4: Spacing Via MUI Props Only**
❌ **Invalid:**
```json
{
  "customStyle": "margin: 20px; padding: 15px;"
}
```

✅ **Valid:**
```json
{
  "type": "grid-container",
  "container": true,
  "spacing": 2
}
```

---

## 🏗️ Common Patterns

### **Pattern 1: Two-Column Form**
```json
{
  "type": "container",
  "maxWidth": "md",
  "children": [
    {
      "type": "grid-container",
      "container": true,
      "spacing": 2,
      "children": [
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12, "md": 6 },
          "children": [{ "type": "short-text", "name": "firstName" }]
        },
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12, "md": 6 },
          "children": [{ "type": "short-text", "name": "lastName" }]
        }
      ]
    }
  ]
}
```

**Result:**
- Mobile (XS): Stacked (12 columns each)
- Desktop (MD+): Side-by-side (6 columns each)

---

### **Pattern 2: Responsive Three-Column Layout**
```json
{
  "type": "grid-container",
  "container": true,
  "spacing": 3,
  "children": [
    {
      "type": "grid-item",
      "item": true,
      "cols": { "xs": 12, "sm": 6, "md": 4 },
      "children": [{ "type": "short-text", "name": "field1" }]
    },
    {
      "type": "grid-item",
      "item": true,
      "cols": { "xs": 12, "sm": 6, "md": 4 },
      "children": [{ "type": "short-text", "name": "field2" }]
    },
    {
      "type": "grid-item",
      "item": true,
      "cols": { "xs": 12, "sm": 12, "md": 4 },
      "children": [{ "type": "short-text", "name": "field3" }]
    }
  ]
}
```

**Result:**
- Mobile (XS): Stacked (12 columns each)
- Tablet (SM): 2 columns (6+6), then full width (12)
- Desktop (MD+): 3 columns (4+4+4)

---

### **Pattern 3: Nested Containers**
```json
{
  "type": "container",
  "maxWidth": "lg",
  "children": [
    {
      "type": "grid-container",
      "container": true,
      "spacing": 2,
      "children": [
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12, "md": 8 },
          "children": [
            {
              "type": "grid-container",
              "container": true,
              "spacing": 1,
              "children": [
                {
                  "type": "grid-item",
                  "item": true,
                  "cols": { "xs": 12, "md": 6 },
                  "children": [{ "type": "short-text", "name": "nestedField1" }]
                },
                {
                  "type": "grid-item",
                  "item": true,
                  "cols": { "xs": 12, "md": 6 },
                  "children": [{ "type": "short-text", "name": "nestedField2" }]
                }
              ]
            }
          ]
        },
        {
          "type": "grid-item",
          "item": true,
          "cols": { "xs": 12, "md": 4 },
          "children": [{ "type": "long-text", "name": "sidebar" }]
        }
      ]
    }
  ]
}
```

**Result:** Main content (8 cols) with nested 2-column grid + Sidebar (4 cols)

---

## 🎨 Visual Representation

```
┌──────────────────────────────────────────────────────┐
│  Container (maxWidth: md)                            │
│  ┌────────────────────────────────────────────────┐  │
│  │  Grid Container (spacing: 2)                   │  │
│  │  ┌─────────────────┐  ┌─────────────────┐     │  │
│  │  │ Grid Item       │  │ Grid Item       │     │  │
│  │  │ xs: 12, md: 6   │  │ xs: 12, md: 6   │     │  │
│  │  │ ┌─────────────┐ │  │ ┌─────────────┐ │     │  │
│  │  │ │ Short Text  │ │  │ │ Short Text  │ │     │  │
│  │  │ │ firstName   │ │  │ │ lastName    │ │     │  │
│  │  │ └─────────────┘ │  │ └─────────────┘ │     │  │
│  │  └─────────────────┘  └─────────────────┘     │  │
│  │  ┌──────────────────────────────────────┐     │  │
│  │  │ Grid Item (xs: 12)                   │     │  │
│  │  │ ┌──────────────────────────────────┐ │     │  │
│  │  │ │ Email                            │ │     │  │
│  │  │ └──────────────────────────────────┘ │     │  │
│  │  └──────────────────────────────────────┘     │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 Utility Functions

### **Validate Schema**
```typescript
import { validateGridStructure } from './utils/grid-schema.utils';

const result = validateGridStructure(element);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### **Create Grid Container**
```typescript
import { createGridContainer } from './utils/grid-schema.utils';

const grid = createGridContainer(3); // spacing: 3
```

### **Auto-Calculate Columns**
```typescript
import { autoCalculateGridCols } from './utils/grid-schema.utils';

const cols = autoCalculateGridCols(3); // Returns config for 3 items
// [
//   { xs: 12, md: 4 },
//   { xs: 12, md: 4 },
//   { xs: 12, md: 4 }
// ]
```

### **Export Schema JSON**
```typescript
import { exportSchemaJson } from './utils/grid-schema.utils';

const json = exportSchemaJson(element);
console.log(JSON.stringify(json, null, 2));
```

---

## 🎯 Migration from Legacy Grid

### **Legacy Structure:**
```typescript
{
  type: 'grid-container',
  rows: [
    [
      { type: 'grid-column', gridItemXs: 12, gridItemMd: 6, children: [...] },
      { type: 'grid-column', gridItemXs: 12, gridItemMd: 6, children: [...] }
    ]
  ]
}
```

### **New Schema:**
```typescript
{
  type: 'grid-container',
  container: true,
  spacing: 2,
  children: [
    { type: 'grid-item', item: true, cols: { xs: 12, md: 6 }, children: [...] },
    { type: 'grid-item', item: true, cols: { xs: 12, md: 6 }, children: [...] }
  ]
}
```

### **Auto-Convert:**
```typescript
import { convertLegacyGrid } from './utils/grid-schema.utils';

const newGrid = convertLegacyGrid(legacyGrid);
```

---

## 🚀 Benefits

1. **MUI-Native:** Directly maps to Material-UI Grid API
2. **Type-Safe:** Full TypeScript support with validation
3. **Responsive:** Built-in breakpoint system (XS, SM, MD, LG, XL)
4. **Validated:** Real-time validation prevents invalid structures
5. **Clean Schema:** No arbitrary CSS, pure MUI props
6. **Nested Support:** Unlimited nesting of containers and grids
7. **Export/Import:** Easy JSON schema export

---

## ✅ Summary

**Valid:**
- Container → Grid Container → Grid Items → Fields
- Spacing via MUI `spacing` prop
- Responsive via `cols` object
- Alignment via MUI Grid props

**Invalid:**
- Grid items without container
- Columns > 12 per row
- Arbitrary CSS (flex, absolute positioning)
- Manual margin/padding (use spacing instead)

This schema-driven approach ensures **clean, maintainable, and MUI-compliant** form layouts! 🎉
