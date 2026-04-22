import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { findUserByEmail, createUser, updateUserRefreshToken, findUserByRefreshToken, findUserById, update2FASecret, update2FAStatus } from '../models/auth.model';
import { signToken, signRefreshToken, verifyToken } from '../utils/jwt';
import { ILoginRequest, IRegisterRequest, IAuthResponse, IJWTPayload, I2FASetupResponse } from '../types/auth.types';
import { getDefaultPermissions } from '../utils/permissions';

export const register = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
  const { email, username, password } = userData;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error: any = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = userData.role || "USER";
  const permissions = userData.permissions && userData.permissions.length > 0
    ? userData.permissions
    : getDefaultPermissions(role);

  const user = await createUser(email, username, hashedPassword, role, permissions);

  const payload: IJWTPayload = {
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  };

  const token = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(user.id, refreshToken);

  const { password: _, refreshToken: __, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token, refreshToken };
};

export const login = async (credentials: ILoginRequest): Promise<IAuthResponse> => {
  const { email, password } = credentials;

  const user = await findUserByEmail(email);
  if (!user) {
    const error: any = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error: any = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Check if 2FA is enabled
  if ((user as any).twoFactorEnabled) {
    return {
      mfaRequired: true,
      userId: user.id
    };
  }

  const payload: IJWTPayload = {
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  };

  const token = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(user.id, refreshToken);

  const { password: _, refreshToken: __, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token, refreshToken };
};

export const refresh = async (oldRefreshToken: string): Promise<IAuthResponse> => {
  const payload = verifyToken(oldRefreshToken);
  if (!payload) {
    const error: any = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const user = await findUserByRefreshToken(oldRefreshToken);
  if (!user || user.id !== payload.userId) {
    const error: any = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const newPayload: IJWTPayload = {
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  };

  const token = signToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);

  await updateUserRefreshToken(user.id, refreshToken);

  const { password: _, refreshToken: __, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token, refreshToken };
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

  return {
    secret: secret.base32,
    qrCode,
  };
};

export const verify2FA = async (userId: string, token: string): Promise<boolean> => {
  const user = await findUserById(userId);
  if (!user || !(user as any).twoFactorSecret) {
    const error: any = new Error('2FA setup not initiated');
    error.statusCode = 400;
    throw error;
  }

  const verified = speakeasy.totp.verify({
    secret: (user as any).twoFactorSecret,
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
  const user = await findUserById(userId);
  if (!user || !(user as any).twoFactorSecret || !(user as any).twoFactorEnabled) {
    const error: any = new Error('2FA is not enabled for this user');
    error.statusCode = 400;
    throw error;
  }

  const verified = speakeasy.totp.verify({
    secret: (user as any).twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    const error: any = new Error('Invalid 2FA token');
    error.statusCode = 401;
    throw error;
  }

  const payload: IJWTPayload = {
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  };

  const accessToken = signToken(payload);
  const refreshToken = signRefreshToken(payload);

  await updateUserRefreshToken(user.id, refreshToken);

  const { password: _, refreshToken: __, twoFactorSecret: ___, ...userWithoutPassword } = user as any;
  return { user: userWithoutPassword, token: accessToken, refreshToken };
};

