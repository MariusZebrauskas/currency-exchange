import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '@/config/env';
import { AppError } from '@/libs/errors';
import { logger } from '@/libs/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten(),
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
    return;
  }

  const isDev = env.NODE_ENV !== 'production';
  const message =
    isDev && err instanceof Error ? err.message : 'Internal server error';

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
}
