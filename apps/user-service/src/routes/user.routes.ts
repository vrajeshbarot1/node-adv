import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// All user management routes require authentication
router.use(authMiddleware);

// Only ADMIN can change roles
router.patch('/:id/role', authorize(['ADMIN']), UserController.updateRole);

// ADMIN and MANAGER can change permissions (service logic handles specific restrictions)
router.patch('/:id/permissions', authorize(['ADMIN', 'MANAGER']), UserController.updatePermissions);

export default router;
