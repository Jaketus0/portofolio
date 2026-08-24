import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { sendUnauthorized } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Fallback to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      sendUnauthorized(res, 'Access token is required');
      return;
    }

    const payload = verifyAccessToken(token);
    req.admin = payload;
    next();
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === 'TokenExpiredError') {
      sendUnauthorized(res, 'Token has expired');
    } else {
      sendUnauthorized(res, 'Invalid token');
    }
  }
}
