import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const contactRouter = Router();

// Public
contactRouter.get('/', contactController.getContact);

// Admin
contactRouter.put('/', authMiddleware, contactController.updateContact);
