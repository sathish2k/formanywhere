/**
 * Workflow Execution Tests — @formanywhere/domain
 *
 * Executes all 5 forms' workflows with mock APIs and verifies field updates,
 * option updates, condition branching, dialog/redirect results, and error handling.
 */
import { describe, it, expect, vi } from 'vitest';
import { executeWorkflow, findPageLoadWorkflows, findWorkflowsForField, findSubmitWorkflows } from '../workflow/engine';
import {
    createEmployeeOnboardingForm,
    createEcommerceCheckoutForm,
    createHealthcareIntakeForm,
    createEventRegistrationForm,
    createSurveyFeedbackForm,
} from './complex-forms.fixtures';
import { createMockApiCaller, createSimpleMockApiCaller, MOCK_RESPONSES } from './mock-api.helpers';

// ─── 1. Employee Onboarding — Pre-fill Workflow ─────────────────────────────

describe('Workflow Execution — Employee Onboarding', () => {
    it('pre-fills employee data from API on page load', async () => {
        const form = createEmployeeOnboardingForm();
        const wf = form.workflows![0]; // wf-prefill-employee
        const caller = createMockApiCaller([
            { matcher: /employee\/profile/, response: MOCK_RESPONSES.employeeProfile },
        ]);

        const result = await executeWorkflow(wf, {}, caller);

        expect(result.fieldUpdates['firstName']).toBe('John');
        expect(result.fieldUpdates['lastName']).toBe('Doe');
        expect(result.fieldUpdates['workEmail']).toBe('john.doe@company.com');
        expect(result.fieldUpdates['phoneNumber']).toBe('+1-555-0123');
        expect(result.fieldUpdates['department']).toBe('engineering');
        expect(caller).toHaveBeenCalledOnce();
    });

    it('is found by findPageLoadWorkflows', () => {
        const form = createEmployeeOnboardingForm();
        const pageLoadWfs = findPageLoadWorkflows(form.workflows!);
        expect(pageLoadWfs.length).toBe(1);
        expect(pageLoadWfs[0].id).toBe('wf-prefill-employee');
    });
});

// ─── 2. E-Commerce Checkout — Fetch States + Payment ─────────────────────────

describe('Workflow Execution — E-Commerce Checkout', () => {
    it('fetches states for country change workflow', async () => {
        const form = createEcommerceCheckoutForm();
        const fetchStatesWf = form.workflows!.find((wf) => wf.id === 'wf-fetch-states')!;
        const caller = createMockApiCaller([
            { matcher: /states/, response: MOCK_RESPONSES.statesUS },
        ]);

        const result = await executeWorkflow(fetchStatesWf, { shippingCountry: 'US' }, caller);

        expect(result.optionUpdates['shippingState']).toBeDefined();
        expect(result.optionUpdates['shippingState']).toHaveLength(5);
        expect(result.optionUpdates['shippingState'][0]).toEqual({ label: 'California', value: 'CA' });
    });

    it('fetch-states workflow is found by findWorkflowsForField("shippingCountry")', () => {
        const form = createEcommerceCheckoutForm();
        const wfs = findWorkflowsForField(form.workflows!, 'shippingCountry');
        expect(wfs.length).toBe(1);
        expect(wfs[0].id).toBe('wf-fetch-states');
    });

    it('payment success workflow shows dialog', async () => {
        const form = createEcommerceCheckoutForm();
        const paymentWf = form.workflows!.find((wf) => wf.id === 'wf-submit-payment')!;
        const caller = createMockApiCaller([
            { matcher: /payment/, response: MOCK_RESPONSES.paymentSuccess },
        ]);

        const result = await executeWorkflow(paymentWf, { paymentStatus: 'success', customerEmail: 'test@test.com', transactionId: 'TXN-123' }, caller);

        // Since condition checks paymentStatus in form values (not API response), this should show dialog on true branch
        expect(result.dialog?.title).toBe('Payment Successful!');
        expect(result.redirectUrl).toBeUndefined();
    });

    it('payment failure workflow redirects', async () => {
        const form = createEcommerceCheckoutForm();
        const paymentWf = form.workflows!.find((wf) => wf.id === 'wf-submit-payment')!;
        const caller = createMockApiCaller([
            { matcher: /payment/, response: MOCK_RESPONSES.paymentFailure },
        ]);

        const result = await executeWorkflow(paymentWf, { paymentStatus: 'failed', customerEmail: 'test@test.com' }, caller);

        expect(result.redirectUrl).toContain('/checkout/retry');
        expect(result.redirectUrl).toContain('test@test.com');
        expect(result.dialog).toBeUndefined();
    });

    it('submit workflow is found by findSubmitWorkflows', () => {
        const form = createEcommerceCheckoutForm();
        const submitWfs = findSubmitWorkflows(form.workflows!);
        expect(submitWfs.length).toBe(1);
        expect(submitWfs[0].id).toBe('wf-submit-payment');
    });
});

// ─── 3. Healthcare Intake — Submit + Map Patient ID ──────────────────────────

