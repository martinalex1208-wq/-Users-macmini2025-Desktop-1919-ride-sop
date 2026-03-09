import Navbar from "@/components/Navbar";
import Link from "next/link";
import HomeLinkButton from "@/components/HomeLinkButton";
import {
  ArrowLeft,
  Wrench,
  Gift,
  Bike,
  Heart,
  CheckCircle2,
} from "lucide-react";

const SECTIONS = [
  {
    id: "repair",
    icon: Wrench,
    title: "修繕物資庫",
    subtitle: "Repair Toolkit · 針對 D6、D10 案家修繕專案的核心儲備",
    items: [
      {
        label: "電動工具",
        desc: "電鑽、切割機、備用電池、延長線（確認電壓與接頭）。",
      },
      {
        label: "五金耗材",
        desc: "各規格螺絲、矽利康、門窗轉軸、水龍頭零件、快乾膠。",
      },
      {
        label: "清潔維護",
        desc: "除鏽劑、潤滑油、修繕後的環境清理工具。",
      },
      {
        label: "備品盤點",
        desc: "標註「安全清點 SOP」，確保修繕完成後工具不遺留在案家，維護案家安全。",
      },
    ],
  },
  {
    id: "donation",
    icon: Gift,
    title: "慈善物資",
    subtitle: "Donation Goods · 針對教會拜訪與送暖任務",
    items: [
      {
        label: "1919 食物包",
        desc: "每日出發前確認數量（米、罐頭、食油等標配）。",
      },
      {
        label: "微光禮物／獎助金",
        desc: "針對孩子的特別獎勵或慰問金，需建立嚴格的「發放記錄表」。",
      },
      {
        label: "文宣品",
        desc: "1919 愛走動手冊、捐款單、感謝狀。",
      },
    ],
  },
  {
    id: "cycling",
    icon: Bike,
    title: "車隊後勤備品",
    subtitle: "Cycling Logistics · 針對 1,300 公里騎行的物理消耗",
    items: [
      {
        label: "單車備件",
        desc: "內胎（各尺寸）、外胎、鏈條油、煞車皮、打氣筒。",
      },
      {
        label: "胎壓檢核",
        desc: "專屬欄位標註「90psi 檢核標準」。",
      },
      {
        label: "電輔車專區",
        desc: "備用電池管理、充電座分配清單。",
      },
    ],
  },
  {
    id: "warrior",
    icon: Heart,
    title: "勇士個人與醫療物資",
    subtitle: "Warrior Support",
    items: [
      {
        label: "醫療包",
        desc: "急救箱、肌肉舒緩噴霧、蛋白飲、電解質補給品、防曬／雨具。",
      },
      {
        label: "限定備品",
        desc: "1919 專屬車衣、毛巾、CEO 企劃專屬的高規備品（如特定品牌蛋白飲）。",
      },
    ],
  },
];

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-amber-600"
        >
          <ArrowLeft size={16} />
          返回首頁
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                物資管理系統
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                修繕五金、慈善物資、後勤備品庫存管理
              </p>
            </div>
            <HomeLinkButton />
          </div>

          <div className="mt-8 space-y-8">
            {SECTIONS.map(({ id, icon: Icon, title, subtitle, items }) => (
              <section
                key={id}
                id={id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5"
              >
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                  <Icon className="text-amber-500" size={20} />
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                <ul className="mt-4 space-y-3">
                  {items.map(({ label, desc }) => (
                    <li
                      key={label}
                      className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-amber-500"
                        size={18}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
