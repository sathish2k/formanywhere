/**
 * Workflow Execution Engine
 * Executes workflow nodes based on form submission
 */

import type { Node, Edge } from 'reactflow';

export interface WorkflowContext {
    formData: Record<string, any>;
    variables: Record<string, any>;
    startTime: Date;
}

export interface WorkflowExecutionResult {
    success: boolean;
    executedNodes: string[];
    errors: string[];
    context: WorkflowContext;
}

export class WorkflowExecutionEngine {
    private nodes: Node[];
    private edges: Edge[];
    private context: WorkflowContext;

    constructor(nodes: Node[], edges: Edge[], formData: Record<string, any>) {
        this.nodes = nodes;
        this.edges = edges;
        this.context = {
            formData,
            variables: {},
            startTime: new Date(),
        };
    }

    /**
     * Execute the workflow from start node
     */
    async execute(): Promise<WorkflowExecutionResult> {
        const result: WorkflowExecutionResult = {
            success: true,
            executedNodes: [],
            errors: [],
            context: this.context,
        };

        try {
            // Find start node
            const startNode = this.nodes.find((node) => node.data.type === 'start');
            if (!startNode) {
                result.success = false;
                result.errors.push('No start node found in workflow');
                return result;
            }

            // Execute from start node
            await this.executeNode(startNode, result);
        } catch (error) {
            result.success = false;
            result.errors.push(error instanceof Error ? error.message : 'Unknown error');
        }

        return result;
    }

    /**
     * Execute a single node
     */
    private async executeNode(node: Node, result: WorkflowExecutionResult): Promise<void> {
        // Skip if already executed
        if (result.executedNodes.includes(node.id)) {
            return;
        }

        result.executedNodes.push(node.id);

        const nodeType = node.data.type;
        const nodeConfig = node.data.config || {};

        try {
            switch (nodeType) {
                case 'start':
                    // Start node - just continue to next
                    break;

                case 'api':
                    await this.executeApiCall(nodeConfig);
                    break;

                case 'condition':
                    await this.executeCondition(node, nodeConfig, result);
                    return; // Condition handles its own branching

                case 'transform':
                    this.executeTransform(nodeConfig);
                    break;

                case 'action':
                    this.executeFormAction(nodeConfig);
                    break;

                case 'email':
                    await this.executeEmail(nodeConfig);
                    break;

                case 'webhook':
                    await this.executeWebhook(nodeConfig);
                    break;

                case 'navigate':
                    this.executeNavigate(nodeConfig);
                    break;

                case 'variable':
                    this.executeSetVariable(nodeConfig);
                    break;

                default:
                    console.warn(`Unknown node type: ${nodeType}`);
            }

            // Find and execute next nodes
            const nextNodes = this.getNextNodes(node.id);
            for (const nextNode of nextNodes) {
                await this.executeNode(nextNode, result);
            }
        } catch (error) {
            result.errors.push(`Error in node ${node.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Execute API call node
     */
    private async executeApiCall(config: any): Promise<void> {
        const { method = 'GET', url, headers = {}, body } = config;

        if (!url) {
            throw new Error('API call requires URL');
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        this.context.variables['apiResponse'] = data;
    }

    /**
     * Execute condition node (branching)
     */
    private async executeCondition(
        node: Node,
        config: any,
        result: WorkflowExecutionResult
    ): Promise<void> {
        const { fieldId, operator, value } = config;

        if (!fieldId) {
            throw new Error('Condition requires field ID');
        }

        const fieldValue = this.context.formData[fieldId];
        let conditionMet = false;

        // Evaluate condition
        switch (operator) {
            case 'equals':
                conditionMet = fieldValue === value;
                break;
            case 'notEquals':
                conditionMet = fieldValue !== value;
                break;
            case 'contains':
                conditionMet = String(fieldValue).includes(value);
                break;
            case 'greaterThan':
                conditionMet = Number(fieldValue) > Number(value);
                break;
            case 'lessThan':
                conditionMet = Number(fieldValue) < Number(value);
                break;
            default:
                conditionMet = false;
        }

        // Find true/false branches
        const trueBranch = this.edges.find(
            (edge) => edge.source === node.id && edge.sourceHandle === 'true'
        );
        const falseBranch = this.edges.find(
            (edge) => edge.source === node.id && edge.sourceHandle === 'false'
        );

        // Execute appropriate branch
        const branchEdge = conditionMet ? trueBranch : falseBranch;
        if (branchEdge) {
            const nextNode = this.nodes.find((n) => n.id === branchEdge.target);
            if (nextNode) {
                await this.executeNode(nextNode, result);
            }
        }
    }

    /**
     * Execute data transformation
     */
    private executeTransform(config: any): void {
        const { code } = config;
        if (!code) return;

        try {
            // Simple transformation - in production, use a safer eval alternative
            const transformFn = new Function('data', 'variables', code);
            const result = transformFn(this.context.formData, this.context.variables);
            this.context.variables['transformResult'] = result;
        } catch (error) {
            console.error('Transform error:', error);
        }
    }

    /**
     * Execute form action (show/hide/enable/disable fields)
     */
    private executeFormAction(config: any): void {
        const { action, targetId } = config;
        // This would be handled by the form renderer
        // For now, just store in variables for reference
        this.context.variables[`action_${targetId}`] = action;
    }

    /**
     * Execute email sending
     */
    private async executeEmail(config: any): Promise<void> {
        const { to, subject, body } = config;

        if (!to || !subject) {
            throw new Error('Email requires recipient and subject');
        }

        // In production, call your email service API
        console.log('Sending email:', { to, subject, body });
        // await emailService.send({ to, subject, body });
    }

    /**
     * Execute webhook call
     */
    private async executeWebhook(config: any): Promise<void> {
        const { url, payload } = config;

        if (!url) {
            throw new Error('Webhook requires URL');
        }

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload || this.context.formData),
        });
    }

    /**
     * Execute navigation
     */
    private executeNavigate(config: any): void {
        const { url } = config;
        if (url) {
            this.context.variables['navigateTo'] = url;
        }
    }

    /**
     * Execute set variable
     */
    private executeSetVariable(config: any): void {
        const { variableName, source, value } = config;

        if (!variableName) return;

        if (source === 'field' && value) {
            this.context.variables[variableName] = this.context.formData[value];
        } else if (source === 'custom') {
            this.context.variables[variableName] = value;
        }
    }

    /**
     * Get next nodes connected to current node
     */
    private getNextNodes(nodeId: string): Node[] {
        const outgoingEdges = this.edges.filter((edge) => edge.source === nodeId);
        return outgoingEdges
            .map((edge) => this.nodes.find((node) => node.id === edge.target))
            .filter((node): node is Node => node !== undefined);
    }

    /**
     * Get workflow context
     */
    getContext(): WorkflowContext {
        return this.context;
    }
}
