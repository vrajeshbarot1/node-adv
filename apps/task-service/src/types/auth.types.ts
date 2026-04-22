export interface IJWTPayload {
  userId: string;
  role: string;
}

export interface IUser {
  id: string;
  email: string;
  username?: string | null;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
