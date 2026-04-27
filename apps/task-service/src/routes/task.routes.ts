import { Router } from 'express';
import * as TaskController from '../controllers/task.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Manager Routes
router.post('/', authorize(['MANAGER', 'ADMIN']), TaskController.createTask);
router.get('/team', authorize(['MANAGER', 'ADMIN']), TaskController.getTeamTasks);
router.patch('/:id', authorize(['MANAGER', 'ADMIN']), TaskController.updateTask);

// User Routes
router.get('/my-tasks', TaskController.getMyTasks);

export default router;
