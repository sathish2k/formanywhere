// Conflict resolution strategies for offline sync

export type ConflictStrategy = 'server-wins' | 'client-wins' | 'last-write-wins' | 'manual';

export interface ConflictInfo<T> {
    clientData: T;
    serverData: T;
    clientTimestamp: Date;
    serverTimestamp: Date;
}

export function resolveConflict<T extends { updatedAt: Date }>(
    conflict: ConflictInfo<T>,
    strategy: ConflictStrategy
): T {
    switch (strategy) {
        case 'server-wins':
            return conflict.serverData;
        case 'client-wins':
            return conflict.clientData;
        case 'last-write-wins':
            return conflict.clientTimestamp > conflict.serverTimestamp
                ? conflict.clientData
                : conflict.serverData;
        case 'manual':
            // For manual resolution, return server data by default
            // The UI should handle showing a merge dialog
            return conflict.serverData;
        default:
            return conflict.serverData;
    }
}

export function detectConflict<T extends { updatedAt: Date }>(
    clientData: T,
    serverData: T,
    lastSyncedAt: Date
): boolean {
    // Conflict exists if server has been updated since last sync
    // and client has local changes
    return serverData.updatedAt > lastSyncedAt && clientData.updatedAt > lastSyncedAt;
}
