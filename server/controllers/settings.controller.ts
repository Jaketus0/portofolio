import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';
import { sendSuccess } from '../utils/response';

export const settingsController = {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getSettings();
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  },

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.updateSettings(req.admin!.adminId, req.body);
      sendSuccess(res, settings, 'Settings updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async getRecentActivities(req: Request, res: Response, next: NextFunction) {
      try {
          const limit = parseInt(req.query.limit as string) || 20;
          const activities = await settingsService.getRecentActivities(limit);
          sendSuccess(res, activities);
      } catch (error) {
          next(error);
      }
  }
};
