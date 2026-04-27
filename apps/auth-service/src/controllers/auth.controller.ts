import type { Request, Response, NextFunction } from 'express';
import {
  register as authRegister,
  login as authLogin,
  refresh as authRefresh,
  setup2FA as authSetup2FA,
  verify2FA as authVerify2FA,
  disable2FA as authDisable2FA,
  verifyLogin2FA as authVerifyLogin2FA
} from '../services/auth.service';
import { signToken, signRefreshToken } from '../utils/jwt';
import { updateUserRefreshToken } from '../models/auth.model';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authRegister(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authLogin(req.body);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error: any = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }
    const result = await authRefresh(refreshToken);
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as any;
  const payload = {
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  };

  const token = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(user.id, refreshToken);

  res.json({ success: true, token, refreshToken, user });
};

export const getProfile = (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
};

export const getSystemStatus = (req: Request, res: Response) => {
  res.json({ success: true, message: 'System is healthy' });
};

export const setup2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId;
    const result = await authSetup2FA(userId);
    res.status(200).json({
      success: true,
      message: '2FA setup initiated',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId;
    const { token } = req.body;
    if (!token) {
      const error: any = new Error('Token is required');
      error.statusCode = 400;
      throw error;
    }
    const verified = await authVerify2FA(userId, token);
    if (verified) {
      res.status(200).json({
        success: true,
        message: '2FA enabled successfully',
      });
    } else {
      const error: any = new Error('Invalid 2FA token');
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};


export const disable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId;
    await authDisable2FA(userId);
    res.status(200).json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const login2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) {
      const error: any = new Error('UserId and Token are required');
      error.statusCode = 400;
      throw error;
    }
    const result = await authVerifyLogin2FA(userId, token);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
