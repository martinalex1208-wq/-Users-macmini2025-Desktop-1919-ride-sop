export type IndicatorKey = 'DXY' | 'US10Y' | 'USDJPY' | 'VIX' | 'SP500' | 'NASDAQ' | 'EEM';
export type IndicatorSource = 'live' | 'mock';

export interface IndicatorData {
  key: IndicatorKey;
  name: string;
  symbol: string;
  value: number;
  changePct: number;
  updatedAt: string;
  source: IndicatorSource;
}

export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface IndicatorRisk extends IndicatorData {
  riskScore: number;
  weight: number;
  weightedScore: number;
}

export interface RiskResult {
  totalScore: number;
  level: RiskLevel;
  indicators: IndicatorRisk[];
}

export type MarketDataMode = 'live' | 'partial' | 'mock';
export interface MarketApiResponse {
  data: IndicatorData[];
  asOf: string;
  dataMode: MarketDataMode;
  isFallback: boolean;
  missingSymbols: IndicatorKey[];
}

export interface MarketHistoryPoint { timestamp: string; totalScore: number; }
export interface MarketHistoryResponse {
  range: '30d' | '90d';
  globalRiskHistory: MarketHistoryPoint[];
  indicatorHistory: Record<IndicatorKey, Array<{ timestamp: string; weightedScore: number; riskScore: number; value: number }>>;
}

export type AlertLevel = 'info' | 'warning' | 'danger' | 'critical';
export interface MarketAlert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  timestamp: string;
  triggerSource: 'global' | IndicatorKey | 'regime';
  active: boolean;
}

export interface MarketAlertsResponse {
  activeAlerts: MarketAlert[];
  latestAlerts: MarketAlert[];
  alertCount: number;
}
