import rateLimit from 'express-rate-limit';

export const otpRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // 3 attempts per 10 minutes
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again in 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.email || req.ip || 'unknown';
  },
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const messageRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Too many messages. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
