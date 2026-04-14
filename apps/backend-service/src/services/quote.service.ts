import Decimal from 'decimal.js';
import { AppError } from '@/libs/errors';
import { QuoteQuery, QuoteResponse } from '@/schemas/quote.schema';
import { FxRatesService } from '@/services/fx-rates.service';

export class QuoteService {
  public static async getQuote(query: QuoteQuery): Promise<QuoteResponse> {
    const { baseCurrency, quoteCurrency, baseAmount } = query;

    if (baseCurrency === quoteCurrency) {
      return {
        exchangeRate: 1,
        quoteAmount: baseAmount,
      };
    }

    const fxData = await FxRatesService.getRates(baseCurrency);
    const marketRate = fxData.rates[quoteCurrency];

    if (marketRate === undefined || !Number.isFinite(marketRate)) {
      throw new AppError(
        422,
        'UNSUPPORTED_CURRENCY_PAIR',
        `No exchange rate for ${baseCurrency} to ${quoteCurrency}`
      );
    }

    const rate = new Decimal(String(marketRate));
    const base = new Decimal(baseAmount);
    const quoteAmount = base
      .times(rate)
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();

    const exchangeRate = Number(rate.toDecimalPlaces(3, Decimal.ROUND_HALF_UP));

    return {
      exchangeRate,
      quoteAmount,
    };
  }
}
