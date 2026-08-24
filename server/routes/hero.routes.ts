import { Router } from 'express';
import { heroController } from '../controllers/hero.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate, validateBody } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { updateHeroSchema, socialLinkSchema } from '../validations/hero.validation';

export const heroRouter = Router();

// Public
heroRouter.get('/', heroController.getHero);
heroRouter.get('/social-links', heroController.getSocialLinks);

// Admin
heroRouter.put('/', authMiddleware, upload.single('heroImage'), validateBody(updateHeroSchema), heroController.updateHero);
heroRouter.post('/social-links', authMiddleware, validate(socialLinkSchema), heroController.createSocialLink);
heroRouter.put('/social-links/:id', authMiddleware, validate(socialLinkSchema), heroController.updateSocialLink);
heroRouter.delete('/social-links/:id', authMiddleware, heroController.deleteSocialLink);
