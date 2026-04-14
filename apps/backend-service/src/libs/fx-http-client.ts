import axios from 'axios';
import { env } from '@/config/env';

export const fxHttp = axios.create({
  timeout: env.FX_TIMEOUT_MS,
  maxRedirects: 0,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    Accept: 'application/json',
    'User-Agent': 'currency-exchange-backend/1.0 (+https://github.com/)',
  },
});