describe('Workflow Execution — Healthcare Intake', () => {
    it('registers patient and maps patient ID', async () => {
        const form = createHealthcareIntakeForm();
        const wf = form.workflows![0]; // wf-register-patient
        const caller = createMockApiCaller([
            { matcher: /patients\/register/, response: MOCK_RESPONSES.patientRegistration },
        ]);

        const result = await executeWorkflow(wf, {}, caller);

        expect(result.fieldUpdates['patientId']).toBe('PAT-2024-XYZ');
        expect(result.fieldUpdates['confirmedAppointment']).toBe('2024-06-15');
        expect(result.dialog?.title).toBe('Registration Complete');
        expect(caller).toHaveBeenCalledOnce();
    });
});

// ─── 4. Event Registration — Load Categories + Fetch Pricing ─────────────────

describe('Workflow Execution — Event Registration', () => {
    it('loads event categories on page load', async () => {
        const form = createEventRegistrationForm();
        const loadWf = form.workflows!.find((wf) => wf.id === 'wf-load-categories')!;
        const caller = createMockApiCaller([
            { matcher: /categories/, response: MOCK_RESPONSES.eventCategories },
        ]);

        const result = await executeWorkflow(loadWf, {}, caller);

        expect(result.optionUpdates['eventCategory']).toBeDefined();
        expect(result.optionUpdates['eventCategory']).toHaveLength(5);
        expect(result.optionUpdates['eventCategory'][0]).toEqual({ label: 'Tech Conference', value: 'tech-conf' });
    });

    it('fetches pricing on category change', async () => {
        const form = createEventRegistrationForm();
        const pricingWf = form.workflows!.find((wf) => wf.id === 'wf-fetch-pricing')!;
        const caller = createMockApiCaller([
            { matcher: /pricing/, response: MOCK_RESPONSES.eventPricing },
        ]);

        const result = await executeWorkflow(pricingWf, { eventCategory: 'tech-conf' }, caller);

        expect(result.fieldUpdates['ticketPrice']).toBe('99.99');
        expect(result.fieldUpdates['discount']).toBe('20');
    });

    it('page load workflows include category loader', () => {
        const form = createEventRegistrationForm();
        const pageLoadWfs = findPageLoadWorkflows(form.workflows!);
        expect(pageLoadWfs.some((wf) => wf.id === 'wf-load-categories')).toBe(true);
    });

    it('field change workflow triggers for eventCategory', () => {
        const form = createEventRegistrationForm();
        const wfs = findWorkflowsForField(form.workflows!, 'eventCategory');
        expect(wfs.some((wf) => wf.id === 'wf-fetch-pricing')).toBe(true);
    });
});

// ─── 5. Survey/Feedback — Submit with Branching ──────────────────────────────

describe('Workflow Execution — Survey/Feedback', () => {
    it('high satisfaction shows thank-you dialog', async () => {
        const form = createSurveyFeedbackForm();
        const wf = form.workflows![0]; // wf-submit-survey
        const caller = createMockApiCaller([
            { matcher: /surveys/, response: MOCK_RESPONSES.surveyResult },
        ]);

        const result = await executeWorkflow(wf, { overallSatisfaction: '5', surveyName: 'Alice' }, caller);

        expect(result.dialog?.title).toBe('Thank You!');
        expect(result.dialog?.message).toContain('Alice');
        expect(result.redirectUrl).toBeUndefined();
    });

    it('low satisfaction redirects to support', async () => {
        const form = createSurveyFeedbackForm();
        const wf = form.workflows![0];
        const caller = createMockApiCaller([
            { matcher: /surveys/, response: MOCK_RESPONSES.surveyResult },
        ]);

        const result = await executeWorkflow(wf, { overallSatisfaction: '2', surveyEmail: 'bob@example.com' }, caller);

        expect(result.redirectUrl).toContain('/support');
        expect(result.redirectUrl).toContain('bob@example.com');
        expect(result.dialog).toBeUndefined();
    });
});

// ─── Error Handling ──────────────────────────────────────────────────────────

describe('Workflow Execution — Error Handling', () => {
    it('handles API failure gracefully', async () => {
        const form = createEmployeeOnboardingForm();
        const wf = form.workflows![0];
        const caller = vi.fn().mockRejectedValue(new Error('Network Error'));

        const result = await executeWorkflow(wf, {}, caller);

        const errorResult = result.results.find((r) => r.status === 'error');
        expect(errorResult).toBeDefined();
        expect(errorResult?.error).toContain('Network Error');
    });

    it('disabled workflow returns empty results', async () => {
        const form = createEmployeeOnboardingForm();
        const wf = { ...form.workflows![0], enabled: false };
        const caller = vi.fn();

        const result = await executeWorkflow(wf, {}, caller);

        expect(result.results).toHaveLength(0);
        expect(caller).not.toHaveBeenCalled();
    });

    it('no over-fetching: API called correct number of times', async () => {
        const form = createEventRegistrationForm();
        const loadWf = form.workflows!.find((wf) => wf.id === 'wf-load-categories')!;
        const caller = createMockApiCaller([
            { matcher: /categories/, response: MOCK_RESPONSES.eventCategories },
        ]);

        await executeWorkflow(loadWf, {}, caller);
        expect(caller).toHaveBeenCalledTimes(1); // Only one API call in this workflow
    });
});
