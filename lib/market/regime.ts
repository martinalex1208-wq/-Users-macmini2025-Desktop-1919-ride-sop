import { RiskLevel } from './types';

export type RiskRegime = 'Risk On' | 'Neutral' | 'Risk Off' | 'Crisis';

export const toRiskRegime = (score: number): RiskRegime => {
  if (score <= 30) return 'Risk On';
  if (score <= 50) return 'Neutral';
  if (score <= 70) return 'Risk Off';
  return 'Crisis';
};

export const levelFromRegime = (regime: RiskRegime): RiskLevel => {
  if (regime === 'Risk On') return 'green';
  if (regime === 'Neutral') return 'yellow';
  if (regime === 'Risk Off') return 'orange';
  return 'red';
};
