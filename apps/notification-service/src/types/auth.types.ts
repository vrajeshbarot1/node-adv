export interface IJWTPayload {
  userId: string;
  role: string;
  permissions?: string[];
}
