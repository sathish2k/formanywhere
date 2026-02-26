/**
 * Zod Schema Generation Tests — @formanywhere/domain
 *
 * Tests buildZodSchema() and buildInitialValues() with all 5 complex forms.
 * Validates correct/incorrect input for every field type.
 */
import { describe, it, expect } from 'vitest';
import { buildZodSchema, buildInitialValues } from '../schema/zod-schema';
import {
    ALL_FORM_FIXTURES,
    createEmployeeOnboardingForm,
    createEcommerceCheckoutForm,
    createHealthcareIntakeForm,
    createEventRegistrationForm,
    createSurveyFeedbackForm,
    collectAllElements,
} from './complex-forms.fixtures';
import { LAYOUT_ELEMENT_TYPES } from '../elements/registry';

// ─── Schema Generation ──────────────────────────────────────────────────────

describe('Zod Schema Generation — All Forms', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: buildZodSchema() produces a valid Zod object`, () => {
            const form = create();
            const schema = buildZodSchema(form);
            expect(schema).toBeDefined();
            expect(typeof schema.parse).toBe('function');
            expect(typeof schema.safeParse).toBe('function');
        });

        it(`${name}: schema has keys for all non-layout elements`, () => {
            const form = create();
            const schema = buildZodSchema(form);
            const shape = schema.shape;
            const layoutTypes = new Set(LAYOUT_ELEMENT_TYPES);
            const allElements = collectAllElements(form.elements);
            const fieldElements = allElements.filter((el) => !layoutTypes.has(el.type as any));
            for (const el of fieldElements) {
                expect(shape[el.id], `Missing schema key for ${el.id} (${el.type})`).toBeDefined();
            }
        });
    }
});

// ─── Initial Values ──────────────────────────────────────────────────────────

describe('buildInitialValues — All Forms', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: returns initial values for all field elements`, () => {
            const form = create();
            const values = buildInitialValues(form);
            const layoutTypes = new Set(LAYOUT_ELEMENT_TYPES);
            const allElements = collectAllElements(form.elements);
            const fieldElements = allElements.filter((el) => !layoutTypes.has(el.type as any));
            for (const el of fieldElements) {
                expect(el.id in values, `Missing initial value for ${el.id}`).toBe(true);
            }
        });

        it(`${name}: checkbox/switch defaults to 'false'`, () => {
            const form = create();
            const values = buildInitialValues(form);
            const allElements = collectAllElements(form.elements);
            const toggleElements = allElements.filter((el) => el.type === 'checkbox' || el.type === 'switch');
            for (const el of toggleElements) {
                expect(values[el.id]).toBe('false');
            }
        });

        it(`${name}: other fields default to empty string`, () => {
            const form = create();
            const values = buildInitialValues(form);
            const layoutTypes = new Set(LAYOUT_ELEMENT_TYPES);
            const allElements = collectAllElements(form.elements);
            const otherFields = allElements.filter(
                (el) => !layoutTypes.has(el.type as any) && el.type !== 'checkbox' && el.type !== 'switch'
            );
            for (const el of otherFields) {
                expect(values[el.id]).toBe('');
            }
        });
    }
});

// ─── Type-Specific Validation ────────────────────────────────────────────────

describe('Zod Schema — Employee Onboarding Validation', () => {
    const form = createEmployeeOnboardingForm();
    const schema = buildZodSchema(form);

    it('rejects empty required fields', () => {
        const values = buildInitialValues(form);
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });

    it('accepts valid complete submission', () => {
        const values = buildInitialValues(form);
        values['firstName'] = 'John';
        values['lastName'] = 'Doe';
        values['workEmail'] = 'john@company.com';
        values['phoneNumber'] = '+1-555-0123';
        values['department'] = 'engineering';
        values['roleLevel'] = 'ic';
        values['startDate'] = '2030-06-01';
        values['salary'] = '85000';
        values['resume'] = 'data:application/pdf;base64,abc';
        values['idDocument'] = 'data:image/png;base64,abc';
        values['employeeSignature'] = 'data:image/png;base64,sig';
        const result = schema.safeParse(values);
        expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
        const values = buildInitialValues(form);
        values['firstName'] = 'John';
        values['lastName'] = 'Doe';
        values['workEmail'] = 'not-an-email';
        values['phoneNumber'] = '+1-555-0123';
        values['department'] = 'engineering';
        values['roleLevel'] = 'ic';
        values['startDate'] = '2025-06-01';
        values['salary'] = '85000';
        values['resume'] = 'file';
        values['idDocument'] = 'file';
        values['employeeSignature'] = 'sig';
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });

    it('rejects salary below minimum', () => {
        const values = buildInitialValues(form);
        values['firstName'] = 'John';
        values['lastName'] = 'Doe';
        values['workEmail'] = 'john@company.com';
        values['phoneNumber'] = '+1-555-0123';
        values['department'] = 'engineering';
        values['roleLevel'] = 'ic';
        values['startDate'] = '2025-06-01';
        values['salary'] = '1000';  // below minimum
        values['resume'] = 'file';
        values['idDocument'] = 'file';
        values['employeeSignature'] = 'sig';
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });

    it('rejects name shorter than minLength', () => {
        const values = buildInitialValues(form);
        values['firstName'] = 'J';  // too short (min 2)
        values['lastName'] = 'Doe';
        values['workEmail'] = 'john@company.com';
        values['phoneNumber'] = '+1-555-0123';
        values['department'] = 'engineering';
        values['roleLevel'] = 'ic';
        values['startDate'] = '2025-06-01';
        values['salary'] = '85000';
        values['resume'] = 'file';
        values['idDocument'] = 'file';
        values['employeeSignature'] = 'sig';
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });
});

