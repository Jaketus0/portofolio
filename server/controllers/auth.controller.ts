import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendUnauthorized } from '../utils/response';

export const authController = {
  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.requestOtp(email);
      sendSuccess(res, null, result.message);
    } catch (error) {
      console.log('Error in sendOtp:', error);
      next(error);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code, rememberMe } = req.body;
      const result = await authService.verifyOtp(email, code, rememberMe);

      // Set HTTP-only cookie for access token
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // Send tokens in body too for flexibility
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const adminId = req.admin?.adminId;

      if (adminId) {
        await authService.logout(refreshToken, adminId);
      }

      res.clearCookie('accessToken');
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
      try {
          if (!req.admin) {
              sendUnauthorized(res);
              return;
          }
          sendSuccess(res, req.admin, 'Current admin retrieved');
      } catch (error) {
          next(error);
      }
  }
};
