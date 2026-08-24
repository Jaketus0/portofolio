import { Request, Response, NextFunction } from 'express';
import { contactSubmissionService } from '../services/contact-submission.service';
import { generateCaptchaChallenge, verifyCaptchaChallenge } from '../utils/captcha.util';
import { sendBadRequest, sendSuccess } from '../utils/response';

export const contactSubmissionController = {
  async getCaptcha(req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, generateCaptchaChallenge(), 'Captcha generated');
    } catch (error) {
      next(error);
    }
  },

  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { captchaToken, captchaAnswer, ...payload } = req.body;
      if (!verifyCaptchaChallenge(captchaToken, captchaAnswer)) {
        sendBadRequest(res, 'Invalid captcha answer. Please try again');
        return;
      }
      const submission = await contactSubmissionService.createSubmission(payload);
      sendSuccess(res, submission, 'Message sent successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const items = await contactSubmissionService.getAll(status as string | undefined);
      sendSuccess(res, items);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const item = await contactSubmissionService.updateStatus(req.admin!.adminId, req.params.id as string, status);
      sendSuccess(res, item, 'Status updated');
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await contactSubmissionService.deleteSubmission(req.admin!.adminId, req.params.id as string);
      sendSuccess(res, null, 'Submission deleted');
    } catch (error) {
      next(error);
    }
  },
};