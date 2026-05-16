import { IndicatorData, IndicatorKey, RiskLevel, RiskResult } from './types';

export const DEFAULT_WEIGHTS: Record<IndicatorKey, number> = {
  DXY: 15,
  US10Y: 15,
  USDJPY: 15,
  VIX: 20,
  SP500: 15,
  NASDAQ: 10,
  EEM: 10,
};

const clamp = (num: number, min = 0, max = 100) => Math.max(min, Math.min(max, num));

const scoreIndicator = (item: IndicatorData): number => {
  const c = item.changePct;
  switch (item.key) {
    case 'DXY':
    case 'US10Y':
      return clamp(50 + c * 12);
    case 'USDJPY':
      return clamp(45 + c * 14);
    case 'VIX':
      if (item.value >= 30) return clamp(80 + c * 5);
      if (item.value >= 20) return clamp(60 + c * 5);
      return clamp(30 + c * 4);
    case 'SP500':
    case 'NASDAQ':
    case 'EEM':
      return clamp(50 + -c * 12);
    default:
      return 50;
  }
};

export const toRiskLevel = (score: number): RiskLevel => {
  if (score <= 30) return 'green';
  if (score <= 50) return 'yellow';
  if (score <= 70) return 'orange';
  return 'red';
};

export const calculateRisk = (
  data: IndicatorData[],
  weights: Record<IndicatorKey, number> = DEFAULT_WEIGHTS,
): RiskResult => {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0) || 1;

  const indicators = data.map((item) => {
    const riskScore = scoreIndicator(item);
    const weight = weights[item.key] ?? 0;
    const weightedScore = (riskScore * weight) / totalWeight;
    return { ...item, riskScore, weight, weightedScore };
  });

  const totalScore = clamp(indicators.reduce((sum, i) => sum + i.weightedScore, 0));
  return {
    totalScore: Number(totalScore.toFixed(1)),
    level: toRiskLevel(totalScore),
    indicators,
  };
};
