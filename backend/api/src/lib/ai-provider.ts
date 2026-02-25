/**
 * Unified AI Provider — supports Gemini (default) and OpenRouter.
 *
 * Provider is selected via AI_PROVIDER env var:
 *   "gemini"     — Google Gemini via @google/genai (default)
 *   "openrouter" — Any model via OpenRouter (OpenAI-compatible)
 *
 * Usage:
 *   import { ai } from '../lib/ai-provider';
 *   const text = await ai.generateText('Write a poem');
 *   const json = await ai.generateJSON('Return JSON: ...', schema);
 */
import { GoogleGenAI } from '@google/genai';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AIProviderType = 'gemini' | 'openrouter';

export interface GenerateOptions {
    /** Model tier — maps to provider-specific model IDs */
    model?: 'fast' | 'pro';
    /** Enable extended thinking (Gemini thinkingConfig, ignored on OpenRouter unless model supports it) */
    thinking?: boolean;
    /** Thinking token budget (Gemini-specific) */
    thinkingBudget?: number;
    /** Enable web search grounding (Gemini Google Search tool) */
    webSearch?: boolean;
    /** Response MIME type — 'text/plain' (default) or 'application/json' */
    responseMimeType?: 'text/plain' | 'application/json';
    /** Temperature (0-2) */
    temperature?: number;
    /** Max output tokens */
    maxTokens?: number;
}

interface AIProvider {
    generateText(prompt: string, options?: GenerateOptions): Promise<string>;
}

// ─── Model Maps ─────────────────────────────────────────────────────────────

/**
 * Default model mapping per provider. Override with env vars:
 *   AI_MODEL_FAST — model for quick tasks (chat, summaries, editing)
 *   AI_MODEL_PRO  — model for heavy tasks (blog writing, deep analysis)
 */
const DEFAULT_MODELS: Record<AIProviderType, Record<string, string>> = {
    gemini: {
        fast: 'gemini-2.5-flash',
        pro: 'gemini-2.5-pro',
    },
    openrouter: {
        fast: 'google/gemini-2.5-flash',
        pro: 'google/gemini-2.5-pro',
    },
};

function getModelId(tier: 'fast' | 'pro'): string {
    const provider = getProviderType();
    if (tier === 'fast' && process.env.AI_MODEL_FAST) return process.env.AI_MODEL_FAST;
    if (tier === 'pro' && process.env.AI_MODEL_PRO) return process.env.AI_MODEL_PRO;
    return DEFAULT_MODELS[provider][tier];
}

function getProviderType(): AIProviderType {
    const val = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    if (val === 'openrouter') return 'openrouter';
    return 'gemini';
}

// ─── Gemini Provider ────────────────────────────────────────────────────────

function createGeminiProvider(): AIProvider {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    return {
        async generateText(prompt, options = {}) {
            const model = getModelId(options.model ?? 'fast');
            const config: Record<string, any> = {};

            if (options.responseMimeType === 'application/json') {
                config.responseMimeType = 'application/json';
            }
            if (options.thinking && options.thinkingBudget) {
                config.thinkingConfig = { thinkingBudget: options.thinkingBudget };
            }
            if (options.temperature !== undefined) {
                config.temperature = options.temperature;
            }
            if (options.maxTokens) {
                config.maxOutputTokens = options.maxTokens;
            }

            const tools: any[] = [];
            if (options.webSearch) {
                tools.push({ googleSearch: {} });
            }

            const response = await client.models.generateContent({
                model,
                contents: prompt,
                config: {
                    ...config,
                    ...(tools.length > 0 ? { tools } : {}),
                },
            });

            return response.text || '';
        },
    };
}

// ─── OpenRouter Provider ────────────────────────────────────────────────────

function createOpenRouterProvider(): AIProvider {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter');
    }

    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    return {
        async generateText(prompt, options = {}) {
            const model = getModelId(options.model ?? 'fast');

            const body: Record<string, any> = {
                model,
                messages: [
                    { role: 'user', content: prompt },
                ],
            };

            if (options.temperature !== undefined) {
                body.temperature = options.temperature;
            }
            if (options.maxTokens) {
                body.max_tokens = options.maxTokens;
            }
            if (options.responseMimeType === 'application/json') {
                body.response_format = { type: 'json_object' };
            }

            // Some OpenRouter models support extended thinking via provider params
            if (options.thinking && options.thinkingBudget) {
                body.provider = {
                    ...body.provider,
                    require_parameters: false,
                };
                // Include thinking hint in system message for models that support it
                body.messages.unshift({
                    role: 'system',
                    content: 'Think step by step before responding. Use extended reasoning.',
                });
            }

            // Web search — OpenRouter supports this via plugins for some models
            if (options.webSearch) {
                body.plugins = [...(body.plugins || []), { id: 'web-search' }];
            }

            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.APP_URL || 'https://formanywhere.com',
                    'X-Title': 'FormAnywhere',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => response.statusText);
                throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
            }

            const data = await response.json() as {
                choices?: { message?: { content?: string } }[];
            };

            return data.choices?.[0]?.message?.content || '';
        },
    };
}

// ─── Singleton Export ───────────────────────────────────────────────────────

let _provider: AIProvider | null = null;

function getProvider(): AIProvider {
    if (_provider) return _provider;
    const type = getProviderType();
    console.log(`🤖 AI Provider: ${type} (fast: ${getModelId('fast')}, pro: ${getModelId('pro')})`);
    _provider = type === 'openrouter' ? createOpenRouterProvider() : createGeminiProvider();
    return _provider;
}

/** Unified AI provider — call `ai.generateText(prompt, options)` */
export const ai = {
    generateText(prompt: string, options?: GenerateOptions): Promise<string> {
        return getProvider().generateText(prompt, options);
    },

    /** Convenience: generate and parse JSON */
    async generateJSON<T = any>(prompt: string, options?: Omit<GenerateOptions, 'responseMimeType'>): Promise<T> {
        const text = await getProvider().generateText(prompt, {
            ...options,
            responseMimeType: 'application/json',
        });
        return JSON.parse(text);
    },

    /** Get current provider type */
    get provider(): AIProviderType {
        return getProviderType();
    },
};
