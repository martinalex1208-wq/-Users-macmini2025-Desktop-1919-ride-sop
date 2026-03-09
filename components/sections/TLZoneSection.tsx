"use client";

import { useState } from "react";
import HomeButton from "@/components/HomeButton";
import {
  Users,
  Gauge,
  Heart,
  Droplets,
  Shield,
  Eye,
  Activity,
  Move,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const PRE_RIDE_ITEMS = [
  {
    id: "tire",
    icon: Gauge,
    label: "輪胎氣壓",
    desc: "親自捏捏看前後輪，確保胎壓足夠",
    highlight: "建議 90psi 以上，除非車款有特殊要求",
    isKey: true,
  },
  {
    id: "body",
    icon: Heart,
    label: "身體狀況",
    desc: "主動詢問隊員今日是否有不適、疲勞或受傷",
  },
  {
    id: "gear",
    icon: Droplets,
    label: "裝備完整",
    desc: "確認水壺裝滿，且安全帽、風鏡、手套、衣著著裝完畢",
  },
  {
    id: "report",
    icon: AlertTriangle,
    label: "異常通報",
    desc: "若發現無法即時調整的狀況",
    highlight: "應立即通知押騎處理",
    isKey: true,
  },
];

const DURING_RIDE_ITEMS = [
  {
    id: "tire-check",
    icon: Gauge,
    label: "異常偵測",
    desc: "觀察輪胎是否洩氣或異常磨耗，並提醒組員正確運用檔位",
  },
  {
    id: "status",
    icon: Activity,
    label: "狀態觀察",
    desc: "主動詢問勇士狀態，透過觀察「喘氣頻率」評估體能狀況。喘氣急促或節奏異常時，適時提醒休息或調整騎行強度。",
  },
  {
    id: "posture",
    icon: Move,
    label: "姿態校正",
    desc: "檢查組員騎乘姿勢是否符合 Fitting 原則，有無因疲勞導致的姿態扭曲。適時提醒挺直背部、放鬆肩膀，避免長時間不良姿勢造成傷害。",
  },
  {
    id: "fallback",
    icon: ArrowRight,
    label: "落後導引",
    desc: "若組員無法跟上，應及時告知其「靠右」，確保主隊安全超車",
  },
];

export default function TLZoneSection() {
  const [preRideChecked, setPreRideChecked] = useState<Record<string, boolean>>({});
  const [duringRideChecked, setDuringRideChecked] = useState<Record<string, boolean>>({});

  const togglePreRide = (id: string) => {
    setPreRideChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDuringRide = (id: string) => {
    setDuringRideChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="tlzone" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <Users className="text-amber-500" size={24} />
              小組長專區 (TL Zone)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              騎行前 (胎壓 90psi/身心詢問) · 騎行中 (喘氣觀察/姿態校正)
            </p>
          </div>
          <HomeButton />
        </div>

        {/* 騎行前：安全三要素 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Shield size={18} className="text-amber-500" />
            騎行前：安全三要素
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            每日出發前，小組長需逐一確認組員狀態
          </p>
          <ul className="mt-4 space-y-3">
            {PRE_RIDE_ITEMS.map(({ id, icon: Icon, label, desc, highlight, isKey }) => (
              <li
                key={id}
                className={`flex gap-4 rounded-xl border p-4 transition-colors ${
                  isKey ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <label className="flex min-w-0 flex-1 cursor-pointer gap-4">
                  <input
                    type="checkbox"
                    checked={preRideChecked[id] ?? false}
                    onChange={() => togglePreRide(id)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <div className="flex gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <Icon className="text-amber-600" size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{label}</p>
                      <p className="mt-0.5 text-sm text-slate-600">{desc}</p>
                      {highlight && (
                        <p className="mt-2 rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                          ★ {highlight}
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* 騎行中：動態三檢查 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Eye size={18} className="text-amber-500" />
            騎行中：動態三檢查
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            1300 公里環台過程中，需時刻留意組員狀態
          </p>
          <ul className="mt-4 space-y-3">
            {DURING_RIDE_ITEMS.map(({ id, icon: Icon, label, desc }) => (
              <li
                key={id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-colors"
              >
                <label className="flex min-w-0 flex-1 cursor-pointer gap-4">
                  <input
                    type="checkbox"
                    checked={duringRideChecked[id] ?? false}
                    onChange={() => toggleDuringRide(id)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <div className="flex gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                      <Icon className="text-slate-600" size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{desc}</p>
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* 關懷提醒 */}
        <div className="mt-6 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <CheckCircle2 className="shrink-0 text-amber-500" size={24} />
          <div>
            <p className="font-semibold text-slate-800">對隊員的關懷</p>
            <p className="mt-1 text-sm text-slate-600">
              姿態檢查與喘氣觀察不只是安全要求，更是對每位勇士的關心。適時詢問、細心觀察，讓隊員感受到被照顧，才能一起完成 1300 公里的挑戰。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
