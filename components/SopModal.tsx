"use client";

import { useEffect } from "react";
import type { SopItem } from "@/data/sopChecklist";

interface SopModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  date: string;
  activity: string;
  items: SopItem[];
}

const categoryLabels: Record<SopItem["category"], string> = {
  隱私: "隱私保護",
  工具: "工具準備",
  訪視: "訪視禮儀",
  物資: "物資檢查",
  安全: "安全確認",
  一般: "一般事項",
};

export default function SopModal({
  isOpen,
  onClose,
  day,
  date,
  activity,
  items,
}: SopModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const grouped = items.reduce<Record<string, SopItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const order: SopItem["category"][] = ["隱私", "工具", "訪視", "物資", "安全", "一般"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-lab-elevated border-t border-l border-r border-lab-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:max-w-lg sm:rounded-2xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-lab-elevated border-b border-lab-border px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-lab-accent">
              第 {day} 天 · {date}
            </h2>
            <p className="text-sm text-lab-text-muted">{activity}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-lab-text-muted hover:bg-lab-surface hover:text-lab-text-primary transition-colors"
            aria-label="關閉"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 pb-8 space-y-6">
          <p className="text-sm text-lab-text-muted">SOP 檢查清單</p>
          {order.map((cat) => {
            const list = grouped[cat];
            if (!list?.length) return null;
            return (
              <div key={cat}>
                <h3 className="text-xs font-medium uppercase tracking-wider text-lab-accent/80 mb-2">
                  {categoryLabels[cat]}
                </h3>
                <ul className="space-y-2">
                  {list.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg bg-lab-surface/50 border border-lab-border/50 px-3 py-2.5"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-lab-accent/50 text-lab-accent text-xs">
                        □
                      </span>
                      <span className="text-sm text-lab-text-primary">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
