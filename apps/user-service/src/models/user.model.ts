import { PrismaClient } from "@prisma/client";
import { IUser, Role } from "../types/user.types";

const prisma = new PrismaClient();

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      permissions: true,
      managerId: true,
      createdAt: true,
      updatedAt: true
    }
  }) as unknown as IUser | null;
};

export const updateRole = async (userId: string, role: Role): Promise<IUser> => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      permissions: true,
      managerId: true,
      createdAt: true,
      updatedAt: true
    }
  }) as unknown as IUser;
};

export const updatePermissions = async (userId: string, permissions: string[]): Promise<IUser> => {
  return await prisma.user.update({
    where: { id: userId },
    data: { permissions },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      permissions: true,
      managerId: true,
      createdAt: true,
      updatedAt: true
    }
  }) as unknown as IUser;
};
