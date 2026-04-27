import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { findUserByEmail, createUser, updateUserRefreshToken, findUserByRefreshToken, findUserById, update2FASecret, update2FAStatus } from '../models/auth.model';
import { signToken, signRefreshToken, verifyToken } from '../utils/jwt';
import { ILoginRequest, IRegisterRequest, IAuthResponse, IJWTPayload, I2FASetupResponse } from '../types/auth.types';
import logger from '../utils/logger';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';

const createProfile = async (profileData: any) => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user profile');
    }
    return await response.json();
  } catch (error) {
    logger.error('Error creating user profile:', error);
    throw error;
  }
};

const fetchProfile = async (userId: string) => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/api/users/${userId}`);
    if (!response.ok) {
      return null;
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    return null;
  }
};

export const register = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
  const { email, username, password, role, permissions, managerId } = userData;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error: any = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const authUser = await createUser(email, hashedPassword);

  // Create Profile in User Service
  const profile = await createProfile({
    id: authUser.id,
    username,
    role,
    permissions,
    managerId
  });

  const payload: IJWTPayload = {
    userId: authUser.id,
    role: profile.data.role,
    permissions: profile.data.permissions
  };

  const token = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(authUser.id, refreshToken);

  const { password: _, refreshToken: __, ...userWithoutPassword } = authUser as any;
  return { 
    user: { ...userWithoutPassword, username: profile.data.username, role: profile.data.role, permissions: profile.data.permissions }, 
    token, 
    refreshToken 
  };
};

export const login = async (credentials: ILoginRequest): Promise<IAuthResponse> => {
  const { email, password } = credentials;

  const authUser = await findUserByEmail(email);
  if (!authUser) {
    const error: any = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, authUser.password);
  if (!isMatch) {
    const error: any = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (authUser.twoFactorEnabled) {
    return { mfaRequired: true, userId: authUser.id };
  }

  // Fetch Profile from User Service to get Role/Permissions for JWT
  const profile = await fetchProfile(authUser.id);

  const payload: IJWTPayload = {
    userId: authUser.id,
    role: profile?.role || 'USER',
    permissions: profile?.permissions || []
  };

  const token = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(authUser.id, refreshToken);

  const { password: _, refreshToken: __, ...userWithoutPassword } = authUser as any;
  return { 
    user: { ...userWithoutPassword, username: profile?.username, role: profile?.role, permissions: profile?.permissions }, 
    token, 
    refreshToken 
  };
};

export const refresh = async (oldRefreshToken: string): Promise<IAuthResponse> => {
  const payload = verifyToken(oldRefreshToken);
  if (!payload) {
    const error: any = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const authUser = await findUserByRefreshToken(oldRefreshToken);
  if (!authUser || authUser.id !== payload.userId) {
    const error: any = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const profile = await fetchProfile(authUser.id);

  const newPayload: IJWTPayload = {
    userId: authUser.id,
    role: profile?.role || 'USER',
    permissions: profile?.permissions || []
  };

  const token = signToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);

  await updateUserRefreshToken(authUser.id, refreshToken);

  const { password: _, refreshToken: __, ...userWithoutPassword } = authUser as any;
  return { user: { ...userWithoutPassword, username: profile?.username, role: profile?.role, permissions: profile?.permissions }, token, refreshToken };
};

export const setup2FA = async (userId: string): Promise<I2FASetupResponse> => {
  const user = await findUserById(userId);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const secret = speakeasy.generateSecret({
    name: `TaskManagementApp (${user.email})`,
  });

  await update2FASecret(userId, secret.base32);
  const qrCode = await QRCode.toDataURL(secret.otpauth_url as string);

  return { secret: secret.base32, qrCode };
};

export const verify2FA = async (userId: string, token: string): Promise<boolean> => {
  const user = await findUserById(userId);
  if (!user || !user.twoFactorSecret) {
    const error: any = new Error('2FA setup not initiated');
    error.statusCode = 400;
    throw error;
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    await update2FAStatus(userId, true);
  }

  return verified;
};

export const disable2FA = async (userId: string): Promise<void> => {
  await update2FASecret(userId, null);
  await update2FAStatus(userId, false);
};

export const verifyLogin2FA = async (userId: string, token: string): Promise<IAuthResponse> => {
  const authUser = await findUserById(userId);
  if (!authUser || !authUser.twoFactorSecret || !authUser.twoFactorEnabled) {
    const error: any = new Error('2FA is not enabled for this user');
    error.statusCode = 400;
    throw error;
  }

  const verified = speakeasy.totp.verify({
    secret: authUser.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    const error: any = new Error('Invalid 2FA token');
    error.statusCode = 401;
    throw error;
  }

  const profile = await fetchProfile(authUser.id);

  const payload: IJWTPayload = {
    userId: authUser.id,
    role: profile?.role || 'USER',
    permissions: profile?.permissions || []
  };

  const accessToken = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(authUser.id, refreshToken);

  const { password: _, refreshToken: __, twoFactorSecret: ___, ...userWithoutPassword } = authUser as any;
  return { 
    user: { ...userWithoutPassword, username: profile?.username, role: profile?.role, permissions: profile?.permissions }, 
    token: accessToken, 
    refreshToken 
  };
};
