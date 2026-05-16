import { NextResponse } from 'next/server';
import { mockIndicators } from '@/data/market/mockData';
import { evaluateAlerts } from '@/lib/market/alertEngine';
import { addAlerts, addSnapshot, getLatestSnapshot } from '@/lib/market/historyStore';
import { calculateRisk } from '@/lib/market/riskEngine';
import { IndicatorData, IndicatorKey, MarketApiResponse, MarketDataMode } from '@/lib/market/types';
import { setLastDataMode, setNotificationState } from '@/lib/market/healthState';
import { runtimeConfig } from '@/lib/market/config';
import { deliverAlert, getActiveChannels } from '@/lib/market/notificationEngine';

const SYMBOLS: Record<IndicatorKey, { symbol: string; name: string }> = {
  DXY: { symbol: 'DX-Y.NYB', name: 'Dollar Index' },
  US10Y: { symbol: '^TNX', name: 'US 10Y Yield' },
  USDJPY: { symbol: 'JPY=X', name: 'USD/JPY' },
  VIX: { symbol: '^VIX', name: 'VIX' },
  SP500: { symbol: '^GSPC', name: 'S&P 500' },
  NASDAQ: { symbol: '^IXIC', name: 'Nasdaq' },
  EEM: { symbol: 'EEM', name: 'MSCI EM ETF (EEM)' },
};

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const fetchOne = async (key: IndicatorKey): Promise<IndicatorData | null> => {
  const { symbol, name } = SYMBOLS[key];
  const base = process.env.MARKET_DATA_BASE_URL || 'https://query1.finance.yahoo.com';
  const url = `${base}/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), runtimeConfig.marketFetchTimeoutMs);
    const res = await fetch(url, { next: { revalidate: 300 }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const quotes = result?.indicators?.quote?.[0]?.close;
    if (!Array.isArray(quotes) || quotes.length < 2) return null;

    const valid = quotes.filter((n: unknown) => isFiniteNumber(n));
    if (valid.length < 2) return null;

    const curr = valid[valid.length - 1];
    const prev = valid[valid.length - 2];
    if (!isFiniteNumber(curr) || !isFiniteNumber(prev) || prev === 0) return null;

    const changePct = ((curr - prev) / prev) * 100;
    if (!isFiniteNumber(changePct)) return null;

    return { key, name, symbol, value: Number(curr.toFixed(2)), changePct: Number(changePct.toFixed(2)), updatedAt: new Date().toISOString(), source: 'live' };
  } catch {
    return null;
  }
};

export async function GET() {
  const now = new Date().toISOString();
  const keys = Object.keys(SYMBOLS) as IndicatorKey[];
  const items = await Promise.all(keys.map(async (key) => ({ key, live: await fetchOne(key) })));

  const data: IndicatorData[] = [];
  const missingSymbols: IndicatorKey[] = [];

  for (const item of items) {
    if (item.live) data.push(item.live);
    else {
      missingSymbols.push(item.key);
      const fallback = mockIndicators.find((mock) => mock.key === item.key);
      if (fallback) data.push({ ...fallback, source: 'mock', updatedAt: now });
    }
  }

  let dataMode: MarketDataMode = 'live';
  if (missingSymbols.length === keys.length) dataMode = 'mock';
  else if (missingSymbols.length > 0) dataMode = 'partial';

  const prev = getLatestSnapshot();
  const risk = calculateRisk(data);
  addSnapshot({ timestamp: now, totalScore: risk.totalScore, indicators: risk.indicators.map((i) => ({ key: i.key, riskScore: i.riskScore, weightedScore: i.weightedScore, value: i.value })) });

  const alerts = evaluateAlerts(risk.totalScore, risk.indicators, now, prev);
  addAlerts(alerts);

  let notifStatus: 'sent' | 'skipped' | 'failed' = 'skipped';
  let notifTime: string | null = null;
  if (alerts.length > 0) {
    const result = await deliverAlert(alerts[0]);
    notifStatus = result.status;
    if (result.status === 'sent') notifTime = now;
  }

  setLastDataMode(dataMode);
  setNotificationState({
    lastNotification: notifTime,
    notificationStatus: notifStatus,
    activeChannels: getActiveChannels(),
  });
  const payload: MarketApiResponse = { data, asOf: now, dataMode, isFallback: dataMode !== 'live', missingSymbols };
  return NextResponse.json(payload);
}
