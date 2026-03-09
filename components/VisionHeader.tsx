"use client";

import { Target, Heart, Layers, Award, Quote } from "lucide-react";
import { FUNDRAISING_GOAL } from "@/lib/itinerary";

const PILLARS = [
  { icon: Heart, label: "利他文化" },
  { icon: Layers, label: "系統化" },
  { icon: Award, label: "品牌化" },
];

export default function VisionHeader() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
        <Target className="text-amber-500" size={22} />
        2026 核心願景
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">募款目標</p>
          <p className="mt-1 text-xl font-bold text-amber-600">
            NT$ {(FUNDRAISING_GOAL / 1_000_000).toFixed(0)},000,000
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-slate-500">願景三支柱</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PILLARS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800"
              >
                <Icon size={14} /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <blockquote className="mt-6 flex gap-3 rounded-xl border-l-4 border-amber-500 bg-amber-50/50 px-4 py-3">
        <Quote className="mt-0.5 shrink-0 text-amber-500" size={20} />
        <p className="text-sm font-medium text-slate-700 sm:text-base">
          讓助人成為一個世代的文化與常態
        </p>
      </blockquote>
    </section>
  );
}
