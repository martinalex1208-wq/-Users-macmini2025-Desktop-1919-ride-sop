import Navbar from "@/components/Navbar";
import Link from "next/link";
import HomeLinkButton from "@/components/HomeLinkButton";
import {
  Shield,
  ArrowLeft,
  AlertTriangle,
  Car,
  Users,
  CheckCircle2,
  Ban,
} from "lucide-react";

const DROP_OFF_STEPS = [
  {
    step: "5 公尺警戒",
    desc: "小組長若發現組員落隊超過 5 公尺，應立即口頭提醒「加快速度跟上隊伍」。",
  },
  {
    step: "靠右避讓",
    desc: "若組員仍持續落隊，應提醒其「靠右行駛」。",
  },
  {
    step: "左側超車",
    desc: "主隊應由該名落隊者的「左側安全超車」。",
  },
  {
    step: "押騎支援",
    desc: "落隊組員將由押騎人員全程陪同。",
  },
  {
    step: "行政車接駁",
    desc: "若落隊者已無法繼續騎乘，押騎可安排其上行政車休息。",
  },
];

const PASSING_RULES = [
  {
    icon: Car,
    title: "單一方向",
    desc: "所有超車行為一律由左側超車，嚴禁從右側穿插。",
  },
  {
    icon: Users,
    title: "歸隊時機",
    desc: "落隊組員僅限於「車隊停下時」重新歸隊。",
  },
  {
    icon: Ban,
    title: "行進禁忌",
    desc: "行進間嚴禁私自加速或隨意穿插，以避免碰撞風險。",
  },
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-amber-600"
        >
          <ArrowLeft size={16} />
          返回首頁
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <Shield className="text-amber-500" size={24} />
              安全規範 · 車隊行進與超車
            </h1>
            <HomeLinkButton />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            專業手冊 · 確保全體隊員行進安全
          </p>

          {/* 落隊處理標準作業 */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
              <AlertTriangle className="text-amber-500" size={20} />
              落隊處理標準作業 (Drop-off SOP)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              針對行進間速度較慢的組員，請依序執行以下步驟：
            </p>
            <ul className="mt-4 space-y-4">
              {DROP_OFF_STEPS.map(({ step, desc }, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{step}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 統一超車規範 */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
              <CheckCircle2 className="text-amber-500" size={20} />
              統一超車規範 (Passing Rules)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              為了確保全體隊員安全，超車行為必須嚴格遵守以下規範：
            </p>
            <div className="mt-4 space-y-4">
              {PASSING_RULES.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Icon className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
