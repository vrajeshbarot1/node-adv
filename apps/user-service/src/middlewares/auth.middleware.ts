import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IJWTPayload {
  userId: string;
  role: string;
  permissions?: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

export default authMiddleware;
