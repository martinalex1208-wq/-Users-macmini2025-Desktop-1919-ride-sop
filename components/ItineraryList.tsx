"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Bike, Crown } from "lucide-react";
import type { DayItinerary } from "@/lib/itinerary";
import ComplianceModal from "./ComplianceModal";
import RepairSOPModal from "./RepairSOPModal";
import { COMPLIANCE_ITEMS, REPAIR_SOP_ITEMS } from "@/lib/itinerary";

interface ItineraryListProps {
  items: DayItinerary[];
}

export default function ItineraryList({ items }: ItineraryListProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [modalItem, setModalItem] = useState<DayItinerary | null>(null);
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [complianceChecklist, setComplianceChecklist] = useState<Record<number, boolean[]>>({});
  const [repairChecklist, setRepairChecklist] = useState<Record<number, boolean[]>>({});

  const toggleExpand = (day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  const handleDayClick = (item: DayItinerary) => {
    if (item.isRepair) {
      setModalItem(item);
      setRepairModalOpen(true);
      if (!repairChecklist[item.day]) {
        setRepairChecklist((prev) => ({
          ...prev,
          [item.day]: REPAIR_SOP_ITEMS.map(() => false),
        }));
      }
    } else if (item.isMajor) {
      setModalItem(item);
      setComplianceModalOpen(true);
      if (!complianceChecklist[item.day]) {
        setComplianceChecklist((prev) => ({
          ...prev,
          [item.day]: COMPLIANCE_ITEMS.map(() => false),
        }));
      }
    } else {
      toggleExpand(item.day);
    }
  };

  const toggleComplianceCheck = (day: number, index: number) => {
    setComplianceChecklist((prev) => {
      const arr = prev[day] ?? COMPLIANCE_ITEMS.map(() => false);
      const next = [...arr];
      next[index] = !next[index];
      return { ...prev, [day]: next };
    });
  };

  const toggleRepairCheck = (day: number, index: number) => {
    setRepairChecklist((prev) => {
      const arr = prev[day] ?? REPAIR_SOP_ITEMS.map(() => false);
      const next = [...arr];
      next[index] = !next[index];
      return { ...prev, [day]: next };
    });
  };

  return (
    <>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-800 mb-4">每日行程</h2>
        {items.map((item) => {
          const isMajor = item.isMajor;
          const isRepair = item.isRepair;
          const isClickable = isMajor || isRepair;
          const isExpanded = isClickable || expandedDay === item.day;

          return (
            <div
              key={item.day}
              className={`rounded-xl border overflow-hidden transition-all ${
                isClickable
                  ? "border-amber-300 bg-white cursor-pointer hover:border-amber-400 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => handleDayClick(item)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left sm:p-5"
              >
                <div className="flex gap-4 min-w-0">
                  <div className="text-center shrink-0 w-12">
                    <span className="block text-xs text-slate-500 font-bold">Day</span>
                    <span
                      className={`text-xl font-black ${
                        isClickable ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                      {item.date} {item.start} → {item.end}
                      {isRepair && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold">
                          案家修繕
                        </span>
                      )}
                      {isMajor && !isRepair && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold">
                          重點
                        </span>
                      )}
                      {item.isLongest && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold">
                          🚩 最長挑戰路段
                        </span>
                      )}
                      {item.isCEO && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium">
                          <Crown size={12} /> 旗艦
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                      <MapPin size={14} className="shrink-0" /> {item.hotel}
                      <span className="text-slate-400">|</span>
                      <Bike size={14} className="shrink-0 text-amber-500" /> {item.km} km
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`shrink-0 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>

              {!isClickable && isExpanded && (
                <div className="border-t border-slate-200 px-4 pb-4 pt-2 sm:px-5">
                  <p className="text-sm text-slate-600">{item.task}</p>
                  <p className="mt-2 text-xs text-slate-500">住宿：{item.hotel}</p>
                </div>
              )}

              {isRepair && (
                <div className="border-t border-slate-200 px-4 pb-4 pt-2 sm:px-5">
                  <p className="text-sm text-slate-600">{item.task}</p>
                  <p className="mt-2 text-xs text-amber-600">
                    點擊查看「好用標準檢核表」
                  </p>
                </div>
              )}

              {isMajor && !isRepair && (
                <div className="border-t border-slate-200 px-4 pb-4 pt-2 sm:px-5">
                  <p className="text-sm text-slate-600">{item.task}</p>
                  <p className="mt-2 text-xs text-amber-600">
                    點擊查看「1919 微光執行規範」
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <ComplianceModal
        item={modalItem}
        open={complianceModalOpen}
        onClose={() => {
          setComplianceModalOpen(false);
          setModalItem(null);
        }}
        checklist={
          modalItem
            ? (complianceChecklist[modalItem.day] ?? COMPLIANCE_ITEMS.map(() => false))
            : []
        }
        onToggle={(i) => modalItem && toggleComplianceCheck(modalItem.day, i)}
      />

      <RepairSOPModal
        item={modalItem}
        open={repairModalOpen}
        onClose={() => {
          setRepairModalOpen(false);
          setModalItem(null);
        }}
        checklist={
          modalItem
            ? (repairChecklist[modalItem.day] ?? REPAIR_SOP_ITEMS.map(() => false))
            : []
        }
        onToggle={(i) => modalItem && toggleRepairCheck(modalItem.day, i)}
      />
    </>
  );
}
