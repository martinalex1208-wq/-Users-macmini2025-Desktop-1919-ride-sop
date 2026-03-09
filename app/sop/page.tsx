import Navbar from "@/components/Navbar";
import Link from "next/link";
import HomeLinkButton from "@/components/HomeLinkButton";
import { ClipboardList, ArrowLeft } from "lucide-react";
import {
  generalRideSop,
  repairDaySop,
  foodPackSop,
  kickoffSop,
  challengeSop,
} from "@/data/sopChecklist";
import type { SopItem } from "@/data/sopChecklist";

const CATEGORY_COLORS: Record<SopItem["category"], string> = {
  隱私: "bg-rose-100 text-rose-700",
  工具: "bg-amber-100 text-amber-700",
  訪視: "bg-sky-100 text-sky-700",
  物資: "bg-emerald-100 text-emerald-700",
  安全: "bg-amber-100 text-amber-700",
  一般: "bg-slate-100 text-slate-700",
};

function SopBlock({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: SopItem[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
        <ClipboardList className="text-amber-500" size={20} />
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      )}
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[item.category]}`}
            >
              {item.category}
            </span>
            <span className="text-sm text-slate-700">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SopPage() {
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
              <ClipboardList className="text-amber-500" size={24} />
              SOP 手冊
            </h1>
            <HomeLinkButton />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            各類型行程標準作業流程 · 依情境查閱
          </p>

          <div className="mt-8 space-y-8">
            <SopBlock
              title="通用騎行日 SOP"
              subtitle="適用於一般騎行日"
              items={generalRideSop}
            />
            <SopBlock
              title="案家修繕日 SOP"
              subtitle="適用於 D6 (12/24)、D10 (12/28)"
              items={repairDaySop}
            />
            <SopBlock
              title="食物包發放日 SOP"
              subtitle="適用於 D7 (12/25)"
              items={foodPackSop}
            />
            <SopBlock
              title="啟行儀式日 SOP"
              subtitle="適用於 D1 (12/19)"
              items={kickoffSop}
            />
            <SopBlock
              title="高強度挑戰日 SOP"
              subtitle="適用於 D11 最長挑戰路段"
              items={challengeSop}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
