"use client";

import { useEffect } from "react";
import { X, Wrench, CheckCircle2, Heart } from "lucide-react";
import type { DayItinerary } from "@/lib/itinerary";
import { DAY6_SERVICE_CHECKLIST_ITEMS } from "@/lib/itinerary";

interface RepairSOPModalProps {
  item: DayItinerary | null;
  open: boolean;
  onClose: () => void;
  checklist: boolean[];
  onToggle: (index: number) => void;
}

export default function RepairSOPModal({
  item,
  open,
  onClose,
  checklist,
  onToggle,
}: RepairSOPModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const allChecked = checklist.length > 0 && checklist.every(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="repair-sop-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1919 紅白灰藍 - 頂部標題 */}
        <div className="flex items-center justify-between border-b-2 border-lab-danger bg-lab-danger px-6 py-4">
          <h2
            id="repair-sop-modal-title"
            className="flex items-center gap-2 text-lg font-bold text-white"
          >
            <Wrench size={20} />
            好用標準檢核表
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/20"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Day {item.day} · {item.date} · {item.task}
          </p>

          {/* 互動檢核清單 - 簡潔 Checkbox 列表 */}
          <div className="space-y-3">
            {DAY6_SERVICE_CHECKLIST_ITEMS.map(({ label, desc }, i) => (
              <label
                key={i}
                className={`flex items-start gap-3 cursor-pointer group rounded-xl border-2 p-4 transition-all ${
                  checklist[i]
                    ? "border-lab-1919-blue bg-lab-1919-blue/5"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist[i] ?? false}
                  onChange={() => onToggle(i)}
                  className="mt-1 h-5 w-5 rounded border-2 border-slate-300 text-lab-danger focus:ring-lab-danger focus:ring-2"
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-semibold ${
                      checklist[i] ? "text-lab-1919-blue" : "text-slate-800"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-slate-600">：</span>
                  <span className="text-sm text-slate-600">{desc}</span>
                </div>
                {checklist[i] && (
                  <CheckCircle2
                    className="shrink-0 text-lab-1919-blue"
                    size={20}
                  />
                )}
              </label>
            ))}
          </div>

          {/* 勾選完畢後顯示的互動回饋 */}
          {allChecked && (
            <div className="rounded-xl border-2 border-lab-danger bg-lab-danger/10 px-5 py-4 flex items-center gap-3">
              <Heart className="shrink-0 text-lab-danger" size={28} />
              <p className="text-base font-bold text-lab-danger">
                任務準備就緒，帶著愛出發
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
