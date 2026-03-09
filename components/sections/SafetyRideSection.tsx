"use client";

import HomeButton from "@/components/HomeButton";
import {
  Shield,
  Bike,
  ArrowLeftRight,
  ShieldAlert,
  MessageSquare,
  ArrowRight,
  Car,
  Ban,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const DROP_OFF_STAGES = [
  {
    icon: MessageSquare,
    label: "5 公尺提醒",
    desc: "小組長發現組員落隊超過 5 公尺，立即口頭提醒「加快速度跟上隊伍」",
    badge: "5m",
  },
  {
    icon: ArrowRight,
    label: "靠右行駛",
    desc: "若組員仍持續落隊，應提醒其靠右行駛，讓主隊由左側安全超車",
    badge: "靠右",
  },
  {
    icon: Car,
    label: "押騎／行政車接駁",
    desc: "落隊組員由押騎全程陪同；若無法繼續騎乘，可安排上行政車休息",
    badge: "接駁",
  },
];

export default function SafetyRideSection() {
  return (
    <section id="safety" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <Shield className="text-amber-500" size={24} />
              安全規範 (Safety Ride)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              5公尺提醒 · 一律左側超車 · 行進間嚴禁歸隊
            </p>
          </div>
          <HomeButton />
        </div>

        {/* 警示標語 */}
        <div className="mt-6 flex gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/80 px-5 py-4">
          <ShieldAlert className="shrink-0 text-amber-600" size={28} />
          <div>
            <p className="font-bold text-amber-800">
              遵守超車規範是確保全體隊員安全的關鍵
            </p>
            <p className="mt-1 text-sm text-slate-600">
              一律左側超車 · 行進間嚴禁私自歸隊
            </p>
          </div>
        </div>

        {/* 落隊三階段處理 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Bike size={18} className="text-amber-500" />
            落隊三階段處理
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {DROP_OFF_STAGES.map(({ icon: Icon, label, desc, badge }, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:shadow-md"
              >
                <div className="absolute right-3 top-3 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {badge}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Icon className="text-amber-600" size={24} />
                </div>
                <h4 className="mt-3 font-bold text-slate-800">{label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 超車紀律看板 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <ArrowLeftRight size={18} className="text-amber-500" />
            超車紀律看板
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6 text-center">
              <ArrowLeftRight className="mx-auto text-amber-600" size={40} />
              <p className="mt-3 text-lg font-bold text-amber-800">
                一律左側超車
              </p>
              <p className="mt-1 text-sm text-slate-600">
                所有超車行為由左側進行，嚴禁從右側穿插
              </p>
            </div>
            <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-6 text-center">
              <Ban className="mx-auto text-slate-600" size={40} />
              <p className="mt-3 text-lg font-bold text-slate-800">
                行進間嚴禁私自歸隊
              </p>
              <p className="mt-1 text-sm text-slate-600">
                落隊組員僅限於車隊停下時重新歸隊
              </p>
            </div>
          </div>
        </div>

        {/* 連結至完整規範 */}
        <Link
          href="/safety"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-amber-700"
        >
          <ExternalLink size={16} />
          查看完整車隊行進規範
        </Link>
      </div>
    </section>
  );
}
