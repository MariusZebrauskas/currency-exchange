import axios from 'axios';
import { QuoteQuery, QuoteResponse, quoteResponseSchema } from '@/schemas/quote.schema';

const api = axios.create({
  baseURL: '',
  timeout: 5000,
});

function messageFromAxiosData(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const err = (data as { error?: unknown }).error;
  if (typeof err === 'string') {
    return err;
  }
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string') {
      return m;
    }
  }
  return null;
}

export const quoteService = {
  async getQuote(query: QuoteQuery): Promise<QuoteResponse> {
    try {
      const response = await api.get('/quote', {
        params: {
          ...query,
          baseAmount: String(query.baseAmount),
        },
      });
      return quoteResponseSchema.parse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const msg = messageFromAxiosData(error.response.data);
        if (msg) {
          throw new Error(msg);
        }
      }
      throw error;
    }
  },
};
