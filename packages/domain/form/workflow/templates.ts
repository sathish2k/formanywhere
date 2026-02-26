import type { FormWorkflow } from '@formanywhere/shared/types';

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    workflow: Omit<FormWorkflow, 'id'>;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
    {
        id: 'api-success-dialog',
        name: 'API Call + Success Dialog',
        description: 'Makes an API call and shows a success or error dialog based on the result.',
        workflow: {
            name: 'API Call + Success Dialog',
            enabled: true,
            nodes: [
                {
                    id: 'tpl-trigger-submit',
                    type: 'trigger',
                    label: 'On Submit',
                    position: { x: 0, y: 0 },
                    config: {
                        triggerType: 'formSubmit'
                    }
                },
                {
                    id: 'tpl-api',
                    type: 'callApi',
                    label: 'Submit Data',
                    position: { x: 300, y: 0 },
                    config: {
                        api: {
                            url: 'https://api.example.com/submit',
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        }
                    }
                },
                {
                    id: 'tpl-condition',
                    type: 'condition',
                    label: 'Check Result',
                    position: { x: 600, y: 0 },
                    config: {
                        conditionOperator: 'equals',
                        conditionValue: 'success'
                    }
                },
                {
                    id: 'tpl-dialog-success',
                    type: 'showDialog',
                    label: 'Success Dialog',
                    position: { x: 900, y: -100 },
                    config: {
                        dialogTitle: 'Success!',
                        dialogMessage: 'Your data was submitted successfully.'
                    }
                },
                {
                    id: 'tpl-dialog-error',
                    type: 'showDialog',
                    label: 'Error Dialog',
                    position: { x: 900, y: 100 },
                    config: {
                        dialogTitle: 'Error',
                        dialogMessage: 'Failed to submit data.'
                    }
                }
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'tpl-trigger-submit', sourcePort: 'out', targetNodeId: 'tpl-api' },
                { id: 'e2', sourceNodeId: 'tpl-api', sourcePort: 'out', targetNodeId: 'tpl-condition' },
                { id: 'e3', sourceNodeId: 'tpl-condition', sourcePort: 'true', targetNodeId: 'tpl-dialog-success' },
                { id: 'e4', sourceNodeId: 'tpl-condition', sourcePort: 'false', targetNodeId: 'tpl-dialog-error' }
            ]
        }
    },
    {
        id: 'fetch-and-map',
        name: 'Fetch Data & Pre-fill Options',
        description: 'Triggers on page load to fetch remote options and hydrate a field.',
        workflow: {
            name: 'Fetch Data & Pre-fill Options',
            enabled: true,
            nodes: [
                {
                    id: 'tpl-trigger-load',
                    type: 'trigger',
                    label: 'Page Load',
                    position: { x: 0, y: 0 },
                    config: {
                        triggerType: 'pageLoad'
                    }
                },
                {
                    id: 'tpl-api-fetch',
                    type: 'callApi',
                    label: 'Fetch Options',
                    position: { x: 300, y: 0 },
                    config: {
                        api: {
                            url: 'https://api.example.com/options',
                            method: 'GET'
                        }
                    }
                },
                {
                    id: 'tpl-fetch-opts',
                    type: 'fetchOptions',
                    label: 'Hydrate Field',
                    position: { x: 600, y: 0 },
                    config: {
                        responsePath: 'data'
                    }
                }
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'tpl-trigger-load', sourcePort: 'out', targetNodeId: 'tpl-api-fetch' },
                { id: 'e2', sourceNodeId: 'tpl-api-fetch', sourcePort: 'out', targetNodeId: 'tpl-fetch-opts' }
            ]
        }
    }
];
