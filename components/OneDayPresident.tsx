"use client";

import { Car, Heart, Hotel, Package } from "lucide-react";

const FEATURES = [
  {
    icon: Car,
    title: "前導車",
    desc: "專業前導車開道，確保騎行安全與路線順暢",
  },
  {
    icon: Heart,
    title: "救護車",
    desc: "全程醫療支援，即時照護每位騎士",
  },
  {
    icon: Hotel,
    title: "五星級飯店 VIP 接待",
    desc: "尊榮禮遇，舒適休憩迎接每一天",
  },
  {
    icon: Package,
    title: "行李直送服務",
    desc: "行李專車運送，輕裝騎行無負擔",
  },
];

export default function OneDayPresident() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
          旗艦企劃：一日總裁體驗
        </h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          專業車隊 · 五星款待 · 公益任務 · 高規格服務配置
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-center transition-colors hover:border-amber-300 bg-white"
          >
            <div className="mb-3 rounded-full bg-amber-100 p-3">
              <Icon className="text-amber-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
