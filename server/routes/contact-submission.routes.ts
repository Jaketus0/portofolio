import { Router } from 'express';
import { contactSubmissionController } from '../controllers/contact-submission.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { messageRateLimit } from '../middlewares/rate-limit.middleware';
import { createContactSubmissionSchema } from '../validations/contact-submission.validation';

export const contactSubmissionRouter = Router();

// Public
contactSubmissionRouter.get('/captcha', contactSubmissionController.getCaptcha);
contactSubmissionRouter.post('/', messageRateLimit, validate(createContactSubmissionSchema), contactSubmissionController.submit);

// Admin
contactSubmissionRouter.get('/', authMiddleware, contactSubmissionController.getAll);
contactSubmissionRouter.put('/:id/status', authMiddleware, contactSubmissionController.updateStatus);
contactSubmissionRouter.delete('/:id', authMiddleware, contactSubmissionController.delete);