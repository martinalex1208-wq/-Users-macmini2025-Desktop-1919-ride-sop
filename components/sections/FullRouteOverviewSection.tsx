"use client";

import { MapPin, Phone } from "lucide-react";
import { FULL_ROUTE_DATA, TOTAL_KM, TOTAL_DAYS } from "@/lib/fullRouteData";
import { useDaySelection } from "@/contexts/DaySelectionContext";

export default function FullRouteOverviewSection() {
  const { setSelectedDay } = useDaySelection();

  const handleDayClick = (dayId: number) => {
    setSelectedDay(dayId);
    document.getElementById("board")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="full-route"
      className="scroll-mt-24 overflow-hidden rounded-2xl"
    >
      {/* 航空資訊看板風格 */}
      <div className="bg-[#0f172a] text-white">
        {/* 頂部總計 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <MapPin size={24} className="text-sky-400" />
            全程概覽
          </h2>
          <div className="flex items-center gap-6 text-lg font-bold">
            <span>{TOTAL_KM.toLocaleString("zh-TW", { minimumFractionDigits: 1 })} km</span>
            <span className="text-white/50">|</span>
            <span>{TOTAL_DAYS} Days</span>
          </div>
        </div>

        {/* 縱向時間軸 */}
        <div className="px-6 py-6 sm:px-8">
          <div className="relative">
            {/* 垂直線 */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px bg-white/20 sm:left-5"
              aria-hidden
            />
            <ul className="space-y-0">
              {FULL_ROUTE_DATA.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => handleDayClick(d.id)}
                    className="group relative flex w-full gap-4 py-4 text-left transition-colors hover:bg-white/5"
                  >
                    {/* 圓點 */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 sm:h-9 sm:w-9 ${
                        d.isChallenge
                          ? "border-amber-400 bg-amber-500/20"
                          : "border-sky-400/60 bg-slate-800"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold sm:text-sm ${
                          d.isChallenge ? "text-amber-400" : "text-sky-200"
                        }`}
                      >
                        {d.id}
                      </span>
                    </div>

                    {/* 內容：Day [X] | 起點 ➔ 終點 | 飯店簡稱 */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">
                          Day {d.id} | {d.from} ➔ {d.to}
                        </span>
                        {d.isChallenge && (
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                            🚩 {d.distance} km
                          </span>
                        )}
                        {!d.isChallenge && (
                          <span className="text-sm text-white/60">{d.distance} km</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-sky-200">
                        {d.hotel.name}
                        {d.hotel.phone && (
                          <a
                            href={`tel:${d.hotel.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="ml-2 inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"
                          >
                            <Phone size={12} />
                            {d.hotel.phone}
                          </a>
                        )}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
