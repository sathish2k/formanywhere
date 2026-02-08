// Form element types
export interface FormElement {
    id: string;
    type: FormElementType;
    label: string;
    required?: boolean;
    placeholder?: string;
    validation?: ValidationRule[];
    conditionalLogic?: ConditionalRule[];
}

export type FormElementType =
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file'
    | 'signature';

export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
    value?: string | number;
    message: string;
}

export interface ConditionalRule {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number | boolean;
    action: 'show' | 'hide' | 'require';
}

// Form schema
export interface FormSchema {
    id: string;
    name: string;
    description?: string;
    elements: FormElement[];
    settings: FormSettings;
    createdAt: Date;
    updatedAt: Date;
}

export interface FormSettings {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    multiPage?: boolean;
    pages?: FormPage[];
}

export interface FormPage {
    id: string;
    title: string;
    elements: string[]; // Element IDs
}

// Submission types
export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, unknown>;
    submittedAt: Date;
    syncStatus: 'pending' | 'synced' | 'failed';
}
