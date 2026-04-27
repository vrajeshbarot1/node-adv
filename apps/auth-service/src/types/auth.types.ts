export interface IJWTPayload {
  userId: string;
  role: string;
  permissions: string[];
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  twoFactorSecret?: string | null;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  user?: Omit<IUser, 'password' | 'refreshToken' | 'twoFactorSecret'> & { username?: string; role?: string; permissions?: string[] };
  token?: string;
  refreshToken?: string;
  mfaRequired?: boolean;
  userId?: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
  role?: string;
  permissions?: string[];
  managerId?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface I2FASetupResponse {
  secret: string;
  qrCode: string;
}

export interface I2FAVerifyRequest {
  token: string;
}

export interface I2FALoginRequest {
  userId: string;
  token: string;
}
