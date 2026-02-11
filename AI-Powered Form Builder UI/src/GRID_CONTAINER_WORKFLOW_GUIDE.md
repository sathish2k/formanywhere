# Complete Grid Container & Nesting Workflow Guide

## ✅ How Containers Are Created & Used

### **Understanding the System**

The form builder now supports **two types of grid systems:**

1. **Legacy 2/3-Column Containers** (Section/Card with column1Children, column2Children, column3Children)
2. **NEW Multi-Row Grid System** (Grid Container with rows array structure)

---

## 🎯 **NEW Grid Container Workflow**

### **Step 1: Create a Grid**

**Option A: Empty Canvas**
- When canvas is empty, you see "Create Grid Layout" button
- Click it → Choose 1, 2, or 3 columns
- Grid is created with responsive breakpoints

**Option B: Existing Elements**
- Click "Add Grid" button at bottom
- Choose column count
- New grid added below existing elements

**Result:**
```typescript
{
  id: 'grid-container-123',
  type: 'grid-container',
  rows: [
    [
      { id: 'col-1', type: 'grid-column', children: [] },
      { id: 'col-2', type: 'grid-column', children: [] }
    ]
  ]
}
```

---

### **Step 2: Add Elements to Grid Columns**

**✅ NOW WORKING! Drag & Drop into Columns**

1. **Drag ANY element** from left sidebar
2. **Drop into a grid column** (the dashed border area that says "Drop elements here")
3. Element is added to that column's `children` array

**What you can drop into columns:**
- ✅ Form fields (Short Text, Email, Number, etc.)
- ✅ Containers (Section, Card)
- ✅ Layout elements (Heading, Divider, Spacer, Logo, Text Block)
- ✅ Even MORE grids (nested grids!)

**Example:**
```typescript
{
  rows: [
    [
      {
        id: 'col-1',
        type: 'grid-column',
        children: [
          { type: 'short-text', label: 'First Name' },
          { type: 'email', label: 'Email Address' }
        ]
      },
      {
        id: 'col-2',
        type: 'grid-column',
        children: [
          { type: 'section', label: 'Address', children: [...] }
        ]
      }
    ]
  ]
}
```

---

### **Step 3: Manage Multi-Row Grids**

**Add New Row:**
1. Click ⋮ icon in grid header
2. Select "Add Row"
3. New row created with same column count as first row

**Add Column to Specific Row:**
1. Click ⋮ icon next to row label (e.g., "Row 1")
2. Select "Add Column"
3. New column added to THAT row only

**Delete Row:**
1. Click ⋮ icon next to row label
2. Select "Delete Row" (red text)
3. Row removed
4. If last row → entire grid deleted

**Result: Independent Row Structures**
```typescript
{
  rows: [
    // Row 1: 2 columns
    [
      { id: 'col-1', children: [...] },
      { id: 'col-2', children: [...] }
    ],
    // Row 2: 3 columns
    [
      { id: 'col-3', children: [...] },
      { id: 'col-4', children: [...] },
      { id: 'col-5', children: [...] }
    ]
  ]
}
```

---

### **Step 4: Configure Responsive Breakpoints**

**Adjust Column Width:**
1. Click the red badge (e.g., "6/12") on a column
2. Popover opens with 5 breakpoint tabs: XS, SM, MD, LG, XL
3. Click a breakpoint tab
4. Select width (1-12)
5. Column width updates for that breakpoint

**Example Responsive Config:**
```typescript
{
  gridItemXs: 12,  // Mobile: full width
  gridItemSm: 6,   // Tablet: half width
  gridItemMd: 4,   // Desktop: 1/3 width
  gridItemLg: 3,   // Large: 1/4 width
  gridItemXl: 2    // Extra large: 1/6 width
}
```

---

### **Step 5: Adjust Grid Container Properties**

**When grid container is selected:**
- Right panel shows GridPropertiesPanel
- Three accordions:
  1. **Basic Settings** - Grid columns (12/16/24), spacing
  2. **Layout & Direction** - Direction, wrapping
  3. **Alignment** - Justify, align items, align content

**Properties:**
- `gridColumns`: 12, 16, or 24 column system
- `gridSpacing`: Uniform spacing (0-10)
- `gridRowSpacing`: Vertical spacing
- `gridColumnSpacing`: Horizontal spacing
- `gridDirection`: row | column | row-reverse | column-reverse
- `gridWrap`: wrap | nowrap | wrap-reverse
- `gridJustifyContent`: flex-start | center | flex-end | space-between | etc.
- `gridAlignItems`: flex-start | center | flex-end | stretch | baseline
- `gridAlignContent`: flex-start | center | flex-end | space-between | etc.

---

## 🏗️ **Nesting Capabilities**

### **What Can Be Nested:**

1. **Grid Columns → Form Fields**
   ```
   Grid Column
   └── Short Text Input
   └── Email Input
   └── Number Input
   ```

2. **Grid Columns → Containers → Form Fields**
   ```
   Grid Column
   └── Section Container
       └── Short Text Input
       └── Long Text Input
   ```

