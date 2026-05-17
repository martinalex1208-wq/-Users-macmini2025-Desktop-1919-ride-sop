import { NextResponse } from 'next/server';
import { mockIndicators } from '@/data/market/mockData';
import { getActiveAlerts } from '@/lib/market/historyStore';
import { toRiskRegime } from '@/lib/market/regime';
import { calculateRisk, DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const risk = calculateRisk(mockIndicators, DEFAULT_WEIGHTS);
  const regime = toRiskRegime(risk.totalScore);

  const topRiskContributors = [...risk.indicators]
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, 3)
    .map((i) => ({
      key: i.key,
      weightedScore: Number(i.weightedScore.toFixed(2)),
    }));

  const activeAlerts = getActiveAlerts();

  const narrative = `今日全球市場風險分數為 ${risk.totalScore}，主要風險來源為 ${topRiskContributors
    .map((i) => i.key)
    .join('、')}，目前市場狀態為 ${regime}。`;

  const decision =
    regime === 'Risk Off' || regime === 'Crisis'
      ? '建議降低高波動部位，提高現金比重，避免追價。'
      : '目前可維持中性配置，但仍需持續觀察市場波動。';

  const humanSummary = [
    '【Vibe Market Radar】',
    '',
    `時間：${new Date().toLocaleString('zh-TW')}`,
    `市場狀態：${regime}`,
    `風險分數：${risk.totalScore}`,
    '',
    '主要風險：',
    ...topRiskContributors.map((i) => `- ${i.key}（${i.weightedScore}）`),
    '',
    `目前警報數量：${activeAlerts.length}`,
    '',
    'AI 市場分析：',
    narrative,
    '',
    'AI 建議：',
    decision,
  ].join('\n');

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    regime,
    totalRiskScore: risk.totalScore,
    topRiskContributors,
    activeAlerts,
    narrative,
    decision,
    humanSummary,
  });
}