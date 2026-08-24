import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createMessageSchema } from '../validations/message.validation';
import { messageRateLimit } from '../middlewares/rate-limit.middleware';

export const messageRouter = Router();

// Public
messageRouter.get('/public', messageController.getPublicMessages);
messageRouter.post('/', messageRateLimit, validate(createMessageSchema), messageController.submitMessage);

// Admin
messageRouter.get('/', authMiddleware, messageController.getAdminMessages);
messageRouter.put('/:id/approve', authMiddleware, messageController.approveMessage);
messageRouter.put('/:id/hide', authMiddleware, messageController.hideMessage);
messageRouter.put('/:id/pin', authMiddleware, messageController.pinMessage);
messageRouter.put('/:id/unpin', authMiddleware, messageController.unpinMessage);
messageRouter.delete('/:id', authMiddleware, messageController.deleteMessage);
