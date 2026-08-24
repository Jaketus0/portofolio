import { Request, Response, NextFunction } from 'express';
import { aboutService } from '../services/about.service';
import { sendSuccess } from '../utils/response';

export const aboutController = {
  async getAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const about = await aboutService.getAbout();
      sendSuccess(res, about);
    } catch (error) {
      next(error);
    }
  },

  async updateAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const about = await aboutService.updateAbout(req.admin!.adminId, req.body);
      sendSuccess(res, about, 'About section updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async createTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await aboutService.createTimeline(req.admin!.adminId, req.body);
      sendSuccess(res, timeline, 'Timeline entry created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await aboutService.updateTimeline(req.admin!.adminId, (req.params.id as string), req.body);
      sendSuccess(res, timeline, 'Timeline entry updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      await aboutService.deleteTimeline(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, null, 'Timeline entry deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async reorderTimelines(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      await aboutService.reorderTimelines(req.admin!.adminId, items);
      sendSuccess(res, null, 'Timeline reordered successfully');
    } catch (error) {
      next(error);
    }
  }
};
