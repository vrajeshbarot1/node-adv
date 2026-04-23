import { Router } from 'express';
import * as NotificationController from '../controllers/notification.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Internal endpoint to create notification (could be called by other services)
router.post('/', NotificationController.createNotification);

// User endpoints
router.get('/', authMiddleware, NotificationController.getNotifications);
router.patch('/:id/read', authMiddleware, NotificationController.markAsRead);

export default router;
