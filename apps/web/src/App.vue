<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { quoteService } from '@/services/quoteService';
import type { QuoteResponse } from '@/schemas/quote.schema';

const currencies = ['USD', 'EUR', 'GBP', 'ILS'];

const baseCurrency = ref('EUR');
const quoteCurrency = ref('USD');
const baseAmountInput = ref('');
const result = ref<QuoteResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

let debounceTimer: ReturnType<typeof setTimeout>;

const fetchQuote = async () => {
  const amountCents = Math.round(parseFloat(baseAmountInput.value) * 100);
  
  if (isNaN(amountCents) || amountCents <= 0) {
    result.value = null;
    return;
  }

  if (baseCurrency.value === quoteCurrency.value) {
    result.value = { exchangeRate: 1, quoteAmount: amountCents };
    error.value = null;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    result.value = await quoteService.getQuote({
      baseCurrency: baseCurrency.value as any,
      quoteCurrency: quoteCurrency.value as any,
      baseAmount: amountCents,
    });
  } catch (e: any) {
    error.value = e.message;
    result.value = null;
  } finally {
    loading.value = false;
  }
};

const onInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchQuote, 500);
};

watch([baseCurrency, quoteCurrency], fetchQuote);

const formatCurrency = (cents: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(cents / 100);
};
</script>

<template>
  <div class="exchange-card">
    <header class="card-header">
      <h2>Currency Exchange</h2>
      <p class="subtitle">Fast, secure, and transparent rates.</p>
    </header>

    <div class="card-body">
      <div class="input-group">
        <label>Amount</label>
        <div class="amount-input-wrapper">
          <input 
            v-model="baseAmountInput" 
            type="number" 
            step="0.01" 
            placeholder="0.00"
            @input="onInput"
          />
          <select v-model="baseCurrency">
            <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label>To</label>
        <select v-model="quoteCurrency" class="full-select">
          <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div v-if="loading" class="status-box loading">
        Fetching latest rates...
      </div>

      <div v-if="error" class="status-box error">
        {{ error }}
      </div>

      <div v-if="result && !loading" class="result-area">
        <div class="rate-info">
          1 {{ baseCurrency }} = {{ result.exchangeRate }} {{ quoteCurrency }}
        </div>
        <div class="quote-amount">
          {{ formatCurrency(result.quoteAmount, quoteCurrency) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exchange-card {
  background: var(--card-bg);
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: var(--radius);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  border: 1px solid var(--border);
}

.card-header h2 {
  margin: 0;
  color: var(--primary);
  font-size: 24px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin: 4px 0 24px 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.amount-input-wrapper {
  display: flex;
  gap: 8px;
}

input, select {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  border-color: var(--secondary);
}

input {
  flex: 1;
}

.full-select {
  width: 100%;
}

.status-box {
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 16px;
}

.loading {
  background: #eef2ff;
  color: var(--secondary);
}

.error {
  background: #fef2f2;
  color: var(--error);
}

.result-area {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
}

.rate-info {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.quote-amount {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
}
</style>
