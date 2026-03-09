"use client";

import { Wrench, CheckCircle2 } from "lucide-react";

const RENOVATION_STANDARDS = [
  { key: "用力剛剛好", desc: "施作力道適中，不造成二次損壞" },
  { key: "結構穩定", desc: "確保修繕後結構安全可靠" },
  { key: "維護容易", desc: "案家後續可自行簡易維護" },
  { key: "直覺使用", desc: "操作方式符合案家生活習慣" },
];

const CONSCIENCE_QA = [
  { q: "我是否以案家需求為優先？", a: "是 / 否" },
  { q: "修繕品質是否經得起檢驗？", a: "是 / 否" },
  { q: "我是否尊重案家的隱私與尊嚴？", a: "是 / 否" },
];

export default function SOPCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
        <Wrench className="text-amber-500" size={22} />
        案家修繕標準
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {RENOVATION_STANDARDS.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4"
          >
            <CheckCircle2 className="mt-0.5 shrink-0 text-amber-500" size={20} />
            <div>
              <p className="font-semibold text-slate-800">{item.key}</p>
              <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">良心檢核問答</h3>
        <ul className="space-y-2">
          {CONSCIENCE_QA.map((item, i) => (
            <li key={i} className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-4">
              <span className="text-slate-600">{item.q}</span>
              <span className="text-amber-600 font-medium shrink-0">{item.a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
