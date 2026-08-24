import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateSettingsSchema } from '../validations/settings.validation';

export const settingsRouter = Router();

// Public
settingsRouter.get('/', settingsController.getSettings);

// Admin
settingsRouter.put('/', authMiddleware, validate(updateSettingsSchema), settingsController.updateSettings);
settingsRouter.get('/activities', authMiddleware, settingsController.getRecentActivities);
