import { MarketStorage } from './types';

const mem = {
  history: [] as unknown[],
  alerts: [] as unknown[],
};

export const memoryStorage: MarketStorage = {
  mode: 'memory',
  kvAvailable: false,
  async readJson<T>(key: 'history' | 'alerts') {
    return (mem[key] as T[]) ?? [];
  },
  async writeJson<T>(key: 'history' | 'alerts', value: T[]) {
    mem[key] = value;
    return true;
  },
};
