import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (email: string, password: string) => {
  return await prisma.user.create({
    data: { email, password },
  });
};

export const updateUserRefreshToken = async (userId: string, refreshToken: string | null) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

export const findUserByRefreshToken = async (refreshToken: string) => {
  return await prisma.user.findFirst({
    where: { refreshToken },
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const update2FASecret = async (userId: string, secret: string | null) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret },
  });
};

export const update2FAStatus = async (userId: string, enabled: boolean) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: enabled },
  });
};