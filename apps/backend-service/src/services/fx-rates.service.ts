import axios from 'axios';
import { env } from '@/config/env';
import { AppError } from '@/libs/errors';
import { fxHttp } from '@/libs/fx-http-client';
import { LRUCache } from '@/libs/lru';
import { fxProviderLatestSchema } from '@/schemas/fx-provider.schema';

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

function mapFxProviderFailure(err: unknown): never {
  if (!axios.isAxiosError(err)) {
    throw new AppError(
      502,
      'FX_PROVIDER_ERROR',
      'Unexpected error contacting exchange rate provider'
    );
  }
  if (err.code === 'ECONNABORTED') {
    throw new AppError(
      504,
      'FX_PROVIDER_TIMEOUT',
      'Exchange rate provider did not respond in time'
    );
  }
  const status = err.response?.status;
  if (status === 429) {
    throw new AppError(
      503,
      'FX_PROVIDER_RATE_LIMIT',
      'Exchange rate provider is temporarily unavailable'
    );
  }
  if (status != null && status >= 400) {
    throw new AppError(
      502,
      'FX_PROVIDER_HTTP_ERROR',
      'Exchange rate provider rejected the request'
    );
  }
  throw new AppError(
    502,
    'FX_PROVIDER_UNAVAILABLE',
    'Could not reach exchange rate provider'
  );
}

export class FxRatesService {
  private static cache = new LRUCache<string, ExchangeRates>(10);

  public static async getRates(baseCurrency: string): Promise<ExchangeRates> {
    const base = baseCurrency.toUpperCase();
    const cached = this.cache.get(base);
    const now = Date.now();

    if (cached && now - cached.timestamp < env.CACHE_TTL_MS) {
      return cached;
    }

    try {
      const url = `${env.EXCHANGE_RATE_API_BASE.replace(/\/$/, '')}/${encodeURIComponent(base)}`;
      const response = await fxHttp.get(url);
      const parsed = fxProviderLatestSchema.safeParse(response.data);

      if (!parsed.success) {
        throw new AppError(
          502,
          'FX_PROVIDER_INVALID_PAYLOAD',
          'Exchange rate provider returned an unexpected payload'
        );
      }

      if (parsed.data.base.toUpperCase() !== base) {
        throw new AppError(
          502,
          'FX_PROVIDER_BASE_MISMATCH',
          'Exchange rate provider base currency did not match the request'
        );
      }

      const data: ExchangeRates = {
        base: parsed.data.base,
        rates: parsed.data.rates,
        timestamp: now,
      };

      this.cache.set(base, data);
      return data;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      return mapFxProviderFailure(err);
    }
  }
}
