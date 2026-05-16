import { MarketAlert } from './types';
import { RiskRegime } from './regime';
import { IndicatorRisk } from './types';

export const buildDecisionNarrative = (
  regime: RiskRegime,
  alerts: MarketAlert[],
  indicators: IndicatorRisk[],
): string => {
  const bad = [...indicators].sort((a, b) => b.weightedScore - a.weightedScore).slice(0, 3).map((i) => i.key);
  const hasDanger = alerts.some((a) => a.level === 'danger' || a.level === 'critical');
  const defense = hasDanger || regime === 'Risk Off' || regime === 'Crisis';

  return `目前市場處於 ${regime} 狀態，主因為 ${bad.join('、')} 風險貢獻偏高。${defense ? '建議進入防禦模式，降低風險曝險並提高現金比重。' : '目前可維持中性配置，但需持續監控波動。'}`;
};
