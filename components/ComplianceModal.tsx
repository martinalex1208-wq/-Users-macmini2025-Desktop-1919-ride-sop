"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { DayItinerary } from "@/lib/itinerary";
import { COMPLIANCE_ITEMS } from "@/lib/itinerary";

interface ComplianceModalProps {
  item: DayItinerary | null;
  open: boolean;
  onClose: () => void;
  checklist: boolean[];
  onToggle: (index: number) => void;
}

export default function ComplianceModal({
  item,
  open,
  onClose,
  checklist,
  onToggle,
}: ComplianceModalProps) {
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
      aria-labelledby="compliance-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-amber-50 px-6 py-4">
          <h2 id="compliance-modal-title" className="text-lg font-bold text-slate-800">
            1919 微光執行規範
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
            {COMPLIANCE_ITEMS.map((label, i) => (
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
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
