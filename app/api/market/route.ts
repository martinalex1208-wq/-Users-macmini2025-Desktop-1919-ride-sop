import { NextResponse } from 'next/server';
import { mockIndicators } from '@/data/market/mockData';
import { IndicatorData, IndicatorKey } from '@/lib/market/types';

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
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const quotes = result?.indicators?.quote?.[0]?.close;
    if (!Array.isArray(quotes) || quotes.length < 2) return null;
    const valid = quotes.filter((n: unknown) => isFiniteNumber(n)) as number[];
    if (valid.length < 2) return null;
    const curr = valid[valid.length - 1];
    const prev = valid[valid.length - 2];
    const changePct = ((curr - prev) / prev) * 100;
    return { key, name, symbol, value: Number(curr.toFixed(2)), changePct: Number(changePct.toFixed(2)), updatedAt: new Date().toISOString() };
  } catch {
    return null;
  }
};

export async function GET() {
  const keys = Object.keys(SYMBOLS) as IndicatorKey[];
  const data = await Promise.all(keys.map((k) => fetchOne(k)));
  const clean = data.filter((x): x is IndicatorData => x !== null);
  return NextResponse.json({ data: clean.length === keys.length ? clean : mockIndicators, source: clean.length === keys.length ? 'live' : 'mock' });
}
