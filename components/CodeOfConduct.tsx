"use client";

import { Shield, Volume2, Eye, Heart } from "lucide-react";

const CONDUCT_ITEMS = [
  {
    icon: Volume2,
    label: "低調服務",
    desc: "不喧嘩、不招搖，以案家為中心。進入案家時衣著簡樸，避免過度張揚的裝備或標識，讓受助者感到自在而非被施捨。",
  },
  {
    icon: Eye,
    label: "尊重隱私",
    desc: "未經允許不拍照，不打擾作息。保護案家隱私是基本尊重，不將受助者處境作為宣傳素材，維護其尊嚴。",
  },
  {
    icon: Heart,
    label: "同理心溝通",
    desc: "先聽故事，再給物資，保持平等對話。物資發放前先傾聽案家的需求與處境，讓關懷從理解開始，而非單向給予。",
  },
];

export default function CodeOfConduct() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
        <Shield className="text-amber-500" size={22} />
        行動準則
      </h2>
      <p className="mt-2 text-xs text-slate-500">
        低調 · 尊重 · 同理心（先聽故事再給物資）
      </p>

      <div className="mt-4 space-y-3">
        {CONDUCT_ITEMS.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4"
          >
            <div className="shrink-0 rounded-lg bg-amber-100 p-2">
              <Icon className="text-amber-600" size={18} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{label}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
