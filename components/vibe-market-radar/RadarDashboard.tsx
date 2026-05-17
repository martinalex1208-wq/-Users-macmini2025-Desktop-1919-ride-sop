'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { calculateRisk, DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';
import { toRiskRegime, RiskRegime } from '@/lib/market/regime';
import {
  IndicatorData,
  IndicatorKey,
  IndicatorRisk,
  MarketAlert,
  MarketAlertsResponse,
  MarketApiResponse,
  MarketDataMode,
  MarketHistoryPoint,
  MarketHistoryResponse,
  RiskLevel,
  RiskResult,
} from '@/lib/market/types';

const levelDot: Record<RiskLevel, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-500',
  red: 'bg-red-600',
};

const levelRing: Record<RiskLevel, string> = {
  green: 'ring-emerald-200 bg-emerald-50 text-emerald-900',
  yellow: 'ring-yellow-200 bg-yellow-50 text-yellow-900',
  orange: 'ring-orange-200 bg-orange-50 text-orange-900',
  red: 'ring-red-200 bg-red-50 text-red-900',
};

const levelLabel: Record<RiskLevel, string> = {
  green: 'Low Risk',
  yellow: 'Moderate Risk',
  orange: 'Elevated Risk',
  red: 'High Risk',
};

const modeText: Record<MarketDataMode, string> = {
  live: 'Live Data',
  partial: 'Partial Fallback',
  mock: 'Mock Data',
};

const alertBadge: Record<MarketAlert['level'], string> = {
  info: 'bg-slate-100 text-slate-700 ring-slate-200',
  warning: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  danger: 'bg-orange-100 text-orange-800 ring-orange-200',
  critical: 'bg-red-100 text-red-800 ring-red-200',
};

const indicatorLabel: Record<IndicatorKey, string> = {
  DXY: 'US Dollar Index',
  US10Y: 'US 10Y Yield',
  USDJPY: 'USD/JPY',
  VIX: 'Volatility Index (VIX)',
  SP500: 'S&P 500',
  NASDAQ: 'Nasdaq',
  EEM: 'Emerging Markets (EEM)',
};

const indicatorReason: Record<IndicatorKey, string> = {
  DXY: 'A stronger dollar tightens global financial conditions.',
  US10Y: 'Rising long-end yields raise discount rates for risk assets.',
  USDJPY: 'JPY weakness reflects global carry and rate divergence stress.',
  VIX: 'Elevated implied volatility signals defensive equity positioning.',
  SP500: 'Broad equity drawdowns drive risk-off behaviour.',
  NASDAQ: 'Growth and tech weakness amplifies portfolio risk.',
  EEM: 'Emerging market underperformance signals global liquidity stress.',
};

const parseWeights = (raw: string | null): Record<IndicatorKey, number> => {
  if (!raw) return DEFAULT_WEIGHTS;
  try {
    const parsed = JSON.parse(raw) as Partial<Record<IndicatorKey, number>>;
    const clean: Record<IndicatorKey, number> = { ...DEFAULT_WEIGHTS };
    (Object.keys(DEFAULT_WEIGHTS) as IndicatorKey[]).forEach((key) => {
      const value = parsed[key];
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100) {
        clean[key] = value;
      }
    });
    return clean;
  } catch {
    return DEFAULT_WEIGHTS;
  }
};

