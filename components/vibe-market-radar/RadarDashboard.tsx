'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { buildDecisionNarrative } from '@/lib/market/marketDecisionNarrative';
import { buildMarketNarrative } from '@/lib/market/marketNarrative';
import { calculateRisk, DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';
import { toRiskRegime } from '@/lib/market/regime';
import { IndicatorData, IndicatorKey, MarketAlert, MarketAlertsResponse, MarketApiResponse, MarketDataMode, MarketHistoryResponse } from '@/lib/market/types';

const levelStyle = { green: 'bg-green-500', yellow: 'bg-yellow-400', orange: 'bg-orange-500', red: 'bg-red-600' };
const modeText: Record<MarketDataMode, string> = { live: 'Live Data', partial: 'Partial Fallback', mock: 'Mock Data' };
const alertBadge: Record<MarketAlert['level'], string> = { info: 'bg-slate-100 text-slate-700', warning: 'bg-yellow-100 text-yellow-700', danger: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };

const parseWeights = (raw: string | null): Record<IndicatorKey, number> => {
  if (!raw) return DEFAULT_WEIGHTS;
  try {
    const parsed = JSON.parse(raw) as Partial<Record<IndicatorKey, number>>;
    const clean: Record<IndicatorKey, number> = { ...DEFAULT_WEIGHTS };
    (Object.keys(DEFAULT_WEIGHTS) as IndicatorKey[]).forEach((key) => {
      const value = parsed[key];
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100) clean[key] = value;
    });
    return clean;
  } catch { return DEFAULT_WEIGHTS; }
};

