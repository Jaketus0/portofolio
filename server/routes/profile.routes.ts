import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get('/', profileController.getProfile);
profileRouter.put('/', profileController.updateProfile);
