/**
 * Dynamic Zod Schema Builder — @formanywhere/domain
 *
 * Converts a FormSchema's element tree into a Zod validation schema at runtime.
 * Used by the FormRenderer to validate via `@modular-forms/solid` + `zodForm()`.
 *
 * **Important:** All form values are stored as strings internally (matching
 * native HTML input behaviour). The generated Zod schema validates *strings*
 * and uses `.refine()` for numeric/boolean checks rather than `z.number()`
 * or `z.boolean()`. Coercion to the final type is the consumer's responsibility.
 */
import { z, type ZodTypeAny } from 'zod';
import type { FormElement, FormSchema, ValidationRule } from '@formanywhere/shared/types';

// ── Layout types — these don't produce values, so we skip them. ──
const LAYOUT_TYPES = new Set([
    'container', 'grid', 'section', 'card', 'grid-column',
    'divider', 'spacer', 'heading', 'logo', 'text-block',
]);

function customMsg(element: FormElement, fallback: string): string {
    const msg = element.customError as string | undefined;
    return msg?.trim() ? msg : fallback;
}

function applyStringRules(s: z.ZodString, rules?: ValidationRule[], element?: FormElement): ZodTypeAny {
    if (!rules) return s;
    let schema: ZodTypeAny = s;
    for (const rule of rules) {
        const msg = rule.message || (element ? customMsg(element, '') : '');
        if (rule.type === 'minLength' && rule.value !== undefined) {
            schema = (schema as z.ZodString).min(Number(rule.value), msg || `Minimum ${rule.value} characters`);
        }
        if (rule.type === 'maxLength' && rule.value !== undefined) {
            schema = (schema as z.ZodString).max(Number(rule.value), msg || `Maximum ${rule.value} characters`);
        }
        if (rule.type === 'pattern' && rule.value !== undefined) {
            schema = (schema as z.ZodString).regex(new RegExp(String(rule.value)), msg || 'Invalid format');
        }
    }
    return schema;
}

function applyNumberRules(s: ZodTypeAny, rules?: ValidationRule[], element?: FormElement): ZodTypeAny {
    if (!rules) return s;
    let schema = s;
    for (const rule of rules) {
        const msg = rule.message || (element ? customMsg(element, '') : '');
        if (rule.type === 'min' && rule.value !== undefined) {
            const min = Number(rule.value);
            schema = schema.refine((v: string) => Number(v) >= min, msg || `Must be at least ${min}`);
        }
        if (rule.type === 'max' && rule.value !== undefined) {
            const max = Number(rule.value);
            schema = schema.refine((v: string) => Number(v) <= max, msg || `Must be at most ${max}`);
        }
    }
    return schema;
}

function applyDateRules(s: ZodTypeAny, element: FormElement): ZodTypeAny {
    let schema = s;
    const errMsg = customMsg(element, '');

    if (element.disablePastDates) {
        schema = schema.refine(
            (v: string) => !v || new Date(v) >= new Date(new Date().toDateString()),
            errMsg || 'Date must not be in the past',
        );
    }
    if (element.disableFutureDates) {
        schema = schema.refine(
            (v: string) => !v || new Date(v) <= new Date(new Date().toDateString()),
            errMsg || 'Date must not be in the future',
        );
    }
    if (element.min) {
        const min = String(element.min);
        schema = schema.refine((v: string) => !v || v >= min, errMsg || `Date must be on or after ${min}`);
    }
    if (element.max) {
        const max = String(element.max);
        schema = schema.refine((v: string) => !v || v <= max, errMsg || `Date must be on or before ${max}`);
    }
    return schema;
}

function applyTimeRules(s: ZodTypeAny, element: FormElement): ZodTypeAny {
    let schema = s;
    const errMsg = customMsg(element, '');

    if (element.min) {
        const min = String(element.min);
        schema = schema.refine((v: string) => !v || v >= min, errMsg || `Time must be at or after ${min}`);
    }
    if (element.max) {
        const max = String(element.max);
        schema = schema.refine((v: string) => !v || v <= max, errMsg || `Time must be at or before ${max}`);
    }
    return schema;
}

function applyFileRules(s: ZodTypeAny, element: FormElement): ZodTypeAny {
    let schema = s;
    const errMsg = customMsg(element, '');

    if (element.maxSize) {
        const maxMB = Number(element.maxSize);
        schema = schema.refine(
            (v: string) => {
                if (!v) return true;
                const sizeEstimate = v.length * 0.75;
                return sizeEstimate <= maxMB * 1024 * 1024;
            },
            errMsg || `File must be smaller than ${element.maxSize}MB`,
        );
    }
    return schema;
}

/**
 * Build a Zod field schema for a single FormElement.
 */
