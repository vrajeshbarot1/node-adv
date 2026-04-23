import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const user = await UserService.changeRole(req.params.id, role);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updatePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { permissions } = req.body;
    const currentUserId = req.user!.userId;
    const currentUserRole = req.user!.role;
    
    const user = await UserService.changePermissions(
      currentUserId, 
      currentUserRole, 
      req.params.id, 
      permissions
    );
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
