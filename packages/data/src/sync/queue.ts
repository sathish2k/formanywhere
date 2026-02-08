import { getDB } from '../db/indexeddb';
import { generateId } from '@formanywhere/shared';

export interface SyncQueueItem {
    id: string;
    type: 'form' | 'submission';
    operation: 'create' | 'update' | 'delete';
    data: unknown;
    createdAt: Date;
    retryCount: number;
}

export async function addToSyncQueue(
    type: 'form' | 'submission',
    operation: 'create' | 'update' | 'delete',
    data: unknown
): Promise<void> {
    const db = await getDB();
    await db.put('syncQueue', {
        id: generateId(),
        type,
        operation,
        data,
        createdAt: new Date(),
    });
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
    const db = await getDB();
    return db.getAll('syncQueue') as Promise<SyncQueueItem[]>;
}

export async function removeFromSyncQueue(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('syncQueue', id);
}

export async function processSyncQueue(
    syncFn: (item: SyncQueueItem) => Promise<boolean>
): Promise<{ synced: number; failed: number }> {
    const queue = await getSyncQueue();
    let synced = 0;
    let failed = 0;

    for (const item of queue) {
        try {
            const success = await syncFn(item);
            if (success) {
                await removeFromSyncQueue(item.id);
                synced++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error('Sync failed for item:', item.id, error);
            failed++;
        }
    }

    return { synced, failed };
}