function buildFieldSchema(element: FormElement): ZodTypeAny {
    const required = !!element.required;
    const label = element.label ?? element.id;
    const requiredMsg = customMsg(element, `${label} is required`);

    switch (element.type) {
        case 'email': {
            let s = z.string();
            if (required) s = s.min(1, requiredMsg);
            s = s.email(customMsg(element, 'Please enter a valid email address'));
            return required ? applyStringRules(s, element.validation, element) : s.optional();
        }
        case 'url': {
            let s = z.string();
            if (required) s = s.min(1, requiredMsg);
            s = s.url(customMsg(element, 'Please enter a valid URL'));
            return required ? applyStringRules(s, element.validation, element) : s.optional();
        }
        case 'phone': {
            let s = z.string();
            if (required) s = s.min(1, requiredMsg);
            s = s.regex(/^$|^\+?[\d\s\-().]+$/, customMsg(element, 'Please enter a valid phone number'));
            return required ? applyStringRules(s, element.validation, element) : s.optional();
        }
        case 'number': {
            let s: ZodTypeAny = z.string();
            if (required) s = (s as z.ZodString).min(1, requiredMsg);
            s = s.refine(
                (v: string) => v === '' || !isNaN(Number(v)),
                customMsg(element, 'Please enter a valid number'),
            );
            if (element.precision !== undefined && Number(element.precision) === 0) {
                s = s.refine(
                    (v: string) => v === '' || Number.isInteger(Number(v)),
                    customMsg(element, 'Must be a whole number'),
                );
            }
            s = applyNumberRules(s, element.validation, element);
            return required ? s : (z.string() as ZodTypeAny).optional();
        }
        case 'checkbox':
        case 'switch':
            return required
                ? z.string().refine((v: string) => v === 'true', requiredMsg)
                : z.string().optional();
        case 'date': {
            let s: ZodTypeAny = z.string();
            if (required) s = (s as z.ZodString).min(1, requiredMsg);
            s = applyDateRules(s, element);
            return required ? s : (z.string() as ZodTypeAny).optional();
        }
        case 'time': {
            let s: ZodTypeAny = z.string();
            if (required) s = (s as z.ZodString).min(1, requiredMsg);
            s = applyTimeRules(s, element);
            return required ? s : (z.string() as ZodTypeAny).optional();
        }
        case 'file': {
            let s: ZodTypeAny = z.string();
            if (required) s = (s as z.ZodString).min(1, requiredMsg);
            s = applyFileRules(s, element);
            return required ? s : (z.string() as ZodTypeAny).optional();
        }
        case 'signature': {
            let s = z.string();
            if (required) s = s.min(1, requiredMsg);
            return required ? s : s.optional();
        }
        case 'rating': {
            let s: ZodTypeAny = z.string();
            if (required) {
                s = s.refine((v: string) => v !== '' && v !== '0', requiredMsg);
            }
            const maxStars = Number(element.maxStars ?? 5);
            s = s.refine(
                (v: string) => v === '' || (Number(v) >= 0 && Number(v) <= maxStars),
                customMsg(element, `Rating must be between 0 and ${maxStars}`),
            );
            return required ? s : (z.string() as ZodTypeAny).optional();
        }
        case 'select':
        case 'radio': {
            let s = z.string();
            if (required) s = s.min(1, requiredMsg);
            if (element.options?.length) {
                const allowed = new Set(element.options.map((o) => o.value));
                const withRefine: ZodTypeAny = s.refine(
                    (v: string) => v === '' || allowed.has(v),
                    customMsg(element, 'Please select a valid option'),
                );
                return required ? withRefine : s.optional();
            }
            return required ? applyStringRules(s, element.validation, element) : s.optional();
        }
        default: {
            let s = z.string();
            if (required) s = s.min(1, requiredMsg);
            const withRules = applyStringRules(s, element.validation, element);
            return required ? withRules : s.optional();
        }
    }
}

function collectFieldSchemas(
    elements: FormElement[],
    fields: Record<string, ZodTypeAny>,
): void {
    for (const el of elements) {
        if (LAYOUT_TYPES.has(el.type)) {
            if (el.elements) collectFieldSchemas(el.elements, fields);
            continue;
        }
        fields[el.id] = buildFieldSchema(el);
        if (el.elements) collectFieldSchemas(el.elements, fields);
    }
}

/**
 * Generates a Zod object schema from a {@link FormSchema}.
 * Each input element becomes a top-level key (keyed by `element.id`).
 */
export function buildZodSchema(schema: FormSchema): z.ZodObject<Record<string, ZodTypeAny>> {
    const fields: Record<string, ZodTypeAny> = {};
    collectFieldSchemas(schema.elements, fields);
    return z.object(fields);
}

/**
 * Build the initial values map for `createForm({ initialValues })`.
 * All values are empty strings to match the string-backed store.
 */
export function buildInitialValues(schema: FormSchema): Record<string, string> {
    const values: Record<string, string> = {};
    collectInitialValues(schema.elements, values);
    return values;
}

function collectInitialValues(
    elements: FormElement[],
    values: Record<string, string>,
): void {
    for (const el of elements) {
        if (LAYOUT_TYPES.has(el.type)) {
            if (el.elements) collectInitialValues(el.elements, values);
            continue;
        }
        switch (el.type) {
            case 'checkbox':
            case 'switch':
                values[el.id] = 'false';
                break;
            default:
                values[el.id] = '';
                break;
        }
        if (el.elements) collectInitialValues(el.elements, values);
    }
}

/** Type helper: infer the TS type from a FormSchema's generated Zod schema. */
export type FormValues<S extends FormSchema> = z.infer<ReturnType<typeof buildZodSchema>>;
