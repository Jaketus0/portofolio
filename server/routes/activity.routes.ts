import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { activityRepository } from '../repositories/settings.repository';

export const activityRouter = Router();

activityRouter.get('/', authMiddleware, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const logs = await activityRepository.findRecent(limit);
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
});
