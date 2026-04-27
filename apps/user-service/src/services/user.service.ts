import * as UserModel from '../models/user.model';

export const getProfile = async (userId: string) => {
  return await UserModel.findUserById(userId);
};

export const promoteToManager = async (userId: string) => {
  return await UserModel.updateUser(userId, { role: 'MANAGER' });
};

export const assignUsersToManager = async (managerId: string, userIds: string[]) => {
  const manager = await UserModel.findUserById(managerId);
  if (!manager || manager.role !== 'MANAGER') {
    throw new Error('Valid Manager not found');
  }
  return await UserModel.updateManyUsers(userIds, managerId);
};

export const listUsers = async () => {
  return await UserModel.getAllUsers();
};

export const getTeamMembers = async (managerId: string) => {
  return await UserModel.findUsersByManagerId(managerId);
};
