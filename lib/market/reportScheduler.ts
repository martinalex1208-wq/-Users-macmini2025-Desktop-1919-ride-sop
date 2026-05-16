import { getActiveAlerts, getLatestSnapshot } from './historyStore';
import { buildDecisionNarrative } from './marketDecisionNarrative';
import { buildMarketNarrative } from './marketNarrative';
import { getActiveChannels } from './notificationEngine';
import { toRiskRegime } from './regime';
import { calculateRisk, DEFAULT_WEIGHTS } from './riskEngine';
import { IndicatorData } from './types';

export const generateDailyReport = (data: IndicatorData[]) => {
  const risk = calculateRisk(data, DEFAULT_WEIGHTS);
  const regime = toRiskRegime(risk.totalScore);
  const prev = getLatestSnapshot();
  const prevScore = prev ? prev.totalScore : null;
  const narrative = buildMarketNarrative(prevScore, risk, regime);
  const decision = buildDecisionNarrative(regime, getActiveAlerts(), risk.indicators);
  const top = [...risk.indicators].sort((a, b) => b.weightedScore - a.weightedScore).slice(0, 3).map((i) => ({ key: i.key, weightedScore: Number(i.weightedScore.toFixed(2)) }));
  const activeAlerts = getActiveAlerts();

  return {
    timestamp: new Date().toISOString(),
    regime,
    totalRiskScore: risk.totalScore,
    topRiskContributors: top,
    activeAlerts,
    narrative,
    decision,
  };
};

export const sendReport = async (summary: string) => ({
  sent: false,
  channels: getActiveChannels(),
  summary,
});
