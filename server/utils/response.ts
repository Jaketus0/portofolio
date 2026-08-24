import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  errors?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
}

export function sendNotFound(res: Response, entity = 'Resource'): void {
  sendError(res, `${entity} not found`, 404);
}

export function sendUnauthorized(res: Response, message = 'Unauthorized'): void {
  sendError(res, message, 401);
}

export function sendForbidden(res: Response, message = 'Forbidden'): void {
  sendError(res, message, 403);
}

export function sendBadRequest(res: Response, message = 'Bad request', errors?: unknown): void {
  sendError(res, message, 400, errors);
}

export function sendTooManyRequests(res: Response, message = 'Too many requests'): void {
  sendError(res, message, 429);
}
