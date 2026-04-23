export enum Role {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface IUser {
  id: string;
  email: string;
  username?: string | null;
  role: Role;
  permissions: string[];
  managerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateRoleRequest {
  role: Role;
}

export interface IUpdatePermissionsRequest {
  permissions: string[];
}
