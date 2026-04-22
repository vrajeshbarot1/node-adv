import { IUser } from './auth.types';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
      permissions: string[];
    }

    interface Request {
      user?: User;
    }
  }
}
