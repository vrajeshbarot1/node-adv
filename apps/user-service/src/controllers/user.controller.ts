import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';

// Admin: Promote user to MANAGER
export const promoteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.promoteToManager(req.params.id);
    res.status(200).json({ success: true, message: 'User promoted to MANAGER', data: user });
  } catch (error) {
    next(error);
  }
};

// Admin: Assign a list of users to a manager
export const assignToManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { managerId, userIds } = req.body;
    if (!managerId || !Array.isArray(userIds)) {
      return res.status(400).json({ success: false, message: 'managerId and userIds array are required' });
    }
    await UserService.assignUsersToManager(managerId, userIds);
    res.status(200).json({ success: true, message: 'Users assigned to manager successfully' });
  } catch (error) {
    next(error);
  }
};

// Manager: Get my team members
export const getMyTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const managerId = (req.user as any).userId;
    const team = await UserService.getTeamMembers(managerId);
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

// Get profile
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getProfile(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// List all users for Admin
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.listUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
