export interface SopItem {
  id: string;
  text: string;
  category: "隱私" | "工具" | "訪視" | "物資" | "安全" | "一般";
}

// 通用騎行日 SOP
export const generalRideSop: SopItem[] = [
  { id: "g1", text: "確認當日路線與天氣預報", category: "一般" },
  { id: "g2", text: "檢查單車胎壓、煞車、燈具", category: "安全" },
  { id: "g3", text: "備妥補給品與急救包", category: "物資" },
  { id: "g4", text: "確認住宿訂房與入住時間", category: "一般" },
  { id: "g5", text: "團隊集合時間與出發點確認", category: "一般" },
];

// 案家修繕日 SOP (12/24)
export const repairDaySop: SopItem[] = [
  { id: "r1", text: "確認案家隱私，不拍照、不錄影、不對外透露地址", category: "隱私" },
  { id: "r2", text: "備齊修繕工具與耗材清單", category: "工具" },
  { id: "r3", text: "低調訪視，穿著便服、避免張揚", category: "訪視" },
  { id: "r4", text: "與案家約定到訪時間，尊重作息", category: "訪視" },
  { id: "r5", text: "完工後整理環境、帶走廢料", category: "一般" },
  { id: "r6", text: "填寫修繕紀錄表，拍照存檔（僅限室內局部）", category: "一般" },
];

// 食物包發放日 SOP (12/25)
export const foodPackSop: SopItem[] = [
  { id: "f1", text: "確認案家隱私，不公開個資與住址", category: "隱私" },
  { id: "f2", text: "備齊食物包數量與品項清單", category: "物資" },
  { id: "f3", text: "低調訪視，避免鄰里側目", category: "訪視" },
  { id: "f4", text: "確認案家在家、可收受物資", category: "訪視" },
  { id: "f5", text: "物資輕放、不造成案家負擔", category: "訪視" },
  { id: "f6", text: "簡短關懷、不逾時打擾", category: "訪視" },
];

// 啟行儀式日 SOP
export const kickoffSop: SopItem[] = [
  { id: "k1", text: "確認啟行儀式流程與時間", category: "一般" },
  { id: "k2", text: "檢查全隊裝備與物資", category: "物資" },
  { id: "k3", text: "媒體採訪注意事項宣達", category: "一般" },
  ...generalRideSop,
];

// 高強度挑戰日 SOP
export const challengeSop: SopItem[] = [
  { id: "c1", text: "提早休息、充足睡眠", category: "安全" },
  { id: "c2", text: "加強補給與水分攝取", category: "物資" },
  { id: "c3", text: "確認支援車與救援聯絡方式", category: "安全" },
];

export function getSopForDay(day: number, activity: string, isService?: boolean): SopItem[] {
  if (isService && activity.includes("修繕")) return repairDaySop;
  if (isService && activity.includes("食物包")) return foodPackSop;
  if (activity.includes("啟行")) return kickoffSop;
  if (activity.includes("高強度")) return challengeSop;
  return generalRideSop;
}
