import { Router } from 'express';
import { aboutController } from '../controllers/about.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const aboutRouter = Router();

// Public
aboutRouter.get('/', aboutController.getAbout);

// Admin
aboutRouter.put('/', authMiddleware, aboutController.updateAbout);
aboutRouter.post('/timeline', authMiddleware, aboutController.createTimeline);
aboutRouter.put('/timeline/reorder', authMiddleware, aboutController.reorderTimelines);
aboutRouter.put('/timeline/:id', authMiddleware, aboutController.updateTimeline);
aboutRouter.delete('/timeline/:id', authMiddleware, aboutController.deleteTimeline);
