import { RiskResult } from './types';
import { RiskRegime } from './regime';

export const buildMarketNarrative = (
  prevScore: number | null,
  current: RiskResult,
  regime: RiskRegime,
): string => {
  const sorted = [...current.indicators].sort((a, b) => b.weightedScore - a.weightedScore);
  const top1 = sorted[0]?.key ?? 'N/A';
  const top2 = sorted[1]?.key ?? 'N/A';

  if (prevScore === null) {
    return `今日全球市場風險為 ${current.totalScore}，主要風險來源為 ${top1} 與 ${top2}，目前市場處於 ${regime} 區間。`;
  }

  const direction = current.totalScore >= prevScore ? '升' : '降';
  return `今日全球市場風險由 ${prevScore} ${direction}至 ${current.totalScore}，主要來自 ${top1} 與 ${top2} 的壓力，目前市場進入 ${regime} 區間。`;
};
