import jwt, { SignOptions } from 'jsonwebtoken';
import { IJWTPayload } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signToken = (payload: IJWTPayload, expiresIn: string = '1h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): IJWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as IJWTPayload;
  } catch (error) {
    return null;
  }
};
