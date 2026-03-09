"use client";

import { Target, Heart, Layers, Award, Quote, DollarSign } from "lucide-react";
import HomeButton from "@/components/HomeButton";
import { FUNDRAISING_GOAL } from "@/lib/itinerary";

const PILLARS = [
  { icon: Heart, label: "利他文化", desc: "以服務弱勢為核心，建立互助共好的社會氛圍" },
  { icon: Layers, label: "系統化", desc: "建立可複製的服務流程，讓愛心可持續擴散" },
  { icon: Award, label: "品牌化", desc: "打造 1919 愛走動的公益品牌影響力" },
];

const MISSION = "透過單車環台募款與實地服務，連結企業、教會與弱勢家庭，讓每一份愛心都能轉化為具體行動，陪伴需要幫助的人走過難關。";

export default function VisionSection() {
  return (
    <section id="vision" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
            <Target className="text-amber-500" size={24} />
            願景目標
          </h2>
          <HomeButton />
        </div>

        {/* 募款目標 */}
        <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-center gap-2">
            <DollarSign className="text-amber-600" size={24} />
            <span className="text-sm font-semibold text-slate-600">年度募款目標</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-700 sm:text-4xl">
            NT$ {(FUNDRAISING_GOAL / 1_000_000).toFixed(0)},000,000
          </p>
          <p className="mt-2 text-sm text-slate-600">
            幫助弱勢家庭獲得食物包、案家修繕、急難救助等實質支持
          </p>
        </div>

        {/* 願景三支柱 */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            願景三支柱
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {PILLARS.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-100 p-2">
                    <Icon className="text-amber-600" size={20} />
                  </div>
                  <span className="font-bold text-slate-800">{label}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 核心使命 */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            核心使命
          </h3>
          <div className="mt-3 rounded-xl border-l-4 border-amber-500 bg-slate-50/80 p-5">
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{MISSION}</p>
          </div>
        </div>

        {/* 金句 */}
        <blockquote className="mt-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-4">
          <Quote className="mt-0.5 shrink-0 text-amber-500" size={24} />
          <p className="text-base font-medium text-slate-700 sm:text-lg">
            讓助人成為一個世代的文化與常態
          </p>
        </blockquote>
      </div>
    </section>
  );
}
