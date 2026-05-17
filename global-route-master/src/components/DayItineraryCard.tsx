import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';

// --- Data Model Types ---
interface CautionPoint {
  location: string;
  note: string;
}

interface Elevation {
  total_ascent_m: number;
  caution_points?: CautionPoint[];
}

interface Route {
  from: string;
  to: string;
  estimated_distance_km: number;
  elevation?: Elevation;
}

interface TransportOption {
  time: string;
  show_elevation: boolean;
}

interface Accommodation {
  name: string;
  stars: number;
  phone: string;
  coordinates?: { lat: number; lng: number };
}

interface DayItineraryData {
  project_name: string;
  itinerary_day: number;
  route: Route;
  transport_options: {
    cycling: TransportOption;
    driving: TransportOption;
  };
  accommodation: Accommodation;
}

// --- Day 1 Data ---
const DAY1_DATA: DayItineraryData = {
  project_name: 'Global Route Master',
  itinerary_day: 1,
  route: {
    from: 'Taipei City (台北市)',
    to: 'Hsinchu City (新竹市)',
    estimated_distance_km: 88.5,
    elevation: {
      total_ascent_m: 350,
      caution_points: [{ location: '桃園龜山長坡', note: '坡度較緩但長' }],
    },
  },
  transport_options: {
    cycling: { time: '5.5h', show_elevation: true },
    driving: { time: '1.2h', show_elevation: false },
  },
  accommodation: {
    name: '新竹國賓大飯店',
    stars: 5,
    phone: '03-515-1111',
    coordinates: { lat: 24.807, lng: 120.974 },
  },
};

type TransportMode = 'cycling' | 'driving';

/**
 * DayItineraryCard - 航空等級簡約行程卡片
 * Modern, Clean, High Contrast | NativeWind
 */
export default function DayItineraryCard() {
  const [mode, setMode] = useState<TransportMode>('cycling');
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;

  const { itinerary_day, route, transport_options, accommodation } = DAY1_DATA;
  const { from, to, estimated_distance_km, elevation } = route;
  const currentTransport = transport_options[mode];
  const showElevation = currentTransport.show_elevation;
  const estimatedTime = currentTransport.time;

  const handleCall = () => {
    const url = Platform.select({
      ios: `telprompt:${accommodation.phone}`,
      default: `tel:${accommodation.phone}`,
    });
    Linking.canOpenURL(url).then((ok) => ok && Linking.openURL(url));
  };

  const handleNavigate = () => {
    if (!accommodation.coordinates) return;
    const { lat, lng } = accommodation.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const buttonPadding = isNarrow ? 14 : 18;

  return (
    <View
      className="mx-5 my-4 rounded-2xl border border-white/15 bg-white/[0.07]"
      style={{ padding: isNarrow ? 16 : 20 }}
    >
      {/* Day Badge */}
      <View className="mb-5 self-start rounded-lg bg-blue-500 px-4 py-2">
        <Text className="text-sm font-bold tracking-widest text-white">
          DAY {itinerary_day}
        </Text>
      </View>

      {/* Transport Toggle */}
      <View className="mb-6 flex-row gap-3">
        <TouchableOpacity
          onPress={() => setMode('cycling')}
          activeOpacity={0.85}
          className={`flex-1 rounded-xl border-2 px-5 py-4 ${
            mode === 'cycling'
              ? 'border-blue-400 bg-blue-500/25'
              : 'border-white/15 bg-white/5'
          }`}
        >
          <Text
            className={`text-center text-base font-bold ${
              mode === 'cycling' ? 'text-white' : 'text-white/60'
            }`}
          >
            Cycling
          </Text>
          <Text
            className={`mt-1 text-center text-xs ${
              mode === 'cycling' ? 'text-blue-200' : 'text-white/40'
            }`}
          >
            {transport_options.cycling.time}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('driving')}
          activeOpacity={0.85}
          className={`flex-1 rounded-xl border-2 px-5 py-4 ${
            mode === 'driving'
              ? 'border-blue-400 bg-blue-500/25'
              : 'border-white/15 bg-white/5'
          }`}
        >
          <Text
            className={`text-center text-base font-bold ${
              mode === 'driving' ? 'text-white' : 'text-white/60'
            }`}
          >
            Driving
          </Text>
          <Text
            className={`mt-1 text-center text-xs ${
              mode === 'driving' ? 'text-blue-200' : 'text-white/40'
            }`}
          >
            {transport_options.driving.time}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Route */}
      <View className="mb-5">
        <Text className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
          Route
        </Text>
        <View className="flex-row items-center gap-3">
          <View className="h-2.5 w-2.5 rounded-full bg-blue-400" />
          <Text className="flex-1 text-[15px] font-medium text-white/95" numberOfLines={1}>
            {from}
          </Text>
        </View>
        <View className="ml-1.5 h-4 w-0.5 bg-white/25" />
        <View className="flex-row items-center gap-3">
          <View className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <Text className="flex-1 text-[15px] font-bold text-white" numberOfLines={1}>
            {to}
          </Text>
        </View>
      </View>

      {/* Stats: Distance + Elevation (conditional) */}
      <View className="mb-5 flex-row rounded-xl border border-white/10 bg-black/20 p-4">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-extrabold text-white">
            {estimated_distance_km}
          </Text>
          <Text className="mt-1 text-xs font-medium text-white/55">km</Text>
          <Text className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">
            Distance
          </Text>
        </View>
        {showElevation && elevation && (
          <>
            <View className="w-px bg-white/20" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-white">
                {elevation.total_ascent_m}
              </Text>
              <Text className="mt-1 text-xs font-medium text-white/55">m</Text>
              <Text className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">
                Elevation
              </Text>
            </View>
          </>
        )}
        <View className="w-px bg-white/20" />
        <View className="flex-1 items-center">
          <Text className="text-2xl font-extrabold text-white">{estimatedTime}</Text>
          <Text className="mt-1 text-xs font-medium text-white/55">est.</Text>
          <Text className="mt-0.5 text-[10px] uppercase tracking-wider text-white/45">
            Time
          </Text>
        </View>
      </View>

      {/* Caution Points (Cycling only) */}
      {showElevation && elevation?.caution_points?.length ? (
        <View className="mb-5">
          <Text className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
            Caution
          </Text>
          {elevation.caution_points.map((point, idx) => (
            <View
              key={idx}
              className="mb-2 rounded-lg border-l-4 border-amber-400/70 bg-amber-500/10 p-3"
            >
              <Text className="font-bold text-amber-400">{point.location}</Text>
              <Text className="mt-1 text-sm text-white/85">{point.note}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Accommodation */}
      <View className="mb-5">
        <Text className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
          Accommodation
        </Text>
        <View className="rounded-xl border border-white/10 bg-black/20 p-4">
          <Text className="text-base font-bold text-white">{accommodation.name}</Text>
          <Text className="mt-1 text-sm text-amber-400">
            {'★'.repeat(accommodation.stars)} {accommodation.stars} stars
          </Text>
        </View>
      </View>

      {/* Large CTA Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={handleCall}
          activeOpacity={0.9}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4"
          style={{ paddingVertical: buttonPadding }}
        >
          <Text className="text-xl">📞</Text>
          <Text className="text-base font-bold text-white">撥打電話</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.9}
          disabled={!accommodation.coordinates}
          className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4 ${
            accommodation.coordinates ? 'bg-blue-500' : 'bg-white/20'
          }`}
          style={{ paddingVertical: buttonPadding }}
        >
          <Text className="text-xl">🗺️</Text>
          <Text className="text-base font-bold text-white">地圖導航</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
