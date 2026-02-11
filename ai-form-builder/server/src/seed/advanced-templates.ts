/**
 * Advanced Form Templates with Rules, Workflows, and Multi-Step Logic
 * 5 comprehensive examples showcasing complex business scenarios
 */

export const advancedFormTemplates = [
    // ============================================================================
    // TEMPLATE 1: Enterprise Lead Qualification (B2B Sales)
    // ============================================================================
    {
        title: 'Enterprise Lead Qualification',
        description: 'Smart B2B lead capture with automatic routing and CRM integration',
        category: 'Sales & Marketing',
        settings: {
            layoutType: 'card',
            submitButtonText: 'Submit Inquiry',
            successMessage: 'Thank you! Our team will contact you within 24 hours.',
            pages: [
                { id: 'page-1', name: 'Contact Information', description: 'Tell us about yourself' },
                { id: 'page-2', name: 'Company Details', description: 'About your organization' },
                { id: 'page-3', name: 'Requirements', description: 'Your needs and timeline' },
            ],

            // Advanced Rules
            rules: [
                {
                    id: 'rule-1',
                    name: 'Show Executive Contact for Enterprise',
                    enabled: true,
                    conditions: [
                        { fieldId: 'company_size', operator: 'greaterThan', value: 500 }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'executive_contact' },
                        { type: 'require', targetId: 'executive_contact' }
                    ]
                },
                {
                    id: 'rule-2',
                    name: 'Show Industry-Specific Questions',
                    enabled: true,
                    conditions: [
                        { fieldId: 'industry', operator: 'equals', value: 'Healthcare' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'hipaa_compliance' }
                    ]
                },
                {
                    id: 'rule-3',
                    name: 'Urgent Tag for High Budget',
                    enabled: true,
                    conditions: [
                        { fieldId: 'budget', operator: 'greaterThan', value: 100000 }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'urgency_indicator' }
                    ]
                }
            ],

            // Complex Workflow
            workflows: [
                {
                    id: 'workflow-1',
                    name: 'Lead Routing & Qualification',
                    description: 'Automatic lead scoring and routing to sales team',
                    enabled: true,
                    nodes: [
                        {
                            id: 'start',
                            type: 'custom',
                            position: { x: 250, y: 0 },
                            data: { type: 'start', label: 'Form Submitted' }
                        },
                        {
                            id: 'score-lead',
                            type: 'custom',
                            position: { x: 250, y: 100 },
                            data: {
                                type: 'variable',
                                label: 'Calculate Lead Score',
                                config: {
                                    variableName: 'leadScore',
                                    source: 'custom',
                                    value: 0
                                }
                            }
                        },
                        {
                            id: 'check-enterprise',
                            type: 'custom',
                            position: { x: 250, y: 200 },
                            data: {
                                type: 'condition',
                                label: 'Enterprise Deal?',
                                config: {
                                    fieldId: 'company_size',
                                    operator: 'greaterThan',
                                    value: 500
                                }
                            }
                        },
                        {
                            id: 'crm-enterprise',
                            type: 'custom',
                            position: { x: 100, y: 300 },
                            data: {
                                type: 'api',
                                label: 'Create Enterprise Opportunity',
                                config: {
                                    method: 'POST',
                                    url: 'https://api.salesforce.com/opportunities',
                                    priority: 'High'
                                }
                            }
                        },
                        {
                            id: 'crm-standard',
                            type: 'custom',
                            position: { x: 400, y: 300 },
                            data: {
                                type: 'api',
                                label: 'Create Standard Lead',
                                config: {
                                    method: 'POST',
                                    url: 'https://api.hubspot.com/contacts'
                                }
                            }
                        },
                        {
                            id: 'notify-sales',
                            type: 'custom',
                            position: { x: 100, y: 400 },
                            data: {
                                type: 'webhook',
                                label: 'Alert Sales Team',
                                config: {
                                    url: 'https://hooks.slack.com/services/ENTERPRISE_CHANNEL'
                                }
                            }
                        },
                        {
                            id: 'email-confirm',
                            type: 'custom',
                            position: { x: 250, y: 500 },
                            data: {
                                type: 'email',
                                label: 'Send Confirmation',
                                config: {
                                    to: '{{email}}',
                                    subject: 'Your Enterprise Inquiry',
                                    body: 'Thank you for your interest...'
                                }
                            }
                        }
                    ],
                    edges: [
                        { id: 'e1', source: 'start', target: 'score-lead' },
                        { id: 'e2', source: 'score-lead', target: 'check-enterprise' },
                        { id: 'e3', source: 'check-enterprise', target: 'crm-enterprise', sourceHandle: 'true' },
                        { id: 'e4', source: 'check-enterprise', target: 'crm-standard', sourceHandle: 'false' },
                        { id: 'e5', source: 'crm-enterprise', target: 'notify-sales' },
                        { id: 'e6', source: 'notify-sales', target: 'email-confirm' },
                        { id: 'e7', source: 'crm-standard', target: 'email-confirm' }
                    ]
                }
            ],

            pageElements: {
                'page-1': [
                    { id: 'full_name', type: 'text-input', label: 'Full Name', required: true },
                    { id: 'email', type: 'email-input', label: 'Business Email', required: true },
                    { id: 'phone', type: 'phone-input', label: 'Phone Number', required: true },
                    { id: 'job_title', type: 'text-input', label: 'Job Title', required: true }
                ],
                'page-2': [
                    { id: 'company_name', type: 'text-input', label: 'Company Name', required: true },
                    {
                        id: 'company_size',
                        type: 'select-input',
                        label: 'Company Size',
                        required: true,
                        options: ['1-50', '51-200', '201-500', '501-1000', '1000+']
                    },
                    {
                        id: 'industry',
                        type: 'select-input',
                        label: 'Industry',
                        required: true,
                        options: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Other']
                    },
                    { id: 'executive_contact', type: 'text-input', label: 'Executive Sponsor', required: false, hidden: true },
                    { id: 'hipaa_compliance', type: 'checkbox-input', label: 'HIPAA Compliance Required', required: false, hidden: true }
                ],
                'page-3': [
                    {
                        id: 'budget',
                        type: 'number-input',
                        label: 'Annual Budget ($)',
                        required: true,
                        placeholder: '50000'
                    },
                    {
                        id: 'timeline',
                        type: 'radio-group',
                        label: 'Implementation Timeline',
                        required: true,
                        options: ['Immediate (< 1 month)', '1-3 months', '3-6 months', '6+ months']
                    },
                    {
                        id: 'requirements',
                        type: 'textarea-input',
                        label: 'Specific Requirements',
                        required: true,
                        placeholder: 'Describe your needs...'
                    },
                    { id: 'urgency_indicator', type: 'checkbox-input', label: 'Mark as Urgent', required: false, hidden: true }
                ]
            }
        }
    },

    // ============================================================================
    // TEMPLATE 2: Smart Job Application (HR/Recruiting)
    // ============================================================================
    {
        title: 'Smart Job Application Form',
        description: 'Automated candidate screening with experience-based routing',
        category: 'Human Resources',
        settings: {
            layoutType: 'card',
            submitButtonText: 'Submit Application',
            successMessage: 'Application received! We\'ll review and contact qualified candidates.',
            pages: [
                { id: 'page-1', name: 'Personal Information', description: 'About you' },
                { id: 'page-2', name: 'Experience & Skills', description: 'Your background' },
                { id: 'page-3', name: 'Additional Information', description: 'Final details' },
            ],

            rules: [
                {
                    id: 'rule-1',
                    name: 'Show Management Questions for Senior Roles',
                    enabled: true,
                    conditions: [
                        { fieldId: 'years_experience', operator: 'greaterThanOrEqual', value: 5 }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'management_experience' },
                        { type: 'show', targetId: 'team_size' }
                    ]
                },
                {
                    id: 'rule-2',
                    name: 'Require Portfolio for Design Roles',
                    enabled: true,
                    conditions: [
                        { fieldId: 'position', operator: 'contains', value: 'Design' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'portfolio_url' },
                        { type: 'require', targetId: 'portfolio_url' }
                    ]
                },
                {
                    id: 'rule-3',
                    name: 'Show Relocation for Remote No',
                    enabled: true,
                    conditions: [
                        { fieldId: 'remote_preference', operator: 'equals', value: 'No' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'willing_to_relocate' }
                    ]
                }
            ],

            workflows: [
                {
                    id: 'workflow-1',
                    name: 'Candidate Screening & Routing',
                    description: 'Auto-screen candidates and schedule qualified interviews',
                    enabled: true,
                    nodes: [
                        { id: 'start', type: 'custom', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Application Submitted' } },
                        {
                            id: 'check-experience',
                            type: 'custom',
                            position: { x: 250, y: 100 },
                            data: {
                                type: 'condition',
                                label: 'Meets Experience Requirement?',
                                config: { fieldId: 'years_experience', operator: 'greaterThanOrEqual', value: 3 }
                            }
                        },
                        {
                            id: 'schedule-interview',
                            type: 'custom',
                            position: { x: 100, y: 200 },
                            data: {
                                type: 'api',
                                label: 'Schedule Interview',
                                config: { method: 'POST', url: 'https://api.calendly.com/interview' }
                            }
                        },
                        {
                            id: 'add-to-talent-pool',
                            type: 'custom',
                            position: { x: 400, y: 200 },
                            data: {
                                type: 'api',
                                label: 'Add to Talent Pool',
                                config: { method: 'POST', url: 'https://api.greenhouse.io/talent_pool' }
                            }
                        },
                        {
                            id: 'email-interview',
                            type: 'custom',
                            position: { x: 100, y: 300 },
                            data: {
                                type: 'email',
                                label: 'Send Interview Invite',
                                config: { to: '{{email}}', subject: 'Interview Invitation' }
                            }
                        },
                        {
                            id: 'email-thank-you',
                            type: 'custom',
                            position: { x: 400, y: 300 },
                            data: {
                                type: 'email',
                                label: 'Thank You Email',
                                config: { to: '{{email}}', subject: 'Application Received' }
                            }
                        }
                    ],
                    edges: [
                        { id: 'e1', source: 'start', target: 'check-experience' },
                        { id: 'e2', source: 'check-experience', target: 'schedule-interview', sourceHandle: 'true' },
                        { id: 'e3', source: 'check-experience', target: 'add-to-talent-pool', sourceHandle: 'false' },
                        { id: 'e4', source: 'schedule-interview', target: 'email-interview' },
                        { id: 'e5', source: 'add-to-talent-pool', target: 'email-thank-you' }
                    ]
                }
            ],

            pageElements: {
                'page-1': [
                    { id: 'full_name', type: 'text-input', label: 'Full Name', required: true },
                    { id: 'email', type: 'email-input', label: 'Email Address', required: true },
                    { id: 'phone', type: 'phone-input', label: 'Phone Number', required: true },
                    {
                        id: 'position',
                        type: 'select-input',
                        label: 'Position Applying For',
                        required: true,
                        options: ['Software Engineer', 'Senior Engineer', 'Design Lead', 'Product Manager', 'DevOps Engineer']
                    }
                ],
                'page-2': [
                    {
                        id: 'years_experience',
                        type: 'number-input',
                        label: 'Years of Experience',
                        required: true
                    },
                    {
                        id: 'current_company',
                        type: 'text-input',
                        label: 'Current/Most Recent Company',
                        required: true
                    },
                    {
                        id: 'skills',
                        type: 'textarea-input',
                        label: 'Key Skills',
                        required: true,
                        placeholder: 'List your technical skills...'
                    },
                    { id: 'management_experience', type: 'textarea-input', label: 'Management Experience', required: false, hidden: true },
                    { id: 'team_size', type: 'number-input', label: 'Largest Team Managed', required: false, hidden: true },
                    { id: 'portfolio_url', type: 'url-input', label: 'Portfolio URL', required: false, hidden: true }
                ],
                'page-3': [
                    { id: 'resume', type: 'file-upload', label: 'Upload Resume', required: true },
                    {
                        id: 'remote_preference',
                        type: 'radio-group',
                        label: 'Remote Work Preference',
                        required: true,
                        options: ['Yes', 'No', 'Hybrid']
                    },
                    { id: 'willing_to_relocate', type: 'checkbox-input', label: 'Willing to Relocate', required: false, hidden: true },
                    {
                        id: 'salary_expectation',
                        type: 'number-input',
                        label: 'Salary Expectation ($)',
                        required: true
                    },
                    {
                        id: 'start_date',
                        type: 'date-input',
                        label: 'Earliest Start Date',
                        required: true
                    }
                ]
            }
        }
    },

    // ============================================================================
    // TEMPLATE 3: SaaS Customer Onboarding with Payment
    // ============================================================================
    {
        title: 'SaaS Customer Onboarding',
        description: 'Multi-tier subscription signup with payment processing',
        category: 'SaaS & Subscription',
        settings: {
            layoutType: 'card',
            submitButtonText: 'Complete Signup',
            successMessage: 'Welcome aboard! Your account has been created.',
            pages: [
                { id: 'page-1', name: 'Account Details', description: 'Create your account' },
                { id: 'page-2', name: 'Plan Selection', description: 'Choose your plan' },
                { id: 'page-3', name: 'Payment & Confirmation', description: 'Finalize your subscription' },
            ],

            rules: [
                {
                    id: 'rule-1',
                    name: 'Show Enterprise Features',
                    enabled: true,
                    conditions: [
                        { fieldId: 'plan', operator: 'equals', value: 'Enterprise' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'dedicated_support' },
                        { type: 'show', targetId: 'custom_integration' },
                        { type: 'require', targetId: 'team_size' }
                    ]
                },
                {
                    id: 'rule-2',
                    name: 'Hide Payment for Free Trial',
                    enabled: true,
                    conditions: [
                        { fieldId: 'plan', operator: 'equals', value: 'Free Trial' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'hide', targetId: 'payment_section' }
                    ]
                },
                {
                    id: 'rule-3',
                    name: 'Show Annual Discount',
                    enabled: true,
                    conditions: [
                        { fieldId: 'billing_cycle', operator: 'equals', value: 'Annual' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'discount_banner' }
                    ]
                }
            ],

            workflows: [
                {
                    id: 'workflow-1',
                    name: 'Subscription & Account Provisioning',
                    description: 'Process payment and provision customer account',
                    enabled: true,
                    nodes: [
                        { id: 'start', type: 'custom', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Signup Submitted' } },
                        {
                            id: 'check-plan',
                            type: 'custom',
                            position: { x: 250, y: 100 },
                            data: {
                                type: 'condition',
                                label: 'Paid Plan?',
                                config: { fieldId: 'plan', operator: 'notEquals', value: 'Free Trial' }
                            }
                        },
                        {
                            id: 'process-payment',
                            type: 'custom',
                            position: { x: 100, y: 200 },
                            data: {
                                type: 'api',
                                label: 'Process Stripe Payment',
                                config: { method: 'POST', url: 'https://api.stripe.com/charges' }
                            }
                        },
                        {
                            id: 'create-account',
                            type: 'custom',
                            position: { x: 250, y: 300 },
                            data: {
                                type: 'api',
                                label: 'Create User Account',
                                config: { method: 'POST', url: '/api/users/create' }
                            }
                        },
                        {
                            id: 'provision-resources',
                            type: 'custom',
                            position: { x: 250, y: 400 },
                            data: {
                                type: 'api',
                                label: 'Provision Resources',
                                config: { method: 'POST', url: '/api/provision' }
                            }
                        },
                        {
                            id: 'send-welcome',
                            type: 'custom',
                            position: { x: 250, y: 500 },
                            data: {
                                type: 'email',
                                label: 'Send Welcome Email',
                                config: { to: '{{email}}', subject: 'Welcome to Our Platform!' }
                            }
                        },
                        {
                            id: 'redirect-dashboard',
                            type: 'custom',
                            position: { x: 250, y: 600 },
                            data: {
                                type: 'navigate',
                                label: 'Redirect to Dashboard',
                                config: { url: '/dashboard' }
                            }
                        }
                    ],
                    edges: [
                        { id: 'e1', source: 'start', target: 'check-plan' },
                        { id: 'e2', source: 'check-plan', target: 'process-payment', sourceHandle: 'true' },
                        { id: 'e3', source: 'check-plan', target: 'create-account', sourceHandle: 'false' },
                        { id: 'e4', source: 'process-payment', target: 'create-account' },
                        { id: 'e5', source: 'create-account', target: 'provision-resources' },
                        { id: 'e6', source: 'provision-resources', target: 'send-welcome' },
                        { id: 'e7', source: 'send-welcome', target: 'redirect-dashboard' }
                    ]
                }
            ],

            pageElements: {
                'page-1': [
                    { id: 'company_name', type: 'text-input', label: 'Company Name', required: true },
                    { id: 'admin_name', type: 'text-input', label: 'Admin Name', required: true },
                    { id: 'email', type: 'email-input', label: 'Work Email', required: true },
                    { id: 'password', type: 'password-input', label: 'Password', required: true },
                    { id: 'team_size', type: 'number-input', label: 'Team Size', required: false }
                ],
                'page-2': [
                    {
                        id: 'plan',
                        type: 'radio-group',
                        label: 'Select Plan',
                        required: true,
                        options: ['Free Trial', 'Starter ($29/mo)', 'Professional ($99/mo)', 'Enterprise (Custom)']
                    },
                    {
                        id: 'billing_cycle',
                        type: 'radio-group',
                        label: 'Billing Cycle',
                        required: true,
                        options: ['Monthly', 'Annual (Save 20%)']
                    },
                    { id: 'discount_banner', type: 'heading', label: '🎉 20% Off with Annual Billing!', required: false, hidden: true },
                    { id: 'dedicated_support', type: 'checkbox-input', label: 'Include Dedicated Support', required: false, hidden: true },
                    { id: 'custom_integration', type: 'checkbox-input', label: 'Require Custom Integrations', required: false, hidden: true }
                ],
                'page-3': [
                    { id: 'payment_section', type: 'heading', label: 'Payment Information', required: false },
                    { id: 'card_number', type: 'text-input', label: 'Card Number', required: false },
                    { id: 'exp_date', type: 'text-input', label: 'Expiry Date', required: false },
                    { id: 'cvv', type: 'text-input', label: 'CVV', required: false },
                    { id: 'terms', type: 'checkbox-input', label: 'I agree to Terms of Service', required: true }
                ]
            }
        }
    },

    // ============================================================================
    // TEMPLATE 4: Event Registration with Dynamic Pricing
    // ============================================================================
    {
        title: 'Conference Registration Form',
        description: 'Event registration with dynamic ticket pricing and add-ons',
        category: 'Events & Conferences',
        settings: {
            layoutType: 'card',
            submitButtonText: 'Complete Registration',
            successMessage: 'Registration confirmed! Check your email for details.',
            pages: [
                { id: 'page-1', name: 'Attendee Information', description: 'About you' },
                { id: 'page-2', name: 'Ticket & Sessions', description: 'Choose your options' },
                { id: 'page-3', name: 'Dietary & Special Needs', description: 'Final preferences' },
            ],

            rules: [
                {
                    id: 'rule-1',
                    name: 'Show Group Discount',
                    enabled: true,
                    conditions: [
                        { fieldId: 'attendee_count', operator: 'greaterThanOrEqual', value: 5 }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'group_discount_code' }
                    ]
                },
                {
                    id: 'rule-2',
                    name: 'Show Workshop Selection for Premium',
                    enabled: true,
                    conditions: [
                        { fieldId: 'ticket_type', operator: 'equals', value: 'VIP Pass' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'workshop_selection' },
                        { type: 'show', targetId: 'vip_dinner' }
                    ]
                },
                {
                    id: 'rule-3',
                    name: 'Require Dietary Info if Meals Included',
                    enabled: true,
                    conditions: [
                        { fieldId: 'include_meals', operator: 'isChecked', value: null }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'require', targetId: 'dietary_restrictions' }
                    ]
                }
            ],

            workflows: [
                {
                    id: 'workflow-1',
                    name: 'Registration & Ticketing',
                    description: 'Process registration, generate tickets, send confirmations',
                    enabled: true,
                    nodes: [
                        { id: 'start', type: 'custom', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Registration Submitted' } },
                        {
                            id: 'calculate-price',
                            type: 'custom',
                            position: { x: 250, y: 100 },
                            data: {
                                type: 'transform',
                                label: 'Calculate Total Price',
                                config: { code: 'return data.ticket_price + data.addons_price' }
                            }
                        },
                        {
                            id: 'process-payment',
                            type: 'custom',
                            position: { x: 250, y: 200 },
                            data: {
                                type: 'api',
                                label: 'Process Payment',
                                config: { method: 'POST', url: 'https://api.stripe.com/charges' }
                            }
                        },
                        {
                            id: 'generate-tickets',
                            type: 'custom',
                            position: { x: 250, y: 300 },
                            data: {
                                type: 'api',
                                label: 'Generate E-Tickets',
                                config: { method: 'POST', url: '/api/event/tickets/generate' }
                            }
                        },
                        {
                            id: 'send-confirmation',
                            type: 'custom',
                            position: { x: 250, y: 400 },
                            data: {
                                type: 'email',
                                label: 'Send Confirmation & Tickets',
                                config: { to: '{{email}}', subject: 'Your Conference Tickets' }
                            }
                        },
                        {
                            id: 'add-to-eventbrite',
                            type: 'custom',
                            position: { x: 250, y: 500 },
                            data: {
                                type: 'api',
                                label: 'Sync with Eventbrite',
                                config: { method: 'POST', url: 'https://api.eventbrite.com/attendees' }
                            }
                        }
                    ],
                    edges: [
                        { id: 'e1', source: 'start', target: 'calculate-price' },
                        { id: 'e2', source: 'calculate-price', target: 'process-payment' },
                        { id: 'e3', source: 'process-payment', target: 'generate-tickets' },
                        { id: 'e4', source: 'generate-tickets', target: 'send-confirmation' },
                        { id: 'e5', source: 'send-confirmation', target: 'add-to-eventbrite' }
                    ]
                }
            ],

            pageElements: {
                'page-1': [
                    { id: 'full_name', type: 'text-input', label: 'Full Name', required: true },
                    { id: 'email', type: 'email-input', label: 'Email Address', required: true },
                    { id: 'phone', type: 'phone-input', label: 'Phone Number', required: true },
                    { id: 'company', type: 'text-input', label: 'Company/Organization', required: true },
                    { id: 'job_title', type: 'text-input', label: 'Job Title', required: true }
                ],
                'page-2': [
                    {
                        id: 'ticket_type',
                        type: 'radio-group',
                        label: 'Ticket Type',
                        required: true,
                        options: ['General Admission ($299)', 'VIP Pass ($599)', 'Student ($149)']
                    },
                    { id: 'attendee_count', type: 'number-input', label: 'Number of Attendees', required: true, value: 1 },
                    { id: 'group_discount_code', type: 'text-input', label: 'Group Discount Code', required: false },
                    { id: 'workshop_selection', type: 'select-input', label: 'Select Workshop', required: false },
                    { id: 'vip_dinner', type: 'checkbox-input', label: 'Attend VIP Dinner', required: false },
                    { id: 'include_meals', type: 'checkbox-input', label: 'Include Meal Package (+$50)', required: false }
                ],
                'page-3': [
                    { id: 'dietary_restrictions', type: 'textarea-input', label: 'Dietary Restrictions', required: false },
                    { id: 'accessibility', type: 'textarea-input', label: 'Accessibility Needs', required: false },
                    { id: 'emergency_contact', type: 'text-input', label: 'Emergency Contact', required: true },
                    { id: 'emergency_phone', type: 'phone-input', label: 'Emergency Phone', required: true }
                ]
            }
        }
    },

    // ============================================================================
    // TEMPLATE 5: Medical Patient Intake Form
    // ============================================================================
    {
        title: 'Patient Intake & Assessment',
        description: 'Comprehensive medical intake with HIPAA-compliant workflows',
        category: 'Healthcare',
        settings: {
            layoutType: 'card',
            submitButtonText: 'Submit Information',
            successMessage: 'Thank you. Your information has been securely received.',
            pages: [
                { id: 'page-1', name: 'Personal Information', description: 'Basic details' },
                { id: 'page-2', name: 'Medical History', description: 'Your health background' },
                { id: 'page-3', name: 'Current Symptoms', description: 'Current health concerns' },
                { id: 'page-4', name: 'Insurance & Consent', description: 'Coverage and authorization' },
            ],

            rules: [
                {
                    id: 'rule-1',
                    name: 'Show Emergency Contact for Age < 18',
                    enabled: true,
                    conditions: [
                        { fieldId: 'age', operator: 'lessThan', value: 18 }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'guardian_name' },
                        { type: 'require', targetId: 'guardian_name' },
                        { type: 'show', targetId: 'guardian_phone' },
                        { type: 'require', targetId: 'guardian_phone' }
                    ]
                },
                {
                    id: 'rule-2',
                    name: 'Show Medication Details if Taking Medications',
                    enabled: true,
                    conditions: [
                        { fieldId: 'current_medications', operator: 'equals', value: 'Yes' }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'medication_list' },
                        { type: 'require', targetId: 'medication_list' }
                    ]
                },
                {
                    id: 'rule-3',
                    name: 'Show Specialist Referral for Chronic Condition',
                    enabled: true,
                    conditions: [
                        { fieldId: 'chronic_conditions', operator: 'isNotEmpty', value: null }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'current_specialist' }
                    ]
                },
                {
                    id: 'rule-4',
                    name: 'Urgent Flag for Severe Symptoms',
                    enabled: true,
                    conditions: [
                        { fieldId: 'pain_level', operator: 'greaterThanOrEqual', value: 8 }
                    ],
                    operator: 'AND',
                    actions: [
                        { type: 'show', targetId: 'urgent_care_notice' }
                    ]
                }
            ],

            workflows: [
                {
                    id: 'workflow-1',
                    name: 'Patient Intake & Triage',
                    description: 'Process intake, assess urgency, route to appropriate care',
                    enabled: true,
                    nodes: [
                        { id: 'start', type: 'custom', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Intake Submitted' } },
                        {
                            id: 'check-urgency',
                            type: 'custom',
                            position: { x: 250, y: 100 },
                            data: {
                                type: 'condition',
                                label: 'Urgent Case?',
                                config: { fieldId: 'pain_level', operator: 'greaterThanOrEqual', value: 7 }
                            }
                        },
                        {
                            id: 'alert-emergency',
                            type: 'custom',
                            position: { x: 100, y: 200 },
                            data: {
                                type: 'webhook',
                                label: 'Alert Emergency Desk',
                                config: { url: 'https://hospital.com/emergency-alert' }
                            }
                        },
                        {
                            id: 'standard-intake',
                            type: 'custom',
                            position: { x: 400, y: 200 },
                            data: {
                                type: 'api',
                                label: 'Create Patient Record',
                                config: { method: 'POST', url: 'https://ehr.system.com/patients' }
                            }
                        },
                        {
                            id: 'schedule-appointment',
                            type: 'custom',
                            position: { x: 250, y: 300 },
                            data: {
                                type: 'api',
                                label: 'Schedule Appointment',
                                config: { method: 'POST', url: 'https://scheduling.system.com/appointments' }
                            }
                        },
                        {
                            id: 'send-instructions',
                            type: 'custom',
                            position: { x: 250, y: 400 },
                            data: {
                                type: 'email',
                                label: 'Send Pre-Visit Instructions',
                                config: { to: '{{email}}', subject: 'Your Upcoming Appointment' }
                            }
                        }
                    ],
                    edges: [
                        { id: 'e1', source: 'start', target: 'check-urgency' },
                        { id: 'e2', source: 'check-urgency', target: 'alert-emergency', sourceHandle: 'true' },
                        { id: 'e3', source: 'check-urgency', target: 'standard-intake', sourceHandle: 'false' },
                        { id: 'e4', source: 'alert-emergency', target: 'schedule-appointment' },
                        { id: 'e5', source: 'standard-intake', target: 'schedule-appointment' },
                        { id: 'e6', source: 'schedule-appointment', target: 'send-instructions' }
                    ]
                }
            ],

            pageElements: {
                'page-1': [
                    { id: 'full_name', type: 'text-input', label: 'Full Name', required: true },
                    { id: 'dob', type: 'date-input', label: 'Date of Birth', required: true },
                    { id: 'age', type: 'number-input', label: 'Age', required: true },
                    { id: 'gender', type: 'select-input', label: 'Gender', required: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
                    { id: 'email', type: 'email-input', label: 'Email Address', required: true },
                    { id: 'phone', type: 'phone-input', label: 'Phone Number', required: true },
                    { id: 'address', type: 'textarea-input', label: 'Address', required: true },
                    { id: 'guardian_name', type: 'text-input', label: 'Parent/Guardian Name', required: false },
                    { id: 'guardian_phone', type: 'phone-input', label: 'Guardian Phone', required: false }
                ],
                'page-2': [
                    { id: 'allergies', type: 'textarea-input', label: 'Known Allergies', required: false, placeholder: 'List any drug or food allergies...' },
                    { id: 'current_medications', type: 'radio-group', label: 'Currently Taking Medications?', required: true, options: ['Yes', 'No'] },
                    { id: 'medication_list', type: 'textarea-input', label: 'List All Current Medications', required: false },
                    { id: 'chronic_conditions', type: 'textarea-input', label: 'Chronic Medical Conditions', required: false },
                    { id: 'current_specialist', type: 'text-input', label: 'Current Specialist(s)', required: false },
                    { id: 'previous_surgeries', type: 'textarea-input', label: 'Previous Surgeries', required: false },
                    { id: 'family_history', type: 'textarea-input', label: 'Relevant Family History', required: false }
                ],
                'page-3': [
                    { id: 'chief_complaint', type: 'textarea-input', label: 'Main Reason for Visit', required: true },
                    { id: 'symptom_duration', type: 'text-input', label: 'How Long Have You Had Symptoms?', required: true },
                    { id: 'pain_level', type: 'number-input', label: 'Pain Level (0-10)', required: true, placeholder: '0' },
                    { id: 'urgent_care_notice', type: 'heading', label: '⚠️ High pain level detected. Consider urgent care.', required: false },
                    { id: 'additional_symptoms', type: 'textarea-input', label: 'Additional Symptoms', required: false }
                ],
                'page-4': [
                    { id: 'insurance_provider', type: 'text-input', label: 'Insurance Provider', required: true },
                    { id: 'policy_number', type: 'text-input', label: 'Policy Number', required: true },
                    { id: 'hipaa_consent', type: 'checkbox-input', label: 'I consent to HIPAA privacy practices', required: true },
                    { id: 'treatment_consent', type: 'checkbox-input', label: 'I consent to examination and treatment', required: true }
                ]
            }
        }
    }
];
