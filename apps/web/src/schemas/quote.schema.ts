import { z } from 'zod';

export const quoteQuerySchema = z.object({
  baseCurrency: z.enum(['USD', 'EUR', 'GBP', 'ILS']),
  quoteCurrency: z.enum(['USD', 'EUR', 'GBP', 'ILS']),
  baseAmount: z.number().int(), // integer cents
});

export const quoteResponseSchema = z.object({
  exchangeRate: z.number(),
  quoteAmount: z.number().int(), // integer cents
});

export type QuoteQuery = z.infer<typeof quoteQuerySchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
