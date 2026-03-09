import Navbar from "@/components/Navbar";
import PageNav from "@/components/PageNav";
import BoardSection from "@/components/sections/BoardSection";
import VisionSection from "@/components/sections/VisionSection";
import CEOSection from "@/components/sections/CEOSection";
import TeamDisciplineSection from "@/components/sections/TeamDisciplineSection";
import SafetyRideSection from "@/components/sections/SafetyRideSection";
import TLZoneSection from "@/components/sections/TLZoneSection";
import EquipmentChecklistSection from "@/components/sections/EquipmentChecklistSection";
import WarriorStoriesSection from "@/components/sections/WarriorStoriesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-6 lg:py-12">
        {/* 導覽列：桌面左側 / 手機頂部 */}
        <aside className="shrink-0 lg:w-56">
          <div className="lg:sticky lg:top-20">
            <PageNav />
          </div>
        </aside>

        {/* 主內容區 */}
        <main className="min-w-0 flex-1 space-y-12">
          <VisionSection />
          <BoardSection />
          <CEOSection />
          <TeamDisciplineSection />
          <SafetyRideSection />
          <TLZoneSection />
          <EquipmentChecklistSection />
          <WarriorStoriesSection />

          <footer className="border-t border-slate-200 pt-12 text-center text-sm text-slate-500">
            Beyond AI Lab © 2026 · 1919 愛走動
          </footer>
        </main>
      </div>
    </div>
  );
}
