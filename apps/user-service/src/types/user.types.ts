export enum Role {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface IUser {
  id: string;
  username?: string | null;
  role: Role;
  permissions: string[];
  managerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserRequest {
  id: string;
  username?: string;
  role?: Role;
  permissions?: string[];
  managerId?: string;
}

export interface IUpdateUserRequest {
  username?: string;
  role?: Role;
  permissions?: string[];
  managerId?: string | null;
}
