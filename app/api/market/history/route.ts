import { NextRequest, NextResponse } from 'next/server';
import { buildIndicatorHistory, getSnapshots } from '@/lib/market/historyStore';
import { MarketHistoryRange, MarketHistoryResponse } from '@/lib/market/types';

const parseRange = (raw: string | null): MarketHistoryRange => {
  if (raw === '1d' || raw === '7d' || raw === '30d' || raw === '90d' || raw === 'all') return raw;
  return '30d';
};

export async function GET(req: NextRequest) {
  const range = parseRange(req.nextUrl.searchParams.get('range'));

  const snapshots = getSnapshots(range);
  const payload: MarketHistoryResponse = {
    range,
    globalRiskHistory: snapshots.map((s) => ({ timestamp: s.timestamp, totalScore: s.totalScore })),
    indicatorHistory: buildIndicatorHistory(snapshots),
  };

  return NextResponse.json(payload);
}
