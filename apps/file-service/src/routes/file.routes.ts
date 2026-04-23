import { Router } from 'express';
import multer from 'multer';
import * as FileController from '../controllers/file.controller';

const router = Router();

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post('/upload', upload.single('file'), FileController.uploadFile);

export default router;
