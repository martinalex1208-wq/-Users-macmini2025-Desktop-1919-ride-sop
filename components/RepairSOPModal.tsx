"use client";

import { useEffect } from "react";
import { X, Wrench } from "lucide-react";
import type { DayItinerary } from "@/lib/itinerary";
import { REPAIR_SOP_ITEMS } from "@/lib/itinerary";

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
        <div className="flex items-center justify-between border-b border-slate-200 bg-amber-50 px-6 py-4">
          <h2 id="repair-sop-modal-title" className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Wrench className="text-amber-500" size={20} />
            好用標準檢核表
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Day {item.day} · {item.date} · {item.task}
          </p>

          <div className="space-y-3">
            {REPAIR_SOP_ITEMS.map(({ label, desc }, i) => (
              <label
                key={i}
                className="flex items-start gap-3 cursor-pointer group rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={checklist[i] ?? false}
                  onChange={() => onToggle(i)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-800">{label}</span>
                  <span className="text-slate-600">：</span>
                  <span className="text-sm text-slate-600">{desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
