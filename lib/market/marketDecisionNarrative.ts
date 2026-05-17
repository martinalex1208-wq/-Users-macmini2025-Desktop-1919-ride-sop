import { MarketAlert, IndicatorRisk } from './types';
import { RiskRegime } from './regime';

export const buildDecisionNarrative = (
  regime: RiskRegime,
  alerts: MarketAlert[],
  indicators: IndicatorRisk[],
): string => {
  const top = [...indicators]
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, 3)
    .map((i) => i.key);

  const hasDanger = alerts.some(
    (a) => a.level === 'danger' || a.level === 'critical',
  );

  const defensive =
    hasDanger || regime === 'Risk Off' || regime === 'Crisis';

  return defensive
    ? `目前市場進入 ${regime} 狀態，主要風險來自 ${top.join('、')}。建議降低高波動部位，提高現金比重，避免追價。`
    : `目前市場處於 ${regime} 狀態。風險相對穩定，但仍需持續觀察 ${top.join('、')} 的變化。`;
};
