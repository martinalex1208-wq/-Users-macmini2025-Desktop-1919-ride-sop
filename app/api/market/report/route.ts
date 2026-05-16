import { NextResponse } from 'next/server';
import { mockIndicators } from '@/data/market/mockData';
import { getActiveAlerts } from '@/lib/market/historyStore';
import { generateDailyReport } from '@/lib/market/reportScheduler';

export async function GET() {
  const report = generateDailyReport(mockIndicators);
  const humanSummary = [
    `Regime: ${report.regime}`,
    `Risk Score: ${report.totalRiskScore}`,
    `Top Risks: ${report.topRiskContributors.map((i) => i.key).join(', ')}`,
    `Active Alerts: ${getActiveAlerts().length}`,
    report.narrative,
    report.decision,
  ].join('\n');

  return NextResponse.json({ ...report, humanSummary });
}
