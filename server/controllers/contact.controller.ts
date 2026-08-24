import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service';
import { sendSuccess } from '../utils/response';

export const contactController = {
  async getContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.getContactInfo();
      sendSuccess(res, contact);
    } catch (error) {
      next(error);
    }
  },

  async updateContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.updateContactInfo(req.admin!.adminId, req.body);
      sendSuccess(res, contact, 'Contact info updated successfully');
    } catch (error) {
      next(error);
    }
  }
};
