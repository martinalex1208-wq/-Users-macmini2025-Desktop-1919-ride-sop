import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MarketStorage } from './types';

const DATA_DIR = join(process.cwd(), 'data', 'market');
const FILES = { history: join(DATA_DIR, 'history.json'), alerts: join(DATA_DIR, 'alerts.json') };

const ensure = () => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(FILES.history)) writeFileSync(FILES.history, '[]', 'utf8');
  if (!existsSync(FILES.alerts)) writeFileSync(FILES.alerts, '[]', 'utf8');
};

export const localJsonStorage: MarketStorage = {
  mode: 'local-json',
  kvAvailable: false,
  async readJson<T>(key: 'history' | 'alerts') {
    try {
      ensure();
      const raw = readFileSync(FILES[key], 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  },
  async writeJson<T>(key: 'history' | 'alerts', value: T[]) {
    try {
      ensure();
      writeFileSync(FILES[key], JSON.stringify(value, null, 2), 'utf8');
      return true;
    } catch {
      return false;
    }
  },
};
