/**
 * 多天數行程資料 - 純粹行程資訊 (Day 1 - Day 10)
 */

export interface DayData {
  day: number;
  from: string;
  to: string;
  distance_km: number;
  elevation_m: number;
  hotel: {
    name: string;
    phone: string;
  };
}

export const ITINERARY_DAYS: DayData[] = [
  {
    day: 1,
    from: "台北",
    to: "新竹",
    distance_km: 88.5,
    elevation_m: 350,
    hotel: { name: "新竹國賓大飯店", phone: "03-515-1111" },
  },
  {
    day: 2,
    from: "新竹",
    to: "台中",
    distance_km: 95.0,
    elevation_m: 450,
    hotel: { name: "台中福華大飯店", phone: "04-2323-2323" },
  },
  {
    day: 3,
    from: "苗栗",
    to: "台中",
    distance_km: 78.3,
    elevation_m: 320,
    hotel: { name: "麗寶T11T12", phone: "04-2369-6888" },
  },
  {
    day: 4,
    from: "台中",
    to: "嘉義",
    distance_km: 106.6,
    elevation_m: 280,
    hotel: { name: "嘉義新悅酒店", phone: "05-277-8666" },
  },
  {
    day: 5,
    from: "嘉義",
    to: "雲林",
    distance_km: 86,
    elevation_m: 180,
    hotel: { name: "三好大酒店", phone: "05-551-0999" },
  },
  {
    day: 6,
    from: "雲林",
    to: "台南",
    distance_km: 32,
    elevation_m: 90,
    hotel: { name: "大員皇冠", phone: "06-391-1899" },
  },
  {
    day: 7,
    from: "台南",
    to: "屏東",
    distance_km: 85.5,
    elevation_m: 220,
    hotel: { name: "屏東鮪魚飯店", phone: "08-732-2352" },
  },
  {
    day: 8,
    from: "屏東",
    to: "墾丁",
    distance_km: 98.4,
    elevation_m: 380,
    hotel: { name: "墾丁H會館", phone: "08-877-1888" },
  },
  {
    day: 9,
    from: "墾丁",
    to: "知本",
    distance_km: 94.4,
    elevation_m: 520,
    hotel: { name: "知本老爺酒店", phone: "08-951-0666" },
  },
  {
    day: 10,
    from: "知本",
    to: "鹿野",
    distance_km: 30.5,
    elevation_m: 150,
    hotel: { name: "鹿鳴溫泉酒店", phone: "08-955-0888" },
  },
];