const TrendChart = ({ points }: { points: Array<{ timestamp: string; totalScore: number }> }) => {
  if (points.length < 2) return <div className="text-sm text-gray-500">Not enough history yet.</div>;
  const w = 700; const h = 220; const pad = 20;
  const stepX = (w - pad * 2) / (points.length - 1);
  const y = (v: number) => h - pad - (v / 100) * (h - pad * 2);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * stepX} ${y(p.totalScore)}`).join(' ');

  return <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56"><rect x={0} y={y(30)} width={w} height={h - y(30)} fill="#dcfce7" opacity="0.45" /><rect x={0} y={y(50)} width={w} height={y(30)-y(50)} fill="#fef9c3" opacity="0.55" /><rect x={0} y={y(70)} width={w} height={y(50)-y(70)} fill="#fed7aa" opacity="0.5" /><rect x={0} y={pad} width={w} height={y(70)-pad} fill="#fecaca" opacity="0.45" /><path d={d} stroke="#1d4ed8" strokeWidth={3} fill="none" /></svg>;
};

export default function RadarDashboard() {
  const [data, setData] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState<MarketDataMode>('mock');
  const [asOf, setAsOf] = useState('');
  const [range, setRange] = useState<'30d' | '90d'>('30d');
  const [history, setHistory] = useState<MarketHistoryResponse | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<MarketAlert[]>([]);
  const [latestAlerts, setLatestAlerts] = useState<MarketAlert[]>([]);
  const [weights, setWeights] = useState<Record<IndicatorKey, number>>(DEFAULT_WEIGHTS);
  const [health, setHealth] = useState<{ timestamp: string; historyStoreAvailable: boolean; alertStoreAvailable: boolean; lastNotification?: string | null; notificationStatus?: string; activeChannels?: string[] } | null>(null);
  const [calibration, setCalibration] = useState<{ alertFrequency?: { total: number; last24h: number; avgPerDay90d: number }; topTriggeredAlerts?: Array<{ title: string; count: number }>; notificationConfig?: { cooldownMs: number; maxAlertsPerHour: number; levelThreshold: string } } | null>(null);

  useEffect(() => {
    setWeights(parseWeights(localStorage.getItem('radar-weights')));
    fetch('/api/market').then((r) => r.json()).then((j: MarketApiResponse) => {
      if (Array.isArray(j.data)) setData(j.data);
      if (j.dataMode) setDataMode(j.dataMode);
      if (j.asOf) setAsOf(j.asOf);
    }).catch(() => setDataMode('mock')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`/api/market/history?range=${range}`).then((r) => r.json()).then((j: MarketHistoryResponse) => setHistory(j));
  }, [range]);

  useEffect(() => {
    fetch('/api/market/alerts?recent=20').then((r) => r.json()).then((j: MarketAlertsResponse) => {
      if (Array.isArray(j.activeAlerts)) setActiveAlerts(j.activeAlerts);
      if (Array.isArray(j.latestAlerts)) setLatestAlerts(j.latestAlerts);
    });
  }, []);

  useEffect(() => {
    fetch('/api/health').then((r) => r.json()).then((j) => setHealth(j)).catch(() => setHealth(null));
  }, []);

  useEffect(() => {
    fetch('/api/market/calibration').then((r) => r.json()).then((j) => setCalibration(j)).catch(() => setCalibration(null));
  }, []);

  const risk = useMemo(() => calculateRisk(data, weights), [data, weights]);
  const regime = toRiskRegime(risk.totalScore);
  const prevScore = history && history.globalRiskHistory.length >= 2 ? history.globalRiskHistory[history.globalRiskHistory.length - 2].totalScore : null;
  const narrative = buildMarketNarrative(prevScore, risk, regime);
  const decisionNarrative = buildDecisionNarrative(regime, latestAlerts, risk.indicators);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-bold">Vibe Market Radar</h1><Link href="/vibe-market-radar/settings" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Adjust Weights</Link></div>
      <div className="rounded-xl border p-4 bg-gray-50 text-sm space-y-1"><p><span className="font-medium">Data Mode:</span> {modeText[dataMode]}</p><p><span className="font-medium">Last Updated:</span> {asOf ? new Date(asOf).toLocaleString() : 'N/A'}</p><p><span className="font-medium">Regime:</span> {regime}</p><p><span className="font-medium">Last Health Check:</span> {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}</p><p><span className="font-medium">Data Store Status:</span> {health?.historyStoreAvailable ? 'OK' : 'Degraded'}</p><p><span className="font-medium">Alert Store Status:</span> {health?.alertStoreAvailable ? 'OK' : 'Degraded'}</p><p><span className="font-medium">Last Notification:</span> {health?.lastNotification ? new Date(health.lastNotification).toLocaleString() : 'N/A'}</p><p><span className="font-medium">Notification Status:</span> {health?.notificationStatus ?? 'N/A'}</p><p><span className="font-medium">Active Channels:</span> {(health?.activeChannels ?? []).join(', ') || 'None'}</p></div>
      {(dataMode === 'partial' || dataMode === 'mock') && <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">部分資料目前使用示範資料，請勿作為交易決策依據。</div>}
      <div className="rounded-lg border bg-blue-50 p-4 text-sm text-blue-900">{narrative}</div>
      <div className="rounded-lg border bg-indigo-50 p-4 text-sm text-indigo-900">{decisionNarrative}</div>
      <div className="rounded-xl border p-6 flex items-center justify-between"><div><p className="text-sm text-gray-500">Global Risk Score</p><p className="text-5xl font-extrabold">{risk.totalScore}</p></div><div className={`h-16 w-16 rounded-full ${levelStyle[risk.level]}`} /></div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4"><h2 className="font-semibold mb-3">Active Alerts</h2><div className="space-y-2">{activeAlerts.length === 0 ? <p className="text-sm text-gray-500">No active alerts.</p> : activeAlerts.map((a) => <div key={a.id} className="rounded border p-2 text-sm"><div className="flex justify-between items-center"><span className={`rounded px-2 py-0.5 text-xs font-medium ${alertBadge[a.level]}`}>{a.level.toUpperCase()}</span><span className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</span></div><p className="font-medium mt-1">{a.title}</p><p className="text-gray-600">{a.description}</p><p className="text-xs text-gray-500 mt-1">Source: {a.triggerSource}</p></div>)}</div></div>
        <div className="rounded-xl border p-4"><h2 className="font-semibold mb-3">Latest Market Events</h2><div className="space-y-2">{latestAlerts.length === 0 ? <p className="text-sm text-gray-500">No recent events.</p> : latestAlerts.slice(0, 8).map((a) => <div key={`${a.id}-latest`} className="rounded border p-2 text-sm"><div className="flex justify-between items-center"><span className={`rounded px-2 py-0.5 text-xs font-medium ${alertBadge[a.level]}`}>{a.level.toUpperCase()}</span><span className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</span></div><p className="font-medium mt-1">{a.title}</p><p className="text-gray-600">{a.description}</p><p className="text-xs text-gray-500 mt-1">Source: {a.triggerSource}</p></div>)}</div></div>
      </section>

      <section className="rounded-xl border p-4 space-y-3"><div className="flex items-center justify-between"><h2 className="font-semibold">Global Risk Trend</h2><div className="flex gap-2"><button onClick={() => setRange('30d')} className={`px-3 py-1 rounded border text-sm ${range==='30d'?'bg-black text-white':''}`}>30d</button><button onClick={() => setRange('90d')} className={`px-3 py-1 rounded border text-sm ${range==='90d'?'bg-black text-white':''}`}>90d</button></div></div><TrendChart points={history?.globalRiskHistory ?? []} /></section>

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Calibration Panel</h2>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p><span className="font-medium">Alert Frequency:</span> {calibration?.alertFrequency ? `${calibration.alertFrequency.last24h}/24h (total ${calibration.alertFrequency.total})` : 'N/A'}</p>
          <p><span className="font-medium">Most Triggered Risk:</span> {calibration?.topTriggeredAlerts?.[0] ? `${calibration.topTriggeredAlerts[0].title} (${calibration.topTriggeredAlerts[0].count})` : 'N/A'}</p>
          <p><span className="font-medium">Current Sensitivity:</span> {calibration?.notificationConfig?.levelThreshold ?? 'N/A'}</p>
          <p><span className="font-medium">Notification Cooldown:</span> {calibration?.notificationConfig ? `${Math.round(calibration.notificationConfig.cooldownMs / 60000)} min` : 'N/A'}</p>
        </div>
      </section>

      <section className="rounded-xl border p-4"><h2 className="font-semibold mb-3">Indicator Contribution</h2><div className="space-y-2">{risk.indicators.map((it) => <div key={it.key}><div className="flex justify-between text-sm"><span>{it.key}</span><span>{it.weightedScore.toFixed(1)}</span></div><div className="h-2 bg-gray-100 rounded"><div className="h-2 bg-purple-500 rounded" style={{ width: `${Math.min(100, (it.weightedScore / Math.max(risk.totalScore, 1)) * 100)}%` }} /></div></div>)}</div></section>
      <div className="grid md:grid-cols-2 gap-4">{risk.indicators.map((it) => <div key={it.key} className="rounded-xl border p-4 space-y-2"><div className="flex justify-between"><h3 className="font-semibold">{it.name}</h3><span className={`rounded px-2 py-0.5 text-xs font-medium ${it.source === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>{it.source === 'live' ? 'Live' : 'Mock'}</span></div><p className="text-sm text-gray-500">{it.symbol}</p><p>Latest: {it.value}</p><p>Daily Change: <span className={it.changePct >= 0 ? 'text-red-600' : 'text-green-600'}>{it.changePct}%</span></p><p>Risk Score: {it.riskScore.toFixed(1)}</p><p>Weight: {it.weight}%</p></div>)}</div>
    </main>
  );
}
