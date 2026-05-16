import { IndicatorData } from '@/lib/market/types';

export const mockIndicators: IndicatorData[] = [
  { key: 'DXY', name: 'Dollar Index', symbol: 'DX-Y.NYB', value: 104.2, changePct: 0.32, updatedAt: new Date().toISOString(), source: 'mock' },
  { key: 'US10Y', name: 'US 10Y Yield', symbol: '^TNX', value: 4.41, changePct: 0.18, updatedAt: new Date().toISOString(), source: 'mock' },
  { key: 'USDJPY', name: 'USD/JPY', symbol: 'JPY=X', value: 155.8, changePct: 0.57, updatedAt: new Date().toISOString(), source: 'mock' },
  { key: 'VIX', name: 'VIX', symbol: '^VIX', value: 22.8, changePct: 3.11, updatedAt: new Date().toISOString(), source: 'mock' },
  { key: 'SP500', name: 'S&P 500', symbol: '^GSPC', value: 5232.4, changePct: -1.02, updatedAt: new Date().toISOString(), source: 'mock' },
  { key: 'NASDAQ', name: 'Nasdaq', symbol: '^IXIC', value: 16553.8, changePct: -1.43, updatedAt: new Date().toISOString(), source: 'mock' },
  { key: 'EEM', name: 'MSCI EM ETF (EEM)', symbol: 'EEM', value: 41.9, changePct: -0.87, updatedAt: new Date().toISOString(), source: 'mock' },
];
