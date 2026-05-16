import { IndicatorKey, MarketAlert } from './types';
import { resolveStorage } from './storage/storageAdapter';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 90;
const MAX_ALERTS = 200;

export interface HistorySnapshot {
  timestamp: string;
  totalScore: number;
  indicators: Array<{ key: IndicatorKey; riskScore: number; weightedScore: number; value: number }>;
}

const isValidSnapshot = (x: unknown): x is HistorySnapshot => {
  const o = x as HistorySnapshot;
  return !!o && typeof o.timestamp === 'string' && typeof o.totalScore === 'number' && Array.isArray(o.indicators);
};
const isValidAlert = (x: unknown): x is MarketAlert => {
  const o = x as MarketAlert;
  return !!o && typeof o.id === 'string' && typeof o.timestamp === 'string' && typeof o.level === 'string' && typeof o.title === 'string';
};

const storage = resolveStorage();
const cache: { snapshots: HistorySnapshot[]; alerts: MarketAlert[]; historyStoreAvailable: boolean; alertStoreAvailable: boolean } = {
  snapshots: [], alerts: [], historyStoreAvailable: true, alertStoreAvailable: true,
};

void (async () => {
  try { cache.snapshots = (await storage.readJson<HistorySnapshot>('history')).filter(isValidSnapshot); } catch { cache.historyStoreAvailable = false; }
  try { cache.alerts = (await storage.readJson<MarketAlert>('alerts')).filter(isValidAlert); } catch { cache.alertStoreAvailable = false; }
})();

const persistHistory = async () => {
  const ok = await storage.writeJson('history', cache.snapshots);
  cache.historyStoreAvailable = ok;
};
const persistAlerts = async () => {
  const ok = await storage.writeJson('alerts', cache.alerts);
  cache.alertStoreAvailable = ok;
};

export const getStoreStatus = () => ({ historyStoreAvailable: cache.historyStoreAvailable, alertStoreAvailable: cache.alertStoreAvailable, storageMode: storage.mode, kvAvailable: storage.kvAvailable });

export const addSnapshot = (snapshot: HistorySnapshot) => {
  cache.snapshots.push(snapshot);
  const cutoff = Date.now() - MAX_DAYS * DAY_MS;
  cache.snapshots = cache.snapshots.filter((s) => new Date(s.timestamp).getTime() >= cutoff);
  void persistHistory();
};
export const getLatestSnapshot = (): HistorySnapshot | null => cache.snapshots[cache.snapshots.length - 1] ?? null;

export const addAlerts = (alerts: MarketAlert[]) => {
  if (!alerts.length) return;
  cache.alerts.push(...alerts);
  if (cache.alerts.length > MAX_ALERTS) cache.alerts = cache.alerts.slice(cache.alerts.length - MAX_ALERTS);
  void persistAlerts();
};

export const getAllAlerts = () => cache.alerts;
export const getRecentAlerts = (limit = 20) => cache.alerts.slice(-Math.max(1, limit)).reverse();
export const getActiveAlerts = () => cache.alerts.filter((a) => a.active).slice(-20).reverse();

export const getSnapshots = (range: '30d' | '90d' = '30d') => {
  const days = range === '30d' ? 30 : 90;
  const cutoff = Date.now() - days * DAY_MS;
  return cache.snapshots.filter((s) => new Date(s.timestamp).getTime() >= cutoff);
};

export const buildIndicatorHistory = (snapshots: HistorySnapshot[]) => {
  const result: Record<IndicatorKey, Array<{ timestamp: string; weightedScore: number; riskScore: number; value: number }>> = { DXY: [], US10Y: [], USDJPY: [], VIX: [], SP500: [], NASDAQ: [], EEM: [] };
  snapshots.forEach((s) => s.indicators.forEach((i) => result[i.key].push({ timestamp: s.timestamp, weightedScore: i.weightedScore, riskScore: i.riskScore, value: i.value })));
  return result;
};
