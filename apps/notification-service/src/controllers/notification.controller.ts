import { Request, Response, NextFunction } from 'express';
import * as NotificationService from '../services/notification.service';

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await NotificationService.createNotification(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const notifications = await NotificationService.getNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await NotificationService.markRead(req.params.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};
