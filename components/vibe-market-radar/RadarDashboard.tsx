'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateRisk, DEFAULT_WEIGHTS, toRiskLevel } from '@/lib/market/riskEngine';
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
  MarketHistoryRange,
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

const levelStroke: Record<RiskLevel, string> = {
  green: '#059669',
  yellow: '#ca8a04',
  orange: '#ea580c',
  red: '#dc2626',
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

type TrendDirection = 'rising' | 'falling' | 'flat';
type VelocityTrend = 'accelerating' | 'cooling' | 'stable';

interface VelocityInsight {
  delta3: number | null;
  delta7: number | null;
  trend: VelocityTrend;
  direction: TrendDirection;
}

interface TimelineEvent {
  index: number;
  label: string;
  level: MarketAlert['level'];
  timestamp: string;
}

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
  if (Math.abs(delta) < 0.1) return '0.0';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}`;
};

const formatDate = (iso: string, withTime = false) => {
  const d = new Date(iso);
  if (!withTime) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const computeMovingAverage = (points: MarketHistoryPoint[], window = 7): Array<number | null> => {
  if (points.length === 0) return [];
  return points.map((_, i) => {
    if (i < window - 1) return null;
    let sum = 0;
    for (let j = i - window + 1; j <= i; j += 1) sum += points[j].totalScore;
    return sum / window;
  });
};

const computeStats = (points: MarketHistoryPoint[]) => {
  if (points.length === 0) {
    return { current: null, high: null, low: null, avg: null };
  }
  const scores = points.map((p) => p.totalScore);
  const current = scores[scores.length - 1];
  const high = Math.max(...scores);
  const low = Math.min(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return { current, high, low, avg };
};

const findScoreNDaysAgo = (
  points: MarketHistoryPoint[],
  days: number,
): number | null => {
  if (points.length === 0) return null;
  const targetMs = new Date(points[points.length - 1].timestamp).getTime() - days * 24 * 60 * 60 * 1000;
  let best: MarketHistoryPoint | null = null;
  let bestDiff = Infinity;
  for (const p of points) {
    const diff = Math.abs(new Date(p.timestamp).getTime() - targetMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = p;
    }
  }
  return best ? best.totalScore : null;
};

const computeVelocity = (points: MarketHistoryPoint[]): VelocityInsight => {
  if (points.length < 2) {
    return { delta3: null, delta7: null, trend: 'stable', direction: 'flat' };
  }
  const last = points[points.length - 1].totalScore;
  const score3 = findScoreNDaysAgo(points, 3);
  const score7 = findScoreNDaysAgo(points, 7);
  const delta3 = score3 !== null ? last - score3 : null;
  const delta7 = score7 !== null ? last - score7 : null;

  const reference = delta7 ?? delta3 ?? 0;
  const direction: TrendDirection =
    Math.abs(reference) < 1.5 ? 'flat' : reference > 0 ? 'rising' : 'falling';

  let trend: VelocityTrend = 'stable';
  if (delta3 !== null && delta7 !== null) {
    const rate3 = delta3 / 3;
    const rate7 = delta7 / 7;
    if (Math.abs(delta7) < 2 && Math.abs(delta3) < 1.5) {
      trend = 'stable';
    } else if (Math.sign(rate3) !== Math.sign(rate7) && Math.abs(rate3) > 0.3) {
      trend = 'cooling';
    } else if (Math.abs(rate3) > Math.abs(rate7) * 1.25 && Math.sign(rate3) === Math.sign(rate7)) {
      trend = 'accelerating';
    } else if (Math.abs(rate3) < Math.abs(rate7) * 0.6) {
      trend = 'cooling';
    } else {
      trend = 'stable';
    }
  } else if (delta3 !== null) {
    if (Math.abs(delta3) < 1.5) trend = 'stable';
    else trend = Math.abs(delta3) / 3 > 1 ? 'accelerating' : 'stable';
  }

  return { delta3, delta7, trend, direction };
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
  velocity: VelocityInsight,
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

  const velocityClause =
    velocity.trend === 'accelerating'
      ? 'Short-term velocity is accelerating, suggesting momentum is building.'
      : velocity.trend === 'cooling'
        ? 'Short-term velocity is cooling, suggesting the recent move is losing steam.'
        : 'Short-term velocity is stable, with no clear acceleration or reversal yet.';

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
    velocityClause,
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

const buildTimelineEvents = (
  points: MarketHistoryPoint[],
  alerts: MarketAlert[],
  history: MarketHistoryResponse | null,
): TimelineEvent[] => {
  if (points.length === 0) return [];
  const indicatorHistory = history?.indicatorHistory;

  const labelFor = (alert: MarketAlert): string => {
    if (alert.triggerSource === 'VIX') return 'VIX spike';
    if (alert.triggerSource === 'EEM') return 'EEM collapse';
    if (alert.triggerSource === 'global') return 'Global risk spike';
    if (alert.triggerSource === 'regime') return 'Regime change';
    return `${alert.triggerSource} alert`;
  };

  const findNearestIndex = (timestamp: string): number => {
    const ts = new Date(timestamp).getTime();
    let best = 0;
    let bestDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(new Date(p.timestamp).getTime() - ts);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = idx;
      }
    });
    return best;
  };

  const fromAlerts: TimelineEvent[] = alerts
    .filter((a) => a.level === 'danger' || a.level === 'critical')
    .map((a) => ({
      index: findNearestIndex(a.timestamp),
      label: labelFor(a),
      level: a.level,
      timestamp: a.timestamp,
    }));

  // Add detected spikes from indicator history (synthetic markers)
  if (indicatorHistory) {
    const vix = indicatorHistory.VIX ?? [];
    vix.forEach((v, i) => {
      if (i === 0) return;
      const prev = vix[i - 1].value;
      if (v.value > 28 && prev > 0 && (v.value - prev) / prev > 0.18) {
        fromAlerts.push({
          index: findNearestIndex(v.timestamp),
          label: 'VIX spike',
          level: 'danger',
          timestamp: v.timestamp,
        });
      }
    });
    const eem = indicatorHistory.EEM ?? [];
    eem.forEach((v, i) => {
      if (i === 0) return;
      const prev = eem[i - 1].value;
      if (prev > 0 && (v.value - prev) / prev < -0.04) {
        fromAlerts.push({
          index: findNearestIndex(v.timestamp),
          label: 'EEM collapse',
          level: 'critical',
          timestamp: v.timestamp,
        });
      }
    });
  }

  // De-duplicate (same index + label keep the most severe)
  const dedup = new Map<string, TimelineEvent>();
  for (const ev of fromAlerts) {
    const key = `${ev.index}|${ev.label}`;
    const existing = dedup.get(key);
    if (!existing) dedup.set(key, ev);
    else if (existing.level !== 'critical' && ev.level === 'critical') dedup.set(key, ev);
  }
  return Array.from(dedup.values()).sort((a, b) => a.index - b.index);
};

interface TimelineChartProps {
  points: MarketHistoryPoint[];
  level: RiskLevel;
  events: TimelineEvent[];
  movingAverage: Array<number | null>;
  topContributorsAt: (idx: number) => string;
  alertsAt: (idx: number) => number;
}

const TimelineChart = ({
  points,
  level,
  events,
  movingAverage,
  topContributorsAt,
  alertsAt,
}: TimelineChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (points.length < 2) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center px-6">
        <p className="text-sm font-medium text-slate-700">Historical data is accumulating</p>
        <p className="mt-1 text-xs text-slate-500">
          We need at least two daily snapshots to plot a meaningful timeline. The chart will populate after the next refresh.
        </p>
      </div>
    );
  }

  const w = 760;
  const h = 280;
  const padL = 36;
  const padR = 18;
  const padT = 16;
  const padB = 34;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const stepX = innerW / (points.length - 1);
  const y = (v: number) => padT + innerH - (v / 100) * innerH;
  const x = (i: number) => padL + i * stepX;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.totalScore)}`).join(' ');
  const areaPath = `${path} L ${x(points.length - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;
  const maPath = movingAverage
    .map((v, i) => (v === null ? null : `${i === 0 || movingAverage[i - 1] === null ? 'M' : 'L'} ${x(i)} ${y(v)}`))
    .filter(Boolean)
    .join(' ');

  const stroke = levelStroke[level];

  const tickCount = Math.min(6, points.length);
  const tickIdxs: number[] = [];
  for (let i = 0; i < tickCount; i += 1) {
    tickIdxs.push(Math.round((i * (points.length - 1)) / Math.max(1, tickCount - 1)));
  }

  const hoverPoint = hoverIdx !== null ? points[hoverIdx] : null;
  const hoverMa = hoverIdx !== null ? movingAverage[hoverIdx] : null;
  const hoverLevel = hoverPoint ? toRiskLevel(hoverPoint.totalScore) : null;
  const hoverRegime = hoverPoint ? toRiskRegime(hoverPoint.totalScore) : null;

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    const rel = px - padL;
    if (rel < -stepX / 2 || rel > innerW + stepX / 2) {
      setHoverIdx(null);
      return;
    }
    const idx = Math.max(0, Math.min(points.length - 1, Math.round(rel / stepX)));
    setHoverIdx(idx);
  };

  return (
    <div ref={containerRef} className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-72 select-none"
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* risk bands */}
        <rect x={padL} y={y(100)} width={innerW} height={y(70) - y(100)} fill="#fecaca" opacity="0.45" />
        <rect x={padL} y={y(70)} width={innerW} height={y(50) - y(70)} fill="#fed7aa" opacity="0.45" />
        <rect x={padL} y={y(50)} width={innerW} height={y(30) - y(50)} fill="#fef9c3" opacity="0.55" />
        <rect x={padL} y={y(30)} width={innerW} height={y(0) - y(30)} fill="#dcfce7" opacity="0.5" />

        {/* y gridlines */}
        {[0, 30, 50, 70, 100].map((v) => (
          <g key={v}>
            <line x1={padL} x2={padL + innerW} y1={y(v)} y2={y(v)} stroke="#cbd5e1" strokeDasharray="3 4" strokeWidth={1} />
            <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize={10} fill="#64748b">
              {v}
            </text>
          </g>
        ))}

        {/* area + main line */}
        <path d={areaPath} fill={stroke} opacity="0.1" />
        <path d={path} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeLinecap="round" />

        {/* moving average */}
        {maPath && (
          <path
            d={maPath}
            stroke="#1e293b"
            strokeWidth={1.6}
            fill="none"
            strokeDasharray="4 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* event markers */}
        {events.map((ev, i) => {
          const cx = x(ev.index);
          const cy = y(points[ev.index].totalScore);
          const color = ev.level === 'critical' ? '#b91c1c' : '#ea580c';
          return (
            <g key={`${ev.index}-${i}`}>
              <line x1={cx} x2={cx} y1={padT} y2={cy} stroke={color} strokeDasharray="2 3" strokeWidth={1} opacity="0.6" />
              <circle cx={cx} cy={cy} r={5} fill="#fff" stroke={color} strokeWidth={2} />
              <text x={cx} y={padT - 4} textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>
                {ev.label}
              </text>
            </g>
          );
        })}

        {/* x-axis date ticks */}
        {tickIdxs.map((i) => (
          <g key={`tick-${i}`}>
            <line x1={x(i)} x2={x(i)} y1={padT + innerH} y2={padT + innerH + 4} stroke="#94a3b8" strokeWidth={1} />
            <text x={x(i)} y={padT + innerH + 16} textAnchor="middle" fontSize={10} fill="#64748b">
              {formatDate(points[i].timestamp)}
            </text>
          </g>
        ))}

        {/* hover guide */}
        {hoverIdx !== null && (
          <g pointerEvents="none">
            <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={padT} y2={padT + innerH} stroke="#0f172a" strokeDasharray="2 3" strokeWidth={1} opacity="0.5" />
            <circle cx={x(hoverIdx)} cy={y(points[hoverIdx].totalScore)} r={5} fill={stroke} stroke="#fff" strokeWidth={2} />
            {hoverMa !== null && (
              <circle cx={x(hoverIdx)} cy={y(hoverMa)} r={3.5} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />
            )}
          </g>
        )}

        {/* last point */}
        <circle cx={x(points.length - 1)} cy={y(points[points.length - 1].totalScore)} r={4} fill={stroke} stroke="#fff" strokeWidth={1.5} />
      </svg>

      {hoverIdx !== null && hoverPoint && hoverLevel && hoverRegime && (
        <div
          className="pointer-events-none absolute z-10 min-w-[200px] -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-lg"
          style={{
            left: `${((x(hoverIdx) / w) * 100).toFixed(2)}%`,
            top: 4,
          }}
        >
          <p className="font-semibold text-slate-900">{formatDate(hoverPoint.timestamp, true)}</p>
          <p className="mt-1 flex items-center justify-between gap-3">
            <span className="text-slate-500">Risk score</span>
            <span className="font-semibold text-slate-900">{hoverPoint.totalScore.toFixed(1)}</span>
          </p>
          {hoverMa !== null && (
            <p className="flex items-center justify-between gap-3">
              <span className="text-slate-500">7d MA</span>
              <span className="text-slate-700">{hoverMa.toFixed(1)}</span>
            </p>
          )}
          <p className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Regime</span>
            <span className="text-slate-700">{hoverRegime}</span>
          </p>
          <p className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Level</span>
            <span className="text-slate-700">{levelLabel[hoverLevel]}</span>
          </p>
          <p className="mt-1 text-slate-500">Top contributors</p>
          <p className="font-medium text-slate-800">{topContributorsAt(hoverIdx)}</p>
          <p className="mt-1 flex items-center justify-between gap-3">
            <span className="text-slate-500">Active alerts</span>
            <span className="text-slate-700">{alertsAt(hoverIdx)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default function RadarDashboard() {
  const [data, setData] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState<MarketDataMode>('mock');
  const [asOf, setAsOf] = useState('');
  const [range, setRange] = useState<MarketHistoryRange>('30d');
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

  const stats = useMemo(() => computeStats(points), [points]);
  const movingAverage = useMemo(() => computeMovingAverage(points, 7), [points]);
  const velocity = useMemo(() => computeVelocity(points), [points]);
  const events = useMemo(
    () => buildTimelineEvents(points, [...activeAlerts, ...latestAlerts], history),
    [points, activeAlerts, latestAlerts, history],
  );
  const trendInterpretation = useMemo(
    () => buildTrendInterpretation(points, risk, regime),
    [points, risk, regime],
  );
  const aiInterpretation = useMemo(
    () => buildAiInterpretation(risk, regime, points, activeAlerts, velocity),
    [risk, regime, points, activeAlerts, velocity],
  );
  const contributionTotal = Math.max(
    1,
    risk.indicators.reduce((sum: number, it: IndicatorRisk) => sum + it.weightedScore, 0),
  );

  const indicatorHistory = history?.indicatorHistory;
  const topContributorsAt = (idx: number): string => {
    if (!indicatorHistory) return 'N/A';
    const ts = points[idx]?.timestamp;
    if (!ts) return 'N/A';
    const contributions: Array<{ key: IndicatorKey; weighted: number }> = [];
    (Object.keys(indicatorHistory) as IndicatorKey[]).forEach((key) => {
      const series = indicatorHistory[key];
      const sample = series.find((s) => s.timestamp === ts) ?? series[series.length - 1];
      if (sample) contributions.push({ key, weighted: sample.weightedScore });
    });
    contributions.sort((a, b) => b.weighted - a.weighted);
    const top = contributions.slice(0, 2).map((c) => c.key);
    return top.length ? top.join(' · ') : 'N/A';
  };

  const allAlerts = useMemo(() => [...activeAlerts, ...latestAlerts], [activeAlerts, latestAlerts]);
  const alertsAt = (idx: number): number => {
    const ts = points[idx]?.timestamp;
    if (!ts) return 0;
    const target = new Date(ts).getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return allAlerts.filter((a) => Math.abs(new Date(a.timestamp).getTime() - target) < oneDay).length;
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-8 text-slate-700">
        <p className="text-sm">Loading market radar...</p>
      </main>
    );
  }

  const velocityBadgeStyle: Record<VelocityTrend, string> = {
    accelerating: 'bg-red-100 text-red-800 ring-red-200',
    cooling: 'bg-blue-100 text-blue-800 ring-blue-200',
    stable: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  const directionLabel: Record<TrendDirection, string> = {
    rising: 'Rising ↑',
    falling: 'Falling ↓',
    flat: 'Flat →',
  };

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
                Stress: {levelLabel[risk.level]}
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Regime: {regime}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ${velocityBadgeStyle[velocity.trend]}`}>
                Velocity: {velocity.trend}
              </span>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Trend: {directionLabel[velocity.direction]}
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
              <li>
                · Velocity: {velocity.delta7 !== null ? `${formatDelta(velocity.delta7)} over 7d` : 'n/a 7d'}
                {velocity.delta3 !== null ? `, ${formatDelta(velocity.delta3)} over 3d` : ''}
              </li>
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
              Composite risk score over time — dashed line is 7d moving average, markers flag stress events.
            </p>
          </div>
          <div className="flex gap-2">
            {(['30d', '90d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md border px-3 py-1 text-sm ${
                  range === r
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {points.length >= 2 ? (
          <>
            <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Current', value: stats.current, color: 'text-slate-900' },
                { label: 'High', value: stats.high, color: 'text-red-700' },
                { label: 'Low', value: stats.low, color: 'text-emerald-700' },
                { label: 'Avg', value: stats.avg, color: 'text-slate-700' },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                  <p className={`text-xl font-bold ${s.color}`}>
                    {s.value !== null ? s.value.toFixed(1) : '—'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <span className="font-semibold uppercase tracking-wider text-slate-500">Risk velocity:</span>{' '}
              {velocity.delta7 !== null && (
                <span className="ml-1">
                  <span className={velocity.delta7 >= 0 ? 'text-red-700' : 'text-emerald-700'}>
                    {formatDelta(velocity.delta7)}
                  </span>{' '}
                  over 7d
                </span>
              )}
              {velocity.delta3 !== null && (
                <span className="ml-2">
                  ·{' '}
                  <span className={velocity.delta3 >= 0 ? 'text-red-700' : 'text-emerald-700'}>
                    {formatDelta(velocity.delta3)}
                  </span>{' '}
                  over 3d
                </span>
              )}
              <span className="ml-2">
                ·{' '}
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ring-1 ${velocityBadgeStyle[velocity.trend]}`}
                >
                  {velocity.trend}
                </span>
              </span>
            </div>
          </>
        ) : null}

        <TimelineChart
          points={points}
          level={risk.level}
          events={events}
          movingAverage={movingAverage}
          topContributorsAt={topContributorsAt}
          alertsAt={alertsAt}
        />

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" /> Low (0–30)
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-yellow-400" /> Moderate (30–50)
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-orange-500" /> Elevated (50–70)
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-600" /> High (70–100)
          </span>
          <span className="ml-auto flex items-center gap-2">
            <svg width="22" height="6">
              <line x1="0" x2="22" y1="3" y2="3" stroke="#1e293b" strokeWidth="1.6" strokeDasharray="4 4" />
            </svg>
            7d moving average
          </span>
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
