import type { Application } from 'express';
import { quoteRouter } from '@/controllers/quote.controller';

export class AppController {
  public static setup(app: Application) {
    app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });
    app.use('/quote', quoteRouter);
  }
}
