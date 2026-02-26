/**
 * Mock API Helpers — @formanywhere/domain tests
 *
 * Reusable mock API caller and response fixtures for workflow integration tests.
 */
import { vi } from 'vitest';
import type { WorkflowApiConfig } from '../workflow/types';

// ── Response Fixtures ────────────────────────────────────────────────────────

export const MOCK_RESPONSES = {
    /** Countries list for select options */
    countries: {
        data: [
            { name: 'United States', code: 'US' },
            { name: 'Canada', code: 'CA' },
            { name: 'United Kingdom', code: 'UK' },
            { name: 'Germany', code: 'DE' },
            { name: 'Australia', code: 'AU' },
        ],
    },

    /** States for US country */
    statesUS: {
        data: [
            { name: 'California', code: 'CA' },
            { name: 'New York', code: 'NY' },
            { name: 'Texas', code: 'TX' },
            { name: 'Florida', code: 'FL' },
            { name: 'Washington', code: 'WA' },
        ],
    },

    /** Employee profile data for pre-fill */
    employeeProfile: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0123',
        department: 'engineering',
        employeeId: 'EMP-2024-001',
    },

    /** Event categories for dynamic select */
    eventCategories: {
        data: [
            { name: 'Tech Conference', id: 'tech-conf' },
            { name: 'Workshop', id: 'workshop' },
            { name: 'Hackathon', id: 'hackathon' },
            { name: 'Meetup', id: 'meetup' },
            { name: 'Webinar', id: 'webinar' },
        ],
    },

    /** Pricing based on event type */
    eventPricing: {
        price: '99.99',
        currency: 'USD',
        earlyBirdDiscount: '20',
        maxCapacity: '500',
    },

    /** Payment submission result: success */
    paymentSuccess: { status: 'success', transactionId: 'TXN-2024-ABC123', message: 'Payment processed' },

    /** Payment submission result: failure */
    paymentFailure: { status: 'error', message: 'Insufficient funds' },

    /** Patient registration result */
    patientRegistration: { patientId: 'PAT-2024-XYZ', status: 'registered', appointmentDate: '2024-06-15' },

    /** Survey submission result */
    surveyResult: { submitted: true, thankYouUrl: '/thank-you' },
} as const;

// ── Mock API Caller Factory ──────────────────────────────────────────────────

type UrlMatcher = string | RegExp;
type ResponseMap = Array<{ matcher: UrlMatcher; response: unknown }>;

/**
 * Creates a mock API caller that maps URL patterns to canned responses.
 *
 * @example
 * const caller = createMockApiCaller([
 *   { matcher: /countries/, response: MOCK_RESPONSES.countries },
 *   { matcher: /states/, response: MOCK_RESPONSES.statesUS },
 * ]);
 */
export function createMockApiCaller(responseMap: ResponseMap) {
    const fn = vi.fn(async (api: WorkflowApiConfig, _values: Record<string, unknown>) => {
        for (const { matcher, response } of responseMap) {
            if (typeof matcher === 'string' && api.url.includes(matcher)) {
                return structuredClone(response);
            }
            if (matcher instanceof RegExp && matcher.test(api.url)) {
                return structuredClone(response);
            }
        }
        throw new Error(`No mock response for URL: ${api.url}`);
    });
    return fn;
}

/**
 * Creates a simple mock API caller that returns the same response for any URL.
 */
export function createSimpleMockApiCaller(response: unknown = {}) {
    return vi.fn(async () => structuredClone(response));
}
