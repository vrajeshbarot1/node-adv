import { PrismaClient } from "@prisma/client";
import { ITask, ICreateTaskRequest, IUpdateTaskRequest } from "../types/task.types";

const prisma = new PrismaClient();

export const createTask = async (userId: string, data: ICreateTaskRequest): Promise<ITask> => {
  return await prisma.task.create({
    data: {
      ...data,
      userId
    }
  }) as unknown as ITask;
};

export const findTasksByUserId = async (userId: string): Promise<ITask[]> => {
  return await prisma.task.findMany({
    where: { userId }
  }) as unknown as ITask[];
};

export const findTaskById = async (taskId: string): Promise<ITask | null> => {
  return await prisma.task.findUnique({
    where: { id: taskId }
  }) as unknown as ITask | null;
};

export const updateTask = async (taskId: string, data: IUpdateTaskRequest): Promise<ITask> => {
  return await prisma.task.update({
    where: { id: taskId },
    data
  }) as unknown as ITask;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await prisma.task.delete({
    where: { id: taskId }
  });
};
