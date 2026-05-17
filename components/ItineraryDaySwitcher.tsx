"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, TrendingUp, Building2, Phone, Bike, Car } from "lucide-react";
import { FULL_ROUTE_DATA, type FullRouteItem } from "@/lib/fullRouteData";
import { useDaySelection } from "@/contexts/DaySelectionContext";

type TransportMode = "cycling" | "driving";

export default function ItineraryDaySwitcher() {
  const { selectedDay, setSelectedDay } = useDaySelection();
  const [transportMode, setTransportMode] = useState<TransportMode>("cycling");
  const scrollRef = useRef<HTMLDivElement>(null);
  const current = FULL_ROUTE_DATA.find((d) => d.id === selectedDay) ?? FULL_ROUTE_DATA[0];

  // 選中天數時，將該按鈕捲動至可見區域
  useEffect(() => {
    if (!scrollRef.current) return;
    const btn = scrollRef.current.querySelector(`[data-day="${selectedDay}"]`);
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedDay]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* 天數導覽列 - 可橫向捲動 */}
      <nav
        ref={scrollRef}
        className="flex overflow-x-auto overscroll-x-contain border-b border-slate-200 bg-slate-50/80 scroll-smooth"
        aria-label="行程天數"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {FULL_ROUTE_DATA.map((d) => (
          <button
            key={d.id}
            data-day={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`shrink-0 px-4 py-4 text-center text-sm font-semibold transition-all min-w-[4.25rem] sm:min-w-[4.5rem] ${
              selectedDay === d.id
                ? "border-b-2 border-slate-800 bg-white text-slate-800"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            Day {d.id}
          </button>
        ))}
      </nav>

      {/* 單車 / 汽車 模式切換 */}
      <div className="flex gap-2 border-b border-slate-200 px-4 py-3 sm:px-6">
        <button
          onClick={() => setTransportMode("cycling")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${
            transportMode === "cycling"
              ? "border-slate-700 bg-slate-100 text-slate-800"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          <Bike size={18} />
          單車
        </button>
        <button
          onClick={() => setTransportMode("driving")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${
            transportMode === "driving"
              ? "border-slate-700 bg-slate-100 text-slate-800"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          <Car size={18} />
          汽車
        </button>
      </div>

      {/* 內容區塊 - 點擊天數後同步更新 */}
      <div className="p-6 sm:p-8">
        <DayContent data={current} showElevation={transportMode === "cycling"} />
      </div>
    </div>
  );
}

function DayContent({ data, showElevation }: { data: FullRouteItem; showElevation: boolean }) {
  return (
    <div key={data.id} className="animate-fade-in">
      {/* 路線 */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Route
        </p>
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          <span className="text-lg font-medium text-slate-800">{data.from}</span>
        </div>
        <div className="my-2 ml-1.5 h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-lg font-bold text-slate-900">{data.to}</span>
        </div>
      </div>

      {/* 里程與爬升 - 單車模式顯示 elevation */}
      <div className="mb-6 flex gap-4 sm:gap-6">
        <StatBox
          icon={<MapPin size={18} className="text-slate-500" />}
          value={data.distance}
          unit="km"
          label="里程"
        />
        {showElevation && (
          <StatBox
            icon={<TrendingUp size={18} className="text-slate-500" />}
            value={data.elevation}
            unit="m"
            label="爬升"
          />
        )}
      </div>

      {/* 住宿 - 電話可點擊撥打 */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Building2 size={14} />
          Accommodation
        </p>
        <p className="text-lg font-bold text-slate-800">{data.hotel.name}</p>
        {data.hotel.phone ? (
          <a
            href={`tel:${data.hotel.phone}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-slate-700 active:bg-slate-600 touch-manipulation"
          >
            <Phone size={18} />
            {data.hotel.phone}
          </a>
        ) : (
          <span className="mt-3 inline-block text-slate-500">完騎凱旋</span>
        )}
      </div>
    </div>
  );
}

function StatBox({
  icon,
  value,
  unit,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
          {value}
          <span className="ml-1 text-sm font-medium text-slate-500">{unit}</span>
        </p>
        <p className="text-xs font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}
