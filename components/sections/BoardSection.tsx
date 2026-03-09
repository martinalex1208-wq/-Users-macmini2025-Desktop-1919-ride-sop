"use client";

import HeroSection from "@/components/HeroSection";
import ItineraryList from "@/components/ItineraryList";
import CodeOfConduct from "@/components/CodeOfConduct";
import HomeButton from "@/components/HomeButton";
import { ITINERARY } from "@/lib/itinerary";

export default function BoardSection() {
  return (
    <section id="board" className="scroll-mt-24 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">環台行程表</h2>
        <HomeButton />
      </div>
      <HeroSection />
      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <ItineraryList items={ITINERARY} />
        <aside className="lg:order-first">
          <div className="lg:sticky lg:top-24">
            <CodeOfConduct />
          </div>
        </aside>
      </div>
    </section>
  );
}
