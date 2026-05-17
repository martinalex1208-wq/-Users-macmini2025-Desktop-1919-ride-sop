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

  const narrative = `Global market risk score is ${risk.totalScore}. Main risk contributors are ${topRiskContributors
    .map((i) => i.key)
    .join(', ')}. Current market regime is ${regime}.`;

  const decision =
    regime === 'Risk Off' || regime === 'Crisis'
      ? 'Suggestion: reduce high-volatility exposure, raise cash level, and avoid chasing momentum.'
      : 'Suggestion: maintain neutral exposure, but continue monitoring market volatility.';

  const humanSummary = [
    '[Vibe Market Radar]',
    '',
    `Time: ${new Date().toISOString()}`,
    `Market Regime: ${regime}`,
    `Risk Score: ${risk.totalScore}`,
    '',
    'Top Risks:',
    ...topRiskContributors.map((i) => `- ${i.key} (${i.weightedScore})`),
    '',
    `Active Alerts: ${activeAlerts.length}`,
    '',
    'Market Analysis:',
    narrative,
    '',
    'Decision:',
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