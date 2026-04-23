import { Router } from 'express';
import * as TaskController from '../controllers/task.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
