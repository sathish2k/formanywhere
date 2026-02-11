/**
 * AI Form Builder — @formanywhere/form-editor
 * Generates a FormSchema from a natural language prompt.
 * Users describe their form, and AI creates the initial draft.
 * Can be swapped with a real AI backend in the future.
 */
import { createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormSchema, FormElement, FormElementType } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';
import '../../styles.scss';

export interface AIFormBuilderProps {
    onGenerated: (schema: FormSchema) => void;
    onCancel: () => void;
}

/** Suggested prompts to help users get started */
const SUGGESTIONS = [
    { label: 'Customer Feedback', prompt: 'Create a customer feedback survey with rating, comments, and email fields' },
    { label: 'Job Application', prompt: 'Create a job application form with name, email, resume upload, and work experience' },
    { label: 'Event Registration', prompt: 'Create an event registration form with attendee name, email, number of guests, and dietary preferences' },
    { label: 'Contact Form', prompt: 'Create a simple contact form with name, email, subject, and message' },
    { label: 'Bug Report', prompt: 'Create a bug report form with title, severity, steps to reproduce, expected behavior, and screenshots' },
    { label: 'Course Evaluation', prompt: 'Create a course evaluation form with instructor rating, course rating, and feedback' },
];

/**
 * Parse a user prompt into form elements.
 * Local parser that extracts intent from common patterns.
 */
