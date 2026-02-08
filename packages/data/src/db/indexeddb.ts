import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION } from '@formanywhere/shared';
import type { FormSchema, FormSubmission } from '@formanywhere/shared';

interface FormAnywhereDB extends DBSchema {
    forms: {
        key: string;
        value: FormSchema;
        indexes: { 'by-updated': Date };
    };
    submissions: {
        key: string;
        value: FormSubmission;
        indexes: { 'by-form': string; 'by-sync-status': string };
    };
    syncQueue: {
        key: string;
        value: {
            id: string;
            type: 'form' | 'submission';
            operation: 'create' | 'update' | 'delete';
            data: unknown;
            createdAt: Date;
        };
    };
}

let dbInstance: IDBPDatabase<FormAnywhereDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FormAnywhereDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<FormAnywhereDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Forms store
            if (!db.objectStoreNames.contains('forms')) {
                const formStore = db.createObjectStore('forms', { keyPath: 'id' });
                formStore.createIndex('by-updated', 'updatedAt');
            }

            // Submissions store
            if (!db.objectStoreNames.contains('submissions')) {
                const subStore = db.createObjectStore('submissions', { keyPath: 'id' });
                subStore.createIndex('by-form', 'formId');
                subStore.createIndex('by-sync-status', 'syncStatus');
            }

            // Sync queue store
            if (!db.objectStoreNames.contains('syncQueue')) {
                db.createObjectStore('syncQueue', { keyPath: 'id' });
            }
        },
    });

    return dbInstance;
}

// Form operations
export async function saveForm(form: FormSchema): Promise<void> {
    const db = await getDB();
    await db.put('forms', form);
}

export async function getForm(id: string): Promise<FormSchema | undefined> {
    const db = await getDB();
    return db.get('forms', id);
}

export async function getAllForms(): Promise<FormSchema[]> {
    const db = await getDB();
    return db.getAll('forms');
}

export async function deleteForm(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('forms', id);
}

// Submission operations
export async function saveSubmission(submission: FormSubmission): Promise<void> {
    const db = await getDB();
    await db.put('submissions', submission);
}

export async function getSubmissionsByForm(formId: string): Promise<FormSubmission[]> {
    const db = await getDB();
    return db.getAllFromIndex('submissions', 'by-form', formId);
}

export async function getPendingSubmissions(): Promise<FormSubmission[]> {
    const db = await getDB();
    return db.getAllFromIndex('submissions', 'by-sync-status', 'pending');
}
