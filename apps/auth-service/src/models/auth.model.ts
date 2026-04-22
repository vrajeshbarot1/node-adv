import { PrismaClient } from "@prisma/client";
import { IUser } from "../types/auth.types";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await prisma.user.findUnique({ where: { email } }) as IUser | null;
};

export const createUser = async (email: string, username: string, password: string, role: any = "USER", permissions: string[]): Promise<IUser> => {
  return await prisma.user.create({
    data: { email, username, password, role, permissions } as any,
  }) as unknown as IUser;
};

export const updateUserRefreshToken = async (userId: string, refreshToken: string | null): Promise<IUser> => {
  return await prisma.user.update({
    where: { id: userId },
    data: { refreshToken } as any,
  }) as unknown as IUser;
};

export const findUserByRefreshToken = async (refreshToken: string): Promise<IUser | null> => {
  return await prisma.user.findFirst({
    where: { refreshToken } as any,
  }) as unknown as IUser | null;
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await prisma.user.findUnique({ where: { id } }) as IUser | null;
};

export const update2FASecret = async (userId: string, secret: string | null): Promise<IUser> => {
  return await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret } as any,
  }) as unknown as IUser;
};

export const update2FAStatus = async (userId: string, enabled: boolean): Promise<IUser> => {
  return await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: enabled } as any,
  }) as unknown as IUser;
};