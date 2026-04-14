import type { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      details: { path: req.path },
    },
  });
}
