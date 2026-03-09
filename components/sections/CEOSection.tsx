"use client";

import HomeButton from "@/components/HomeButton";
import {
  Crown,
  Car,
  Heart,
  Hotel,
  Package,
  Gift,
  Target,
  Users,
  Tent,
} from "lucide-react";

const FIVE_STAR_SERVICES = [
  {
    icon: Package,
    title: "行李直送服務",
    desc: "行李專車運送，輕裝騎行無負擔。每日行李由專車運送至當日住宿點，騎士只需專心騎行，無需背負沉重行李完成 1300 公里挑戰。",
  },
  {
    icon: Car,
    title: "豪華保母車",
    desc: "專業前導車開道，確保騎行安全與路線順暢。全程跟隨車隊，提供補給、維修支援與緊急接駁，讓騎士無後顧之憂。",
  },
  {
    icon: Tent,
    title: "專屬露營車",
    desc: "一日總裁專屬露營車隨行，提供中途休憩、補給站與緊急避難空間。高規格配置讓長途騎行更有保障與舒適度。",
  },
  {
    icon: Heart,
    title: "救護車",
    desc: "全程醫療支援，即時照護每位騎士。專業醫護隨行，守護每一位勇士的健康與安全，應對突發狀況。",
  },
  {
    icon: Hotel,
    title: "五星級飯店 VIP 接待",
    desc: "尊榮禮遇，舒適休憩迎接每一天。入住精選五星飯店，讓騎行後的疲憊得到最佳恢復。",
  },
  {
    icon: Gift,
    title: "限定備品",
    desc: "一日總裁專屬補給包、紀念衫、完騎證書等限定備品，記錄這段獨特的公益旅程。",
  },
];

const CHARITY_TASKS = [
  { icon: Target, text: "案家修繕：深入弱勢家庭，進行房屋修繕與安全改善" },
  { icon: Users, text: "食物包發放：與在地教會合作，將物資送到需要的家庭手中" },
  { icon: Heart, text: "關懷陪伴：傾聽故事、給予支持，讓愛心化為實際行動" },
];

export default function CEOSection() {
  return (
    <section id="ceo" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <Crown className="text-amber-500" size={24} />
              CEO 專案 · 一日總裁體驗
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              高規格服務配置 · 專業車隊 · 五星款待 · 公益任務
            </p>
          </div>
          <HomeButton />
        </div>

        {/* 五星款待細節 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Hotel size={18} className="text-amber-500" />
            五星款待細節
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FIVE_STAR_SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Icon className="text-amber-600" size={20} />
                </div>
                <h4 className="font-bold text-slate-800">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 公益任務 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Target size={18} className="text-amber-500" />
            公益任務
          </h3>
          <ul className="mt-4 space-y-3">
            {CHARITY_TASKS.map(({ icon: Icon, text }, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <Icon className="mt-0.5 shrink-0 text-amber-500" size={18} />
                <span className="text-sm text-slate-700">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
