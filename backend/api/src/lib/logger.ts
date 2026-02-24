/**
 * Structured logger for FormAnywhere API.
 *
 * In production: outputs JSON lines (parseable by log aggregators).
 * In development: outputs human-readable colored output.
 *
 * No external dependencies — uses Bun's built-in console with structured data.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    fatal: 50,
};

const isProduction = process.env.NODE_ENV === 'production';
const minLevel = LOG_LEVELS[(process.env.LOG_LEVEL as LogLevel) || (isProduction ? 'info' : 'debug')];

interface LogEntry {
    level: LogLevel;
    msg: string;
    timestamp: string;
    [key: string]: unknown;
}

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= minLevel;
}

function formatDev(entry: LogEntry): string {
    const colors: Record<LogLevel, string> = {
        debug: '\x1b[90m',   // gray
        info: '\x1b[36m',    // cyan
        warn: '\x1b[33m',    // yellow
        error: '\x1b[31m',   // red
        fatal: '\x1b[35m',   // magenta
    };
    const reset = '\x1b[0m';
    const { level, msg, timestamp, ...extra } = entry;
    const extraStr = Object.keys(extra).length > 0
        ? ` ${JSON.stringify(extra)}`
        : '';
    return `${colors[level]}[${level.toUpperCase()}]${reset} ${msg}${extraStr}`;
}

function log(level: LogLevel, msg: string, data?: Record<string, unknown>): void {
    if (!shouldLog(level)) return;

    const entry: LogEntry = {
        level,
        msg,
        timestamp: new Date().toISOString(),
        ...data,
    };

    if (isProduction) {
        // JSON output for log aggregators (ELK, Datadog, Loki, etc.)
        const method = level === 'error' || level === 'fatal' ? 'error' : level === 'warn' ? 'warn' : 'log';
        console[method](JSON.stringify(entry));
    } else {
        const method = level === 'error' || level === 'fatal' ? 'error' : level === 'warn' ? 'warn' : 'log';
        console[method](formatDev(entry));
    }
}

/** Create a child logger with pre-set context fields */
function child(context: Record<string, unknown>) {
    return {
        debug: (msg: string, data?: Record<string, unknown>) => log('debug', msg, { ...context, ...data }),
        info: (msg: string, data?: Record<string, unknown>) => log('info', msg, { ...context, ...data }),
        warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, { ...context, ...data }),
        error: (msg: string, data?: Record<string, unknown>) => log('error', msg, { ...context, ...data }),
        fatal: (msg: string, data?: Record<string, unknown>) => log('fatal', msg, { ...context, ...data }),
    };
}

export const logger = {
    debug: (msg: string, data?: Record<string, unknown>) => log('debug', msg, data),
    info: (msg: string, data?: Record<string, unknown>) => log('info', msg, data),
    warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, data),
    error: (msg: string, data?: Record<string, unknown>) => log('error', msg, data),
    fatal: (msg: string, data?: Record<string, unknown>) => log('fatal', msg, data),
    child,
};
