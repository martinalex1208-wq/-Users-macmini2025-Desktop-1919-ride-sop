"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Bike,
  ChevronRight,
  ClipboardCheck,
  Trophy,
  X,
} from "lucide-react";

const schedule = [
  { day: 1, date: "12/19", start: "台北", end: "新竹", hotel: "喜來登", km: 91, task: "啟行儀式、新莊幸福長老教會", isHighlight: false, isLongest: false },
  { day: 2, date: "12/20", start: "桃園", end: "苗栗", hotel: "西湖渡覺村", km: 105, task: "太平洋自行車博物館", isHighlight: false, isLongest: false },
  { day: 3, date: "12/21", start: "苗栗", end: "台中", hotel: "麗寶T11T12", km: 78.3, task: "舊山線鐵道自行車", isHighlight: false, isLongest: false },
  { day: 4, date: "12/22", start: "台中", end: "嘉義", hotel: "嘉義新悅酒店", km: 106.6, task: "線西靈糧之家", isHighlight: false, isLongest: false },
  { day: 5, date: "12/23", start: "嘉義", end: "雲林", hotel: "三好大酒店", km: 86, task: "嘉基惜食處理中心/小腳腿教會", isHighlight: false, isLongest: false },
  { day: 6, date: "12/24", start: "雲林", end: "台南", hotel: "大員皇冠", km: 32, task: "案家修繕專案", isHighlight: true, isLongest: false },
  { day: 7, date: "12/25", start: "台南", end: "屏東", hotel: "屏東鮪魚飯店", km: 85.5, task: "蚵寮教會 (食物包發放)", isHighlight: true, isLongest: false },
  { day: 8, date: "12/26", start: "屏東", end: "墾丁", hotel: "墾丁H會館", km: 98.4, task: "沿山長老教會", isHighlight: false, isLongest: false },
  { day: 9, date: "12/27", start: "墾丁", end: "知本", hotel: "知本老爺酒店", km: 94.4, task: "全家獅子金流店/森永教會", isHighlight: false, isLongest: false },
  { day: 10, date: "12/28", start: "知本", end: "鹿野", hotel: "鹿鳴溫泉酒店", km: 30.5, task: "台東循理會 (案家修繕)", isHighlight: true, isLongest: false },
  { day: 11, date: "12/29", start: "鹿野", end: "光復", hotel: "光復糖廠日式木屋", km: 110.2, task: "大波池長征", isHighlight: false, isLongest: true },
  { day: 12, date: "12/30", start: "光復", end: "新城", hotel: "煙波太魯閣沁海館", km: 80.3, task: "太巴塱(愛佳培黑水虻)/壽豐長老教會", isHighlight: false, isLongest: false },
  { day: 13, date: "12/31", start: "新城", end: "蘇澳", hotel: "蘇澳煙波飯店", km: 82.1, task: "和平車站/跨年團聚", isHighlight: false, isLongest: false },
  { day: 14, date: "01/01", start: "蘇澳", end: "礁溪", hotel: "長榮鳳凰酒店", km: 59.8, task: "寒溪長老教會 (原住民活動體驗)", isHighlight: true, isLongest: false },
  { day: 15, date: "01/02", start: "礁溪", end: "台北", hotel: "回家", km: 72, task: "完騎凱旋", isHighlight: false, isLongest: false },
];

const SOP_CHECKLIST = [
  "低調服務：不喧嘩、不穿著過於招搖的裝備進入案家。",
  "尊重隱私：未經允許不對受助者拍照，不打擾其作息。",
  "同理心溝通：先聽故事，再給予物資，保持平等對話。",
  "安全確認：修繕工具清點、隊員進場動線確認。",
];

