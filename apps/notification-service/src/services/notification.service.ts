import * as NotificationModel from '../models/notification.model';
import { ICreateNotificationRequest, INotification } from '../types/notification.types';

export const createNotification = async (data: ICreateNotificationRequest): Promise<INotification> => {
  return await NotificationModel.createNotification(data);
};

export const getNotifications = async (userId: string): Promise<INotification[]> => {
  return await NotificationModel.getNotificationsByUserId(userId);
};

export const markRead = async (id: string): Promise<INotification> => {
  return await NotificationModel.markAsRead(id);
};

export const getAllNotifications = async (): Promise<INotification[]> => {
  return await NotificationModel.getAllNotifications();
};
