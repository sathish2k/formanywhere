/**
 * PDF Export — Stub module
 *
 * Generates a PDF from a form schema or submission data.
 * Currently a stub that produces a simple text representation;
 * replace with a real PDF library (jsPDF, @react-pdf/renderer,
 * pdfmake, or a server-side renderer) when ready.
 */

import type { FormSchema, FormElement } from '../types';

export interface PDFExportOptions {
    /** Include form description in the PDF header. */
    includeDescription?: boolean;
    /** Include submission data (key-value pairs). */
    submissionData?: Record<string, unknown>;
    /** Paper size. */
    paperSize?: 'a4' | 'letter';
    /** Orientation. */
    orientation?: 'portrait' | 'landscape';
}

/**
 * Export a form schema (and optionally submission data) to a downloadable file.
 *
 * **Stub implementation** — currently downloads a plain-text summary.
 * Replace the body with a real PDF generation library.
 */
export function exportFormPDF(
    schema: FormSchema,
    options: PDFExportOptions = {},
): void {
    const lines: string[] = [];

    lines.push(`FORM: ${schema.name}`);
    lines.push(`${'='.repeat(40)}`);
    if (options.includeDescription && schema.description) {
        lines.push(schema.description);
        lines.push('');
    }

    lines.push('FIELDS');
    lines.push(`${'-'.repeat(40)}`);
    const flattenElements = (elements: FormElement[], indent = 0) => {
        for (const el of elements) {
            const prefix = '  '.repeat(indent);
            const req = el.required ? ' *' : '';
            lines.push(`${prefix}• [${el.type}] ${el.label}${req}`);
            if (el.elements?.length) {
                flattenElements(el.elements, indent + 1);
            }
        }
    };
    flattenElements(schema.elements);

    if (options.submissionData) {
        lines.push('');
        lines.push('SUBMITTED DATA');
        lines.push(`${'-'.repeat(40)}`);
        for (const [key, value] of Object.entries(options.submissionData)) {
            lines.push(`  ${key}: ${String(value)}`);
        }
    }

    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);

    // Download as text file (stub — replace with PDF blob)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.name.replace(/\s+/g, '_')}_export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // TODO: Replace with real PDF generation:
    // import jsPDF from 'jspdf';
    // const doc = new jsPDF(options.orientation, 'mm', options.paperSize);
    // doc.text(lines.join('\n'), 10, 10);
    // doc.save(`${schema.name}_export.pdf`);
}
