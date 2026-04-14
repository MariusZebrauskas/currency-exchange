import { z } from 'zod';

/** Payload shape from exchangerate-api.com v4 `/latest/{base}` */
export const fxProviderLatestSchema = z.object({
  base: z.string().min(3).max(3),
  rates: z.record(z.string(), z.number().finite()),
});

export type FxProviderLatest = z.infer<typeof fxProviderLatestSchema>;
