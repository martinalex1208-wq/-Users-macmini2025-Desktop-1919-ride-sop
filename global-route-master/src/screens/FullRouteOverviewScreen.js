import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FULL_ROUTE_DATA, TOTAL_KM, TOTAL_DAYS } from '../data/fullRouteData';

export default function FullRouteOverviewScreen({ navigation }) {
  const handleCall = (phone) => {
    if (!phone) return;
    const url = Platform.select({
      ios: `telprompt:${phone}`,
      default: `tel:${phone}`,
    });
    Linking.canOpenURL(url).then((ok) => {
      if (ok) Linking.openURL(url);
    });
  };

  return (
    // 修正：完全不給 SafeAreaView 任何 edges 屬性，讓它跑預設值
    <SafeAreaView style={styles.container}>
      {/* 修正：移除 ScrollView 所有布林屬性，只留最乾淨的樣式 */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>全程概覽</Text>
          <Text style={styles.subtitle}>1919 Love Moves Digital Route</Text>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>總里程</Text>
              <Text style={styles.statValue}>{TOTAL_KM} km</Text>
            </View>
            <View style={styles.statDivider} />
            <View>
              <Text style={styles.statLabel}>總天數</Text>
              <Text style={styles.statValue}>{TOTAL_DAYS} Days</Text>
            </View>
          </View>
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          {FULL_ROUTE_DATA.map((d) => (
            <View key={d.id.toString()} style={styles.timelineItem}>
              <View style={styles.nodeSection}>
                <View style={[styles.dot, d.isChallenge === true && styles.dotChallenge]}>
                  <Text style={[styles.dotText, d.isChallenge === true && styles.dotTextChallenge]}>{d.id}</Text>
                </View>
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeText}>Day {d.id} | {d.from} ➔ {d.to}</Text>
                  {d.isChallenge === true && (
                    <View style={styles.challengeTag}>
                      <Text style={styles.challengeTagText}>🚩 最長挑戰</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.kmText}>{d.distance} km</Text>
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelText}>{d.hotel.name}</Text>
                  {d.hotel.phone ? (
                    <TouchableOpacity 
                      onPress={() => handleCall(d.hotel.phone)} 
                      style={styles.phoneButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.phoneText}>📞 {d.hotel.phone}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.finishText}>✨ 完騎凱旋</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 24, backgroundColor: '#1e293b' },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 12, color: '#38bdf8', marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 24 },
  timeline: { paddingTop: 30, paddingRight: 20 },
  timelineLine: { position: 'absolute', left: 42, top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(56,189,248,0.2)' },
  timelineItem: { flexDirection: 'row', marginBottom: 32, paddingLeft: 24 },
  nodeSection: { alignItems: 'center', width: 40, marginRight: 16 },
  dot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#38bdf8', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotChallenge: { borderColor: '#fbbf24', backgroundColor: '#451a03' },
  dotText: { fontSize: 14, fontWeight: 'bold', color: '#38bdf8' },
  dotTextChallenge: { color: '#fbbf24' },
  timelineContent: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeText: { fontSize: 16, fontWeight: '700', color: '#f8fafc' },
  challengeTag: { backgroundColor: '#451a03', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  challengeTagText: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold' },
  kmText: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  hotelInfo: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  hotelText: { fontSize: 14, color: '#f1f5f9' },
  phoneButton: { marginTop: 6 },
  phoneText: { fontSize: 13, color: '#38bdf8' },
  finishText: { fontSize: 13, color: '#10b981', fontWeight: '600' },
});