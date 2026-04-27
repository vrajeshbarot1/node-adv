import { PrismaClient } from "@prisma/client";
import { INotification, ICreateNotificationRequest } from "../types/notification.types";

const prisma = new PrismaClient();

export const createNotification = async (data: ICreateNotificationRequest): Promise<INotification> => {
  return await prisma.notification.create({
    data
  }) as unknown as INotification;
};

export const getNotificationsByUserId = async (userId: string): Promise<INotification[]> => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  }) as unknown as INotification[];
};

export const markAsRead = async (id: string): Promise<INotification> => {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  }) as unknown as INotification;
};

export const getAllNotifications = async (): Promise<INotification[]> => {
  return await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' }
  }) as unknown as INotification[];
};
