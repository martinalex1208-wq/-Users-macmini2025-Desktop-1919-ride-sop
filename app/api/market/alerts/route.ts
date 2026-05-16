import { NextRequest, NextResponse } from 'next/server';
import { getActiveAlerts, getRecentAlerts } from '@/lib/market/historyStore';
import { MarketAlertsResponse } from '@/lib/market/types';

export async function GET(req: NextRequest) {
  const recent = Number(req.nextUrl.searchParams.get('recent') || '20');
  const latestAlerts = getRecentAlerts(Math.min(Math.max(recent, 1), 100));
  const activeAlerts = getActiveAlerts();

  const payload: MarketAlertsResponse = {
    activeAlerts,
    latestAlerts,
    alertCount: latestAlerts.length,
  };

  return NextResponse.json(payload);
}
