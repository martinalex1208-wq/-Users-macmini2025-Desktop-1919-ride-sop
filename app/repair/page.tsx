import Navbar from "@/components/Navbar";
import Link from "next/link";
import HomeLinkButton from "@/components/HomeLinkButton";
import { Wrench, ArrowLeft, CheckCircle2 } from "lucide-react";

const QUALITY_ITEMS = [
  {
    title: "用力剛剛好",
    desc: "確保家中老人與小孩皆能操作（如門窗、開關），不需額外施力。",
  },
  {
    title: "結構穩定",
    desc: "維修完成後不晃、不鬆，案家不需擔心短期內再次損壞。",
  },
  {
    title: "直覺維護",
    desc: "不需說明書或特殊工具即可自行處理，達到「不用再想它」的境界。",
  },
  {
    title: "良心檢核",
    desc: "每位勇士需在心中回答：「如果是我爸媽住這裡，我會放心嗎？」",
  },
];

export default function RepairPage() {
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
              <Wrench className="text-amber-500" size={24} />
              案家修繕 · 修繕「好用」標準
            </h1>
            <HomeLinkButton />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Repair Quality
          </p>
          <p className="mt-1 text-sm text-slate-600">
            宗旨：修繕的標準不是「能用」，而是要減輕案家負擔並回應尊嚴。
          </p>

          <div className="mt-8 space-y-4">
            {QUALITY_ITEMS.map(({ title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-amber-500"
                  size={22}
                />
                <div>
                  <p className="font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
