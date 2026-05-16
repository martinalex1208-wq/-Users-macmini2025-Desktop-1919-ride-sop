import { NextResponse } from 'next/server';
import { getStoreStatus } from '@/lib/market/historyStore';
import { getHealthState } from '@/lib/market/healthState';
import { envValidation } from '@/lib/market/config';

export async function GET() {
  const stores = getStoreStatus();
  const runtime = process.env.RUNTIME_TARGET === 'cloudflare' ? 'cloudflare' : 'local';
  const state = getHealthState();
  return NextResponse.json({
    status: envValidation.ok ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    marketApiAvailable: true,
    runtime,
    historyStoreAvailable: stores.historyStoreAvailable,
    alertStoreAvailable: stores.alertStoreAvailable,
    storageMode: stores.storageMode,
    kvAvailable: stores.kvAvailable,
    dataMode: state.lastDataMode,
    lastNotification: state.lastNotification,
    notificationStatus: state.notificationStatus,
    activeChannels: state.activeChannels,
    envWarnings: envValidation.warnings,
  });
}
