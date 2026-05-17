import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';

/**
 * Day 1 行程卡片 - 航空公司訂位風格
 * @param {Object} props.itinerary - 行程資料
 */
export default function Day1ItineraryCard({ itinerary }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;

  if (!itinerary) return null;

  const { itinerary_day, route, accommodation_options = [] } = itinerary;
  const { from, to, estimated_distance_km, elevation = {} } = route;
  const { total_ascent_m, caution_points = [] } = elevation;

  const handleCallHotel = (phone) => {
    const telUrl = Platform.select({
      ios: `telprompt:${phone}`,
      android: `tel:${phone}`,
      default: `tel:${phone}`,
    });
    Linking.canOpenURL(telUrl).then((supported) => {
      if (supported) Linking.openURL(telUrl);
    });
  };

  return (
    <View style={[styles.card, isNarrow && styles.cardNarrow]}>
      {/* 卡片標題 - Day 標籤 */}
      <View style={styles.dayBadge}>
        <Text style={styles.dayBadgeText}>Day {itinerary_day}</Text>
      </View>

      {/* 路線區塊 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>路線</Text>
        <View style={styles.routeRow}>
          <View style={styles.routeDot} />
          <Text style={styles.routeFrom} numberOfLines={1}>{from}</Text>
        </View>
        <View style={styles.routeConnector} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, styles.routeDotEnd]} />
          <Text style={styles.routeTo} numberOfLines={1}>{to}</Text>
        </View>
      </View>

      {/* 里程與爬升數據 */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{estimated_distance_km}</Text>
          <Text style={styles.statUnit}>km</Text>
          <Text style={styles.statLabel}>里程</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{total_ascent_m ?? '—'}</Text>
          <Text style={styles.statUnit}>m</Text>
          <Text style={styles.statLabel}>爬升</Text>
        </View>
      </View>

      {/* 注意點 */}
      {caution_points?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>注意點</Text>
          {caution_points.map((point, idx) => (
            <View key={idx} style={styles.cautionItem}>
              <Text style={styles.cautionLocation}>{point.location}</Text>
              <Text style={styles.cautionNote}>{point.note}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 住宿選項 */}
      {accommodation_options?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>住宿</Text>
          {accommodation_options.map((hotel, idx) => (
            <View key={idx} style={styles.hotelRow}>
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={2}>
                  {hotel.name}
                </Text>
                {hotel.stars != null && (
                  <Text style={styles.hotelStars}>
                    {'★'.repeat(hotel.stars)} {hotel.stars} 星
                  </Text>
                )}
              </View>
              {hotel.phone ? (
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCallHotel(hotel.phone)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.callButtonText}>撥打</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  cardNarrow: {
    marginHorizontal: 16,
    padding: 16,
  },
  dayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4a9eff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 20,
  },
  dayBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4a9eff',
  },
  routeDotEnd: {
    backgroundColor: '#34c759',
  },
  routeConnector: {
    width: 2,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginLeft: 3,
    marginVertical: 2,
  },
  routeFrom: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  routeTo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  statUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: 16,
  },
  cautionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,193,7,0.08)',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255,193,7,0.6)',
  },
  cautionLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffc107',
  },
  cautionNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  hotelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  hotelInfo: {
    flex: 1,
    marginRight: 12,
  },
  hotelName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  hotelStars: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  callButton: {
    backgroundColor: '#34c759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