const totalKm = schedule.reduce((sum, item) => sum + item.km, 0);
const highlightCount = schedule.filter((item) => item.isHighlight).length;

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<typeof schedule[0] | null>(null);
  const [checklist, setChecklist] = useState<Record<number, boolean[]>>({});

  const openModal = (item: typeof schedule[0]) => {
    setModalItem(item);
    setModalOpen(true);
    if (!checklist[item.day]) {
      setChecklist((prev) => ({ ...prev, [item.day]: SOP_CHECKLIST.map(() => false) }));
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalItem(null);
  };

  const toggleCheck = (day: number, index: number) => {
    setChecklist((prev) => {
      const arr = prev[day] || SOP_CHECKLIST.map(() => false);
      const next = [...arr];
      next[index] = !next[index];
      return { ...prev, [day]: next };
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Header - 深色導航保持視覺重心 */}
      <header className="bg-slate-800 border-b border-slate-700/50 p-4 sm:p-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              1919 愛走動：環島 SOP 系統
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              2026.12.19 - 2027.01.02 | 1300KM 募款長征
            </p>
          </div>
          <div className="bg-orange-500 px-4 py-2 rounded-full text-xs font-bold animate-pulse text-white shrink-0">
            隊長版 (Steve)
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Quick Stats - 白底、細邊框、微弱陰影，自動計算 */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs">總天數</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{schedule.length} Days</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs">總里程</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">~{Math.round(totalKm)} km</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs">重點服務</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{highlightCount} 次</p>
          </div>
        </div>

        {/* Schedule Timeline */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <Calendar size={20} className="text-orange-500 shrink-0" />
            關鍵行程 SOP 看板
          </h2>
          <div className="space-y-4">
            {schedule.map((item) => (
              <div
                key={item.day}
                onClick={() => item.isHighlight && openModal(item)}
                role={item.isHighlight ? "button" : undefined}
                tabIndex={item.isHighlight ? 0 : undefined}
                onKeyDown={(e) => item.isHighlight && (e.key === "Enter" || e.key === " ") && openModal(item)}
                className={`p-4 rounded-2xl border-l-4 transition-all bg-white border border-slate-200 shadow-sm hover:shadow-md ${
                  item.isHighlight ? "border-l-orange-500 cursor-pointer" : "border-l-slate-300"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-3 sm:gap-4 min-w-0">
                    <div className="text-center min-w-[44px] sm:min-w-[50px] shrink-0">
                      <span className="block text-xs text-slate-500 font-bold uppercase">
                        Day
                      </span>
                      <span className={`text-xl font-black ${item.isHighlight ? "text-orange-600" : "text-slate-800"}`}>
                        {item.day}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                        {item.date} {item.start} → {item.end}
                        {item.isHighlight && (
                          <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shrink-0">
                            SOP 指引
                          </span>
                        )}
                        {item.isLongest && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold shrink-0">
                            <Trophy size={12} /> 最長挑戰路段
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 flex items-center gap-1 font-medium flex-wrap">
                        <MapPin size={14} className="text-slate-500 shrink-0" /> {item.hotel} |{" "}
                        <Bike size={14} className="text-orange-500 shrink-0" /> {item.km}km
                      </p>
                    </div>
                  </div>
                  {item.isHighlight && <ChevronRight className="text-orange-500 shrink-0" />}
                  {!item.isHighlight && <ChevronRight className="text-slate-400 shrink-0" />}
                </div>

                {/* SOP 提示區塊 - 極淺橘底、橘色虛線邊框 */}
                <div className="mt-3 p-3 rounded-lg border border-dashed bg-orange-50 border-orange-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
                    <ClipboardCheck size={14} className="text-orange-500 shrink-0" /> 當日 SOP 執行重點：
                  </div>
                  <p className={`text-xs leading-relaxed ${item.isHighlight ? "text-slate-700 font-medium" : "text-slate-600"}`}>
                    {item.task}
                    {item.isHighlight &&
                      " — 點擊卡片查看「1919 微光執行規範」檢查清單。"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* SOP Modal - 點擊 [重點] 卡片彈出 */}
          {modalOpen && modalItem && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">1919 微光執行規範</h3>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label="關閉"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-600">
                    Day {modalItem.day} {modalItem.date} {modalItem.task}
                  </p>
                  <div className="space-y-3">
                    {SOP_CHECKLIST.map((text, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={(checklist[modalItem.day] || [])[i] || false}
                          onChange={() => toggleCheck(modalItem.day, i)}
                          className="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-800">
                          {text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Footer Note */}
        <div className="text-center py-10 text-slate-500 text-xs">
          Beyond AI Lab © 2026 · 1919 愛走動
        </div>
      </main>
    </div>
  );
}
