import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validation';

export const projectRouter = Router();

// Public (with optional admin bypass in controller based on auth state if we want to pass it manually, but handled by separate endpoint conceptually)
projectRouter.get('/', projectController.getProjects); // Handled dynamically in controller
projectRouter.get('/slug/:slug', projectController.getProjectBySlug);
projectRouter.get('/:id', projectController.getProjectById);

// Admin
projectRouter.post('/', authMiddleware, validate(createProjectSchema), projectController.createProject);
projectRouter.put('/:id', authMiddleware, validate(updateProjectSchema), projectController.updateProject);
projectRouter.delete('/:id', authMiddleware, projectController.deleteProject);

projectRouter.post('/:id/images', authMiddleware, projectController.addProjectImage);
projectRouter.delete('/:id/images/:imageId', authMiddleware, projectController.removeProjectImage);