function parsePromptToSchema(prompt: string): FormSchema {
    const lower = prompt.toLowerCase();
    const elements: FormElement[] = [];

    const fieldPatterns: Array<{
        patterns: string[];
        type: FormElementType;
        label: string;
        placeholder?: string;
        required?: boolean;
    }> = [
        { patterns: ['name', 'full name', 'your name'], type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
        { patterns: ['first name'], type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
        { patterns: ['last name'], type: 'text', label: 'Last Name', placeholder: 'Enter your last name', required: true },
        { patterns: ['email', 'e-mail', 'email address'], type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
        { patterns: ['phone', 'phone number', 'mobile'], type: 'text', label: 'Phone Number', placeholder: '+1 (555) 000-0000' },
        { patterns: ['subject', 'topic'], type: 'text', label: 'Subject', placeholder: 'Enter the subject' },
        { patterns: ['message', 'comments', 'feedback', 'additional comments', 'notes'], type: 'textarea', label: 'Message', placeholder: 'Write your message here...' },
        { patterns: ['description', 'details', 'explain'], type: 'textarea', label: 'Description', placeholder: 'Provide details...' },
        { patterns: ['rating', 'rate', 'score', 'star'], type: 'number', label: 'Rating (1-5)', placeholder: '1-5' },
        { patterns: ['date', 'event date', 'start date', 'end date'], type: 'date', label: 'Date', placeholder: 'Select a date' },
        { patterns: ['file', 'upload', 'attachment', 'resume', 'screenshot', 'document'], type: 'file', label: 'File Upload' },
        { patterns: ['checkbox', 'agree', 'terms', 'consent', 'accept'], type: 'checkbox', label: 'I agree to the terms and conditions' },
        { patterns: ['company', 'organization', 'company name'], type: 'text', label: 'Company', placeholder: 'Enter company name' },
        { patterns: ['address', 'street', 'location'], type: 'textarea', label: 'Address', placeholder: 'Enter your address' },
        { patterns: ['age', 'number of', 'count', 'quantity', 'guests', 'attendees'], type: 'number', label: 'Number', placeholder: 'Enter a number' },
        { patterns: ['preference', 'dietary', 'option', 'choose', 'select', 'category', 'type', 'severity', 'priority'], type: 'select', label: 'Select Option', placeholder: 'Choose an option' },
        { patterns: ['radio', 'gender', 'yes/no', 'yes or no'], type: 'radio', label: 'Choose One' },
        { patterns: ['signature', 'sign'], type: 'signature', label: 'Signature' },
        { patterns: ['experience', 'work experience', 'background'], type: 'textarea', label: 'Experience', placeholder: 'Describe your experience...' },
        { patterns: ['steps to reproduce', 'reproduce'], type: 'textarea', label: 'Steps to Reproduce', placeholder: 'Step 1:\nStep 2:\nStep 3:' },
        { patterns: ['expected behavior', 'expected'], type: 'textarea', label: 'Expected Behavior', placeholder: 'What did you expect to happen?' },
        { patterns: ['title'], type: 'text', label: 'Title', placeholder: 'Enter a title', required: true },
        { patterns: ['instructor'], type: 'text', label: 'Instructor Name', placeholder: 'Instructor name' },
    ];

    const added = new Set<string>();

    for (const fp of fieldPatterns) {
        for (const pattern of fp.patterns) {
            if (lower.includes(pattern) && !added.has(fp.label)) {
                added.add(fp.label);
                elements.push({
                    id: generateId(),
                    type: fp.type,
                    label: fp.label,
                    required: fp.required ?? false,
                    placeholder: fp.placeholder,
                });
                break;
            }
        }
    }

    // Fallback: sensible default fields
    if (elements.length === 0) {
        elements.push(
            { id: generateId(), type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
            { id: generateId(), type: 'email', label: 'Email', required: true, placeholder: 'you@example.com' },
            { id: generateId(), type: 'textarea', label: 'Message', required: false, placeholder: 'Write your message...' },
        );
    }

    const nameMatch = prompt.match(/(?:create|build|make|generate)\s+(?:a|an)?\s*(.+?)(?:\s+(?:form|survey|questionnaire|template))/i);
    const formName = nameMatch?.[1]
        ? `${nameMatch[1].charAt(0).toUpperCase()}${nameMatch[1].slice(1)} Form`
        : 'AI Generated Form';

    return {
        id: generateId(),
        name: formName,
        description: prompt,
        elements,
        settings: {
            submitButtonText: 'Submit',
            successMessage: 'Thank you for your submission!',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export const AIFormBuilder: Component<AIFormBuilderProps> = (props) => {
    const [prompt, setPrompt] = createSignal('');
    const [generating, setGenerating] = createSignal(false);
    const [previewSchema, setPreviewSchema] = createSignal<FormSchema | null>(null);

    const handleGenerate = async () => {
        const text = prompt().trim();
        if (!text) return;

        setGenerating(true);
        await new Promise((r) => setTimeout(r, 800));

        const schema = parsePromptToSchema(text);
        setPreviewSchema(schema);
        setGenerating(false);
    };

    const handleAccept = () => {
        const schema = previewSchema();
        if (schema) props.onGenerated(schema);
    };

    const handleRegenerate = () => {
        setPreviewSchema(null);
        handleGenerate();
    };

    return (
        <div class="ai-form-builder">
            <div class="ai-form-builder__container">
                {/* Header */}
                <div class="ai-form-builder__header">
                    <div class="ai-form-builder__icon-box">
                        <Icon name="sparkle" size={32} />
                    </div>
                    <Typography variant="headline-small">
                        Create with AI
                    </Typography>
                    <Typography variant="body-medium" color="on-surface-variant">
                        Describe the form you need and AI will create the first draft for you.
                    </Typography>
                </div>

                {/* Prompt Input */}
                <Show when={!previewSchema()}>
                    <div class="ai-form-builder__input-area">
                        <textarea
                            class="ai-form-builder__textarea"
                            placeholder="Describe the form you want to create..."
                            value={prompt()}
                            onInput={(e) => setPrompt(e.currentTarget.value)}
                            rows={4}
                        />

                        <div class="ai-form-builder__suggestions">
                            <Typography variant="label-medium" color="on-surface-variant">
                                Try a suggestion:
                            </Typography>
                            <div class="ai-form-builder__suggestion-chips">
                                <For each={SUGGESTIONS}>
                                    {(s) => (
                                        <button
                                            class="ai-form-builder__chip"
                                            onClick={() => setPrompt(s.prompt)}
                                        >
                                            {s.label}
                                        </button>
                                    )}
                                </For>
                            </div>
                        </div>

                        <div class="ai-form-builder__actions">
                            <Button variant="text" onClick={props.onCancel}>Cancel</Button>
                            <Button
                                variant="filled"
                                onClick={handleGenerate}
                                disabled={!prompt().trim() || generating()}
                            >
                                <Icon name="sparkle" size={18} />
                                {generating() ? 'Generating...' : 'Generate Form'}
                            </Button>
                        </div>
                    </div>
                </Show>

                {/* Preview Generated Schema */}
                <Show when={previewSchema()}>
                    {(schema) => (
                        <div class="ai-form-builder__preview">
                            <Typography variant="title-medium">{schema().name}</Typography>
                            <Show when={schema().description}>
                                <Typography variant="body-small" color="on-surface-variant">
                                    {schema().description}
                                </Typography>
                            </Show>

                            <div class="ai-form-builder__fields-preview">
                                <For each={schema().elements}>
                                    {(element) => (
                                        <div class="ai-form-builder__field-item">
                                            <span class="ai-form-builder__field-type">{element.type}</span>
                                            <span class="ai-form-builder__field-label">{element.label}</span>
                                            <Show when={element.required}>
                                                <span class="ai-form-builder__field-required">Required</span>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>

                            <div class="ai-form-builder__preview-actions">
                                <Button variant="text" onClick={props.onCancel}>Cancel</Button>
                                <Button variant="outlined" onClick={handleRegenerate}>
                                    <Icon name="sparkle" size={18} />
                                    Regenerate
                                </Button>
                                <Button variant="filled" onClick={handleAccept}>
                                    <Icon name="check" size={18} />
                                    Use This Form
                                </Button>
                            </div>
                        </div>
                    )}
                </Show>
            </div>
        </div>
    );
};
