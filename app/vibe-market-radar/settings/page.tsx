'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';
import { IndicatorKey } from '@/lib/market/types';

export default function SettingsPage() {
  const [weights, setWeights] = useState<Record<IndicatorKey, number>>(DEFAULT_WEIGHTS);

  useEffect(() => {
    const saved = localStorage.getItem('radar-weights');
    if (saved) setWeights(JSON.parse(saved));
  }, []);

  const update = (key: IndicatorKey, v: string) => {
    const n = Math.max(0, Math.min(100, Number(v.replace(/[^0-9.]/g, '')) || 0));
    setWeights((prev) => ({ ...prev, [key]: n }));
  };

  const save = () => localStorage.setItem('radar-weights', JSON.stringify(weights));

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Risk Weights Settings</h1>
      {Object.entries(weights).map(([k, v]) => (
        <div key={k} className="flex items-center justify-between border rounded p-3">
          <label>{k}</label>
          <input value={v} onChange={(e) => update(k as IndicatorKey, e.target.value)} className="border rounded px-2 py-1 w-32" />
        </div>
      ))}
      <button onClick={save} className="bg-black text-white px-4 py-2 rounded">Save</button>
    </main>
  );
}
