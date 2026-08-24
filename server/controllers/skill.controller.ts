import { Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skill.service';
import { sendSuccess } from '../utils/response';

export const skillController = {
  async getSkillsPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await skillService.getSkillsGrouped();
      sendSuccess(res, skills);
    } catch (error) {
      next(error);
    }
  },

  async getSkillsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await skillService.getAllSkillsAdmin();
      sendSuccess(res, skills);
    } catch (error) {
      next(error);
    }
  },

  async createSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await skillService.createSkill(req.admin!.adminId, req.body);
      sendSuccess(res, skill, 'Skill created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await skillService.updateSkill(req.admin!.adminId, (req.params.id as string), req.body);
      sendSuccess(res, skill, 'Skill updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      await skillService.deleteSkill(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, null, 'Skill deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async reorderSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      await skillService.reorderSkills(req.admin!.adminId, items);
      sendSuccess(res, null, 'Skills reordered successfully');
    } catch (error) {
      next(error);
    }
  }
};
