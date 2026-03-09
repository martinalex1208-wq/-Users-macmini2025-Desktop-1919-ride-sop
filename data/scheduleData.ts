export interface ScheduleItem {
  day: number;
  date: string;
  start: string;
  end: string;
  hotel: string;
  km: number;
  activity: string;
  isService?: boolean;
}

export const scheduleData: ScheduleItem[] = [
  { day: 1, date: "12/19", start: "台北", end: "桃園/新竹", hotel: "新竹豐邑喜來登", km: 91, activity: "啟行儀式" },
  { day: 2, date: "12/20", start: "新竹", end: "苗栗", hotel: "苗栗兆品酒店", km: 58, activity: "騎行日" },
  { day: 3, date: "12/21", start: "苗栗", end: "台中", hotel: "台中福華飯店", km: 72, activity: "騎行日" },
  { day: 4, date: "12/22", start: "台中", end: "彰化", hotel: "彰化全台大飯店", km: 45, activity: "騎行日" },
  { day: 5, date: "12/23", start: "彰化", end: "雲林", hotel: "雲林三好國際酒店", km: 52, activity: "騎行日" },
  { day: 6, date: "12/24", start: "雲林", end: "台南", hotel: "大員皇冠假日酒店", km: 32, activity: "案家修繕", isService: true },
  { day: 7, date: "12/25", start: "台南", end: "屏東", hotel: "屏東鮪魚飯店", km: 85.5, activity: "食物包發放", isService: true },
  { day: 8, date: "12/26", start: "屏東", end: "枋寮", hotel: "枋寮F Hotel", km: 48, activity: "騎行日" },
  { day: 9, date: "12/27", start: "枋寮", end: "台東", hotel: "台東娜路彎大酒店", km: 95, activity: "騎行日" },
  { day: 10, date: "12/28", start: "台東", end: "鹿野", hotel: "鹿野鹿鳴溫泉酒店", km: 38, activity: "騎行日" },
  { day: 11, date: "12/29", start: "鹿野", end: "光復", hotel: "光復糖廠日式木屋", km: 110.2, activity: "高強度挑戰" },
  { day: 12, date: "12/30", start: "光復", end: "新城", hotel: "新城七星潭渡假飯店", km: 88, activity: "騎行日" },
  { day: 13, date: "12/31", start: "新城", end: "蘇澳", hotel: "蘇澳煙波飯店", km: 82.1, activity: "跨年晚會" },
  { day: 14, date: "1/1", start: "蘇澳", end: "台北", hotel: "—", km: 120, activity: "凱旋歸來" },
];
