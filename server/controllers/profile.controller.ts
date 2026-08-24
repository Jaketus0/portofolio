import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { sendSuccess, sendNotFound } from '../utils/response';

export const profileController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.admin!.adminId);
      if (!profile) {
          sendNotFound(res, 'Profile');
          return;
      }
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.updateProfile(req.admin!.adminId, req.body);
      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
};
