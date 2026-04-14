import { z } from 'zod';

const queryScalar = z.preprocess(
  (v) => (Array.isArray(v) ? v[0] : v),
  z.unknown()
);

const cents = queryScalar.pipe(
  z
    .string()
    .regex(/^\d+$/, 'baseAmount must be a non-negative integer string of minor units (cents)')
    .transform(Number)
    .pipe(z.number().int().positive().max(1_000_000_000_000))
);

const iso4217 = queryScalar.pipe(
  z
    .string()
    .length(3)
    .transform((c) => c.toUpperCase())
    .pipe(z.enum(['USD', 'EUR', 'GBP', 'ILS']))
);

export const quoteQuerySchema = z.object({
  baseCurrency: iso4217,
  quoteCurrency: iso4217,
  baseAmount: cents,
});

export const quoteResponseSchema = z.object({
  exchangeRate: z.number().finite(),
  quoteAmount: z.number().int(),
});

export type QuoteQuery = z.infer<typeof quoteQuerySchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
