/**
 * Rules Engine
 * Evaluates conditional logic and applies actions based on form state
 */

import { Condition, ConditionalLogic, Rule, RuleAction, DroppedElement } from '../types/form.types';

export class RulesEngine {
  private formData: Record<string, any>;
  private elements: DroppedElement[];
  private rules: Rule[];

  constructor(elements: DroppedElement[], rules: Rule[] = []) {
    this.formData = {};
    this.elements = elements;
    this.rules = rules;
  }

  /**
   * Update form data
   */
  updateFormData(fieldId: string, value: any): void {
    this.formData[fieldId] = value;
    this.evaluateRules();
  }

  /**
   * Get current form data
   */
  getFormData(): Record<string, any> {
    return { ...this.formData };
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: Condition): boolean {
    const fieldValue = this.formData[condition.fieldId];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      
      case 'notEquals':
        return fieldValue !== condition.value;
      
      case 'contains':
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(condition.value);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(condition.value);
        }
        return false;
      
      case 'notContains':
        if (typeof fieldValue === 'string') {
          return !fieldValue.includes(condition.value);
        }
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(condition.value);
        }
        return true;
      
      case 'startsWith':
        if (typeof fieldValue === 'string') {
          return fieldValue.startsWith(condition.value);
        }
        return false;
      
      case 'endsWith':
        if (typeof fieldValue === 'string') {
          return fieldValue.endsWith(condition.value);
        }
        return false;
      
      case 'greaterThan':
        return Number(fieldValue) > Number(condition.value);
      
      case 'lessThan':
        return Number(fieldValue) < Number(condition.value);
      
      case 'greaterThanOrEqual':
        return Number(fieldValue) >= Number(condition.value);
      
      case 'lessThanOrEqual':
        return Number(fieldValue) <= Number(condition.value);
      
      case 'isEmpty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      
      case 'isNotEmpty':
        return !!fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      
      case 'isChecked':
        return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
      
      case 'isNotChecked':
        return !fieldValue || fieldValue === false || fieldValue === 'false' || fieldValue === 0;
      
      default:
        return false;
    }
  }

  /**
   * Evaluate conditional logic
   */
  evaluateConditionalLogic(logic: ConditionalLogic): boolean {
    if (!logic.conditions || logic.conditions.length === 0) {
      return true;
    }

    const results = logic.conditions.map(condition => this.evaluateCondition(condition));

    if (logic.operator === 'AND') {
      return results.every(result => result);
    } else {
      return results.some(result => result);
    }
  }

  /**
   * Evaluate all rules and return state updates
   */
  evaluateRules(): RuleEvaluationResult {
    const result: RuleEvaluationResult = {
      visibility: {},
      enabled: {},
      required: {},
      values: {},
    };

    // Initialize with default states
    this.elements.forEach(element => {
      result.visibility[element.id] = true;
      result.enabled[element.id] = true;
      result.required[element.id] = element.required || false;
    });

    // Evaluate each rule
    this.rules.forEach(rule => {
      if (!rule.enabled) return;

      const conditionsMet = this.evaluateConditionalLogic({
        conditions: rule.conditions,
        operator: rule.operator,
        action: 'show'
      });

      if (conditionsMet) {
        rule.actions.forEach(action => {
          this.applyAction(action, result);
        });
      }
    });

    return result;
  }

  /**
   * Apply a rule action
   */
  private applyAction(action: RuleAction, result: RuleEvaluationResult): void {
    if (!action.targetId) return;

    switch (action.type) {
      case 'show':
        result.visibility[action.targetId] = true;
        break;
      
      case 'hide':
        result.visibility[action.targetId] = false;
        break;
      
      case 'enable':
        result.enabled[action.targetId] = true;
        break;
      
      case 'disable':
        result.enabled[action.targetId] = false;
        break;
      
      case 'require':
        result.required[action.targetId] = true;
        break;
      
      case 'setValue':
        result.values[action.targetId] = action.value;
        break;
    }
  }

  /**
   * Validate form data against validation rules
   */
  validateForm(): ValidationResult {
    const errors: Record<string, string> = {};
    let isValid = true;

    const ruleResult = this.evaluateRules();

    this.elements.forEach(element => {
      // Skip hidden elements
      if (!ruleResult.visibility[element.id]) {
        return;
      }

      const value = this.formData[element.id];
      const isRequired = ruleResult.required[element.id];

      // Check required
      if (isRequired && (!value || value === '')) {
        errors[element.id] = `${element.label} is required`;
        isValid = false;
        return;
      }

      // Skip validation if empty and not required
      if (!value || value === '') {
        return;
      }

      // Type-specific validation
      if (element.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[element.id] = 'Please enter a valid email address';
          isValid = false;
          return;
        }
      }

      if (element.type === 'url') {
        try {
          new URL(value);
        } catch {
          errors[element.id] = 'Please enter a valid URL';
          isValid = false;
          return;
        }
      }

      if (element.type === 'phone') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
          errors[element.id] = 'Please enter a valid phone number';
          isValid = false;
          return;
        }
      }

      // Custom validation rules
      if (element.validation) {
        if (element.validation.minLength && value.length < element.validation.minLength) {
          errors[element.id] = element.validation.message || `Minimum length is ${element.validation.minLength}`;
          isValid = false;
          return;
        }

        if (element.validation.maxLength && value.length > element.validation.maxLength) {
          errors[element.id] = element.validation.message || `Maximum length is ${element.validation.maxLength}`;
          isValid = false;
          return;
        }

        if (element.validation.pattern) {
          const regex = new RegExp(element.validation.pattern);
          if (!regex.test(value)) {
            errors[element.id] = element.validation.message || 'Invalid format';
            isValid = false;
            return;
          }
        }

        if (element.validation.min !== undefined && Number(value) < element.validation.min) {
          errors[element.id] = element.validation.message || `Minimum value is ${element.validation.min}`;
          isValid = false;
          return;
        }

        if (element.validation.max !== undefined && Number(value) > element.validation.max) {
          errors[element.id] = element.validation.message || `Maximum value is ${element.validation.max}`;
          isValid = false;
          return;
        }

        if (element.validation.customRule && !element.validation.customRule(value)) {
          errors[element.id] = element.validation.message || 'Invalid value';
          isValid = false;
          return;
        }
      }
    });

    return { isValid, errors };
  }

  /**
   * Check if an element should be visible
   */
  isElementVisible(elementId: string): boolean {
    const element = this.elements.find(el => el.id === elementId);
    if (!element || !element.conditionalLogic) {
      return true;
    }

    const shouldShow = this.evaluateConditionalLogic(element.conditionalLogic);
    
    return element.conditionalLogic.action === 'show' ? shouldShow : !shouldShow;
  }

  /**
   * Add a new rule
   */
  addRule(rule: Rule): void {
    this.rules.push(rule);
    this.evaluateRules();
  }

  /**
   * Update an existing rule
   */
  updateRule(ruleId: string, updates: Partial<Rule>): void {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      this.evaluateRules();
    }
  }

  /**
   * Delete a rule
   */
  deleteRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
    this.evaluateRules();
  }

  /**
   * Get all rules
   */
  getRules(): Rule[] {
    return [...this.rules];
  }
}

export interface RuleEvaluationResult {
  visibility: Record<string, boolean>;
  enabled: Record<string, boolean>;
  required: Record<string, boolean>;
  values: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}