const formatDelta = (delta: number) => {
  if (Math.abs(delta) < 0.1) return 'flat';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}`;
};

const buildTrendInterpretation = (
  points: MarketHistoryPoint[],
  current: RiskResult,
  regime: RiskRegime,
): { headline: string; detail: string } => {
  if (points.length < 2) {
    return {
      headline: 'Historical data is accumulating',
      detail:
        'The radar needs at least two daily snapshots to interpret a trend. Check back after the next scheduled data refresh.',
    };
  }

  const last = points[points.length - 1].totalScore;
  const prev = points[points.length - 2].totalScore;
  const weekAgo = points[Math.max(0, points.length - 6)].totalScore;
  const dayDelta = last - prev;
  const weekDelta = last - weekAgo;

  const shortTrend = Math.abs(dayDelta) < 1
    ? 'is essentially unchanged versus yesterday'
    : dayDelta > 0
      ? `is rising (${formatDelta(dayDelta)} vs. yesterday)`
      : `is easing (${formatDelta(dayDelta)} vs. yesterday)`;

  const mediumTrend = Math.abs(weekDelta) < 2
    ? 'and remains range-bound over the last week'
    : weekDelta > 0
      ? `and has built up ${formatDelta(weekDelta)} pts over the last week`
      : `and has cooled ${formatDelta(weekDelta)} pts over the last week`;

  return {
    headline: `Risk ${shortTrend} ${mediumTrend}.`,
    detail: `The market is currently classified as ${regime}. ${
      regime === 'Crisis' || regime === 'Risk Off'
        ? 'Defensive posture is warranted — reduce exposure to high-volatility names and review hedges.'
        : regime === 'Neutral'
          ? 'Conditions are balanced — maintain core allocations and watch the top contributors for early shifts.'
          : 'Conditions favor risk assets, but monitor for sudden reversals in the leading indicators.'
    } Current score: ${current.totalScore.toFixed(1)} / 100.`,
  };
};

const buildAiInterpretation = (
  current: RiskResult,
  regime: RiskRegime,
  points: MarketHistoryPoint[],
  activeAlerts: MarketAlert[],
): string => {
  const sorted = [...current.indicators].sort((a, b) => b.weightedScore - a.weightedScore);
  const topThree = sorted.slice(0, 3);
  const hottest = topThree[0];
  const calmest = [...current.indicators].sort((a, b) => a.weightedScore - b.weightedScore)[0];

  const trendClause = points.length >= 2
    ? (() => {
        const delta = points[points.length - 1].totalScore - points[0].totalScore;
        if (Math.abs(delta) < 2) return 'The trajectory across the visible window is broadly flat.';
        return delta > 0
          ? `The trajectory has drifted up by ${delta.toFixed(1)} pts across the visible window.`
          : `The trajectory has eased by ${Math.abs(delta).toFixed(1)} pts across the visible window.`;
      })()
    : 'Historical data is accumulating, so trend signals are limited.';

  const alertClause = activeAlerts.length === 0
    ? 'No active alerts are currently firing.'
    : `${activeAlerts.length} active alert${activeAlerts.length === 1 ? '' : 's'} ${activeAlerts.length === 1 ? 'is' : 'are'} live, with the most recent flagging ${activeAlerts[0].title}.`;

  const regimeAdvice =
    regime === 'Crisis'
      ? 'Treat this as a crisis regime: prioritise capital preservation, raise cash, and avoid initiating new high-beta positions.'
      : regime === 'Risk Off'
        ? 'Treat this as a risk-off regime: trim cyclicals, lean on quality and duration, and tighten stops on momentum trades.'
        : regime === 'Neutral'
          ? 'Treat this as a neutral regime: keep core allocations intact and use weakness in laggards selectively.'
          : 'Treat this as a risk-on regime: stay constructive on equities, but keep tail hedges in place against a sudden volatility re-rating.';

  return [
    `Global risk sits at ${current.totalScore.toFixed(1)} / 100 (${levelLabel[current.level]}, ${regime}).`,
    `${hottest ? `The largest contributor is ${indicatorLabel[hottest.key]}, accounting for ${hottest.weightedScore.toFixed(1)} pts of the composite.` : ''} ${calmest && calmest.key !== hottest?.key ? `The most benign reading is ${indicatorLabel[calmest.key]} at ${calmest.weightedScore.toFixed(1)} pts.` : ''}`.trim(),
    trendClause,
    alertClause,
    regimeAdvice,
  ].join(' ');
};

const buildAlertExplanation = (alert: MarketAlert): string => {
  if (alert.triggerSource === 'global') {
    return 'Triggered by the composite global risk score crossing a defined threshold. This reflects pressure across multiple indicators simultaneously.';
  }
  if (alert.triggerSource === 'regime') {
    return 'Triggered by a change in the prevailing market regime. Re-evaluate positioning against the new regime profile.';
  }
  const key = alert.triggerSource as IndicatorKey;
  return `Triggered by ${indicatorLabel[key] ?? key}. ${indicatorReason[key] ?? ''}`.trim();
};

const TrendChart = ({
  points,
  level,
}: {
  points: MarketHistoryPoint[];
  level: RiskLevel;
}) => {
  if (points.length < 2) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center px-6">
        <p className="text-sm font-medium text-slate-700">Historical data is accumulating</p>
        <p className="mt-1 text-xs text-slate-500">
          We need at least two daily snapshots to plot a meaningful timeline. The chart will populate after the next refresh.
        </p>
      </div>
    );
  }

  const w = 720;
  const h = 240;
  const padX = 28;
  const padY = 24;
  const stepX = (w - padX * 2) / (points.length - 1);
  const y = (v: number) => h - padY - (v / 100) * (h - padY * 2);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${padX + i * stepX} ${y(p.totalScore)}`)
    .join(' ');

  const areaPath = `${path} L ${padX + (points.length - 1) * stepX} ${h - padY} L ${padX} ${h - padY} Z`;

  const stroke =
    level === 'red' ? '#dc2626' : level === 'orange' ? '#ea580c' : level === 'yellow' ? '#ca8a04' : '#059669';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-60">
      <rect x={padX} y={y(100)} width={w - padX * 2} height={y(70) - y(100)} fill="#fecaca" opacity="0.45" />
      <rect x={padX} y={y(70)} width={w - padX * 2} height={y(50) - y(70)} fill="#fed7aa" opacity="0.45" />
      <rect x={padX} y={y(50)} width={w - padX * 2} height={y(30) - y(50)} fill="#fef9c3" opacity="0.55" />
      <rect x={padX} y={y(30)} width={w - padX * 2} height={y(0) - y(30)} fill="#dcfce7" opacity="0.5" />
      {[30, 50, 70].map((v) => (
        <line key={v} x1={padX} x2={w - padX} y1={y(v)} y2={y(v)} stroke="#94a3b8" strokeDasharray="3 4" strokeWidth={1} />
      ))}
      <path d={areaPath} fill={stroke} opacity="0.12" />
      <path d={path} stroke={stroke} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle
          key={p.timestamp}
          cx={padX + i * stepX}
          cy={y(p.totalScore)}
          r={i === points.length - 1 ? 4 : 2}
          fill={i === points.length - 1 ? stroke : '#ffffff'}
          stroke={stroke}
          strokeWidth={1.5}
        />
      ))}
      {[0, 30, 50, 70, 100].map((v) => (
        <text key={v} x={padX - 6} y={y(v) + 3} textAnchor="end" fontSize={10} fill="#64748b">
          {v}
        </text>
      ))}
    </svg>
  );
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
  const [health, setHealth] = useState<{
    timestamp: string;
    historyStoreAvailable: boolean;
    alertStoreAvailable: boolean;
    lastNotification?: string | null;
    notificationStatus?: string;
    activeChannels?: string[];
  } | null>(null);

  useEffect(() => {
    setWeights(parseWeights(localStorage.getItem('radar-weights')));
    fetch('/api/market')
      .then((r) => r.json())
      .then((j: MarketApiResponse) => {
        if (Array.isArray(j.data)) setData(j.data);
        if (j.dataMode) setDataMode(j.dataMode);
        if (j.asOf) setAsOf(j.asOf);
      })
      .catch(() => setDataMode('mock'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`/api/market/history?range=${range}`)
      .then((r) => r.json())
      .then((j: MarketHistoryResponse) => setHistory(j))
      .catch(() => setHistory(null));
  }, [range]);

  useEffect(() => {
    fetch('/api/market/alerts?recent=20')
      .then((r) => r.json())
      .then((j: MarketAlertsResponse) => {
        if (Array.isArray(j.activeAlerts)) setActiveAlerts(j.activeAlerts);
        if (Array.isArray(j.latestAlerts)) setLatestAlerts(j.latestAlerts);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((j) => setHealth(j))
      .catch(() => setHealth(null));
  }, []);

  const risk = useMemo(() => calculateRisk(data, weights), [data, weights]);
  const regime = toRiskRegime(risk.totalScore);
  const points = useMemo(() => history?.globalRiskHistory ?? [], [history]);
  const prevScore = points.length >= 2 ? points[points.length - 2].totalScore : null;
  const dayDelta = prevScore !== null ? risk.totalScore - prevScore : null;
  const sortedIndicators = useMemo(
    () => [...risk.indicators].sort((a, b) => b.weightedScore - a.weightedScore),
    [risk.indicators],
  );
  const topContributors = sortedIndicators.slice(0, 3);
  const trendInterpretation = useMemo(
    () => buildTrendInterpretation(points, risk, regime),
    [points, risk, regime],
  );
  const aiInterpretation = useMemo(
    () => buildAiInterpretation(risk, regime, points, activeAlerts),
    [risk, regime, points, activeAlerts],
  );
  const contributionTotal = Math.max(
    1,
    risk.indicators.reduce((sum: number, it: IndicatorRisk) => sum + it.weightedScore, 0),
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-8 text-slate-700">
        <p className="text-sm">Loading market radar...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            One-Glance Historical Risk Dashboard
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Vibe Market Radar</h1>
          <p className="text-sm text-slate-500">
            Composite market risk derived from {risk.indicators.length} core indicators.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            {modeText[dataMode]}
          </span>
          <Link
            href="/vibe-market-radar/settings"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Adjust Weights
          </Link>
        </div>
      </header>

      {(dataMode === 'partial' || dataMode === 'mock') && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Some indicators are currently using demo data. Do not use this view as a sole trading input.
        </div>
      )}

      {/* 1. Hero Risk Summary */}
      <section
        className={`rounded-2xl border-2 p-6 shadow-sm ring-4 ring-inset transition-colors ${levelRing[risk.level]}`}
      >
        <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex items-center gap-4">
            <div className={`h-20 w-20 rounded-full ${levelDot[risk.level]} shadow-lg ring-4 ring-white/60`} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Global Risk Score
              </p>
              <p className="text-6xl font-extrabold leading-none">{risk.totalScore.toFixed(1)}</p>
              <p className="text-sm font-medium opacity-80">/ 100</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                {levelLabel[risk.level]}
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Regime: {regime}
              </span>
              {dayDelta !== null && (
                <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  {dayDelta > 0 ? '↑' : dayDelta < 0 ? '↓' : '·'} {formatDelta(dayDelta)} vs. prev
                </span>
              )}
            </div>
            <p className="opacity-90">
              Top stressors:{' '}
              {topContributors.length === 0
                ? 'no readings yet'
                : topContributors.map((c) => indicatorLabel[c.key]).join(' · ')}
            </p>
            <p className="text-xs opacity-70">
              Last updated: {asOf ? new Date(asOf).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className="rounded-xl bg-white/70 p-4 text-xs leading-relaxed text-slate-700 shadow-inner md:max-w-xs">
            <p className="font-semibold uppercase tracking-wider text-slate-500">At a glance</p>
            <ul className="mt-2 space-y-1">
              <li>· {risk.indicators.filter((i) => i.source === 'live').length} live feeds</li>
              <li>· {activeAlerts.length} active alert{activeAlerts.length === 1 ? '' : 's'}</li>
              <li>· {points.length} snapshot{points.length === 1 ? '' : 's'} on file</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Historical Risk Timeline */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Historical Risk Timeline</h2>
            <p className="text-xs text-slate-500">
              Composite risk score over time — shaded bands mark Low / Moderate / Elevated / High zones.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRange('30d')}
              className={`rounded-md border px-3 py-1 text-sm ${
                range === '30d'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              30d
            </button>
            <button
              onClick={() => setRange('90d')}
              className={`rounded-md border px-3 py-1 text-sm ${
                range === '90d'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              90d
            </button>
          </div>
        </div>
        <TrendChart points={points} level={risk.level} />
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Low (0–30)</span>
          <span><span className="inline-block h-2 w-2 rounded-full bg-yellow-400" /> Moderate (30–50)</span>
          <span><span className="inline-block h-2 w-2 rounded-full bg-orange-500" /> Elevated (50–70)</span>
          <span><span className="inline-block h-2 w-2 rounded-full bg-red-600" /> High (70–100)</span>
        </div>
      </section>

      {/* 3. Risk Trend Interpretation */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          Risk Trend Interpretation
        </h2>
        <p className="mt-2 text-lg font-semibold text-blue-900">{trendInterpretation.headline}</p>
        <p className="mt-1 text-sm text-blue-900/90">{trendInterpretation.detail}</p>
      </section>

      {/* 4. Indicator Risk Contribution */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Indicator Risk Contribution</h2>
          <p className="text-xs text-slate-500">
            Each bar shows the share of the composite score driven by that indicator.
          </p>
        </div>
        {risk.indicators.length === 0 ? (
          <p className="text-sm text-slate-500">No indicator data available.</p>
        ) : (
          <div className="space-y-3">
            {sortedIndicators.map((it) => {
              const share = (it.weightedScore / contributionTotal) * 100;
              const isLive = it.source === 'live';
              return (
                <div key={it.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
                    <span className="font-medium text-slate-800">
                      {indicatorLabel[it.key]}{' '}
                      <span className="text-xs font-normal text-slate-500">({it.key})</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      Weight {it.weight}% · Value {it.value} · Δ{' '}
                      <span className={it.changePct >= 0 ? 'text-red-600' : 'text-emerald-600'}>
                        {it.changePct >= 0 ? '+' : ''}
                        {it.changePct}%
                      </span>{' '}
                      · {isLive ? 'live' : 'mock'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          share > 25
                            ? 'bg-red-500'
                            : share > 18
                              ? 'bg-orange-500'
                              : share > 12
                                ? 'bg-yellow-400'
                                : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(2, Math.min(100, share))}%` }}
                      />
                    </div>
                    <span className="w-14 text-right text-xs font-semibold text-slate-700">
                      {it.weightedScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Risk Alert Explanation Panel */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Risk Alert Explanation</h2>
          <span className="text-xs text-slate-500">
            {activeAlerts.length} active · {latestAlerts.length} recent
          </span>
        </div>
        {activeAlerts.length === 0 && latestAlerts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No alerts have been raised. The radar will surface explanations here as soon as any indicator
            crosses a threshold.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active alerts
              </h3>
              {activeAlerts.length === 0 ? (
                <p className="rounded border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                  None firing right now.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeAlerts.map((a) => (
                    <article
                      key={a.id}
                      className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${alertBadge[a.level]}`}
                        >
                          {a.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(a.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-slate-900">{a.title}</p>
                      <p className="text-slate-600">{a.description}</p>
                      <p className="mt-1 text-xs italic text-slate-500">
                        Why: {buildAlertExplanation(a)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Recent events
              </h3>
              {latestAlerts.length === 0 ? (
                <p className="rounded border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                  No recent events.
                </p>
              ) : (
                <div className="space-y-2">
                  {latestAlerts.slice(0, 6).map((a) => (
                    <article
                      key={`${a.id}-recent`}
                      className="rounded-lg border border-slate-200 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${alertBadge[a.level]}`}
                        >
                          {a.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(a.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-slate-900">{a.title}</p>
                      <p className="text-slate-600">{a.description}</p>
                      <p className="mt-1 text-xs italic text-slate-500">
                        Why: {buildAlertExplanation(a)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 6. AI Market Interpretation */}
      <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-700">
            AI Market Interpretation
          </h2>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-500 ring-1 ring-indigo-200">
            Auto-generated
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-800">{aiInterpretation}</p>
        <p className="mt-2 text-[11px] italic text-slate-500">
          Generated from current readings, recent history, and active alerts — not investment advice.
        </p>
      </section>

      {/* System status footer */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        <p className="mb-1 font-semibold uppercase tracking-wider text-slate-500">System health</p>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          <p>Data mode: {modeText[dataMode]}</p>
          <p>History store: {health?.historyStoreAvailable ? 'OK' : 'Degraded'}</p>
          <p>Alert store: {health?.alertStoreAvailable ? 'OK' : 'Degraded'}</p>
          <p>Last notification: {health?.lastNotification ? new Date(health.lastNotification).toLocaleString() : 'N/A'}</p>
          <p>Notification status: {health?.notificationStatus ?? 'N/A'}</p>
          <p>Active channels: {(health?.activeChannels ?? []).join(', ') || 'None'}</p>
        </div>
      </section>
    </main>
  );
}
