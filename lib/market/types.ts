export type IndicatorKey = 'DXY' | 'US10Y' | 'USDJPY' | 'VIX' | 'SP500' | 'NASDAQ' | 'EEM';

export interface IndicatorData {
  key: IndicatorKey;
  name: string;
  symbol: string;
  value: number;
  changePct: number;
  updatedAt: string;
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
