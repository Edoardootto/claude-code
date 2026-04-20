import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, PanResponder, Dimensions, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Clock, SlidersHorizontal } from 'lucide-react-native';
import { Colors, Font, Radius, SportColors, SportEmoji, MicroStyle } from '@/constants/theme';
import { useStore } from '@/store/useStore';

const { height: SCREEN_H } = Dimensions.get('window');
const SNAP_PEEK     = SCREEN_H * 0.22;  // collapsed: peek ~22% from bottom
const SNAP_HALF     = SCREEN_H * 0.52;  // default: 52%
const SNAP_EXPANDED = SCREEN_H * 0.82;  // expanded: 82%

const SPORT_FILTERS = ['All', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Running', 'Cycling'];

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

// ─── Sport Marker ─────────────────────────────────────────────────────────────

function SportMarker({ sport, onPress }: { sport: string; onPress: () => void }) {
  const color = SportColors[sport] ?? Colors.coral;
  const emoji = SportEmoji[sport] ?? '🏅';
  return (
    <TouchableOpacity onPress={onPress} style={[markerS.pin, { backgroundColor: color }]} activeOpacity={0.85}>
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
    </TouchableOpacity>
  );
}

const markerS = StyleSheet.create({
  pin: { width: 40, height: 40, borderRadius: 20, borderWidth: 2.5, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 },
});

// ─── Game Card (inside sheet) ─────────────────────────────────────────────────

function SheetGameCard({ game }: { game: ReturnType<typeof useStore.getState>['allGames'][0] }) {
  const spots = game.playersMax - game.playersJoined;
  return (
    <TouchableOpacity style={sheetS.card} onPress={() => router.push(`/game/${game.id}` as any)} activeOpacity={0.8}>
      <View style={[sheetS.dateChip, { backgroundColor: Colors.gray100 }]}>
        <Text style={{ fontFamily: Font.display, fontSize: 20, color: Colors.ink, lineHeight: 22 }}>{game.dateDay}</Text>
        <Micro>{game.dateMonth}</Micro>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Micro style={{ marginBottom: 2 }}>{game.sport} · {game.format}</Micro>
        <Text style={sheetS.title} numberOfLines={1}>{game.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Text style={sheetS.meta}>{game.location}</Text>
          <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: Colors.gray400 }} />
          <Clock size={10} color={Colors.gray400} strokeWidth={1.8} />
          <Text style={sheetS.meta}>{game.time}</Text>
        </View>
      </View>
      <View style={[sheetS.pill, { backgroundColor: spots <= 2 ? Colors.coralSoft : Colors.gray100 }]}>
        {spots <= 2 && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.coral }} />}
        <Text style={{ fontSize: 11, fontWeight: '600', color: spots <= 2 ? Colors.coral : Colors.gray600 }}>
          {spots <= 2 ? `${spots} spots` : `${game.playersJoined}/${game.playersMax}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const sheetS = StyleSheet.create({
  card: { marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  dateChip: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '600', color: Colors.ink, letterSpacing: -0.15 },
  meta: { fontSize: 11, color: Colors.gray500 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { allGames } = useStore();
  const [sportFilter, setSportFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredGames = allGames.filter((g) => {
    const matchSport = sportFilter === 'All' || g.sport === sportFilter;
    const matchSearch = !searchText || g.title.toLowerCase().includes(searchText.toLowerCase()) || g.location.toLowerCase().includes(searchText.toLowerCase());
    return matchSport && matchSearch;
  });

  // Bottom sheet drag
  const sheetY = useRef(new Animated.Value(SNAP_HALF)).current;
  const lastY = useRef(SNAP_HALF);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        const newY = Math.max(SNAP_PEEK, Math.min(SNAP_EXPANDED, lastY.current + g.dy));
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const current = lastY.current + g.dy;
        const snaps = [SNAP_PEEK, SNAP_HALF, SNAP_EXPANDED];
        const closest = snaps.reduce((a, b) => Math.abs(b - current) < Math.abs(a - current) ? b : a);
        lastY.current = closest;
        Animated.spring(sheetY, { toValue: closest, useNativeDriver: false, tension: 80, friction: 12 }).start();
      },
    })
  ).current;

  const sheetHeight = Animated.subtract(SCREEN_H, sheetY);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Map */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{ latitude: 40.7128, longitude: -74.0060, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        showsUserLocation
        showsCompass={false}
        toolbarEnabled={false}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {filteredGames.map((game) => (
          <Marker key={game.id} coordinate={{ latitude: game.latitude, longitude: game.longitude }} anchor={{ x: 0.5, y: 0.5 }}>
            <SportMarker sport={game.sport} onPress={() => router.push(`/game/${game.id}` as any)} />
          </Marker>
        ))}
      </MapView>

      {/* Top bar */}
      <View style={[topS.bar, { paddingTop: insets.top + 8 }]}>
        {/* Search */}
        <View style={topS.searchRow}>
          <Search size={16} color={Colors.gray400} strokeWidth={1.8} />
          <TextInput
            style={topS.input}
            placeholder="Search games, courts, sports…"
            placeholderTextColor={Colors.gray400}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Sport filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}>
          {SPORT_FILTERS.map((sp) => (
            <TouchableOpacity
              key={sp}
              onPress={() => setSportFilter(sp)}
              style={[topS.filterChip, sportFilter === sp ? topS.filterActive : topS.filterInactive]}
            >
              {sp !== 'All' && <View style={[topS.sportDot, { backgroundColor: SportColors[sp] ?? Colors.gray400 }]} />}
              <Text style={[topS.filterTxt, sportFilter === sp && topS.filterTxtActive]}>{sp}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom sheet */}
      <Animated.View style={[sheetV.sheet, { height: sheetHeight, bottom: 72 + insets.bottom }]}>
        {/* Handle */}
        <View style={sheetV.handleArea} {...panResponder.panHandlers}>
          <View style={sheetV.handle} />
          <View style={sheetV.sheetTitleRow}>
            <Micro>NEARBY · {filteredGames.length} GAMES</Micro>
            <TouchableOpacity style={sheetV.sortBtn}>
              <SlidersHorizontal size={14} color={Colors.gray600} strokeWidth={1.8} />
              <Text style={sheetV.sortTxt}>Distance ↓</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, paddingTop: 4 }}>
          {filteredGames.map((game) => <SheetGameCard key={game.id} game={game} />)}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const topS = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(250,250,250,0.95)', paddingHorizontal: 16, paddingBottom: 12, zIndex: 20 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, height: 48, paddingHorizontal: 14, marginBottom: 10 },
  input: { flex: 1, fontSize: 13, color: Colors.ink },
  filterChip: { height: 36, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  filterInactive: { backgroundColor: Colors.white, borderColor: Colors.border },
  filterTxt: { fontSize: 13, fontWeight: '500', color: Colors.gray600 },
  filterTxtActive: { color: Colors.white },
  sportDot: { width: 7, height: 7, borderRadius: 3.5 },
});

const sheetV = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 12, overflow: 'hidden' },
  handleArea: { paddingBottom: 4 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.gray300, alignSelf: 'center', marginTop: 12, marginBottom: 10 },
  sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortTxt: { fontSize: 12, color: Colors.gray600 },
});
