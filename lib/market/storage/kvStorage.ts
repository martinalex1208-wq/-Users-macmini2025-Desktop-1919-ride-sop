import { MarketStorage } from './types';

declare global {
  // eslint-disable-next-line no-var
  var MARKET_HISTORY_KV: { get: (k: string) => Promise<string | null>; put: (k: string, v: string) => Promise<void> } | undefined;
  // eslint-disable-next-line no-var
  var MARKET_ALERTS_KV: { get: (k: string) => Promise<string | null>; put: (k: string, v: string) => Promise<void> } | undefined;
}

const getNamespace = (key: 'history' | 'alerts') => (key === 'history' ? globalThis.MARKET_HISTORY_KV : globalThis.MARKET_ALERTS_KV);

export const kvStorage: MarketStorage = {
  mode: 'kv',
  kvAvailable: true,
  async readJson<T>(key: 'history' | 'alerts') {
    try {
      const ns = getNamespace(key);
      if (!ns) return [];
      const raw = await ns.get('v1');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  },
  async writeJson<T>(key: 'history' | 'alerts', value: T[]) {
    try {
      const ns = getNamespace(key);
      if (!ns) return false;
      await ns.put('v1', JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
