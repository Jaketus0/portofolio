import { Request, Response, NextFunction } from 'express';
import { heroService } from '../services/hero.service';
import { sendSuccess } from '../utils/response';

export const heroController = {
  async getHero(req: Request, res: Response, next: NextFunction) {
    try {
      const hero = await heroService.getHero();
      sendSuccess(res, hero);
    } catch (error) {
      next(error);
    }
  },

  async updateHero(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        req.body.heroImage = `/uploads/images/${req.file.filename}`;
      }
      const hero = await heroService.updateHero(req.admin!.adminId, req.body);
      sendSuccess(res, hero, 'Hero section updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async getSocialLinks(req: Request, res: Response, next: NextFunction) {
    try {
      const links = await heroService.getSocialLinks();
      sendSuccess(res, links);
    } catch (error) {
      next(error);
    }
  },

  async createSocialLink(req: Request, res: Response, next: NextFunction) {
    try {
      const link = await heroService.createSocialLink(req.admin!.adminId, req.body);
      sendSuccess(res, link, 'Social link created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateSocialLink(req: Request, res: Response, next: NextFunction) {
    try {
      const link = await heroService.updateSocialLink(req.admin!.adminId, (req.params.id as string), req.body);
      sendSuccess(res, link, 'Social link updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteSocialLink(req: Request, res: Response, next: NextFunction) {
    try {
      await heroService.deleteSocialLink(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, null, 'Social link deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};
