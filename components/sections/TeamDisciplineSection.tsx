"use client";

import HomeButton from "@/components/HomeButton";
import {
  Scale,
  Clock,
  Bike,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const TIME_DISCIPLINE = [
  "準時集合：每日出發前 30 分鐘完成整隊，不遲到、不脫隊",
  "統一作息：依領隊指示休息與補給，維持隊伍節奏一致",
  "定點報到：每站休息點需向小組長報到，確保全員安全",
  "日落前抵達：每日行程規劃於日落前抵達住宿點，避免夜騎",
  "團隊優先：個人狀況需即時回報，以全隊安全為最高原則",
];

const TIRE_CHECK_ITEMS = [
  "前輪胎壓確認",
  "後輪胎壓確認",
  "建議 90psi 以上（依車款規格調整）",
  "胎紋檢查，磨損過度需更換",
];

export default function TeamDisciplineSection() {
  return (
    <section id="discipline" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <Scale className="text-amber-500" size={24} />
              紀律管理
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              專業手冊 · 電輔車編組規範與胎壓 90psi 檢查標準
            </p>
          </div>
          <HomeButton />
        </div>

        {/* 時間紀律五條 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Clock size={18} className="text-amber-500" />
            時間紀律五條
          </h3>
          <ul className="mt-4 space-y-3">
            {TIME_DISCIPLINE.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <CheckCircle2 className="mt-0.5 shrink-0 text-amber-500" size={18} />
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 電輔車編組規範 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Bike size={18} className="text-amber-500" />
            電輔車編組規範
          </h3>
          <div className="mt-4 flex gap-3 rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5">
            <AlertTriangle className="shrink-0 text-amber-600" size={24} />
            <div>
              <p className="font-semibold text-slate-800">電輔車統一編組於第六組後</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                維持隊伍秩序與安全。電輔車騎士因動力輔助，騎行節奏與一般騎士不同，統一編組於第六組後可避免隊伍斷裂，並便於領隊掌握整體狀況。此規範確保車隊行進一致性，降低意外風險，讓每位騎士都能在安全環境下完成環台挑戰。
              </p>
            </div>
          </div>
        </div>

        {/* 胎壓 90psi 安全檢查 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Gauge size={18} className="text-amber-500" />
            胎壓 90psi 檢查標準
          </h3>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
            <p className="text-sm leading-relaxed text-slate-600">
              每日出發前，小組長需協助成員完成胎壓檢查。胎壓不足易導致爆胎、騎行阻力增加與耗費體力，建議維持 90psi 以上（依車款規格調整）。以下為標準檢查流程：
            </p>
            <ul className="mt-4 space-y-2">
              {TIRE_CHECK_ITEMS.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              ※ 胎壓 90psi 為建議標準，確保騎行效率與安全。請依車款規格與胎壓標示調整。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
