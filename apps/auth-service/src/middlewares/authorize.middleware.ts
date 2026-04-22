import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if a user has specific permissions.
 */
export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User session not found' });
    }

    // Check if user has ALL required permissions
    const hasPermissions = requiredPermissions.every(perm =>
      user.permissions?.includes(perm)
    );

    if (!hasPermissions) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Missing required permissions: ${requiredPermissions.join(', ')}`
      });
    }

    next();
  };
};
