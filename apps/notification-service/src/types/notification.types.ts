export interface INotification {
  id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ICreateNotificationRequest {
  userId: string;
  message: string;
  type?: string;
}
