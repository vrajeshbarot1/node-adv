import * as UserModel from '../models/user.model';
import { Role, IUser } from '../types/user.types';

export const changeRole = async (targetUserId: string, newRole: Role): Promise<IUser> => {
  const user = await UserModel.findUserById(targetUserId);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return await UserModel.updateRole(targetUserId, newRole);
};

export const changePermissions = async (
  currentUserId: string,
  currentUserRole: string,
  targetUserId: string,
  newPermissions: string[]
): Promise<IUser> => {
  const targetUser = await UserModel.findUserById(targetUserId);

  if (!targetUser) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Admin can change anyone's permissions
  if (currentUserRole === Role.ADMIN) {
    return await UserModel.updatePermissions(targetUserId, newPermissions);
  }

  // Manager can only change permissions of their team members
  if (currentUserRole === Role.MANAGER) {
    if (targetUser.managerId !== currentUserId) {
      const error: any = new Error('Forbidden: You can only manage permissions for your team members');
      error.statusCode = 403;
      throw error;
    }
    return await UserModel.updatePermissions(targetUserId, newPermissions);
  }

  const error: any = new Error('Forbidden');
  error.statusCode = 403;
  throw error;
};
