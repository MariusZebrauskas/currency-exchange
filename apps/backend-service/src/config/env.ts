import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(3001),
  EXCHANGE_RATE_API_BASE: z
    .string()
    .url()
    .default('https://api.exchangerate-api.com/v4/latest'),
  CORS_ORIGIN: z.string().default('*'),
  CACHE_TTL_MS: z.coerce.number().int().positive().default(3_600_000),
  FX_TIMEOUT_MS: z.coerce.number().int().positive().default(5_000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  LOG_LEVEL: z.string().default('info'),
  TRUST_PROXY: z.coerce.number().int().min(0).max(3).default(0),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment configuration', result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
