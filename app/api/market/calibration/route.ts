import { NextResponse } from 'next/server';
import { getAllAlerts, getSnapshots } from '@/lib/market/historyStore';
import { getNotificationConfig } from '@/lib/market/notificationEngine';
import { DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';

export async function GET() {
  const alerts = getAllAlerts();
  const snapshots = getSnapshots('90d');

  const byTitle = new Map<string, number>();
  alerts.forEach((a) => byTitle.set(a.title, (byTitle.get(a.title) ?? 0) + 1));
  const topTriggeredAlerts = Array.from(byTitle.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([title, count]) => ({ title, count }));

  const regimeDistribution = { 'Risk On': 0, Neutral: 0, 'Risk Off': 0, Crisis: 0 } as Record<string, number>;
  snapshots.forEach((s) => {
    if (s.totalScore <= 30) regimeDistribution['Risk On'] += 1;
    else if (s.totalScore <= 50) regimeDistribution.Neutral += 1;
    else if (s.totalScore <= 70) regimeDistribution['Risk Off'] += 1;
    else regimeDistribution.Crisis += 1;
  });

  const alertFrequency = {
    total: alerts.length,
    last24h: alerts.filter((a) => Date.now() - new Date(a.timestamp).getTime() < 24 * 60 * 60 * 1000).length,
    avgPerDay90d: snapshots.length ? Number((alerts.length / 90).toFixed(2)) : 0,
  };

  return NextResponse.json({
    currentThresholds: {
      globalWarning: 50,
      globalDanger: 70,
      globalCritical: 80,
      vixWarning: 20,
      vixCritical: 30,
      dxyAccelerationPct: 1,
      eemCollapsePct: -2.5,
    },
    currentWeights: DEFAULT_WEIGHTS,
    alertFrequency,
    regimeDistribution,
    topTriggeredAlerts,
    notificationConfig: getNotificationConfig(),
  });
}
