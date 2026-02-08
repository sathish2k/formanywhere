// Permission definitions

export type Permission =
    | 'forms:create'
    | 'forms:read'
    | 'forms:update'
    | 'forms:delete'
    | 'submissions:read'
    | 'submissions:export'
    | 'settings:manage'
    | 'users:manage';

export interface Role {
    name: string;
    permissions: Permission[];
}

export const ROLES: Record<string, Role> = {
    admin: {
        name: 'Administrator',
        permissions: [
            'forms:create',
            'forms:read',
            'forms:update',
            'forms:delete',
            'submissions:read',
            'submissions:export',
            'settings:manage',
            'users:manage',
        ],
    },
    editor: {
        name: 'Editor',
        permissions: [
            'forms:create',
            'forms:read',
            'forms:update',
            'submissions:read',
        ],
    },
    viewer: {
        name: 'Viewer',
        permissions: ['forms:read', 'submissions:read'],
    },
};

export function hasPermission(
    userPermissions: Permission[],
    required: Permission
): boolean {
    return userPermissions.includes(required);
}
