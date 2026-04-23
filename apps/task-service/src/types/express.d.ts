import { IJWTPayload } from './auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
    }
  }
}
