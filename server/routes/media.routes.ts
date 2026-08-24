import { Router } from 'express';
import { mediaController } from '../controllers/media.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';

export const mediaRouter = Router();

// All media routes are protected
mediaRouter.use(authMiddleware);

mediaRouter.get('/', mediaController.getMediaFiles);
mediaRouter.get('/folders', mediaController.getFolders);
mediaRouter.post('/upload', uploadSingle, mediaController.uploadFile);
mediaRouter.put('/:id', mediaController.updateFile);
mediaRouter.delete('/:id', mediaController.deleteFile);
