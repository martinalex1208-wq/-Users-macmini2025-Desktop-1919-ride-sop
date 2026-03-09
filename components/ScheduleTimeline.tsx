"use client";

import { useState } from "react";
import { scheduleData } from "@/data/scheduleData";
import { getSopForDay } from "@/data/sopChecklist";
import SopModal from "./SopModal";

export default function ScheduleTimeline() {
  const [selectedDay, setSelectedDay] = useState<typeof scheduleData[0] | null>(null);

  const isHighlightDay = (date: string) =>
    date === "12/24" || date === "12/25";

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-lab-text-primary sm:text-2xl">
            行程看板
          </h1>
          <p className="mt-1 text-sm text-lab-text-muted">
            點擊任一天查看當日 SOP 檢查清單
          </p>
        </div>

        <div className="relative">
          {/* 時間軸主線 */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px bg-lab-border sm:left-6"
            aria-hidden="true"
          />

          <ul className="space-y-4 sm:space-y-5">
            {scheduleData.map((item, idx) => {
              const isHighlight = isHighlightDay(item.date);
              return (
                <li key={item.day} className="relative flex gap-4 sm:gap-6">
                  {/* 時間軸節點 */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 ${
                      isHighlight
                        ? "border-lab-danger bg-lab-danger/20"
                        : "border-lab-accent/60 bg-lab-elevated"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold sm:text-sm ${
                        isHighlight ? "text-lab-danger" : "text-lab-accent"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>

                  {/* 卡片內容 */}
                  <button
                    onClick={() => setSelectedDay(item)}
                    className={`group flex-1 rounded-xl border p-4 text-left transition-all hover:border-lab-accent/50 hover:shadow-btn-hover sm:p-5 ${
                      isHighlight
                        ? "border-lab-danger/50 bg-lab-danger/5"
                        : "border-lab-border bg-lab-elevated"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-lab-text-muted">
                        {item.date}
                      </span>
                      {isHighlight && (
                        <span className="rounded-full bg-lab-danger/30 px-2 py-0.5 text-xs font-medium text-lab-danger">
                          {item.date === "12/24" ? "修繕日" : "食物包日"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-medium text-lab-text-primary">
                      {item.start} → {item.end}
                    </p>
                    <p className="mt-0.5 text-sm text-lab-accent">
                      {item.activity}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-lab-text-muted">
                      <span>{item.km} km</span>
                      <span>{item.hotel}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {selectedDay && (
        <SopModal
          isOpen={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          day={selectedDay.day}
          date={selectedDay.date}
          activity={selectedDay.activity}
          items={getSopForDay(
            selectedDay.day,
            selectedDay.activity,
            selectedDay.isService
          )}
        />
      )}
    </>
  );
}
