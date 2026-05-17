import { NextResponse } from 'next/server';
import { mockIndicators } from '@/data/market/mockData';
import { getActiveAlerts } from '@/lib/market/historyStore';
import { generateDailyReport } from '@/lib/market/reportScheduler';

export async function GET() {
  const report = generateDailyReport(mockIndicators);

  const humanSummary = [
    '📡【Vibe Market Radar】',
    '',
    `🕒 時間：${new Date().toLocaleString('zh-TW')}`,
    `📊 市場狀態：${report.regime}`,
    `⚠️ 風險分數：${report.totalRiskScore}`,
    '',
    '📌 主要風險：',
    ...report.topRiskContributors.map(
      (i) => `• ${i.key}（${i.weightedScore}）`,
    ),
    '',
    `🚨 目前警報數量：${getActiveAlerts().length}`,
    '',
    '🧠 AI 市場分析：',
    report.narrative,
    '',
    '💡 AI 建議：',
    report.decision,
  ].join('\n');

  return NextResponse.json({
    ...report,
    humanSummary,
  });
}