describe('Zod Schema — E-Commerce Checkout Validation', () => {
    const form = createEcommerceCheckoutForm();
    const schema = buildZodSchema(form);

    it('rejects empty required fields', () => {
        const values = buildInitialValues(form);
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });

    it('accepts valid checkout data', () => {
        const values = buildInitialValues(form);
        values['customerEmail'] = 'buyer@example.com';
        values['customerPhone'] = '+1-555-0000';
        values['shippingName'] = 'Jane Doe';
        values['shippingStreet'] = '123 Main St';
        values['shippingCity'] = 'Portland';
        values['shippingCountry'] = 'US';
        values['shippingState'] = 'OR';
        values['shippingZip'] = '97201';
        values['paymentType'] = 'credit';
        values['cardNumber'] = '4111111111111111';
        values['orderTotal'] = '99.99';
        values['agreeTerms'] = 'true';
        const result = schema.safeParse(values);
        expect(result.success).toBe(true);
    });

    it('rejects invalid ZIP code format', () => {
        const values = buildInitialValues(form);
        values['customerEmail'] = 'buyer@example.com';
        values['customerPhone'] = '+1-555-0000';
        values['shippingName'] = 'Jane Doe';
        values['shippingStreet'] = '123 Main St';
        values['shippingCity'] = 'Portland';
        values['shippingCountry'] = 'US';
        values['shippingState'] = 'OR';
        values['shippingZip'] = 'INVALID';
        values['paymentType'] = 'credit';
        values['cardNumber'] = '4111111111111111';
        values['orderTotal'] = '99.99';
        values['agreeTerms'] = 'true';
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });

    it('rejects unchecked terms (checkbox required)', () => {
        const values = buildInitialValues(form);
        values['customerEmail'] = 'buyer@example.com';
        values['customerPhone'] = '+1-555-0000';
        values['shippingName'] = 'Jane Doe';
        values['shippingStreet'] = '123 Main St';
        values['shippingCity'] = 'Portland';
        values['shippingCountry'] = 'US';
        values['shippingState'] = 'OR';
        values['shippingZip'] = '97201';
        values['paymentType'] = 'credit';
        values['cardNumber'] = '4111111111111111';
        values['orderTotal'] = '99.99';
        values['agreeTerms'] = 'false'; // unchecked
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });
});

describe('Zod Schema — Healthcare Intake Validation', () => {
    const form = createHealthcareIntakeForm();
    const schema = buildZodSchema(form);

    it('rating field validates bounds (0 to maxStars)', () => {
        const values = buildInitialValues(form);
        // Fill all required fields
        values['patFirstName'] = 'Jane';
        values['patLastName'] = 'Smith';
        values['dateOfBirth'] = '1990-01-15';
        values['gender'] = 'female';
        values['patEmail'] = 'jane@example.com';
        values['emergencyPhone'] = '+1-555-9999';
        values['hasAllergies'] = 'no';
        values['appointmentDate'] = '2030-12-01';
        values['appointmentTime'] = '09:00';
        values['painLevel'] = '11'; // exceeds maxStars of 10
        values['visitReason'] = 'Regular checkup, annual physical examination for general health';
        values['insuranceFront'] = 'file-data';
        values['consentToTreatment'] = 'true';
        values['patientSignature'] = 'sig-data';
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });

    it('accepts valid pain level within bounds', () => {
        const values = buildInitialValues(form);
        values['patFirstName'] = 'Jane';
        values['patLastName'] = 'Smith';
        values['dateOfBirth'] = '1990-01-15';
        values['gender'] = 'female';
        values['patEmail'] = 'jane@example.com';
        values['emergencyPhone'] = '+1-555-9999';
        values['hasAllergies'] = 'no';
        values['appointmentDate'] = '2030-12-01';
        values['appointmentTime'] = '09:00';
        values['painLevel'] = '5';
        values['visitReason'] = 'Regular checkup, annual physical examination for general health';
        values['insuranceFront'] = 'file-data';
        values['consentToTreatment'] = 'true';
        values['patientSignature'] = 'sig-data';
        const result = schema.safeParse(values);
        expect(result.success).toBe(true);
    });
});

describe('Zod Schema — Survey Feedback Validation', () => {
    const form = createSurveyFeedbackForm();
    const schema = buildZodSchema(form);

    it('accepts minimal valid submission (required fields only)', () => {
        const values = buildInitialValues(form);
        values['overallSatisfaction'] = '4';
        values['wouldRecommend'] = 'probably';
        values['productQuality'] = '4';
        values['customerService'] = '3';
        values['valueForMoney'] = '4';
        const result = schema.safeParse(values);
        expect(result.success).toBe(true);
    });

    it('rejects zero rating for required rating field', () => {
        const values = buildInitialValues(form);
        values['overallSatisfaction'] = '0'; // required, can't be 0
        values['wouldRecommend'] = 'probably';
        values['productQuality'] = '4';
        values['customerService'] = '3';
        values['valueForMoney'] = '4';
        const result = schema.safeParse(values);
        expect(result.success).toBe(false);
    });
});
