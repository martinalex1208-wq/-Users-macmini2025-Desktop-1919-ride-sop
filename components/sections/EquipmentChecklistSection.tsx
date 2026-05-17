"use client";

import { useState } from "react";
import HomeButton from "@/components/HomeButton";
import {
  Package,
  Shirt,
  Bike,
  Sparkles,
} from "lucide-react";

interface EquipmentItem {
  id: string;
  label: string;
  qty?: string;
  note?: string;
}

const ASSOCIATION_ITEMS: EquipmentItem[] = [
  { id: "a1", label: "紀念車衣", qty: "2 件" },
  { id: "a2", label: "頭巾", qty: "2 條" },
  { id: "a3", label: "高級自行車帽", qty: "1 頂" },
  { id: "a4", label: "防水透氣外套", qty: "1 件", note: "結束後收回" },
  { id: "a5", label: "防風背心", qty: "1 件" },
  { id: "a6", label: "行李吊牌", qty: "2 個" },
  { id: "a7", label: "姓名貼", qty: "1 包" },
  { id: "a8", label: "自行車褲（長褲，全黑）", qty: "1 條", note: "協會提供" },
];

const PERSONAL_REQUIRED: EquipmentItem[] = [
  { id: "p1", label: "露指手套" },
  { id: "p2", label: "單車水壺", qty: "1 個" },
  { id: "p3", label: "硬底鞋或卡鞋", qty: "1 雙" },
  { id: "p4", label: "內胎", qty: "2 條", note: "公路車 700×25C" },
  { id: "p5", label: "前/後車燈", qty: "1 組" },
  { id: "p6", label: "健保卡", qty: "1 份" },
  { id: "p7", label: "身分證", qty: "1 份" },
  { id: "p8", label: "個人藥品", note: "酸痛噴劑/貼布" },
  { id: "p9", label: "太陽眼鏡" },
  { id: "p10", label: "防曬/護唇膏" },
  { id: "p11", label: "換洗衣物與便服", qty: "1 套" },
  { id: "p12", label: "保暖外套", note: "晚上休息用" },
  { id: "p13", label: "運動襪", qty: "2-3 雙" },
  { id: "p14", label: "洗衣袋", qty: "1 個", note: "脫水用" },
  { id: "p15", label: "登機箱", qty: "1 件", note: "20 吋以內，置於大行李車" },
  { id: "p16", label: "小型背包", qty: "1 件", note: "20L，裝隨身物品，置於小行李車" },
];

const PERSONAL_OPTIONAL: EquipmentItem[] = [
  { id: "o1", label: "全指手套" },
  { id: "o2", label: "雨褲" },
  { id: "o3", label: "涼鞋", note: "雨天備用" },
  { id: "o4", label: "個人盥洗用品" },
  { id: "o5", label: "水壺刷" },
  { id: "o6", label: "泳裝/泳帽" },
];

function ChecklistItem({
  item,
  checked,
  onToggle,
  icon: Icon,
  isRequired,
}: {
  item: EquipmentItem;
  checked: boolean;
  onToggle: () => void;
  icon: React.ElementType;
  isRequired?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors ${
        isRequired ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-slate-50/50"
      } ${checked ? "opacity-60" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
      />
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200">
          <Icon className="text-slate-600" size={18} />
        </div>
        <div className="min-w-0">
          <p className={`font-medium ${checked ? "line-through text-slate-500" : "text-slate-800"}`}>
            {item.label}
            {item.qty && (
              <span className="ml-2 text-sm font-bold text-amber-700">{item.qty}</span>
            )}
          </p>
          {item.note && (
            <p className="mt-0.5 text-xs text-slate-500">{item.note}</p>
          )}
        </div>
      </div>
    </label>
  );
}

export default function EquipmentChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allIds = [
    ...ASSOCIATION_ITEMS.map((i) => i.id),
    ...PERSONAL_REQUIRED.map((i) => i.id),
    ...PERSONAL_OPTIONAL.map((i) => i.id),
  ];
  const checkedCount = allIds.filter((id) => checked[id]).length;
  const progress = Math.round((checkedCount / allIds.length) * 100);

  return (
    <section id="equipment" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <Package className="text-amber-500" size={24} />
              個人裝備清單 (Equipment Checklist)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              協會提供 · 個人必帶 · 建議選帶 · 內胎 700×25C · 20吋登機箱
            </p>
          </div>
          <HomeButton />
        </div>

        {/* 進度條 */}
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">檢核進度</span>
            <span className="font-semibold text-amber-600">
              {checkedCount} / {allIds.length} 項
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 協會提供 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Shirt size={18} className="text-amber-500" />
            協會提供（核心識別與安全）
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            由救助協會統一提供，確保團隊形象與基礎防護
          </p>
          <ul className="mt-4 space-y-2">
            {ASSOCIATION_ITEMS.map((item) => (
              <li key={item.id}>
                <ChecklistItem
                  item={item}
                  checked={checked[item.id] ?? false}
                  onToggle={() => toggle(item.id)}
                  icon={Shirt}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* 個人必帶 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Bike size={18} className="text-amber-500" />
            個人必帶（騎行與生活必需）
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            勇士需自備的關鍵物資，確保 15 天旅程順利
          </p>
          <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            ★ 必需品 · 請依建議數量準備
          </div>
          <ul className="mt-4 space-y-2">
            {PERSONAL_REQUIRED.map((item) => (
              <li key={item.id}>
                <ChecklistItem
                  item={item}
                  checked={checked[item.id] ?? false}
                  onToggle={() => toggle(item.id)}
                  icon={Bike}
                  isRequired
                />
              </li>
            ))}
          </ul>
        </div>

        {/* 建議選帶 */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Sparkles size={18} className="text-amber-500" />
            建議選帶（提升舒適度）
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            可依個人需求選擇攜帶
          </p>
          <ul className="mt-4 space-y-2">
            {PERSONAL_OPTIONAL.map((item) => (
              <li key={item.id}>
                <ChecklistItem
                  item={item}
                  checked={checked[item.id] ?? false}
                  onToggle={() => toggle(item.id)}
                  icon={Sparkles}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
