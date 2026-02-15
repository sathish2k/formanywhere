# FormAnywhere — Schema Reference

> Canonical specification for the **FormSchema** data model that powers every form across the editor, runtime renderer, storage layer, and API.

---

## Table of Contents

- [Overview](#overview)
- [Schema Tree](#schema-tree)
- [Core Types](#core-types)
  - [FormSchema](#formschema)
  - [FormElement](#formelement)
  - [FormElementType](#formelementtype)
  - [ValidationRule](#validationrule)
  - [ConditionalRule](#conditionalrule)
  - [FormSettings](#formsettings)
  - [FormPage](#formpage)
  - [FormSubmission](#formsubmission)
- [Rule Engine Types](#rule-engine-types)
  - [RuleCondition](#rulecondition)
  - [RuleAction](#ruleaction)
  - [FormRule](#formrule)
- [Element Categories](#element-categories)
  - [Layout Elements](#layout-elements)
  - [Text Input Elements](#text-input-elements)
  - [Choice Elements](#choice-elements)
  - [Date & Time Elements](#date--time-elements)
  - [Advanced Elements](#advanced-elements)
- [Nesting & Recursive Structure](#nesting--recursive-structure)
- [Validation Pipeline](#validation-pipeline)
  - [Schema-Level Validation](#schema-level-validation)
  - [Field-Level Validation](#field-level-validation)
  - [Runtime Zod Integration](#runtime-zod-integration)
- [Conditional Logic](#conditional-logic)
- [Zod Schema Generation](#zod-schema-generation)
- [API Functions](#api-functions)
  - [form-editor: engine/schema](#form-editor-engineschema)
  - [form-runtime: validators](#form-runtime-validators)
  - [form-runtime: zodSchema](#form-runtime-zodschema)
  - [form-runtime: conditional](#form-runtime-conditional)
- [JSON Examples](#json-examples)
- [Package Ownership](#package-ownership)

---

## Overview

FormAnywhere uses a single JSON-serialisable schema to describe every form's structure, settings, validation rules, and conditional behaviour. The schema is:

- **Defined** in `@formanywhere/shared` (`packages/shared/src/types/index.ts`)
- **Validated & manipulated** in `@formanywhere/form-editor` (`engine/schema.ts`)
- **Rendered & runtime-validated** in `@formanywhere/form-runtime` (`FormRenderer.tsx`, `validators/`, `zodSchema.ts`)
- **Persisted** in IndexedDB (local-first) and optionally synced to the cloud API

---

## Schema Tree

```
FormSchema
├── id: string                          — Unique form identifier (nanoid)
├── name: string                        — Human-readable form title
├── description?: string                — Optional form description
├── elements: FormElement[]             — Recursive tree of element nodes
│   ├── id: string                      — Unique element identifier
│   ├── type: FormElementType           — Element type discriminator
│   │       Layout:   container | grid | section | card |
│   │                 grid-column | divider | spacer |
│   │                 heading | logo | text-block
│   │       Input:    text | textarea | email | phone |
│   │                 number | url
│   │       Choice:   select | radio | checkbox | switch
│   │       DateTime: date | time
│   │       Advanced: file | rating | signature
│   ├── label: string                   — Display label
│   ├── required?: boolean              — Submission requires a value
│   ├── placeholder?: string            — Input placeholder
│   ├── description?: string            — Helper / descriptive text
│   ├── validation?: ValidationRule[]   — Declarative validation rules
│   ├── conditionalLogic?: ConditionalRule[]  — Visibility/require conditions
│   ├── options?: { label, value }[]    — Options for select/radio/checkbox
│   ├── elements?: FormElement[]        — Nested children (layout containers)
│   └── [key: string]: unknown          — Plugin-specific properties
├── settings: FormSettings
│   ├── submitButtonText: string
│   ├── successMessage: string
│   ├── redirectUrl?: string
│   ├── multiPage?: boolean
│   └── pages?: FormPage[]
├── createdAt: Date
└── updatedAt: Date
```

---

## Core Types

### FormSchema

The root object representing a complete form.

```typescript
interface FormSchema {
    id: string;
    name: string;
    description?: string;
    elements: FormElement[];
    settings: FormSettings;
    createdAt: Date;
    updatedAt: Date;
}
```

| Field         | Type             | Required | Description                         |
|---------------|------------------|----------|-------------------------------------|
| `id`          | `string`         | ✅       | Unique identifier (nanoid)          |
| `name`        | `string`         | ✅       | Human-readable title                |
| `description` | `string`         | ❌       | Optional description                |
| `elements`    | `FormElement[]`  | ✅       | Root-level element tree             |
| `settings`    | `FormSettings`   | ✅       | Submission and display settings     |
| `createdAt`   | `Date`           | ✅       | Creation timestamp                  |
| `updatedAt`   | `Date`           | ✅       | Last modification timestamp         |

### FormElement

A single node in the element tree. Can be a value-producing input or a layout container.

```typescript
interface FormElement {
    id: string;
    type: FormElementType;
    label: string;
    required?: boolean;
    placeholder?: string;
    description?: string;
    validation?: ValidationRule[];
    conditionalLogic?: ConditionalRule[];
    options?: Array<{ label: string; value: string }>;
    elements?: FormElement[];
    [key: string]: unknown;
}
```

| Field              | Type                            | Required | Description                                          |
|--------------------|---------------------------------|----------|------------------------------------------------------|
| `id`               | `string`                        | ✅       | Unique element ID                                    |
| `type`             | `FormElementType`               | ✅       | Element type discriminator                           |
| `label`            | `string`                        | ✅       | Display label                                        |
| `required`         | `boolean`                       | ❌       | Whether the field must have a value                  |
| `placeholder`      | `string`                        | ❌       | Input placeholder text                               |
| `description`      | `string`                        | ❌       | Helper text shown below the field                    |
| `validation`       | `ValidationRule[]`              | ❌       | Declarative validation constraints                   |
| `conditionalLogic` | `ConditionalRule[]`             | ❌       | Conditions for show/hide/require                     |
| `options`          | `{ label, value }[]`            | ❌       | Options for select, radio, checkbox                  |
| `elements`         | `FormElement[]`                 | ❌       | Nested children (layout containers)                  |
| `[key: string]`    | `unknown`                       | ❌       | Plugin-specific extensibility (width, class, etc.)   |

### FormElementType

Union of all 25 supported element types.

```typescript
type FormElementType =
    // Layout (10)
    | 'container' | 'grid' | 'section' | 'card' | 'grid-column'
    | 'divider'   | 'spacer' | 'heading' | 'logo' | 'text-block'
    // Text Inputs (6)
    | 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'url'
    // Choice (4)
    | 'select' | 'radio' | 'checkbox' | 'switch'
    // Date & Time (2)
    | 'date' | 'time'
    // Advanced (3)
    | 'file' | 'rating' | 'signature';
```

### ValidationRule

Declarative validation constraint attached to an element.

```typescript
interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
    value?: string | number;
    message: string;
}
```

| Type        | `value`          | Applies to     | Description                         |
|-------------|------------------|----------------|-------------------------------------|
| `required`  | —                | All            | Field must have a non-empty value   |
| `minLength` | `number`         | String fields  | Minimum character count             |
| `maxLength` | `number`         | String fields  | Maximum character count             |
| `pattern`   | `string` (regex) | String fields  | Must match the regular expression   |
| `min`       | `number`         | Number fields  | Minimum numeric value               |
| `max`       | `number`         | Number fields  | Maximum numeric value               |

### ConditionalRule

Defines when an element is visible or required based on another field's value.

```typescript
interface ConditionalRule {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number | boolean;
    action: 'show' | 'hide' | 'require';
}
```

| Field      | Type                                   | Description                              |
|------------|----------------------------------------|------------------------------------------|
| `field`    | `string`                               | ID of the field to observe               |
| `operator` | `equals` \| `notEquals` \| `contains` \| `greaterThan` \| `lessThan` | Comparison operator |
| `value`    | `string \| number \| boolean`          | Value to compare against                 |
| `action`   | `show` \| `hide` \| `require`          | Action to take when the condition is met |

### FormSettings

Configuration for submission behaviour and multi-page layout.

```typescript
interface FormSettings {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    multiPage?: boolean;
    pages?: FormPage[];
}
```

### FormPage

Defines a page in a multi-page form.

```typescript
interface FormPage {
    id: string;
    title: string;
    elements: string[];   // Element IDs belonging to this page
}
```

### FormSubmission

Represents a completed form submission with sync state.

```typescript
interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, unknown>;
    submittedAt: Date;
    syncStatus: 'pending' | 'synced' | 'failed';
}
```

---

## Rule Engine Types

Advanced conditional logic used by the Logic Dialog and Workflow Dialog in the editor.

### RuleCondition

```typescript
interface RuleCondition {
    fieldId: string;
    operator:
        | 'equals' | 'notEquals'
        | 'contains' | 'notContains'
        | 'greaterThan' | 'lessThan'
        | 'isEmpty' | 'isNotEmpty';
    value: string;
}
```

### RuleAction

```typescript
interface RuleAction {
    type:
        | 'show' | 'hide'
        | 'enable' | 'disable'
        | 'require'
        | 'setValue'
        | 'navigate';
    targetId: string;
    value: string;
}
```

### FormRule

A complete rule combining triggers, conditions, and actions.

```typescript
interface FormRule {
    id: string;
    name: string;
    enabled: boolean;
    trigger: 'onChange' | 'onBlur' | 'onFocus' | 'onSubmit' | 'onPageLoad';
    triggerFieldId?: string;
    conditions: RuleCondition[];
    conditionOperator: 'AND' | 'OR';
    actions: RuleAction[];
}
```

---

## Element Categories

### Layout Elements

Layout elements do **not** produce values — they are structural containers.

| Type          | Has Children | Description                           |
|---------------|:------------:|---------------------------------------|
| `container`   | ✅           | Generic wrapper                       |
| `grid`        | ✅           | CSS Grid layout container             |
| `section`     | ✅           | Named form section with heading       |
| `card`        | ✅           | Elevated card container               |
| `grid-column` | ✅           | Column within a grid                  |
| `divider`     | ❌           | Horizontal separator line             |
| `spacer`      | ❌           | Empty vertical space                  |
| `heading`     | ❌           | Section heading text                  |
| `logo`        | ❌           | Logo / brand image                    |
| `text-block`  | ❌           | Static rich text block                |

### Text Input Elements

String-valued input fields.

| Type       | HTML Input Type | Validation         | Description             |
|------------|:---------------:|--------------------|-------------------------|
| `text`     | `text`          | minLength, maxLength, pattern | Free text          |
| `textarea` | `<textarea>`    | minLength, maxLength, pattern | Multi-line text    |
| `email`    | `email`         | Built-in email format        | Email address       |
| `phone`    | `tel`           | pattern                      | Phone number        |
| `number`   | `number`        | min, max                     | Numeric input       |
| `url`      | `url`           | Built-in URL format          | Web address         |

### Choice Elements

Selection / toggle fields.

| Type       | Value Type     | Uses `options` | Description              |
|------------|:--------------:|:--------------:|--------------------------|
| `select`   | `string`       | ✅             | Dropdown select          |
| `radio`    | `string`       | ✅             | Radio button group       |
| `checkbox` | `boolean`*     | ❌             | Single toggle checkbox   |
| `switch`   | `boolean`*     | ❌             | Toggle switch            |

> \* In the runtime form store, checkbox/switch values are stored as the strings `"true"` / `"false"` to match the string-backed form values model.

### Date & Time Elements

| Type   | HTML Input Type | Value Format    |
|--------|:---------------:|-----------------|
| `date` | `date`          | `YYYY-MM-DD`   |
| `time` | `time`          | `HH:MM`        |

### Advanced Elements

| Type        | Description                             |
|-------------|-----------------------------------------|
| `file`      | File upload (stores filename string)    |
| `rating`    | Star / numeric rating                   |
| `signature` | Signature pad (placeholder — coming soon)|

---

## Nesting & Recursive Structure

The element tree is **recursive**: layout containers can hold child elements via the `elements` property, which may themselves be containers. This enables complex layouts like:

```
grid
├── grid-column
│   ├── text (First Name)
│   └── text (Last Name)
├── grid-column
│   ├── email (Email)
│   └── phone (Phone)
└── section
    ├── heading (Address)
    ├── text (Street)
    ├── grid
    │   ├── grid-column → text (City)
    │   └── grid-column → text (ZIP)
    └── select (Country)
```

**All utility functions that traverse elements are recursive** — they walk into `el.elements` at every level:

| Function                    | Package         | Behaviour                              |
|-----------------------------|-----------------|----------------------------------------|
| `validateSchema()`         | `form-editor`   | Checks IDs & labels at all levels      |
| `findElementById()`        | `form-editor`   | DFS search through full tree           |
| `countElements()`          | `form-editor`   | Counts every node recursively          |
| `validateForm()`           | `form-runtime`  | Validates nested field values           |
| `buildZodSchema()`         | `form-runtime`  | Collects Zod schemas from full tree    |
| `buildInitialValues()`     | `form-runtime`  | Generates initial values for all fields|

---

## Validation Pipeline

FormAnywhere validates at three distinct layers:

### Schema-Level Validation

**When:** Editor saves / exports a form  
**Where:** `@formanywhere/form-editor` → `validateSchema()`  
**Checks:**

1. `name` must be non-empty
2. `elements` must contain at least one entry
3. All element IDs must be unique (O(n) Set-based duplicate detection)
4. Every element must have a non-empty `label`

```typescript
import { validateSchema } from '@formanywhere/form-editor';

const result = validateSchema(mySchema);
// { valid: boolean, errors: string[] }
```

### Field-Level Validation

**When:** User fills out a form (blur / submit)  
**Where:** `@formanywhere/form-runtime` → `validateField()` / `validateForm()`  
**Checks:**

1. Required fields must be non-empty
2. Type-specific checks (email format, numeric value)
3. Custom `ValidationRule[]` (minLength, maxLength, min, max, pattern)
4. Recursive: validates fields nested inside layout containers

```typescript
import { validateField, validateForm } from '@formanywhere/form-runtime';

const error = validateField(element, value);  // string | null
const result = validateForm(schema, values);  // { valid, errors }
```

### Runtime Zod Integration

**When:** User interacts with the form (blur + input)  
**Where:** `@formanywhere/form-runtime` → `buildZodSchema()` + `@modular-forms/solid`  
**How:**

1. `buildZodSchema(schema)` generates a `z.object({})` from the element tree
2. `zodForm(zodSchema)` adapts it for `@modular-forms/solid`'s `createForm()`
3. Validation triggers on blur (first error) and re-validates on input (recovery)

```typescript
import { buildZodSchema, buildInitialValues } from '@formanywhere/form-runtime';
import { createForm, zodForm } from '@modular-forms/solid';

const zodSchema = buildZodSchema(myFormSchema);
const [form, { Form, Field }] = createForm({
    validate: zodForm(zodSchema),
    validateOn: 'blur',
    revalidateOn: 'input',
    initialValues: buildInitialValues(myFormSchema),
});
```

#### Zod Mapping per Element Type

| Element Type     | Zod Schema                                                      |
|------------------|-----------------------------------------------------------------|
| `text`, default  | `z.string().min(1, ...)` + string rules                        |
| `email`          | `z.string().min(1, ...).email(...)`                             |
| `url`            | `z.string().min(1, ...).url(...)`                               |
| `number`         | `z.string().min(1, ...).refine(isNumber)` + numeric refines    |
| `checkbox/switch`| `z.string().refine(v => v === 'true', ...)`                    |
| `date/time/file` | `z.string().min(1, ...)`                                       |
| Any (optional)   | `...schema.optional()`                                          |

> All values are validated as **strings** (matching native HTML input behaviour). Numeric constraints use `.refine()` on the string representation.

---

## Conditional Logic

Conditional rules control element visibility and requirement state at runtime.

### Simple ConditionalRule (Per-Element)

Attached directly to a `FormElement.conditionalLogic` array:

```json
{
    "field": "employment_status",
    "operator": "equals",
    "value": "employed",
    "action": "show"
}
```

**Evaluation:** All rules in the array must pass (`AND` logic):

```typescript
import { evaluateCondition, evaluateAllConditions } from '@formanywhere/form-runtime';

const visible = evaluateAllConditions(element.conditionalLogic, formValues);
```

| Operator      | Behaviour                                           |
|---------------|-----------------------------------------------------|
| `equals`      | Strict equality (`===`)                             |
| `notEquals`   | Strict inequality (`!==`)                           |
| `contains`    | `String(value).includes(String(ruleValue))`         |
| `greaterThan` | `Number(value) > Number(ruleValue)`                 |
| `lessThan`    | `Number(value) < Number(ruleValue)`                 |

### Advanced FormRule (Workflow Engine)

For complex multi-condition, multi-action workflows:

```json
{
    "id": "rule-1",
    "name": "Show address section when delivery selected",
    "enabled": true,
    "trigger": "onChange",
    "triggerFieldId": "delivery_method",
    "conditions": [
        { "fieldId": "delivery_method", "operator": "equals", "value": "shipping" }
    ],
    "conditionOperator": "AND",
    "actions": [
        { "type": "show", "targetId": "address_section", "value": "" },
        { "type": "require", "targetId": "street_address", "value": "" }
    ]
}
```

---

## Zod Schema Generation

The `buildZodSchema()` function dynamically converts a `FormSchema` into a Zod validation schema at runtime. This bridges the declarative schema with `@modular-forms/solid`'s type-safe form management.

### How It Works

```
FormSchema.elements
       │
       ▼
  collectFieldSchemas()  ← Recursively walks tree, skips layout elements
       │
       ▼
  buildFieldSchema()     ← Maps element type → Zod schema
       │                    Applies ValidationRule[] constraints
       │                    Handles required vs optional
       ▼
  z.object({ ... })      ← Flat object: { [elementId]: ZodType }
       │
       ▼
  zodForm(zodSchema)     ← @modular-forms/solid adapter
       │
       ▼
  createForm({ validate: ... })
```

### Layout Elements (Skipped)

The following types are traversed for their children but produce no Zod field entry:

`container`, `grid`, `section`, `card`, `grid-column`, `divider`, `spacer`, `heading`, `logo`, `text-block`

### Initial Values

`buildInitialValues(schema)` generates a matching `Record<string, string>` with:
- `""` for all string-based fields
- `"false"` for checkbox/switch fields

---

## API Functions

### form-editor: engine/schema

**Source:** `packages/form-editor/src/engine/schema.ts`

| Function              | Signature                                                    | Description                                |
|-----------------------|--------------------------------------------------------------|--------------------------------------------|
| `validateSchema`      | `(schema: FormSchema) → SchemaValidation`                    | Structural validation (name, IDs, labels)  |
| `serializeSchema`     | `(schema: FormSchema) → string`                              | Pretty-print JSON (2-space indent)         |
| `serializeSchemaCompact` | `(schema: FormSchema) → string`                           | Minified JSON (no whitespace)              |
| `parseSchema`         | `(json: string) → FormSchema`                                | Parse JSON + hydrate Date fields           |
| `cloneSchema`         | `(schema: FormSchema) → FormSchema`                          | Deep clone via `structuredClone()`         |
| `mergeSchema`         | `(schema, updates) → FormSchema`                             | Shallow merge + bump `updatedAt`           |
| `findElementById`     | `(elements: FormElement[], id: string) → FormElement \| undefined` | Recursive DFS search              |
| `countElements`       | `(elements: FormElement[]) → number`                         | Total count including nested               |

### form-runtime: validators

**Source:** `packages/form-runtime/src/validators/index.ts`

| Function        | Signature                                                   | Description                          |
|-----------------|-------------------------------------------------------------|--------------------------------------|
| `validateField` | `(element: FormElement, value: unknown) → string \| null`   | Single field validation              |
| `validateForm`  | `(schema: FormSchema, values: Record<string, unknown>) → ValidationResult` | Full form validation (recursive) |

### form-runtime: zodSchema

**Source:** `packages/form-runtime/src/zodSchema.ts`

| Function              | Signature                                              | Description                          |
|-----------------------|--------------------------------------------------------|--------------------------------------|
| `buildZodSchema`      | `(schema: FormSchema) → z.ZodObject<...>`              | Generate Zod schema from FormSchema  |
| `buildInitialValues`  | `(schema: FormSchema) → Record<string, string>`        | Generate initial values map          |

### form-runtime: conditional

**Source:** `packages/form-runtime/src/conditional.ts`

| Function                | Signature                                                    | Description                         |
|-------------------------|--------------------------------------------------------------|-------------------------------------|
| `evaluateCondition`     | `(rule: ConditionalRule, values: Record<string, unknown>) → boolean` | Evaluate single condition     |
| `evaluateAllConditions` | `(rules: ConditionalRule[], values: Record<string, unknown>) → boolean` | All conditions must pass (AND)|

---

## JSON Examples

### Minimal Form

```json
{
    "id": "form_001",
    "name": "Contact Us",
    "elements": [
        {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your name"
        },
        {
            "id": "email",
            "type": "email",
            "label": "Email Address",
            "required": true,
            "validation": [
                { "type": "pattern", "value": "^[^@]+@[^@]+\\.[^@]+$", "message": "Invalid email" }
            ]
        },
        {
            "id": "message",
            "type": "textarea",
            "label": "Message",
            "required": false,
            "placeholder": "How can we help?",
            "validation": [
                { "type": "maxLength", "value": 500, "message": "Max 500 characters" }
            ]
        }
    ],
    "settings": {
        "submitButtonText": "Send Message",
        "successMessage": "Thank you! We'll get back to you soon."
    },
    "createdAt": "2026-01-15T00:00:00.000Z",
    "updatedAt": "2026-02-10T12:30:00.000Z"
}
```

### Form with Nested Grid Layout

```json
{
    "id": "form_002",
    "name": "Job Application",
    "elements": [
        {
            "id": "personal_section",
            "type": "section",
            "label": "Personal Information",
            "elements": [
                {
                    "id": "name_grid",
                    "type": "grid",
                    "label": "Name Row",
                    "elements": [
                        {
                            "id": "col_first",
                            "type": "grid-column",
                            "label": "First",
                            "elements": [
                                { "id": "first_name", "type": "text", "label": "First Name", "required": true }
                            ]
                        },
                        {
                            "id": "col_last",
                            "type": "grid-column",
                            "label": "Last",
                            "elements": [
                                { "id": "last_name", "type": "text", "label": "Last Name", "required": true }
                            ]
                        }
                    ]
                },
                { "id": "email", "type": "email", "label": "Email", "required": true },
                { "id": "phone", "type": "phone", "label": "Phone Number" }
            ]
        },
        {
            "id": "position",
            "type": "select",
            "label": "Position Applied For",
            "required": true,
            "options": [
                { "label": "Frontend Engineer", "value": "frontend" },
                { "label": "Backend Engineer", "value": "backend" },
                { "label": "Full Stack Engineer", "value": "fullstack" }
            ]
        },
        {
            "id": "resume",
            "type": "file",
            "label": "Resume / CV",
            "required": true
        }
    ],
    "settings": {
        "submitButtonText": "Submit Application",
        "successMessage": "Application received! We'll review it shortly."
    },
    "createdAt": "2026-02-01T00:00:00.000Z",
    "updatedAt": "2026-02-14T09:00:00.000Z"
}
```

### Form with Conditional Logic

```json
{
    "id": "form_003",
    "name": "Event Registration",
    "elements": [
        {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true
        },
        {
            "id": "attending",
            "type": "select",
            "label": "Will you attend?",
            "required": true,
            "options": [
                { "label": "Yes, in person", "value": "in-person" },
                { "label": "Yes, virtually", "value": "virtual" },
                { "label": "No", "value": "no" }
            ]
        },
        {
            "id": "dietary",
            "type": "select",
            "label": "Dietary Requirements",
            "options": [
                { "label": "None", "value": "none" },
                { "label": "Vegetarian", "value": "vegetarian" },
                { "label": "Vegan", "value": "vegan" },
                { "label": "Gluten-free", "value": "gluten-free" }
            ],
            "conditionalLogic": [
                {
                    "field": "attending",
                    "operator": "equals",
                    "value": "in-person",
                    "action": "show"
                }
            ]
        },
        {
            "id": "agree_terms",
            "type": "checkbox",
            "label": "I agree to the terms and conditions",
            "required": true
        }
    ],
    "settings": {
        "submitButtonText": "Register",
        "successMessage": "You're registered! Check your email for confirmation."
    },
    "createdAt": "2026-02-05T00:00:00.000Z",
    "updatedAt": "2026-02-12T16:45:00.000Z"
}
```

---

## Package Ownership

| Concern                    | Package                    | Key Files                                  |
|----------------------------|----------------------------|--------------------------------------------|
| Type definitions           | `@formanywhere/shared`     | `src/types/index.ts`, `src/types/form-rules.ts` |
| Schema validation & utils  | `@formanywhere/form-editor`| `src/engine/schema.ts`                     |
| Zod schema generation      | `@formanywhere/form-runtime`| `src/zodSchema.ts`                        |
| Field/form validation      | `@formanywhere/form-runtime`| `src/validators/index.ts`                 |
| Conditional logic          | `@formanywhere/form-runtime`| `src/conditional.ts`                      |
| Form rendering (SolidJS)   | `@formanywhere/form-runtime`| `src/renderer/FormRenderer.tsx`           |
| UI components (M3)         | `@formanywhere/ui`         | `src/textfield/`, `src/select/`, etc.      |
