/**
 * 2026 1919 愛走動 單車環台 - 行程數據模型
 * 總里程 1,300 公里 | 15 天
 */

export interface DayItinerary {
  day: number;
  date: string;
  start: string;
  end: string;
  hotel: string;
  km: number;
  task: string;
  /** 重點天數：點擊時啟動 ComplianceModal */
  isMajor: boolean;
  /** 案家修繕日：點擊時啟動 RepairSOPModal (12/24、12/28) */
  isRepair?: boolean;
  /** 最長挑戰路段標記 (D11) */
  isLongest?: boolean;
  /** 一日總裁旗艦企劃標記 */
  isCEO?: boolean;
}

export const ITINERARY: DayItinerary[] = [
  { day: 1, date: "12/19", start: "台北", end: "新竹", hotel: "喜來登", km: 91, task: "啟行儀式、新莊幸福長老教會", isMajor: false, isCEO: true },
  { day: 2, date: "12/20", start: "桃園", end: "苗栗", hotel: "西湖渡覺村", km: 105, task: "太平洋自行車博物館", isMajor: false },
  { day: 3, date: "12/21", start: "苗栗", end: "台中", hotel: "麗寶T11T12", km: 78.3, task: "舊山線鐵道自行車", isMajor: false },
  { day: 4, date: "12/22", start: "台中", end: "嘉義", hotel: "嘉義新悅酒店", km: 106.6, task: "線西靈糧之家", isMajor: false },
  { day: 5, date: "12/23", start: "嘉義", end: "雲林", hotel: "三好大酒店", km: 86, task: "嘉基惜食處理中心/小腳腿教會", isMajor: false },
  { day: 6, date: "12/24", start: "雲林", end: "台南", hotel: "大員皇冠", km: 32, task: "案家修繕專案", isMajor: true, isRepair: true, isCEO: true },
  { day: 7, date: "12/25", start: "台南", end: "屏東", hotel: "屏東鮪魚飯店", km: 85.5, task: "蚵寮教會 (食物包發放)", isMajor: true, isCEO: true },
  { day: 8, date: "12/26", start: "屏東", end: "墾丁", hotel: "墾丁H會館", km: 98.4, task: "沿山長老教會", isMajor: false },
  { day: 9, date: "12/27", start: "墾丁", end: "知本", hotel: "知本老爺酒店", km: 94.4, task: "全家獅子金流店/森永教會", isMajor: false },
  { day: 10, date: "12/28", start: "知本", end: "鹿野", hotel: "鹿鳴溫泉酒店", km: 30.5, task: "台東循理會 (案家修繕)", isMajor: true, isRepair: true, isCEO: true },
  { day: 11, date: "12/29", start: "鹿野", end: "光復", hotel: "光復糖廠日式木屋", km: 110.2, task: "大波池長征", isMajor: false, isLongest: true },
  { day: 12, date: "12/30", start: "光復", end: "新城", hotel: "煙波太魯閣沁海館", km: 80.3, task: "太巴塱(愛佳培黑水虻)/壽豐長老教會", isMajor: false },
  { day: 13, date: "12/31", start: "新城", end: "蘇澳", hotel: "蘇澳煙波飯店", km: 82.1, task: "和平車站/跨年團聚", isMajor: false },
  { day: 14, date: "01/01", start: "蘇澳", end: "礁溪", hotel: "長榮鳳凰酒店", km: 59.8, task: "寒溪長老教會 (原住民活動體驗)", isMajor: true, isCEO: true },
  { day: 15, date: "01/02", start: "礁溪", end: "台北", hotel: "回家", km: 72, task: "完騎凱旋", isMajor: false, isCEO: true },
];

/** 募款目標 NT$40,000,000 */
export const FUNDRAISING_GOAL = 40_000_000;

/** 總里程 1,300 公里 */
export const TOTAL_KM = 1300;

/** 1919 微光執行規範 - Compliance Modal 檢查項目 */
export const COMPLIANCE_ITEMS = [
  "低調服務",
  "尊重隱私",
  "同理心溝通",
  "安全確認",
] as const;

/** 案家修繕好用標準 - Repair SOP Modal (12/24、12/28) */
export const REPAIR_SOP_ITEMS = [
  { label: "用力剛剛好", desc: "老人小孩皆能輕鬆操作" },
  { label: "結構穩定", desc: "維修後不晃動、不鬆脫" },
  { label: "直覺維護", desc: "不需說明書即可自行處理" },
  { label: "良心問答", desc: "如果是我爸媽住這裡，我會放心嗎？" },
] as const;
