/**
 * Test-safe shim for @formanywhere/shared/types
 *
 * Self-contained replacement used as a vitest alias for @formanywhere/shared/types.
 * The real module re-exports from @formanywhere/domain/form creating a circular
 * resolution loop. This shim inlines all types to break the cycle.
 */

// ── Form Rules ───────────────────────────────────────────────────────────────

export interface RuleCondition {
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value: string;
}

export interface RuleAction {
    type: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'setValue' | 'navigate';
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

// ── Workflow Types (from domain/form/workflow/types) ──────────────────────────

export type WorkflowNodeType = 'trigger' | 'page' | 'callApi' | 'setData' | 'fetchOptions' | 'showDialog' | 'redirect' | 'condition';
export type TriggerType = 'pageLoad' | 'fieldChange' | 'formSubmit';
export interface NodePosition { x: number; y: number; }

export interface WorkflowApiConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    bodyTemplate?: string;
}

export interface DataMappingEntry { from: string; to: string; }

export interface WorkflowNodeConfig {
    triggerType?: TriggerType;
    triggerFieldId?: string;
    pageId?: string;
    api?: WorkflowApiConfig;
    dataMapping?: DataMappingEntry[];
    targetFieldId?: string;
    labelKey?: string;
    valueKey?: string;
    responsePath?: string;
    dialogTitle?: string;
    dialogMessage?: string;
    redirectUrl?: string;
    redirectNewTab?: boolean;
    conditionField?: string;
    conditionOperator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    conditionValue?: string;
}

export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    label: string;
    position: NodePosition;
    config: WorkflowNodeConfig;
}

export type EdgeSourcePort = 'out' | 'true' | 'false';

export interface WorkflowEdge {
    id: string;
    sourceNodeId: string;
    sourcePort: EdgeSourcePort;
    targetNodeId: string;
}

export interface FormWorkflow {
    id: string;
    name: string;
    enabled: boolean;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

export interface NodeExecutionResult {
    nodeId: string;
    type: WorkflowNodeType;
    status: 'success' | 'error' | 'skipped';
    data?: unknown;
    error?: string;
    branch?: 'true' | 'false';
}

export interface WorkflowExecutionResult {
    workflowId: string;
    results: NodeExecutionResult[];
    fieldUpdates: Record<string, unknown>;
    optionUpdates: Record<string, Array<{ label: string; value: string }>>;
    redirectUrl?: string;
    redirectNewTab?: boolean;
    dialog?: { title: string; message: string };
}

export interface WorkflowValidationIssue {
    nodeId?: string;
    severity: 'error' | 'warning';
    message: string;
}

export interface WorkflowValidationResult {
    valid: boolean;
    issues: WorkflowValidationIssue[];
}

// ── Core Form Types ──────────────────────────────────────────────────────────

export interface FormElement {
    id: string;
    type: FormElementType;
    label: string;
    required?: boolean;
    placeholder?: string;
    description?: string;
    validation?: ValidationRule[];
    conditionalLogic?: ConditionalRule[];
    options?: Array<{ label: string; value: string }>;
    elements?: FormElement[];
    [key: string]: unknown;
}

export type FormElementType =
    | 'container' | 'grid' | 'section' | 'card' | 'grid-column'
    | 'divider' | 'spacer' | 'heading' | 'logo' | 'text-block'
    | 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'url'
    | 'select' | 'radio' | 'checkbox' | 'switch'
    | 'date' | 'time'
    | 'file' | 'rating' | 'signature';

export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
    value?: string | number;
    message: string;
}

export interface ConditionalRule {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number | boolean;
    action: 'show' | 'hide' | 'require';
}

export interface FormSchema {
    id: string;
    name: string;
    description?: string;
    elements: FormElement[];
    settings: FormSettings;
    rules?: FormRule[];
    workflows?: FormWorkflow[];
    createdAt: Date;
    updatedAt: Date;
}

export interface FormSettings {
    submitButtonText: string;
    successMessage: string;
    successHeading?: string;
    successShowData?: boolean;
    successButtonText?: string;
    successButtonUrl?: string;
    redirectUrl?: string;
    redirectDelay?: number;
    multiPage?: boolean;
    pages?: FormPage[];
    theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        surfaceColor?: string;
        borderRadius?: number;
        fontFamily?: string;
    };
    customCSS?: string;
    googleFontUrl?: string;
    externalCSS?: string[];
    externalJS?: string[];
}

export interface FormPage {
    id: string;
    title: string;
    elements: string[];
}

export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, unknown>;
    submittedAt: Date;
    syncStatus: 'pending' | 'synced' | 'failed';
}
