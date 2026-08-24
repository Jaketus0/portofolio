import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createServiceSchema, updateServiceSchema } from '../validations/service.validation';

export const serviceRouter = Router();

// Public
serviceRouter.get('/', serviceController.getPublicServices);

// Admin
serviceRouter.get('/admin', authMiddleware, serviceController.getAllServices);
serviceRouter.post('/', authMiddleware, validate(createServiceSchema), serviceController.createService);
serviceRouter.put('/:id', authMiddleware, validate(updateServiceSchema), serviceController.updateService);
serviceRouter.delete('/:id', authMiddleware, serviceController.deleteService);