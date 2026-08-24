import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import { sendSuccess } from '../utils/response';

export const messageController = {
  async getPublicMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messageService.getPublicMessages();
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async getAdminMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const messages = await messageService.getAllMessages(status);
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async submitMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await messageService.submitMessage(req.body);
      sendSuccess(res, message, 'Message submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async approveMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await messageService.approveMessage(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, msg, 'Message approved');
    } catch (error) {
      next(error);
    }
  },

  async hideMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await messageService.hideMessage(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, msg, 'Message hidden');
    } catch (error) {
      next(error);
    }
  },

  async pinMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await messageService.pinMessage(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, msg, 'Message pinned');
    } catch (error) {
      next(error);
    }
  },

  async unpinMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await messageService.unpinMessage(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, msg, 'Message unpinned');
    } catch (error) {
      next(error);
    }
  },

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      await messageService.deleteMessage(req.admin!.adminId, (req.params.id as string));
      sendSuccess(res, null, 'Message deleted');
    } catch (error) {
      next(error);
    }
  }
};
