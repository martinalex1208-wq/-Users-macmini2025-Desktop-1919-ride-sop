"use client";

import { Target, DollarSign, Heart, Layers, Award } from "lucide-react";
import { FUNDRAISING_GOAL } from "@/lib/itinerary";

const PILLARS = [
  { icon: Heart, label: "利他" },
  { icon: Layers, label: "系統" },
  { icon: Award, label: "品牌" },
];

export default function BoardDashboard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
        <Target className="text-amber-500" size={22} />
        首頁看板
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2">
            <DollarSign className="text-amber-600" size={20} />
            <span className="text-xs font-semibold text-slate-600">募款目標</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            $40M
          </p>
          <p className="mt-1 text-xs text-slate-600">
            NT$ {(FUNDRAISING_GOAL / 1_000_000).toFixed(0)},000,000
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:col-span-2 lg:col-span-3">
          <p className="text-xs font-semibold text-slate-500">願景三支柱</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {PILLARS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm border border-slate-200"
              >
                <Icon className="text-amber-500" size={18} />
                <span className="font-semibold text-slate-800">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">
            利他文化 · 系統化服務流程 · 品牌化公益影響力
          </p>
        </div>
      </div>
    </div>
  );
}
