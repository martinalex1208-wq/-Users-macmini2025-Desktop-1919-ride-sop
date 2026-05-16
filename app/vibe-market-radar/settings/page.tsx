'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_WEIGHTS } from '@/lib/market/riskEngine';
import { IndicatorKey } from '@/lib/market/types';

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

export default function SettingsPage() {
  const [weights, setWeights] = useState<Record<IndicatorKey, number>>(DEFAULT_WEIGHTS);
  const totalWeight = useMemo(() => Object.values(weights).reduce((sum, n) => sum + n, 0), [weights]);

  useEffect(() => {
    setWeights(parseWeights(localStorage.getItem('radar-weights')));
  }, []);

  const update = (key: IndicatorKey, v: string) => {
    const n = Math.max(0, Math.min(100, Number(v.replace(/[^0-9.]/g, '')) || 0));
    setWeights((prev) => ({ ...prev, [key]: n }));
  };

  const save = () => localStorage.setItem('radar-weights', JSON.stringify(weights));
  const reset = () => setWeights(DEFAULT_WEIGHTS);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Risk Weights Settings</h1>
      <p className="text-sm text-gray-600">Total Weight: {totalWeight} (will auto-normalize in score calculation)</p>

      {Object.entries(weights).map(([k, v]) => (
        <div key={k} className="flex items-center justify-between border rounded p-3">
          <label>{k}</label>
          <input
            inputMode="decimal"
            value={v}
            onChange={(e) => update(k as IndicatorKey, e.target.value)}
            className="border rounded px-2 py-1 w-32"
          />
        </div>
      ))}

      <div className="flex gap-3">
        <button onClick={save} className="bg-black text-white px-4 py-2 rounded">Save</button>
        <button onClick={reset} className="border px-4 py-2 rounded">Reset Default</button>
      </div>
    </main>
  );
}
