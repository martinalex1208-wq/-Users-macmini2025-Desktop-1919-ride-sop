"use client";

import { FUNDRAISING_GOAL, TOTAL_KM } from "@/lib/itinerary";

/** 模擬募款進度 (可改為 API 串接) */
const MOCK_RAISED = 12_500_000;

export default function HeroSection() {
  const progress = Math.min(100, (MOCK_RAISED / FUNDRAISING_GOAL) * 100);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-16 shadow-sm sm:py-24">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-orange-500 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
          2026 1919 愛走動
        </h1>
        <p className="mt-2 text-lg text-slate-600 sm:text-xl">
          單車環台 · 1,300 公里 · 15 天
        </p>

        {/* 核心標語 */}
        <blockquote className="mt-8 text-xl font-medium text-amber-700 sm:text-2xl md:text-3xl">
          「帶著使命騎，為了生命停」
        </blockquote>

        {/* 募款進度條 */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>募款進度</span>
            <span className="font-semibold text-amber-600">
              NT$ {(MOCK_RAISED / 1_000_000).toFixed(1)}M / {(FUNDRAISING_GOAL / 1_000_000).toFixed(0)}M
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            年度募款目標 NT$40,000,000 · 幫助弱勢家庭
          </p>
        </div>
      </div>
    </section>
  );
}
