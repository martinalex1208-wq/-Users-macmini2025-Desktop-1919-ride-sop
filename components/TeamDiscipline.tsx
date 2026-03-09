"use client";

import { Scale, Bike, Gauge } from "lucide-react";

const TIRE_CHECK_ITEMS = [
  "前輪胎壓確認",
  "後輪胎壓確認",
  "建議 90psi 以上",
];

export default function TeamDiscipline() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
        <Scale className="text-amber-500" size={22} />
        團隊紀律
      </h2>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="flex items-center gap-2 font-semibold text-slate-800">
            <Bike size={18} className="text-amber-500" />
            電輔車編組規範
          </p>
          <p className="mt-2 text-sm text-slate-600">
            電輔車統一編組於第六組後，維持隊伍秩序與安全。
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="flex items-center gap-2 font-semibold text-slate-800">
            <Gauge size={18} className="text-amber-500" />
            小組長胎壓檢查清單
          </p>
          <ul className="mt-3 space-y-2">
            {TIRE_CHECK_ITEMS.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
