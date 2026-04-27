import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (data: any) => {
  return await prisma.task.create({ data });
};

export const findTaskById = async (id: string) => {
  return await prisma.task.findUnique({ where: { id } });
};

export const updateTask = async (id: string, data: any) => {
  return await prisma.task.update({
    where: { id },
    data
  });
};

export const findTasksByCreator = async (creatorId: string) => {
  return await prisma.task.findMany({ where: { creatorId } });
};

export const findTasksByUser = async (userId: string) => {
  return await prisma.task.findMany({ where: { userId } });
};

export const deleteTask = async (id: string) => {
  return await prisma.task.delete({ where: { id } });
};
