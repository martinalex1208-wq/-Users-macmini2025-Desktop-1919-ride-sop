import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';

// 定義明確的型別，避免 TypeScript 推論出字串衝突
type TransportMode = 'Cycling' | 'Driving';

interface Day1Data {
  route: {
    from: string;
    to: string;
    distance_km: number;
    elevation_m: number;
  };
  transport: {
    [key in TransportMode]: {
      time: string;
      showElevation: boolean;
    };
  };
  hotel: {
    name: string;
    stars: number;
    phone: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date: string;
}

const DAY1_DATA: Day1Data = {
  route: {
    from: '台北市',
    to: '新竹市',
    distance_km: 88.5,
    elevation_m: 350,
  },
  transport: {
    Cycling: { time: '5.5h', showElevation: true },
    Driving: { time: '1.2h', showElevation: false },
  },
  hotel: {
    name: '新竹國賓大飯店',
    stars: 5,
    phone: '03-515-1111',
    coordinates: { lat: 24.807, lng: 120.974 },
  },
  date: '2025.03.10',
};

export default function DayOneItinerary() {
  const [transportMode, setTransportMode] = useState<TransportMode>('Cycling');
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;

  const { route, transport, hotel, date } = DAY1_DATA;
  const currentTransport = transport[transportMode];
  const showElevation = currentTransport.showElevation;

  const handleCall = () => {
    const url = Platform.select({
      ios: `telprompt:${hotel.phone}`,
      default: `tel:${hotel.phone}`,
    });
    if (url) {
      Linking.canOpenURL(url).then((ok) => ok && Linking.openURL(url));
    }
  };

  const handleNavigate = () => {
    const { lat, lng } = hotel.coordinates;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const padding = isNarrow ? 16 : 24;
  const buttonHeight = isNarrow ? 52 : 56;

  return (
    <View style={[styles.card, { marginHorizontal: padding }]}>
      {/* 頂部區域 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Day 1</Text>
        <Text style={styles.headerDate}>{date}</Text>
      </View>

      {/* 路線資訊 */}
      <View style={styles.section}>
        <Text style={styles.label}>路線</Text>
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: '#1e3a8a' }]} />
          <Text style={styles.routeText}>{route.from}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.routeToText}>{route.to}</Text>
        </View>

        {/* 模式切換器 */}
        <View style={styles.modeToggleRow}>
          <TouchableOpacity
            onPress={() => setTransportMode('Cycling')}
            activeOpacity={0.8}
            style={[styles.modeBtn, transportMode === 'Cycling' && styles.modeBtnActive]}
          >
            <Text style={[styles.modeBtnText, transportMode === 'Cycling' && styles.modeBtnTextActive]}>單車</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTransportMode('Driving')}
            activeOpacity={0.8}
            style={[styles.modeBtn, transportMode === 'Driving' && styles.modeBtnActive]}
          >
            <Text style={[styles.modeBtnText, transportMode === 'Driving' && styles.modeBtnTextActive]}>汽車</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 數據統計列 */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{route.distance_km}</Text>
          <Text style={styles.statUnit}>km</Text>
          <Text style={styles.statLabel}>里程</Text>
        </View>
        {showElevation && (
          <>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{route.elevation_m}</Text>
              <Text style={styles.statUnit}>m</Text>
              <Text style={styles.statLabel}>爬升</Text>
            </View>
          </>
        )}
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentTransport.time}</Text>
          <Text style={styles.statUnit}>est.</Text>
          <Text style={styles.statLabel}>耗時</Text>
        </View>
      </View>

      {/* 底部功能區 */}
      <View style={styles.footer}>
        <Text style={styles.label}>住宿</Text>
        <View style={styles.hotelCard}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelStars}>{'★'.repeat(hotel.stars)} {hotel.stars} 星</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleCall} activeOpacity={0.9} style={[styles.actionBtn, { backgroundColor: '#1e3a8a', height: buttonHeight }]}>
            <Text style={styles.actionBtnText}>📞 撥打電話</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigate} activeOpacity={0.9} style={[styles.actionBtn, { backgroundColor: '#374151', height: buttonHeight }]}>
            <Text style={styles.actionBtnText}>🗺️ 地圖導航</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', marginVertical: 12, overflow: 'hidden' },
  header: { backgroundColor: '#1e3a8a', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerDate: { fontSize: 14, color: '#dbeafe', marginTop: 4 },
  section: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  label: { fontSize: 10, fontWeight: 'bold', color: '#9ca3af', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  routeText: { fontSize: 16, color: '#374151' },
  routeToText: { fontSize: 16, color: '#111827', fontWeight: 'bold' },
  routeLine: { width: 1, height: 12, backgroundColor: '#d1d5db', marginLeft: 3.5, marginVertical: 4 },
  modeToggleRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modeBtn: { flex: 1, borderRadius: 8, borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', height: 45 },
  modeBtnActive: { borderColor: '#1e3a8a', backgroundColor: '#eff6ff' },
  modeBtnText: { fontWeight: 'bold', color: '#6b7280' },
  modeBtnTextActive: { color: '#1e3a8a' },
  statsBar: { flexDirection: 'row', backgroundColor: '#f9fafb', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1e3a8a' },
  statUnit: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statLabel: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', marginTop: 4 },
  divider: { width: 1, backgroundColor: '#e5e7eb' },
  footer: { padding: 24 },
  hotelCard: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  hotelName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  hotelStars: { color: '#d97706', marginTop: 4, fontSize: 14 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});