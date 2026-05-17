/**
 * Global Route Master - 旅遊模式基礎參數設定
 */

/** 旅遊模式類型 */
export const TRAVEL_MODES = {
  GENERAL: 'general',      // 通用旅遊
  CYCLING: 'cycling',      // 單車環島
  DRIVING: 'driving',      // 駕駛
  MOTORCYCLE: 'motorcycle', // 機車
};

/** 通用旅遊 - 基礎參數 */
export const GENERAL_TRAVEL_CONFIG = {
  id: TRAVEL_MODES.GENERAL,
  name: '通用旅遊',
  nameEn: 'General Travel',
  avgSpeedKmh: null,       // 依載具動態計算
  avoidHighways: false,
  preferScenicRoutes: true,
  maxDailyDistanceKm: 400,
  restStopIntervalKm: 100,
};

/** 單車環島 - 基礎參數 */
export const CYCLING_CONFIG = {
  id: TRAVEL_MODES.CYCLING,
  name: '單車環島',
  nameEn: 'Cycling Around Island',
  avgSpeedKmh: 15,         // 單車平均時速 15 km/h
  avoidHighways: true,     // 避開高速公路
  preferBikeLanes: true,
  preferScenicRoutes: true,
  maxDailyDistanceKm: 80,
  restStopIntervalKm: 25,
  elevationConsideration: true,
};

/** 駕駛 - 基礎參數 */
export const DRIVING_CONFIG = {
  id: TRAVEL_MODES.DRIVING,
  name: '駕駛',
  nameEn: 'Driving',
  avgSpeedKmh: 60,
  avoidHighways: false,
  preferHighways: true,
  maxDailyDistanceKm: 500,
  restStopIntervalKm: 150,
};

/** 機車 - 基礎參數 */
export const MOTORCYCLE_CONFIG = {
  id: TRAVEL_MODES.MOTORCYCLE,
  name: '機車',
  nameEn: 'Motorcycle',
  avgSpeedKmh: 45,
  avoidHighways: true,
  routePref: '台1線',
  maxDailyDistanceKm: 300,
  restStopIntervalKm: 80,
};

/** 依模式取得設定 */
export const getConfigByMode = (mode) => {
  switch (mode) {
    case TRAVEL_MODES.GENERAL:
      return GENERAL_TRAVEL_CONFIG;
    case TRAVEL_MODES.CYCLING:
      return CYCLING_CONFIG;
    case TRAVEL_MODES.DRIVING:
      return DRIVING_CONFIG;
    case TRAVEL_MODES.MOTORCYCLE:
      return MOTORCYCLE_CONFIG;
    default:
      return GENERAL_TRAVEL_CONFIG;
  }
};
