import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP must be 6 digits'),
  rememberMe: z.boolean().optional().default(false),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
