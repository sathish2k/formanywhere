/**
 * Form Logic Rules — types for conditional logic & workflow automation
 * Migrated from AI-Powered Form Builder UI
 */

export interface RuleCondition {
    fieldId: string;
    operator:
        | 'equals'
        | 'notEquals'
        | 'contains'
        | 'notContains'
        | 'greaterThan'
        | 'lessThan'
        | 'isEmpty'
        | 'isNotEmpty';
    value: string;
}

export interface RuleAction {
    type:
        | 'show'
        | 'hide'
        | 'enable'
        | 'disable'
        | 'require'
        | 'setValue'
        | 'navigate';
    targetId: string;
    value: string;
}

export interface FormRule {
    id: string;
    name: string;
    enabled: boolean;
    trigger: 'onChange' | 'onBlur' | 'onFocus' | 'onSubmit' | 'onPageLoad';
    triggerFieldId?: string;
    conditions: RuleCondition[];
    conditionOperator: 'AND' | 'OR';
    actions: RuleAction[];
}
