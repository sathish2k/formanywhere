/**
 * Rules Engine Examples
 * Demonstrates how to use the rules engine for conditional logic
 */

import { Rule, DroppedElement, Condition } from '../types/form.types';
import { RulesEngine } from '../engines/RulesEngine';

// Example 1: Simple Show/Hide Logic
// "Show email field when contact preference is 'email'"
export const simpleShowHideRule: Rule = {
  id: 'rule-show-email',
  name: 'Show email when contact preference is email',
  conditions: [
    {
      fieldId: 'contact-preference',
      operator: 'equals',
      value: 'email',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'email-field',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 2: Multiple Conditions with AND operator
// "Show discount code field when order total > 100 AND customer type is 'VIP'"
export const multipleConditionsAndRule: Rule = {
  id: 'rule-vip-discount',
  name: 'Show discount for VIP customers with high order value',
  conditions: [
    {
      fieldId: 'order-total',
      operator: 'greaterThan',
      value: 100,
    },
    {
      fieldId: 'customer-type',
      operator: 'equals',
      value: 'VIP',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'discount-code-field',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 3: Multiple Conditions with OR operator
// "Require phone number when contact preference is 'phone' OR 'sms'"
export const multipleConditionsOrRule: Rule = {
  id: 'rule-require-phone',
  name: 'Require phone for phone/SMS contact',
  conditions: [
    {
      fieldId: 'contact-preference',
      operator: 'equals',
      value: 'phone',
    },
    {
      fieldId: 'contact-preference',
      operator: 'equals',
      value: 'sms',
    },
  ],
  actions: [
    {
      type: 'require',
      targetId: 'phone-field',
    },
  ],
  operator: 'OR',
  enabled: true,
};

// Example 4: Enable/Disable Logic
// "Disable shipping address when 'same as billing' is checked"
export const enableDisableRule: Rule = {
  id: 'rule-disable-shipping',
  name: 'Disable shipping address when same as billing',
  conditions: [
    {
      fieldId: 'same-as-billing',
      operator: 'equals',
      value: true,
    },
  ],
  actions: [
    {
      type: 'disable',
      targetId: 'shipping-address',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 5: Set Value Action
// "Set discount to 10% when customer is 'VIP'"
export const setValueRule: Rule = {
  id: 'rule-set-discount',
  name: 'Apply VIP discount',
  conditions: [
    {
      fieldId: 'customer-type',
      operator: 'equals',
      value: 'VIP',
    },
  ],
  actions: [
    {
      type: 'setValue',
      targetId: 'discount-percentage',
      value: 10,
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 6: Complex Business Logic
// "Show additional insurance options when item value > 500 AND shipping international"
export const complexBusinessRule: Rule = {
  id: 'rule-insurance-options',
  name: 'Show insurance for high-value international shipments',
  conditions: [
    {
      fieldId: 'item-value',
      operator: 'greaterThan',
      value: 500,
    },
    {
      fieldId: 'shipping-type',
      operator: 'equals',
      value: 'international',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'insurance-options',
    },
    {
      type: 'require',
      targetId: 'insurance-selection',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 7: isEmpty Condition
// "Show payment method when cart is not empty"
export const isNotEmptyRule: Rule = {
  id: 'rule-payment-method',
  name: 'Show payment when cart has items',
  conditions: [
    {
      fieldId: 'cart-items',
      operator: 'isNotEmpty',
      value: null,
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'payment-method',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 8: Multiple Actions
// "When user selects 'Other' for employment status, show and require custom field"
export const multipleActionsRule: Rule = {
  id: 'rule-employment-other',
  name: 'Handle Other employment status',
  conditions: [
    {
      fieldId: 'employment-status',
      operator: 'equals',
      value: 'Other',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'employment-custom',
    },
    {
      type: 'require',
      targetId: 'employment-custom',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Usage Example: Complete Implementation
export function RulesEngineUsageExample() {
  // Mock form elements
  const elements: DroppedElement[] = [
    {
      id: 'contact-preference',
      type: 'dropdown',
      label: 'Contact Preference',
      icon: null as any,
      color: '#1976D2',
      options: ['email', 'phone', 'sms'],
    },
    {
      id: 'email-field',
      type: 'email',
      label: 'Email',
      icon: null as any,
      color: '#1976D2',
    },
    {
      id: 'phone-field',
      type: 'phone',
      label: 'Phone',
      icon: null as any,
      color: '#1976D2',
    },
  ];

  // Define rules
  const rules: Rule[] = [
    simpleShowHideRule,
    multipleConditionsOrRule,
  ];

  // Initialize rules engine
  const rulesEngine = new RulesEngine(elements, rules);

  // Simulate user input
  rulesEngine.updateFormData('contact-preference', 'email');

  // Evaluate rules
  const result = rulesEngine.evaluateRules();
  console.log('Visibility:', result.visibility);
  console.log('Required:', result.required);

  // Validate form
  const validation = rulesEngine.validateForm();
  console.log('Is Valid:', validation.isValid);
  console.log('Errors:', validation.errors);

  // Dynamic rule management
  const newRule: Rule = {
    id: 'dynamic-rule',
    name: 'Dynamic Rule',
    conditions: [
      {
        fieldId: 'some-field',
        operator: 'equals',
        value: 'some-value',
      },
    ],
    actions: [
      {
        type: 'show',
        targetId: 'target-field',
      },
    ],
    operator: 'AND',
    enabled: true,
  };

  // Add rule dynamically
  rulesEngine.addRule(newRule);

  // Update rule
  rulesEngine.updateRule('dynamic-rule', { enabled: false });

  // Delete rule
  rulesEngine.deleteRule('dynamic-rule');

  return {
    rulesEngine,
    result,
    validation,
  };
}

// Example 9: Cascading Rules
// Multiple rules that work together
export const cascadingRules: Rule[] = [
  {
    id: 'rule-show-shipping',
    name: 'Show shipping section for physical products',
    conditions: [
      {
        fieldId: 'product-type',
        operator: 'equals',
        value: 'physical',
      },
    ],
    actions: [
      {
        type: 'show',
        targetId: 'shipping-section',
      },
    ],
    operator: 'AND',
    enabled: true,
  },
  {
    id: 'rule-show-international-fields',
    name: 'Show international fields for international shipping',
    conditions: [
      {
        fieldId: 'product-type',
        operator: 'equals',
        value: 'physical',
      },
      {
        fieldId: 'shipping-type',
        operator: 'equals',
        value: 'international',
      },
    ],
    actions: [
      {
        type: 'show',
        targetId: 'customs-declaration',
      },
      {
        type: 'show',
        targetId: 'international-tracking',
      },
    ],
    operator: 'AND',
    enabled: true,
  },
];

// Example 10: Form Validation with Custom Rules
export function validateFormWithRules(
  elements: DroppedElement[],
  formData: Record<string, any>,
  rules: Rule[]
) {
  const rulesEngine = new RulesEngine(elements, rules);

  // Update form data
  Object.entries(formData).forEach(([fieldId, value]) => {
    rulesEngine.updateFormData(fieldId, value);
  });

  // Get rule evaluation result
  const ruleResult = rulesEngine.evaluateRules();

  // Validate form
  const validation = rulesEngine.validateForm();

  return {
    isValid: validation.isValid,
    errors: validation.errors,
    visibility: ruleResult.visibility,
    enabled: ruleResult.enabled,
    required: ruleResult.required,
  };
}

// Example 11: Enhanced Comparison Operators
// "Show premium support when subscription tier >= Gold"
export const greaterThanOrEqualRule: Rule = {
  id: 'rule-premium-support',
  name: 'Show premium support for Gold tier and above',
  conditions: [
    {
      fieldId: 'subscription-tier-level',
      operator: 'greaterThanOrEqual',
      value: 3, // Gold = 3, Platinum = 4
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'premium-support-section',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 12: Text Pattern Matching - startsWith
// "Show industry-specific questions when company name starts with 'Tech'"
export const startsWithRule: Rule = {
  id: 'rule-tech-company',
  name: 'Show tech industry questions',
  conditions: [
    {
      fieldId: 'company-name',
      operator: 'startsWith',
      value: 'Tech',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'tech-industry-questions',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 13: Text Pattern Matching - endsWith
// "Require additional verification when email ends with specific domains"
export const endsWithRule: Rule = {
  id: 'rule-email-verification',
  name: 'Additional verification for certain email domains',
  conditions: [
    {
      fieldId: 'email',
      operator: 'endsWith',
      value: '.gov',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'government-id-verification',
    },
    {
      type: 'require',
      targetId: 'government-id-verification',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 14: Contains and NotContains
// "Show allergy warning when ingredients contain peanuts"
export const containsRule: Rule = {
  id: 'rule-allergy-warning',
  name: 'Show peanut allergy warning',
  conditions: [
    {
      fieldId: 'ingredients',
      operator: 'contains',
      value: 'peanut',
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'allergy-warning',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 15: NotContains operator
// "Enable express shipping when address does not contain 'PO Box'"
export const notContainsRule: Rule = {
  id: 'rule-express-shipping',
  name: 'Enable express shipping for non-PO Box addresses',
  conditions: [
    {
      fieldId: 'shipping-address',
      operator: 'notContains',
      value: 'PO Box',
    },
  ],
  actions: [
    {
      type: 'enable',
      targetId: 'express-shipping-option',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 16: LessThanOrEqual operator
// "Require guardian consent when age <= 18"
export const lessThanOrEqualRule: Rule = {
  id: 'rule-guardian-consent',
  name: 'Require guardian consent for minors',
  conditions: [
    {
      fieldId: 'age',
      operator: 'lessThanOrEqual',
      value: 18,
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'guardian-consent-section',
    },
    {
      type: 'require',
      targetId: 'guardian-signature',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 17: Checkbox operators - isChecked
// "Show terms and conditions details when user checks the box"
export const isCheckedRule: Rule = {
  id: 'rule-show-terms',
  name: 'Show terms details when checked',
  conditions: [
    {
      fieldId: 'show-terms-checkbox',
      operator: 'isChecked',
      value: null,
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'terms-details',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 18: Checkbox operators - isNotChecked
// "Require acknowledgment when privacy policy is not checked"
export const isNotCheckedRule: Rule = {
  id: 'rule-privacy-warning',
  name: 'Show warning when privacy not acknowledged',
  conditions: [
    {
      fieldId: 'privacy-policy-checkbox',
      operator: 'isNotChecked',
      value: null,
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'privacy-policy-warning',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 19: Complex Multi-Condition Rule with Various Operators
// "Show financing options for high-value purchases by qualified customers"
export const complexMultiOperatorRule: Rule = {
  id: 'rule-financing-options',
  name: 'Show financing for qualified high-value purchases',
  conditions: [
    {
      fieldId: 'purchase-amount',
      operator: 'greaterThanOrEqual',
      value: 1000,
    },
    {
      fieldId: 'credit-score',
      operator: 'greaterThan',
      value: 650,
    },
    {
      fieldId: 'employment-status',
      operator: 'notEquals',
      value: 'unemployed',
    },
    {
      fieldId: 'bankruptcy-history',
      operator: 'isNotChecked',
      value: null,
    },
  ],
  actions: [
    {
      type: 'show',
      targetId: 'financing-options-section',
    },
    {
      type: 'enable',
      targetId: 'apply-for-financing-button',
    },
  ],
  operator: 'AND',
  enabled: true,
};

// Example 20: Complete Operator Reference Guide
export const operatorReferenceExamples: Record<string, Rule> = {
  equals: {
    id: 'ref-equals',
    name: 'Equals Example',
    conditions: [{ fieldId: 'status', operator: 'equals', value: 'active' }],
    actions: [{ type: 'show', targetId: 'status-details' }],
    operator: 'AND',
    enabled: true,
  },
  notEquals: {
    id: 'ref-not-equals',
    name: 'Not Equals Example',
    conditions: [{ fieldId: 'status', operator: 'notEquals', value: 'inactive' }],
    actions: [{ type: 'enable', targetId: 'edit-button' }],
    operator: 'AND',
    enabled: true,
  },
  greaterThan: {
    id: 'ref-greater-than',
    name: 'Greater Than Example',
    conditions: [{ fieldId: 'quantity', operator: 'greaterThan', value: 10 }],
    actions: [{ type: 'show', targetId: 'bulk-discount' }],
    operator: 'AND',
    enabled: true,
  },
  lessThan: {
    id: 'ref-less-than',
    name: 'Less Than Example',
    conditions: [{ fieldId: 'stock', operator: 'lessThan', value: 5 }],
    actions: [{ type: 'show', targetId: 'low-stock-warning' }],
    operator: 'AND',
    enabled: true,
  },
  greaterThanOrEqual: {
    id: 'ref-gte',
    name: 'Greater Than or Equal Example',
    conditions: [{ fieldId: 'age', operator: 'greaterThanOrEqual', value: 21 }],
    actions: [{ type: 'enable', targetId: 'alcohol-purchase' }],
    operator: 'AND',
    enabled: true,
  },
  lessThanOrEqual: {
    id: 'ref-lte',
    name: 'Less Than or Equal Example',
    conditions: [{ fieldId: 'temperature', operator: 'lessThanOrEqual', value: 32 }],
    actions: [{ type: 'show', targetId: 'freezing-warning' }],
    operator: 'AND',
    enabled: true,
  },
  contains: {
    id: 'ref-contains',
    name: 'Contains Example',
    conditions: [{ fieldId: 'tags', operator: 'contains', value: 'urgent' }],
    actions: [{ type: 'show', targetId: 'priority-badge' }],
    operator: 'AND',
    enabled: true,
  },
  notContains: {
    id: 'ref-not-contains',
    name: 'Not Contains Example',
    conditions: [{ fieldId: 'address', operator: 'notContains', value: 'APO' }],
    actions: [{ type: 'enable', targetId: 'standard-shipping' }],
    operator: 'AND',
    enabled: true,
  },
  startsWith: {
    id: 'ref-starts-with',
    name: 'Starts With Example',
    conditions: [{ fieldId: 'code', operator: 'startsWith', value: 'VIP' }],
    actions: [{ type: 'show', targetId: 'vip-benefits' }],
    operator: 'AND',
    enabled: true,
  },
  endsWith: {
    id: 'ref-ends-with',
    name: 'Ends With Example',
    conditions: [{ fieldId: 'filename', operator: 'endsWith', value: '.pdf' }],
    actions: [{ type: 'enable', targetId: 'pdf-viewer' }],
    operator: 'AND',
    enabled: true,
  },
  isEmpty: {
    id: 'ref-is-empty',
    name: 'Is Empty Example',
    conditions: [{ fieldId: 'optional-notes', operator: 'isEmpty', value: null }],
    actions: [{ type: 'hide', targetId: 'notes-preview' }],
    operator: 'AND',
    enabled: true,
  },
  isNotEmpty: {
    id: 'ref-is-not-empty',
    name: 'Is Not Empty Example',
    conditions: [{ fieldId: 'comments', operator: 'isNotEmpty', value: null }],
    actions: [{ type: 'show', targetId: 'comments-section' }],
    operator: 'AND',
    enabled: true,
  },
  isChecked: {
    id: 'ref-is-checked',
    name: 'Is Checked Example',
    conditions: [{ fieldId: 'newsletter-opt-in', operator: 'isChecked', value: null }],
    actions: [{ type: 'show', targetId: 'email-preferences' }],
    operator: 'AND',
    enabled: true,
  },
  isNotChecked: {
    id: 'ref-is-not-checked',
    name: 'Is Not Checked Example',
    conditions: [{ fieldId: 'terms-accepted', operator: 'isNotChecked', value: null }],
    actions: [{ type: 'disable', targetId: 'submit-button' }],
    operator: 'AND',
    enabled: true,
  },
};