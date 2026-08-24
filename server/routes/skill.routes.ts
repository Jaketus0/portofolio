import { Router } from 'express';
import { skillController } from '../controllers/skill.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createSkillSchema, updateSkillSchema, reorderSkillsSchema } from '../validations/skill.validation';

export const skillRouter = Router();

// Public
skillRouter.get('/', skillController.getSkillsPublic);

// Admin
skillRouter.get('/admin', authMiddleware, skillController.getSkillsAdmin);
skillRouter.post('/', authMiddleware, validate(createSkillSchema), skillController.createSkill);
skillRouter.put('/reorder', authMiddleware, validate(reorderSkillsSchema), skillController.reorderSkills);
skillRouter.put('/:id', authMiddleware, validate(updateSkillSchema), skillController.updateSkill);
skillRouter.delete('/:id', authMiddleware, skillController.deleteSkill);
