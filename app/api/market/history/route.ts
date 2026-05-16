import { NextRequest, NextResponse } from 'next/server';
import { buildIndicatorHistory, getSnapshots } from '@/lib/market/historyStore';
import { MarketHistoryResponse } from '@/lib/market/types';

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('range');
  const range = raw === '90d' ? '90d' : '30d';

  const snapshots = getSnapshots(range);
  const payload: MarketHistoryResponse = {
    range,
    globalRiskHistory: snapshots.map((s) => ({ timestamp: s.timestamp, totalScore: s.totalScore })),
    indicatorHistory: buildIndicatorHistory(snapshots),
  };

  return NextResponse.json(payload);
}
