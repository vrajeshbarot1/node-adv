import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (userId: string, updateData: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

export const updateManyUsers = async (userIds: string[], managerId: string) => {
  return await prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: { managerId },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const findUsersByManagerId = async (managerId: string) => {
  return await prisma.user.findMany({
    where: { managerId },
  });
};
