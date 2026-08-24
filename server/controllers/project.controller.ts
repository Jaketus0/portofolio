import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { sendSuccess, sendNotFound } from '../utils/response';
import { ProjectStatus } from '@prisma/client';

export const projectController = {
  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const isAdmin = !!req.admin;
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
        status: req.query.status as ProjectStatus,
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 12,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await projectService.getProjects(filters, isAdmin);
      sendSuccess(res, result.data, 'Projects retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  },

  async getProjectBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProjectBySlug((req.params.slug as string));
      if (!project) {
        sendNotFound(res, 'Project');
        return;
      }
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProjectById((req.params.id as string));
      if (!project) {
        sendNotFound(res, 'Project');
        return;
      }
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  },

  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.createProject(req.admin!.adminId, req.body);
      sendSuccess(res, project, 'Project created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.updateProject(req.admin!.adminId, (req.params.id as string), req.body);
      sendSuccess(res, project, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, null, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async addProjectImage(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await projectService.addProjectImage(req.admin!.adminId, (req.params.id as string), req.body);
      sendSuccess(res, image, 'Project image added successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async removeProjectImage(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.removeProjectImage(req.admin!.adminId, (req.params.imageId as string));
      sendSuccess(res, null, 'Project image removed successfully');
    } catch (error) {
      next(error);
    }
  }
};
