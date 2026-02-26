/**
 * Complex Form Fixtures — @formanywhere/domain tests
 *
 * Five production-grade FormSchema objects covering all 26 element types,
 * conditional rules, form rules, and visual workflows.
 */
import type { FormSchema, FormElement, FormRule, FormWorkflow, ConditionalRule, ValidationRule } from './test-types';

// ── Helpers ──────────────────────────────────────────────────────────────────

let _counter = 0;
function uid(prefix = 'el'): string { return `${prefix}-${++_counter}`; }

function el(type: FormElement['type'], label: string, overrides: Partial<FormElement> = {}): FormElement {
    return { id: uid(type), type, label, ...overrides };
}

function layout(type: FormElement['type'], label: string, children: FormElement[], overrides: Partial<FormElement> = {}): FormElement {
    return { id: uid(type), type, label, elements: children, ...overrides };
}

// ── 1. Employee Onboarding Form ──────────────────────────────────────────────

export function createEmployeeOnboardingForm(): FormSchema {
    _counter = 0;
    const departmentSelect = el('select', 'Department', {
        id: 'department',
        required: true,
        options: [
            { label: 'Engineering', value: 'engineering' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Sales', value: 'sales' },
            { label: 'HR', value: 'hr' },
            { label: 'Finance', value: 'finance' },
        ],
    });

    const roleSelect = el('select', 'Role Level', {
        id: 'roleLevel',
        required: true,
        options: [
            { label: 'Individual Contributor', value: 'ic' },
            { label: 'Team Lead', value: 'lead' },
            { label: 'Manager', value: 'manager' },
            { label: 'Director', value: 'director' },
        ],
        conditionalLogic: [
            { field: 'department', operator: 'notEquals', value: '', action: 'show' },
        ] as ConditionalRule[],
    });

    const managerSection = layout('section', 'Manager Details', [
        el('text', 'Direct Reports Count', {
            id: 'directReports',
            required: true,
            validation: [
                { type: 'min', value: 1, message: 'Must manage at least 1 person' },
                { type: 'max', value: 100, message: 'Please verify the count' },
            ] as ValidationRule[],
        }),
        el('textarea', 'Management Experience', {
            id: 'managementExp',
            required: true,
            placeholder: 'Describe your management experience...',
            validation: [
                { type: 'minLength', value: 50, message: 'Please provide at least 50 characters' },
                { type: 'maxLength', value: 2000, message: 'Maximum 2000 characters' },
            ] as ValidationRule[],
        }),
    ], {
        id: 'managerSection',
        conditionalLogic: [
            { field: 'roleLevel', operator: 'equals', value: 'manager', action: 'show' },
        ] as ConditionalRule[],
    });

    const elements: FormElement[] = [
        layout('section', 'Personal Information', [
            layout('grid', 'Name Row', [
                layout('grid-column', 'Col 1', [
                    el('text', 'First Name', {
                        id: 'firstName',
                        required: true,
                        placeholder: 'Enter your first name',
                        validation: [
                            { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
                            { type: 'maxLength', value: 50, message: 'Name cannot exceed 50 characters' },
                        ] as ValidationRule[],
                    }),
                ], { columns: 6 }),
                layout('grid-column', 'Col 2', [
                    el('text', 'Last Name', {
                        id: 'lastName',
                        required: true,
                        placeholder: 'Enter your last name',
                        validation: [
                            { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
                        ] as ValidationRule[],
                    }),
                ], { columns: 6 }),
            ], { id: 'nameRow' }),
            el('email', 'Work Email', {
                id: 'workEmail',
                required: true,
                placeholder: 'name@company.com',
            }),
            el('phone', 'Phone Number', {
                id: 'phoneNumber',
                required: true,
                placeholder: '+1 (555) 000-0000',
            }),
            el('url', 'LinkedIn Profile', {
                id: 'linkedIn',
                required: false,
                placeholder: 'https://linkedin.com/in/...',
            }),
        ], { id: 'personalSection' }),

        layout('section', 'Employment Details', [
            layout('grid', 'Employment Row', [
                layout('grid-column', 'Col 1', [departmentSelect], { columns: 6 }),
                layout('grid-column', 'Col 2', [roleSelect], { columns: 6 }),
            ]),
            el('date', 'Start Date', {
                id: 'startDate',
                required: true,
                disablePastDates: true,
            }),
            el('number', 'Expected Annual Salary', {
                id: 'salary',
                required: true,
                placeholder: '80000',
                validation: [
                    { type: 'min', value: 30000, message: 'Salary must be at least $30,000' },
                    { type: 'max', value: 500000, message: 'Please verify the amount' },
                ] as ValidationRule[],
            }),
            managerSection,
        ], { id: 'employmentSection' }),

        layout('section', 'Documents & Agreements', [
            el('file', 'Resume Upload', {
                id: 'resume',
                required: true,
                maxSize: 10,
                accept: '.pdf,.doc,.docx',
            }),
            el('file', 'ID Document', {
                id: 'idDocument',
                required: true,
                maxSize: 5,
                accept: '.pdf,.jpg,.png',
            }),
            el('signature', 'Digital Signature', {
                id: 'employeeSignature',
                required: true,
            }),
        ], { id: 'documentsSection' }),
    ];

    const rules: FormRule[] = [
        {
            id: 'show-manager-section',
            name: 'Show Manager Section',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'roleLevel',
            conditions: [
                { fieldId: 'roleLevel', operator: 'equals', value: 'manager' },
            ],
            conditionOperator: 'AND',
            actions: [
                { type: 'show', targetId: 'managerSection', value: '' },
            ],
        },
        {
            id: 'require-linkedin-director',
            name: 'Require LinkedIn for Directors',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'roleLevel',
            conditions: [
                { fieldId: 'roleLevel', operator: 'equals', value: 'director' },
            ],
            conditionOperator: 'AND',
            actions: [
                { type: 'require', targetId: 'linkedIn', value: '' },
            ],
        },
        {
            id: 'navigate-on-complete',
            name: 'Navigate After signature',
            enabled: true,
            trigger: 'onSubmit',
            conditions: [
                { fieldId: 'employeeSignature', operator: 'isNotEmpty', value: '' },
            ],
            conditionOperator: 'AND',
            actions: [
                { type: 'navigate', targetId: '', value: '/onboarding/success' },
            ],
        },
    ];

    const workflows: FormWorkflow[] = [
        {
            id: 'wf-prefill-employee',
            name: 'Pre-fill Employee Data',
            enabled: true,
            nodes: [
                { id: 'trigger-load', type: 'trigger', label: 'Page Load', position: { x: 0, y: 0 }, config: { triggerType: 'pageLoad' } },
                { id: 'fetch-profile', type: 'callApi', label: 'Fetch Employee Profile', position: { x: 300, y: 0 }, config: { api: { url: 'https://api.internal.com/employee/profile', method: 'GET' } } },
                {
                    id: 'map-data', type: 'setData', label: 'Map Profile Data', position: { x: 600, y: 0 }, config: {
                        dataMapping: [
                            { from: 'firstName', to: 'firstName' },
                            { from: 'lastName', to: 'lastName' },
                            { from: 'email', to: 'workEmail' },
                            { from: 'phone', to: 'phoneNumber' },
                            { from: 'department', to: 'department' },
                        ],
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-load', sourcePort: 'out', targetNodeId: 'fetch-profile' },
                { id: 'e2', sourceNodeId: 'fetch-profile', sourcePort: 'out', targetNodeId: 'map-data' },
            ],
        },
    ];

    return {
        id: 'form-employee-onboarding',
        name: 'Employee Onboarding Form',
        description: 'New hire onboarding form with conditional sections and pre-fill workflow',
        elements,
        settings: {
            submitButtonText: 'Complete Onboarding',
            successMessage: 'Welcome aboard! Your onboarding is complete.',
            successHeading: 'Onboarding Complete',
        },
        rules,
        workflows,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-06-15'),
    };
}

// ── 2. E-Commerce Checkout Form ──────────────────────────────────────────────

export function createEcommerceCheckoutForm(): FormSchema {
    _counter = 100;

    const elements: FormElement[] = [
        layout('card', 'Contact Information', [
            el('email', 'Email Address', {
                id: 'customerEmail',
                required: true,
                placeholder: 'you@example.com',
            }),
            el('phone', 'Phone Number', {
                id: 'customerPhone',
                required: true,
                placeholder: '+1 (555) 000-0000',
            }),
        ], { id: 'contactCard' }),

        layout('card', 'Shipping Address', [
            el('text', 'Full Name', {
                id: 'shippingName',
                required: true,
                validation: [{ type: 'minLength', value: 3, message: 'Please enter your full name' }] as ValidationRule[],
            }),
            el('text', 'Street Address', {
                id: 'shippingStreet',
                required: true,
            }),
            layout('grid', 'City/State Row', [
                layout('grid-column', 'Col 1', [
                    el('text', 'City', { id: 'shippingCity', required: true }),
                ], { columns: 4 }),
                layout('grid-column', 'Col 2', [
                    el('select', 'Country', {
                        id: 'shippingCountry',
                        required: true,
                        options: [
                            { label: 'United States', value: 'US' },
                            { label: 'Canada', value: 'CA' },
                            { label: 'United Kingdom', value: 'UK' },
                        ],
                    }),
                ], { columns: 4 }),
                layout('grid-column', 'Col 3', [
                    el('select', 'State/Province', {
                        id: 'shippingState',
                        required: true,
                        options: [], // dynamically populated by workflow
                    }),
                ], { columns: 4 }),
            ]),
            el('text', 'ZIP/Postal Code', {
                id: 'shippingZip',
                required: true,
                validation: [{ type: 'pattern', value: '^\\d{5}(-\\d{4})?$|^[A-Za-z]\\d[A-Za-z]\\s?\\d[A-Za-z]\\d$', message: 'Enter a valid ZIP or postal code' }] as ValidationRule[],
            }),
        ], { id: 'shippingCard' }),

        layout('card', 'Billing Address', [
            el('switch', 'Same as Shipping', {
                id: 'sameAsShipping',
                defaultValue: 'true',
            }),
            layout('container', 'Billing Fields', [
                el('text', 'Billing Name', {
                    id: 'billingName',
                    conditionalLogic: [{ field: 'sameAsShipping', operator: 'equals', value: 'false', action: 'show' }] as ConditionalRule[],
                }),
                el('text', 'Billing Street', {
                    id: 'billingStreet',
                    conditionalLogic: [{ field: 'sameAsShipping', operator: 'equals', value: 'false', action: 'show' }] as ConditionalRule[],
                }),
                el('text', 'Billing City', {
                    id: 'billingCity',
                    conditionalLogic: [{ field: 'sameAsShipping', operator: 'equals', value: 'false', action: 'show' }] as ConditionalRule[],
                }),
            ], { id: 'billingFieldsContainer' }),
        ], { id: 'billingCard' }),

        layout('card', 'Payment Method', [
            el('radio', 'Payment Type', {
                id: 'paymentType',
                required: true,
                options: [
                    { label: 'Credit Card', value: 'credit' },
                    { label: 'Debit Card', value: 'debit' },
                    { label: 'PayPal', value: 'paypal' },
                ],
            }),
            el('text', 'Card Number', {
                id: 'cardNumber',
                required: true,
                validation: [
                    { type: 'pattern', value: '^\\d{13,19}$', message: 'Enter a valid card number' },
                ] as ValidationRule[],
                conditionalLogic: [{ field: 'paymentType', operator: 'notEquals', value: 'paypal', action: 'show' }] as ConditionalRule[],
            }),
            el('number', 'Order Total', {
                id: 'orderTotal',
                required: true,
                validation: [
                    { type: 'min', value: 0.01, message: 'Order must have a value' },
                ] as ValidationRule[],
            }),
            el('checkbox', 'I agree to Terms & Conditions', {
                id: 'agreeTerms',
                required: true,
            }),
        ], { id: 'paymentCard' }),
    ];

    const rules: FormRule[] = [
        {
            id: 'hide-billing-when-same',
            name: 'Hide billing fields when same as shipping',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'sameAsShipping',
            conditions: [
                { fieldId: 'sameAsShipping', operator: 'equals', value: 'true' },
            ],
            conditionOperator: 'AND',
            actions: [
                { type: 'hide', targetId: 'billingName', value: '' },
                { type: 'hide', targetId: 'billingStreet', value: '' },
                { type: 'hide', targetId: 'billingCity', value: '' },
            ],
        },
        {
            id: 'hide-card-for-paypal',
            name: 'Hide card fields for PayPal',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'paymentType',
            conditions: [
                { fieldId: 'paymentType', operator: 'equals', value: 'paypal' },
            ],
            conditionOperator: 'AND',
            actions: [
                { type: 'hide', targetId: 'cardNumber', value: '' },
            ],
        },
    ];

    const workflows: FormWorkflow[] = [
        {
            id: 'wf-fetch-states',
            name: 'Fetch States on Country Change',
            enabled: true,
            nodes: [
                { id: 'trigger-country', type: 'trigger', label: 'Country Changed', position: { x: 0, y: 0 }, config: { triggerType: 'fieldChange', triggerFieldId: 'shippingCountry' } },
                {
                    id: 'fetch-states', type: 'fetchOptions', label: 'Fetch States', position: { x: 300, y: 0 }, config: {
                        api: { url: 'https://api.geo.com/states?country={{shippingCountry}}', method: 'GET' },
                        targetFieldId: 'shippingState',
                        responsePath: 'data',
                        labelKey: 'name',
                        valueKey: 'code',
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-country', sourcePort: 'out', targetNodeId: 'fetch-states' },
            ],
        },
        {
            id: 'wf-submit-payment',
            name: 'Submit Payment on Form Submit',
            enabled: true,
            nodes: [
                { id: 'trigger-submit', type: 'trigger', label: 'Form Submit', position: { x: 0, y: 0 }, config: { triggerType: 'formSubmit' } },
                {
                    id: 'call-payment', type: 'callApi', label: 'Process Payment', position: { x: 300, y: 0 }, config: {
                        api: { url: 'https://api.payment.com/charge', method: 'POST', headers: { 'Content-Type': 'application/json' }, bodyTemplate: '{"email":"{{customerEmail}}","amount":"{{orderTotal}}"}' },
                    }
                },
                {
                    id: 'check-result', type: 'condition', label: 'Payment Successful?', position: { x: 600, y: 0 }, config: {
                        conditionField: 'paymentStatus',
                        conditionOperator: 'equals',
                        conditionValue: 'success',
                    }
                },
                {
                    id: 'show-success', type: 'showDialog', label: 'Success Dialog', position: { x: 900, y: -100 }, config: {
                        dialogTitle: 'Payment Successful!',
                        dialogMessage: 'Your order has been confirmed. Transaction: {{transactionId}}',
                    }
                },
                {
                    id: 'redirect-fail', type: 'redirect', label: 'Retry Page', position: { x: 900, y: 100 }, config: {
                        redirectUrl: '/checkout/retry?email={{customerEmail}}',
                        redirectNewTab: false,
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-submit', sourcePort: 'out', targetNodeId: 'call-payment' },
                { id: 'e2', sourceNodeId: 'call-payment', sourcePort: 'out', targetNodeId: 'check-result' },
                { id: 'e3', sourceNodeId: 'check-result', sourcePort: 'true', targetNodeId: 'show-success' },
                { id: 'e4', sourceNodeId: 'check-result', sourcePort: 'false', targetNodeId: 'redirect-fail' },
            ],
        },
    ];

    return {
        id: 'form-ecommerce-checkout',
        name: 'E-Commerce Checkout',
        description: 'Multi-step checkout with dynamic state loading and payment processing workflow',
        elements,
        settings: {
            submitButtonText: 'Place Order',
            successMessage: 'Your order has been placed!',
            successHeading: 'Order Confirmed',
        },
        rules,
        workflows,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-06-15'),
    };
}

// ── 3. Healthcare Patient Intake Form ────────────────────────────────────────

export function createHealthcareIntakeForm(): FormSchema {
    _counter = 200;

    const elements: FormElement[] = [
        layout('section', 'Patient Information', [
            layout('grid', 'Name Grid', [
                layout('grid-column', 'Col 1', [
                    el('text', 'First Name', { id: 'patFirstName', required: true }),
                ], { columns: 4 }),
                layout('grid-column', 'Col 2', [
                    el('text', 'Last Name', { id: 'patLastName', required: true }),
                ], { columns: 4 }),
                layout('grid-column', 'Col 3', [
                    el('date', 'Date of Birth', {
                        id: 'dateOfBirth',
                        required: true,
                        disableFutureDates: true,
                    }),
                ], { columns: 4 }),
            ]),
            el('radio', 'Gender', {
                id: 'gender',
                required: true,
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Non-Binary', value: 'non-binary' },
                    { label: 'Prefer not to say', value: 'prefer-not' },
                ],
            }),
            el('email', 'Email', { id: 'patEmail', required: true }),
            el('phone', 'Emergency Contact Phone', { id: 'emergencyPhone', required: true }),
        ], { id: 'patientInfoSection' }),

        layout('section', 'Medical History', [
            el('radio', 'Do you have any allergies?', {
                id: 'hasAllergies',
                required: true,
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
            }),
            el('textarea', 'Allergy Details', {
                id: 'allergyDetails',
                placeholder: 'List all known allergies...',
                conditionalLogic: [
                    { field: 'hasAllergies', operator: 'equals', value: 'yes', action: 'show' },
                ] as ConditionalRule[],
                validation: [
                    { type: 'minLength', value: 10, message: 'Please provide detailed allergy information' },
                ] as ValidationRule[],
            }),
            el('checkbox', 'Currently taking medications?', {
                id: 'onMedication',
            }),
            el('textarea', 'Current Medications', {
                id: 'medicationList',
                conditionalLogic: [
                    { field: 'onMedication', operator: 'equals', value: 'true', action: 'show' },
                ] as ConditionalRule[],
            }),
            el('select', 'Blood Type', {
                id: 'bloodType',
                options: [
                    { label: 'A+', value: 'A+' },
                    { label: 'A-', value: 'A-' },
                    { label: 'B+', value: 'B+' },
                    { label: 'B-', value: 'B-' },
                    { label: 'AB+', value: 'AB+' },
                    { label: 'AB-', value: 'AB-' },
                    { label: 'O+', value: 'O+' },
                    { label: 'O-', value: 'O-' },
                ],
            }),
        ], { id: 'medicalHistorySection' }),

        layout('section', 'Appointment Details', [
            el('date', 'Preferred Appointment Date', {
                id: 'appointmentDate',
                required: true,
                disablePastDates: true,
            }),
            el('time', 'Preferred Time', {
                id: 'appointmentTime',
                required: true,
                min: '08:00',
                max: '17:00',
            }),
            el('rating', 'Pain Level (1-10)', {
                id: 'painLevel',
                required: true,
                maxStars: 10,
            }),
            el('textarea', 'Reason for Visit', {
                id: 'visitReason',
                required: true,
                validation: [
                    { type: 'minLength', value: 20, message: 'Please describe your symptoms in detail' },
                    { type: 'maxLength', value: 5000, message: 'Maximum 5000 characters' },
                ] as ValidationRule[],
            }),
        ], { id: 'appointmentSection' }),

        layout('section', 'Documents & Consent', [
            el('file', 'Insurance Card (Front)', {
                id: 'insuranceFront',
                required: true,
                maxSize: 5,
                accept: '.jpg,.png,.pdf',
            }),
            el('file', 'Insurance Card (Back)', {
                id: 'insuranceBack',
                maxSize: 5,
                accept: '.jpg,.png,.pdf',
            }),
            el('switch', 'I consent to treatment', {
                id: 'consentToTreatment',
                required: true,
            }),
            el('signature', 'Patient Signature', {
                id: 'patientSignature',
                required: true,
            }),
        ], { id: 'consentSection' }),
    ];

    const rules: FormRule[] = [
        {
            id: 'show-allergy-details',
            name: 'Show allergy details when has allergies',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'hasAllergies',
            conditions: [{ fieldId: 'hasAllergies', operator: 'equals', value: 'yes' }],
            conditionOperator: 'AND',
            actions: [
                { type: 'show', targetId: 'allergyDetails', value: '' },
                { type: 'require', targetId: 'allergyDetails', value: '' },
            ],
        },
        {
            id: 'show-medications',
            name: 'Show medication list',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'onMedication',
            conditions: [{ fieldId: 'onMedication', operator: 'equals', value: 'true' }],
            conditionOperator: 'AND',
            actions: [{ type: 'show', targetId: 'medicationList', value: '' }],
        },
        {
            id: 'require-consent',
            name: 'Require consent before submit',
            enabled: true,
            trigger: 'onSubmit',
            conditions: [{ fieldId: 'consentToTreatment', operator: 'equals', value: 'true' }],
            conditionOperator: 'AND',
            actions: [{ type: 'enable', targetId: 'submitButton', value: '' }],
        },
        {
            id: 'high-pain-alert',
            name: 'Alert for high pain level',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'painLevel',
            conditions: [{ fieldId: 'painLevel', operator: 'greaterThan', value: '7' }],
            conditionOperator: 'AND',
            actions: [{ type: 'setValue', targetId: 'visitReason', value: 'URGENT - High pain level reported. ' }],
        },
    ];

    const workflows: FormWorkflow[] = [
        {
            id: 'wf-register-patient',
            name: 'Register Patient on Submit',
            enabled: true,
            nodes: [
                { id: 'trigger-submit', type: 'trigger', label: 'Form Submit', position: { x: 0, y: 0 }, config: { triggerType: 'formSubmit' } },
                {
                    id: 'call-register', type: 'callApi', label: 'Register Patient', position: { x: 300, y: 0 }, config: {
                        api: { url: 'https://api.hospital.com/patients/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
                    }
                },
                {
                    id: 'map-patient-id', type: 'setData', label: 'Set Patient ID', position: { x: 600, y: 0 }, config: {
                        dataMapping: [
                            { from: 'patientId', to: 'patientId' },
                            { from: 'appointmentDate', to: 'confirmedAppointment' },
                        ],
                    }
                },
                {
                    id: 'show-confirmation', type: 'showDialog', label: 'Confirmation', position: { x: 900, y: 0 }, config: {
                        dialogTitle: 'Registration Complete',
                        dialogMessage: 'Your patient ID is {{patientId}}. Your appointment is confirmed.',
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-submit', sourcePort: 'out', targetNodeId: 'call-register' },
                { id: 'e2', sourceNodeId: 'call-register', sourcePort: 'out', targetNodeId: 'map-patient-id' },
                { id: 'e3', sourceNodeId: 'map-patient-id', sourcePort: 'out', targetNodeId: 'show-confirmation' },
            ],
        },
    ];

    return {
        id: 'form-healthcare-intake',
        name: 'Healthcare Patient Intake',
        description: 'Patient intake form with allergy/medication conditionals, file uploads, and patient registration workflow',
        elements,
        settings: {
            submitButtonText: 'Submit Intake Form',
            successMessage: 'Your intake form has been submitted.',
        },
        rules,
        workflows,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-06-15'),
    };
}

// ── 4. Event Registration Form ───────────────────────────────────────────────

export function createEventRegistrationForm(): FormSchema {
    _counter = 300;

    const elements: FormElement[] = [
        layout('section', 'Attendee Information', [
            el('heading', 'Event Registration', { id: 'eventHeading', content: 'Register for an upcoming event' }),
            el('text', 'Full Name', { id: 'attendeeName', required: true }),
            el('email', 'Email Address', { id: 'attendeeEmail', required: true }),
            el('phone', 'Phone', { id: 'attendeePhone' }),
            el('text', 'Company / Organization', { id: 'attendeeCompany' }),
        ], { id: 'attendeeSection' }),

        el('divider', 'Section Break', { id: 'divider1' }),

        layout('section', 'Event Selection', [
            el('select', 'Event Category', {
                id: 'eventCategory',
                required: true,
                options: [], // populated by pageLoad workflow
            }),
            el('select', 'Specific Event', {
                id: 'specificEvent',
                required: true,
                options: [],
                conditionalLogic: [
                    { field: 'eventCategory', operator: 'notEquals', value: '', action: 'show' },
                ] as ConditionalRule[],
            }),
            el('date', 'Preferred Date', {
                id: 'eventDate',
                required: true,
                disablePastDates: true,
            }),
            el('time', 'Preferred Time Slot', {
                id: 'eventTime',
                required: true,
                min: '09:00',
                max: '18:00',
            }),
            el('number', 'Number of Tickets', {
                id: 'ticketCount',
                required: true,
                validation: [
                    { type: 'min', value: 1, message: 'Must purchase at least 1 ticket' },
                    { type: 'max', value: 10, message: 'Maximum 10 tickets per registration' },
                ] as ValidationRule[],
            }),
        ], { id: 'eventSelectionSection' }),

        el('spacer', 'Gap', { id: 'spacer1', height: 24 }),

        layout('card', 'Dining Preferences', [
            el('radio', 'Will you attend the dinner?', {
                id: 'attendDinner',
                required: true,
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
            }),
            el('select', 'Dietary Requirements', {
                id: 'dietaryReqs',
                options: [
                    { label: 'No Restrictions', value: 'none' },
                    { label: 'Vegetarian', value: 'vegetarian' },
                    { label: 'Vegan', value: 'vegan' },
                    { label: 'Gluten-Free', value: 'gluten-free' },
                    { label: 'Halal', value: 'halal' },
                    { label: 'Kosher', value: 'kosher' },
                ],
                conditionalLogic: [
                    { field: 'attendDinner', operator: 'equals', value: 'yes', action: 'show' },
                ] as ConditionalRule[],
            }),
            el('textarea', 'Special Requests', {
                id: 'specialRequests',
                placeholder: 'Any special requirements...',
                conditionalLogic: [
                    { field: 'attendDinner', operator: 'equals', value: 'yes', action: 'show' },
                ] as ConditionalRule[],
            }),
        ], { id: 'diningCard' }),

        el('text-block', 'Payment Notice', { id: 'paymentNotice', content: 'Payment will be processed after registration confirmation.' }),
    ];

    const rules: FormRule[] = [
        {
            id: 'show-dietary-options',
            name: 'Show dietary options when attending dinner',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'attendDinner',
            conditions: [{ fieldId: 'attendDinner', operator: 'equals', value: 'yes' }],
            conditionOperator: 'AND',
            actions: [
                { type: 'show', targetId: 'dietaryReqs', value: '' },
                { type: 'show', targetId: 'specialRequests', value: '' },
            ],
        },
        {
            id: 'disable-past-events',
            name: 'Disable registration after event date',
            enabled: true,
            trigger: 'onPageLoad',
            conditions: [],
            conditionOperator: 'AND',
            actions: [
                { type: 'enable', targetId: 'eventDate', value: '' },
            ],
        },
    ];

    const workflows: FormWorkflow[] = [
        {
            id: 'wf-load-categories',
            name: 'Load Event Categories on Page Load',
            enabled: true,
            nodes: [
                { id: 'trigger-load', type: 'trigger', label: 'Page Load', position: { x: 0, y: 0 }, config: { triggerType: 'pageLoad' } },
                {
                    id: 'fetch-categories', type: 'fetchOptions', label: 'Fetch Categories', position: { x: 300, y: 0 }, config: {
                        api: { url: 'https://api.events.com/categories', method: 'GET' },
                        targetFieldId: 'eventCategory',
                        responsePath: 'data',
                        labelKey: 'name',
                        valueKey: 'id',
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-load', sourcePort: 'out', targetNodeId: 'fetch-categories' },
            ],
        },
        {
            id: 'wf-fetch-pricing',
            name: 'Fetch Pricing on Category Change',
            enabled: true,
            nodes: [
                { id: 'trigger-category', type: 'trigger', label: 'Category Changed', position: { x: 0, y: 0 }, config: { triggerType: 'fieldChange', triggerFieldId: 'eventCategory' } },
                {
                    id: 'fetch-pricing', type: 'callApi', label: 'Fetch Pricing', position: { x: 300, y: 0 }, config: {
                        api: { url: 'https://api.events.com/pricing?category={{eventCategory}}', method: 'GET' },
                    }
                },
                {
                    id: 'map-pricing', type: 'setData', label: 'Set Pricing', position: { x: 600, y: 0 }, config: {
                        dataMapping: [
                            { from: 'price', to: 'ticketPrice' },
                            { from: 'earlyBirdDiscount', to: 'discount' },
                        ],
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-category', sourcePort: 'out', targetNodeId: 'fetch-pricing' },
                { id: 'e2', sourceNodeId: 'fetch-pricing', sourcePort: 'out', targetNodeId: 'map-pricing' },
            ],
        },
    ];

    return {
        id: 'form-event-registration',
        name: 'Event Registration',
        description: 'Event registration with dynamic category loading, pricing workflow, and dining preferences',
        elements,
        settings: {
            submitButtonText: 'Register Now',
            successMessage: 'You are registered!',
            multiPage: true,
            pages: [
                { id: 'page-1', title: 'Attendee Info', elements: ['attendeeSection'] },
                { id: 'page-2', title: 'Event Details', elements: ['eventSelectionSection', 'diningCard'] },
            ],
        },
        rules,
        workflows,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2024-06-15'),
    };
}

// ── 5. Survey / Feedback Form ────────────────────────────────────────────────

export function createSurveyFeedbackForm(): FormSchema {
    _counter = 400;

    const elements: FormElement[] = [
        el('heading', 'Customer Satisfaction Survey', { id: 'surveyTitle', content: 'Tell us about your experience' }),
        el('text-block', 'Survey Instructions', { id: 'surveyInstructions', content: 'Please rate your experience on a scale of 1-5 and provide feedback.' }),
        el('divider', 'Top Divider', { id: 'topDivider' }),

        layout('section', 'Overall Experience', [
            el('rating', 'Overall Satisfaction', {
                id: 'overallSatisfaction',
                required: true,
                maxStars: 5,
            }),
            el('radio', 'Would you recommend us?', {
                id: 'wouldRecommend',
                required: true,
                options: [
                    { label: 'Definitely', value: 'definitely' },
                    { label: 'Probably', value: 'probably' },
                    { label: 'Not sure', value: 'not-sure' },
                    { label: 'Probably not', value: 'probably-not' },
                    { label: 'Definitely not', value: 'definitely-not' },
                ],
            }),
            el('select', 'How did you hear about us?', {
                id: 'howHeard',
                options: [
                    { label: 'Search Engine', value: 'search' },
                    { label: 'Social Media', value: 'social' },
                    { label: 'Friend/Referral', value: 'referral' },
                    { label: 'Advertisement', value: 'ad' },
                    { label: 'Other', value: 'other' },
                ],
            }),
        ], { id: 'overallSection' }),

        layout('section', 'Detailed Feedback', [
            el('rating', 'Product Quality', { id: 'productQuality', required: true, maxStars: 5 }),
            el('rating', 'Customer Service', { id: 'customerService', required: true, maxStars: 5 }),
            el('rating', 'Value for Money', { id: 'valueForMoney', required: true, maxStars: 5 }),
        ], { id: 'detailedSection' }),

        layout('section', 'Complaints & Issues', [
            el('switch', 'Did you experience any issues?', {
                id: 'hadIssues',
            }),
            el('checkbox', 'I would like a callback', {
                id: 'wantCallback',
                conditionalLogic: [
                    { field: 'hadIssues', operator: 'equals', value: 'true', action: 'show' },
                ] as ConditionalRule[],
            }),
            el('textarea', 'Describe the issue', {
                id: 'issueDescription',
                conditionalLogic: [
                    { field: 'hadIssues', operator: 'equals', value: 'true', action: 'show' },
                ] as ConditionalRule[],
                validation: [
                    { type: 'minLength', value: 20, message: 'Please describe the issue in detail (min 20 chars)' },
                    { type: 'maxLength', value: 3000, message: 'Maximum 3000 characters' },
                ] as ValidationRule[],
            }),
            el('select', 'Issue Category', {
                id: 'issueCategory',
                conditionalLogic: [
                    { field: 'hadIssues', operator: 'equals', value: 'true', action: 'show' },
                ] as ConditionalRule[],
                options: [
                    { label: 'Product Defect', value: 'defect' },
                    { label: 'Shipping Delay', value: 'shipping' },
                    { label: 'Wrong Item', value: 'wrong-item' },
                    { label: 'Customer Service', value: 'service' },
                    { label: 'Billing Issue', value: 'billing' },
                    { label: 'Other', value: 'other' },
                ],
            }),
        ], { id: 'complaintsSection' }),

        layout('container', 'Additional Comments', [
            el('textarea', 'Any additional comments?', {
                id: 'additionalComments',
                placeholder: 'Share your thoughts...',
                validation: [
                    { type: 'maxLength', value: 5000, message: 'Maximum 5000 characters' },
                ] as ValidationRule[],
            }),
            el('text', 'Your Name (optional)', { id: 'surveyName' }),
            el('email', 'Your Email (optional)', { id: 'surveyEmail' }),
        ], { id: 'additionalContainer' }),

        el('logo', 'Company Logo', { id: 'companyLogo', src: '/logo.png' }),
        el('spacer', 'Bottom Spacer', { id: 'bottomSpacer', height: 32 }),
    ];

    const rules: FormRule[] = [
        {
            id: 'show-complaints-low-satisfaction',
            name: 'Show complaints for low satisfaction',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'overallSatisfaction',
            conditions: [{ fieldId: 'overallSatisfaction', operator: 'lessThan', value: '3' }],
            conditionOperator: 'AND',
            actions: [{ type: 'show', targetId: 'complaintsSection', value: '' }],
        },
        {
            id: 'show-issue-fields',
            name: 'Show issue fields when had issues',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'hadIssues',
            conditions: [{ fieldId: 'hadIssues', operator: 'equals', value: 'true' }],
            conditionOperator: 'AND',
            actions: [
                { type: 'show', targetId: 'issueDescription', value: '' },
                { type: 'show', targetId: 'issueCategory', value: '' },
                { type: 'show', targetId: 'wantCallback', value: '' },
            ],
        },
        {
            id: 'require-email-callback',
            name: 'Require email when requesting callback',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'wantCallback',
            conditions: [{ fieldId: 'wantCallback', operator: 'equals', value: 'true' }],
            conditionOperator: 'AND',
            actions: [{ type: 'require', targetId: 'surveyEmail', value: '' }],
        },
        {
            id: 'set-high-priority',
            name: 'Set high priority for very low ratings',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'overallSatisfaction',
            conditions: [
                { fieldId: 'overallSatisfaction', operator: 'lessThan', value: '2' },
                { fieldId: 'hadIssues', operator: 'equals', value: 'true' },
            ],
            conditionOperator: 'AND',
            actions: [{ type: 'setValue', targetId: 'issueDescription', value: '[HIGH PRIORITY] ' }],
        },
        {
            id: 'thank-high-spenders',
            name: 'Thank users who recommend',
            enabled: true,
            trigger: 'onChange',
            triggerFieldId: 'wouldRecommend',
            conditions: [{ fieldId: 'wouldRecommend', operator: 'contains', value: 'definitely' }],
            conditionOperator: 'AND',
            actions: [{ type: 'setValue', targetId: 'additionalComments', value: 'Thank you for being a loyal customer! ' }],
        },
    ];

    const workflows: FormWorkflow[] = [
        {
            id: 'wf-submit-survey',
            name: 'Submit Survey with Branching',
            enabled: true,
            nodes: [
                { id: 'trigger-submit', type: 'trigger', label: 'Form Submit', position: { x: 0, y: 0 }, config: { triggerType: 'formSubmit' } },
                {
                    id: 'call-submit', type: 'callApi', label: 'Submit Survey', position: { x: 300, y: 0 }, config: {
                        api: { url: 'https://api.surveys.com/submit', method: 'POST' },
                    }
                },
                {
                    id: 'check-score', type: 'condition', label: 'High Score?', position: { x: 600, y: 0 }, config: {
                        conditionField: 'overallSatisfaction',
                        conditionOperator: 'greaterThan',
                        conditionValue: '3',
                    }
                },
                {
                    id: 'show-thanks', type: 'showDialog', label: 'Thank You!', position: { x: 900, y: -100 }, config: {
                        dialogTitle: 'Thank You!',
                        dialogMessage: 'We appreciate your positive feedback, {{surveyName}}!',
                    }
                },
                {
                    id: 'redirect-support', type: 'redirect', label: 'Support Page', position: { x: 900, y: 100 }, config: {
                        redirectUrl: '/support?email={{surveyEmail}}',
                        redirectNewTab: false,
                    }
                },
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'trigger-submit', sourcePort: 'out', targetNodeId: 'call-submit' },
                { id: 'e2', sourceNodeId: 'call-submit', sourcePort: 'out', targetNodeId: 'check-score' },
                { id: 'e3', sourceNodeId: 'check-score', sourcePort: 'true', targetNodeId: 'show-thanks' },
                { id: 'e4', sourceNodeId: 'check-score', sourcePort: 'false', targetNodeId: 'redirect-support' },
            ],
        },
    ];

    return {
        id: 'form-survey-feedback',
        name: 'Customer Satisfaction Survey',
        description: 'Multi-section survey with ratings, conditional complaints, and score-based workflow branching',
        elements,
        settings: {
            submitButtonText: 'Submit Feedback',
            successMessage: 'Thank you for your feedback!',
            successHeading: 'Feedback Received',
            theme: {
                primaryColor: '#6366f1',
                backgroundColor: '#f8fafc',
                borderRadius: 12,
                fontFamily: 'Inter',
            },
        },
        rules,
        workflows,
        createdAt: new Date('2024-05-01'),
        updatedAt: new Date('2024-06-15'),
    };
}

// ── Export all fixtures ──────────────────────────────────────────────────────

export const ALL_FORM_FIXTURES = [
    { name: 'Employee Onboarding', create: createEmployeeOnboardingForm },
    { name: 'E-Commerce Checkout', create: createEcommerceCheckoutForm },
    { name: 'Healthcare Intake', create: createHealthcareIntakeForm },
    { name: 'Event Registration', create: createEventRegistrationForm },
    { name: 'Survey/Feedback', create: createSurveyFeedbackForm },
] as const;

/** Collect all elements from a FormElement tree, recursively. */
export function collectAllElements(elements: FormElement[]): FormElement[] {
    const result: FormElement[] = [];
    for (const el of elements) {
        result.push(el);
        if (el.elements) result.push(...collectAllElements(el.elements));
    }
    return result;
}
