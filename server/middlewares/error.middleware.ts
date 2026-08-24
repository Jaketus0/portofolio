import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(err.message, err.stack);

  if (err.name === 'MulterError') {
    const multerErr = err as { code?: string };
    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ success: false, message: 'File too large. Maximum size is 10MB.' });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: 'Validation error', errors: err.message });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
