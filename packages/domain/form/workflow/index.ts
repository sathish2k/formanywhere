/**
 * Workflow Engine — Barrel Export
 *
 * Public API for the form workflow domain module.
 */
export type {
    WorkflowNodeType,
    TriggerType,
    NodePosition,
    WorkflowApiConfig,
    DataMappingEntry,
    WorkflowNodeConfig,
    WorkflowNode,
    EdgeSourcePort,
    WorkflowEdge,
    FormWorkflow,
    NodeExecutionResult,
    WorkflowExecutionResult,
    WorkflowValidationIssue,
    WorkflowValidationResult,
} from './types';

export {
    interpolate,
    findStartNodes,
    resolveNextNodes,
    extractPath,
    applyDataMapping,
    extractOptions,
    evaluateConditionNode,
    executeWorkflow,
    findWorkflowsForField,
    findPageLoadWorkflows,
    findSubmitWorkflows,
    validateWorkflow,
} from './engine';
export type { ApiCaller } from './engine';

export { autoLayoutWorkflow } from './layout';
export { WORKFLOW_TEMPLATES } from './templates';
export type { WorkflowTemplate } from './templates';
