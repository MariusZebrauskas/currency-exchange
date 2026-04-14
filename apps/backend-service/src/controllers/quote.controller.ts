import type { Request, Response } from 'express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import { asyncHandler } from '@/middleware/async-handler';
import { quoteQuerySchema } from '@/schemas/quote.schema';
import { QuoteService } from '@/services/quote.service';

const router = Router();

router.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        error: { code: 'RATE_LIMIT', message: 'Too many requests' },
      });
    },
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = quoteQuerySchema.parse(req.query);
    const result = await QuoteService.getQuote(query);
    res.json(result);
  })
);

export const quoteRouter = router;
