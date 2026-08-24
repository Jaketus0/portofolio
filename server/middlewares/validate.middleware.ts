import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { sendBadRequest } from '../utils/response';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const payload = {
        body: req.body,
        query: req.query,
        params: req.params,
        ...req.body,
      };

      schema.parse(payload);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        sendBadRequest(res, 'Validation failed', errors);
      } else {
        next(error);
      }
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        sendBadRequest(res, 'Validation failed', errors);
      } else {
        next(error);
      }
    }
  };
}
