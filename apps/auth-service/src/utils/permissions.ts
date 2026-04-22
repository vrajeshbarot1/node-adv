export const DEFAULT_PERMISSIONS = {
  USER: [
    'task:read',
    'task:create',
    'task:update_own'
  ],
  MANAGER: [
    'task:read',
    'task:create',
    'task:update_team',
    'task:delete_team',
    'user:read'
  ],
  ADMIN: [
    'task:read',
    'task:create',
    'task:update_any',
    'task:delete_any',
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'system:manage'
  ]
};

export const getDefaultPermissions = (role: string): string[] => {
  return (DEFAULT_PERMISSIONS as any)[role] || DEFAULT_PERMISSIONS.USER;
};