3. **Grid Columns → Nested Grids**
   ```
   Grid Column
   └── Grid Container
       └── Row 1
           └── Column 1: Input
           └── Column 2: Input
   ```

4. **Grid Columns → Mixed Elements**
   ```
   Grid Column
   └── Heading
   └── Divider
   └── Card Container
       └── Form inputs
   └── Spacer
   ```

---

## 📐 **Complete Example: Multi-Row Form**

```typescript
// Responsive contact form with address section
{
  type: 'grid-container',
  gridColumns: 12,
  gridSpacing: 3,
  gridDirection: 'row',
  gridWrap: 'wrap',
  rows: [
    // Row 1: Personal Info (2 columns)
    [
      {
        id: 'col-1',
        type: 'grid-column',
        gridItemXs: 12,
        gridItemMd: 6,
        children: [
          { type: 'short-text', label: 'First Name', required: true },
          { type: 'email', label: 'Email', required: true }
        ]
      },
      {
        id: 'col-2',
        type: 'grid-column',
        gridItemXs: 12,
        gridItemMd: 6,
        children: [
          { type: 'short-text', label: 'Last Name', required: true },
          { type: 'short-text', label: 'Phone' }
        ]
      }
    ],
    
    // Row 2: Address (1 full-width column with nested section)
    [
      {
        id: 'col-3',
        type: 'grid-column',
        gridItemXs: 12,
        children: [
          {
            type: 'section',
            label: 'Address Information',
            children: [
              { type: 'long-text', label: 'Street Address' },
              { type: 'short-text', label: 'City' },
              { type: 'dropdown', label: 'State' }
            ]
          }
        ]
      }
    ],
    
    // Row 3: Submit (1 centered column)
    [
      {
        id: 'col-4',
        type: 'grid-column',
        gridItemXs: 12,
        gridItemMd: 6,
        children: [
          { type: 'button', label: 'Submit Application' }
        ]
      }
    ]
  ]
}
```

---

## 🎨 **Visual Workflow**

```
┌─────────────────────────────────────────────────┐
│  Grid Layout                         ⋮ 🗑       │ ← Grid header menu
├─────────────────────────────────────────────────┤
│  Row 1  ⋮                                       │ ← Row menu (Add Column/Delete Row)
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Column 1         │  │ Column 2         │    │
│  │ [6/12] 🗑        │  │ [6/12] 🗑        │    │ ← Column width badge & delete
│  ├──────────────────┤  ├──────────────────┤    │
│  │                  │  │                  │    │
│  │ Drop elements    │  │ ✓ Short Text     │    │ ← Drop zone & nested elements
│  │ here             │  │ ✓ Email Input    │    │
│  │                  │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
├─────────────────────────────────────────────────┤
│  Row 2  ⋮                                       │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Column 3         │  │ Column 4         │    │
│  │ [4/12] 🗑        │  │ [8/12] 🗑        │    │
│  └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## 🚀 **Key Implementation Details**

### **How Drag & Drop Works:**

1. **GridColumnElement** has `onDragOver` and `onDropInside` handlers
2. When element dropped → `handleDropInside(e, columnId)` called
3. Handler searches grid rows for matching column
4. Adds element to that column's `children` array
5. Re-renders with new element

### **How Updates Work:**

1. **handleUpdateElement** recursively searches:
   - Regular `children` arrays
   - Grid container `rows` arrays
   - Column children within rows
2. Updates element properties (width, label, validation, etc.)
3. Entire structure re-renders

### **How Delete Works:**

1. **Column delete:** Remove column from row, auto-cleanup empty rows
2. **Row delete:** Remove row at index, auto-delete grid if last row
3. **Nested element delete:** Search rows → find column → remove from children

---

## ✅ **What's Working:**

✅ Grid creation (1, 2, 3 columns)  
✅ Multi-row grids  
✅ Independent column counts per row  
✅ Drag & drop INTO grid columns  
✅ Responsive breakpoints (XS-XL)  
✅ Grid properties panel  
✅ Row-level menus (Add Column, Delete Row)  
✅ Column width adjustment  
✅ Nested containers inside columns  
✅ Full CRUD operations  
✅ Auto-cleanup empty rows  

---

## 🎯 **User Journey:**

1. **Start:** Click "Create Grid Layout" → Choose 2 columns
2. **Add Content:** Drag "Short Text" → Drop in Column 1
3. **Add More:** Drag "Email" → Drop in Column 1
4. **Configure:** Click "6/12" badge → Change to "4/12"
5. **Expand:** Click Row 1 ⋮ → "Add Column" → Now 3 columns
6. **Grow:** Click Grid ⋮ → "Add Row" → Two-row grid
7. **Organize:** Click Row 2 ⋮ → "Add Column" → Row 2 has different layout
8. **Nest:** Drag "Section" → Drop in Column 2 → Drag form fields into Section
9. **Responsive:** Adjust breakpoints for mobile/tablet/desktop
10. **Clean:** Click Row ⋮ → "Delete Row" → Row removed

**The entire system is now fully functional with proper drag-and-drop nesting!** 🎉
