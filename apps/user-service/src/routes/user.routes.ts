import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Admin Routes
router.patch('/:id/promote', authMiddleware, authorize(['ADMIN']), UserController.promoteUser);
router.post('/assign-to-manager', authMiddleware, authorize(['ADMIN']), UserController.assignToManager);
router.get('/my-team', authMiddleware, authorize(['MANAGER']), UserController.getMyTeam);
router.get('/all', authMiddleware, authorize(['ADMIN']), UserController.listUsers);

// User Profile
router.get('/:id', UserController.getUser);

export default router;
