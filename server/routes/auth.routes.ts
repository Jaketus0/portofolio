import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { sendOtpSchema, verifyOtpSchema } from '../validations/auth.validation';
import { otpRateLimit } from '../middlewares/rate-limit.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/send-otp', otpRateLimit, validate(sendOtpSchema), authController.sendOtp);
authRouter.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
authRouter.post('/logout', authMiddleware, authController.logout);
authRouter.get('/me', authMiddleware, authController.me);
