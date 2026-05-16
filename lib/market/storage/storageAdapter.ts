import { kvStorage } from './kvStorage';
import { localJsonStorage } from './localJsonStorage';
import { memoryStorage } from './memoryStorage';
import { MarketStorage } from './types';

export const resolveStorage = (): MarketStorage => {
  const runtime = process.env.RUNTIME_TARGET;
  const kvEnabled = process.env.MARKET_HISTORY_KV === 'enabled' && process.env.MARKET_ALERTS_KV === 'enabled';

  if (runtime === 'cloudflare' && kvEnabled) return kvStorage;
  if (runtime === 'cloudflare') return memoryStorage;
  return localJsonStorage;
};
