"use client";

import ItineraryDaySwitcher from "@/components/ItineraryDaySwitcher";
import HomeButton from "@/components/HomeButton";

export default function BoardSection() {
  return (
    <section id="board" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">行程資訊</h2>
        <HomeButton />
      </div>
      <ItineraryDaySwitcher />
    </section>
  );
}
