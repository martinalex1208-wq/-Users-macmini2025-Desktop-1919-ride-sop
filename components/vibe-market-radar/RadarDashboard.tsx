'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculateRisk, DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';
import { IndicatorData, IndicatorKey } from '@/lib/market/types';

const levelStyle = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-500',
  red: 'bg-red-600',
};

export default function RadarDashboard() {
  const [data, setData] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);

  const [weights, setWeights] = useState<Record<IndicatorKey, number>>(DEFAULT_WEIGHTS);

  useEffect(() => {
    const saved = localStorage.getItem('radar-weights');
    if (saved) setWeights(JSON.parse(saved));
    fetch('/api/market').then((r) => r.json()).then((j) => setData(j.data)).finally(() => setLoading(false));
  }, []);

  const risk = useMemo(() => calculateRisk(data, weights), [data, weights]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Vibe Market Radar</h1>
      <div className="rounded-xl border p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Global Risk Score</p>
          <p className="text-5xl font-extrabold">{risk.totalScore}</p>
        </div>
        <div className={`h-16 w-16 rounded-full ${levelStyle[risk.level]}`} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {risk.indicators.map((it) => (
          <div key={it.key} className="rounded-xl border p-4 space-y-2">
            <div className="flex justify-between"><h3 className="font-semibold">{it.name}</h3><span>{it.symbol}</span></div>
            <p>Latest: {it.value}</p>
            <p>Daily Change: <span className={it.changePct >= 0 ? 'text-red-600' : 'text-green-600'}>{it.changePct}%</span></p>
            <p>Risk Score: {it.riskScore.toFixed(1)}</p>
            <p>Weight: {it.weight}%</p>
            <div className="h-2 bg-gray-100 rounded"><div className="h-2 bg-indigo-500 rounded" style={{ width: `${it.riskScore}%` }} /></div>
          </div>
        ))}
      </div>
    </main>
  );
}
