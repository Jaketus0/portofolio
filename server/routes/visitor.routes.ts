import { Router } from 'express';
import { visitorController } from '../controllers/visitor.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { apiRateLimit } from '../middlewares/rate-limit.middleware';

export const visitorRouter = Router();

// Public (with loose rate limit)
visitorRouter.post('/track', apiRateLimit, visitorController.trackVisitor);
visitorRouter.get('/stats', visitorController.getStats);

// Admin
visitorRouter.get('/analytics', authMiddleware, visitorController.getAnalytics);
