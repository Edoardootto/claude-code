import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Dimensions, TextInput, Modal, ScrollView, Animated,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X, Clock, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors, Radius, SportColors, SportEmoji } from '@/constants/theme';
import { useStore, Game } from '@/store/useStore';

const { width: SW } = Dimensions.get('window');

const SPORTS_FILTER = ['All', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Running', 'Cycling'];
const SKILLS_FILTER = ['Any', 'Beginner', 'Intermediate', 'Advanced'];
const AVAIL_FILTER = ['Any', 'Open spots', 'Full'];
const CAL_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Filters {
  sport: string;
  date: string | null;
  skill: string;
  distance: number;
  city: string;
  availability: string;
}
const DEFAULT_FILTERS: Filters = { sport: 'All', date: null, skill: 'Any', distance: 20, city: '', availability: 'Any' };

// ─── Map Pin ──────────────────────────────────────────────────────────────────

function GamePin({ sport, active, onPress }: { sport: string; active: boolean; onPress: () => void }) {
  const color = SportColors[sport] ?? Colors.coral;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={[pin.base, { backgroundColor: color }, active && pin.active]}>
      <Text style={{ fontSize: active ? 18 : 14 }}>{SportEmoji[sport] ?? '🏅'}</Text>
    </TouchableOpacity>
  );
}

const pin = StyleSheet.create({
  base: { width: 38, height: 38, borderRadius: 19, borderWidth: 2.5, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 },
  active: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, shadowOpacity: 0.4, elevation: 10 },
});

// ─── Carousel Card ────────────────────────────────────────────────────────────

function CarouselCard({ game, active }: { game: Game; active: boolean }) {
  const spots = game.playersMax - game.playersJoined;
  const color = SportColors[game.sport] ?? Colors.coral;
  return (
    <TouchableOpacity style={[cc.wrap, active && cc.wrapActive]}
      onPress={() => router.push(`/game/${game.id}` as any)} activeOpacity={0.92}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={[cc.icon, { backgroundColor: color + '18' }]}>
          <Text style={{ fontSize: 22 }}>{SportEmoji[game.sport] ?? '🏅'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <Text style={[cc.sport, { color }]}>{game.sport}</Text>
            <Text style={cc.bull}>·</Text>
            <Text style={cc.format}>{game.format}</Text>
          </View>
          <Text style={cc.title} numberOfLines={1}>{game.title}</Text>
        </View>
        <View style={[cc.spot, { backgroundColor: spots <= 2 ? Colors.coralSoft : Colors.gray100 }]}>
          {spots <= 2 && <View style={cc.dot} />}
          <Text style={[cc.spotTxt, { color: spots <= 2 ? Colors.coral : Colors.gray600 }]}>
            {spots <= 2 ? `${spots} left` : `${game.playersJoined}/${game.playersMax}`}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 11 }}>📍</Text>
          <Text style={cc.meta}>{game.location}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Clock size={10} color={Colors.gray500} strokeWidth={2} />
          <Text style={cc.meta}>{game.time} · {game.dateDay} {game.dateMonth}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cc = StyleSheet.create({
  wrap: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  wrapActive: { borderColor: Colors.coral + '50', shadowOpacity: 0.16 },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sport: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  bull: { fontSize: 11, color: Colors.gray400 },
  format: { fontSize: 11, color: Colors.gray500 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.ink, letterSpacing: -0.3 },
  meta: { fontSize: 12, color: Colors.gray500 },
  spot: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.coral },
  spotTxt: { fontSize: 11, fontWeight: '600' },
});

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({ game }: { game: Game }) {
  const spots = game.playersMax - game.playersJoined;
  const color = SportColors[game.sport] ?? Colors.coral;
  return (
    <TouchableOpacity style={gc.wrap} onPress={() => router.push(`/game/${game.id}` as any)} activeOpacity={0.8}>
      {/* Date chip */}
      <View style={gc.dateBox}>
        <Text style={gc.dateDay}>{game.dateDay}</Text>
        <Text style={gc.dateMon}>{game.dateMonth}</Text>
      </View>
      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <Text style={[gc.sport, { color }]}>{game.sport}</Text>
          <Text style={gc.bull}>·</Text>
          <Text style={gc.format}>{game.format}</Text>
        </View>
        <Text style={gc.title} numberOfLines={1}>{game.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 5 }}>
          <Text style={gc.meta}>📍 {game.location}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Clock size={10} color={Colors.gray500} strokeWidth={2} />
            <Text style={gc.meta}>{game.time}</Text>
          </View>
        </View>
      </View>
      {/* Spot pill */}
      <View style={[gc.spotPill, { backgroundColor: spots <= 2 ? Colors.coralSoft : Colors.gray100 }]}>
        {spots <= 2 && <View style={gc.dot} />}
        <Text style={[gc.spotTxt, { color: spots <= 2 ? Colors.coral : Colors.gray600 }]}>
          {spots <= 2 ? `${spots} left` : `${game.playersJoined}/${game.playersMax}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const gc = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 18,
    marginHorizontal: 16, marginBottom: 10, padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  dateBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dateDay: { fontSize: 17, fontWeight: '800', color: Colors.ink, lineHeight: 19 },
  dateMon: { fontSize: 9, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5 },
  sport: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  bull: { fontSize: 10, color: Colors.gray400 },
  format: { fontSize: 11, color: Colors.gray500 },
  title: { fontSize: 15, fontWeight: '700', color: Colors.ink, letterSpacing: -0.2 },
  meta: { fontSize: 11, color: Colors.gray500 },
  spotPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, flexShrink: 0 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.coral },
  spotTxt: { fontSize: 10, fontWeight: '700' },
});

// ─── Distance Slider ──────────────────────────────────────────────────────────

function DistanceSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const MAX = 20;
  const [trackWidth, setTrackWidth] = useState(280);
  const pct = Math.min(1, value / MAX);

  const update = (locationX: number) => {
    const ratio = Math.max(0, Math.min(1, locationX / trackWidth));
    onChange(Math.max(1, Math.round(ratio * MAX)));
  };

  return (
    <View style={{ paddingVertical: 4 }}>
      <View
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={e => update(e.nativeEvent.locationX)}
        onResponderMove={e => update(e.nativeEvent.locationX)}
        style={{ height: 44, justifyContent: 'center' }}
      >
        <View style={{ height: 4, backgroundColor: Colors.gray150, borderRadius: 2 }}>
          <View style={{ height: 4, width: `${pct * 100}%`, backgroundColor: Colors.ink, borderRadius: 2 }} />
        </View>
        <View style={{
          position: 'absolute',
          left: Math.max(0, pct * trackWidth - 12),
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: Colors.white, borderWidth: 3, borderColor: Colors.ink,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
        }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
        <Text style={{ fontSize: 10, color: Colors.gray400 }}>1 mi</Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.ink }}>
          {value >= 20 ? 'Any distance' : `Within ${value} mi`}
        </Text>
        <Text style={{ fontSize: 10, color: Colors.gray400 }}>20 mi</Text>
      </View>
    </View>
  );
}

// ─── Calendar Picker ──────────────────────────────────────────────────────────

function CalendarPicker({ selected, onChange }: { selected: string | null; onChange: (d: string | null) => void }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
          <ChevronLeft size={16} color={Colors.gray600} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.ink }}>{CAL_MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
          <ChevronRight size={16} color={Colors.gray600} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <Text key={i} style={cal.dayLabel}>{d}</Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {blanks.map((_, b) => <View key={`b${b}`} style={cal.cell} />)}
        {days.map(d => {
          const dateStr = `${year}-${month + 1}-${d}`;
          const isSel = selected === dateStr;
          const isPast = new Date(year, month, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return (
            <TouchableOpacity key={d} style={cal.cell}
              onPress={() => !isPast && onChange(isSel ? null : dateStr)}>
              <View style={[cal.dayCircle, isSel && cal.dayCircleSel]}>
                <Text style={[cal.dayTxt, isSel && cal.dayTxtSel, isPast && { color: Colors.gray300 }]}>{d}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const cal = StyleSheet.create({
  navBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '600', color: Colors.gray400 },
  cell: { width: '14.28%', height: 36, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  dayCircleSel: { backgroundColor: Colors.ink },
  dayTxt: { fontSize: 13, color: Colors.ink },
  dayTxtSel: { color: Colors.white, fontWeight: '700' },
});

// ─── Filter Sheet ─────────────────────────────────────────────────────────────

function FilterSheet({ visible, onClose, filters, onChange }: {
  visible: boolean; onClose: () => void; filters: Filters; onChange: (f: Filters) => void;
}) {
  const insets = useSafeAreaInsets();
  const [local, setLocal] = useState<Filters>(filters);
  useEffect(() => { if (visible) setLocal(filters); }, [visible]);

  const Chip = ({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[fs.chip, on && fs.chipOn]}>
      <Text style={[fs.chipTxt, on && fs.chipTxtOn]}>{label}</Text>
    </TouchableOpacity>
  );

  const activeCount = [
    local.sport !== 'All',
    local.date !== null,
    local.skill !== 'Any',
    local.distance < 20,
    local.city !== '',
    local.availability !== 'Any',
  ].filter(Boolean).length;

  const formatDate = (d: string | null) => {
    if (!d) return null;
    const [y, m, day] = d.split('-').map(Number);
    return `${CAL_MONTHS[m - 1]} ${day}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
        <View style={[fs.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={fs.handle} />
          <View style={fs.header}>
            <TouchableOpacity onPress={() => setLocal(DEFAULT_FILTERS)}>
              <Text style={fs.reset}>Reset{activeCount > 0 ? ` (${activeCount})` : ''}</Text>
            </TouchableOpacity>
            <Text style={fs.title}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={fs.closeBtn}>
              <X size={15} color={Colors.gray700} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}>

            {/* Sport */}
            <Text style={fs.label}>Sport</Text>
            <View style={fs.row}>
              {SPORTS_FILTER.map(s => <Chip key={s} label={s} on={local.sport === s} onPress={() => setLocal(f => ({ ...f, sport: s }))} />)}
            </View>

            {/* Date */}
            <Text style={fs.label}>
              Date{local.date ? ` · ${formatDate(local.date)}` : ''}
            </Text>
            <CalendarPicker selected={local.date} onChange={d => setLocal(f => ({ ...f, date: d }))} />
            <View style={{ height: 20 }} />

            {/* Distance */}
            <Text style={fs.label}>Distance</Text>
            <DistanceSlider value={local.distance} onChange={d => setLocal(f => ({ ...f, distance: d }))} />
            <View style={{ height: 20 }} />

            {/* City */}
            <Text style={fs.label}>City</Text>
            <View style={fs.inputWrap}>
              <Search size={14} color={Colors.gray400} strokeWidth={2} />
              <TextInput
                style={fs.input}
                placeholder="Any city..."
                placeholderTextColor={Colors.gray400}
                value={local.city}
                onChangeText={t => setLocal(f => ({ ...f, city: t }))}
              />
              {local.city.length > 0 && (
                <TouchableOpacity onPress={() => setLocal(f => ({ ...f, city: '' }))}>
                  <X size={12} color={Colors.gray400} strokeWidth={2.5} />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ height: 20 }} />

            {/* Skill level */}
            <Text style={fs.label}>Skill level</Text>
            <View style={fs.row}>
              {SKILLS_FILTER.map(l => <Chip key={l} label={l} on={local.skill === l} onPress={() => setLocal(f => ({ ...f, skill: l }))} />)}
            </View>

            {/* Availability */}
            <Text style={fs.label}>Availability</Text>
            <View style={fs.row}>
              {AVAIL_FILTER.map(a => <Chip key={a} label={a} on={local.availability === a} onPress={() => setLocal(f => ({ ...f, availability: a }))} />)}
            </View>

          </ScrollView>
          <View style={fs.footer}>
            <TouchableOpacity style={fs.applyBtn} onPress={() => { onChange(local); onClose(); }}>
              <Text style={fs.applyTxt}>Show results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const fs = StyleSheet.create({
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.gray200, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 20 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.ink },
  reset: { fontSize: 14, fontWeight: '500', color: Colors.coral, width: 80 },
  closeBtn: { width: 30, height: 30, borderRadius: 9, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '700', color: Colors.ink, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  chipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipTxt: { fontSize: 13, fontWeight: '500', color: Colors.gray600 },
  chipTxtOn: { color: Colors.white },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, height: 44, backgroundColor: Colors.white },
  input: { flex: 1, fontSize: 13, color: Colors.ink },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  applyBtn: { backgroundColor: Colors.ink, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  applyTxt: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { allGames } = useStore();
  const [view, setView] = useState<'map' | 'grid'>('map');
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList>(null);

  const filtered = allGames.filter(g => {
    if (filters.sport !== 'All' && g.sport !== filters.sport) return false;
    if (filters.skill !== 'Any' && !g.skill.toLowerCase().includes(filters.skill.toLowerCase())) return false;
    if (filters.availability === 'Open spots' && g.playersJoined >= g.playersMax) return false;
    if (filters.availability === 'Full' && g.playersJoined < g.playersMax) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) && !g.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = [
    filters.sport !== 'All',
    filters.date !== null,
    filters.skill !== 'Any',
    filters.distance < 20,
    filters.city !== '',
    filters.availability !== 'Any',
  ].filter(Boolean).length;

  const TOP_H = insets.top + 112;
  const CAROUSEL_BTM = insets.bottom + 96;

  const centerMap = useCallback((idx: number) => {
    if (!filtered[idx]) return;
    mapRef.current?.animateToRegion({
      latitude: filtered[idx].latitude, longitude: filtered[idx].longitude,
      latitudeDelta: 0.014, longitudeDelta: 0.014,
    }, 350);
  }, [filtered]);

  const focusGame = useCallback((idx: number) => {
    setActiveIdx(idx);
    listRef.current?.scrollToIndex({ index: idx, animated: true });
    centerMap(idx);
  }, [centerMap]);

  const onCardScroll = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    if (idx !== activeIdx && idx >= 0 && idx < filtered.length) {
      setActiveIdx(idx);
      centerMap(idx);
    }
  }, [activeIdx, filtered, centerMap]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>

      {/* ── MAP (full screen background) ── */}
      {view === 'map' && (
        <MapView ref={mapRef} style={StyleSheet.absoluteFillObject}
          initialRegion={{ latitude: 40.7128, longitude: -74.006, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
          showsUserLocation showsCompass={false} toolbarEnabled={false}>
          <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />
          {filtered.map((game, idx) => (
            <Marker key={game.id} coordinate={{ latitude: game.latitude, longitude: game.longitude }}
              anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
              <GamePin sport={game.sport} active={activeIdx === idx} onPress={() => focusGame(idx)} />
            </Marker>
          ))}
        </MapView>
      )}

      {/* ── GRID ── */}
      {view === 'grid' && (
        <FlatList data={filtered} keyExtractor={g => g.id}
          renderItem={({ item }) => <GridCard game={item} />}
          contentContainerStyle={{ paddingTop: TOP_H + 8, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 32, marginBottom: 10 }}>🔍</Text>
              <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.ink }}>No games found</Text>
              <Text style={{ fontSize: 13, color: Colors.gray500, marginTop: 4 }}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}

      {/* ── FLOATING TOP CONTROLS ── */}
      <View style={[top.bar, { paddingTop: insets.top + 12 }]} pointerEvents="box-none">
        {/* Search + filter row */}
        <View style={top.searchRow} pointerEvents="auto">
          <View style={top.inputWrap}>
            <Search size={15} color={Colors.gray400} strokeWidth={2} />
            <TextInput style={top.input} placeholder="Search games, venues..."
              placeholderTextColor={Colors.gray400} value={search} onChangeText={setSearch} />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={14} color={Colors.gray400} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => setShowFilter(true)}
            style={[top.filterBtn, activeCount > 0 && top.filterBtnOn]}>
            <SlidersHorizontal size={16} color={activeCount > 0 ? Colors.white : Colors.gray700} strokeWidth={2} />
            {activeCount > 0 && (
              <View style={top.badge}><Text style={{ fontSize: 9, fontWeight: '800', color: Colors.white }}>{activeCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        {/* Centered Map/Grid toggle */}
        <View style={top.toggleRow} pointerEvents="auto">
          <View style={top.toggle}>
            {(['map', 'grid'] as const).map(v => (
              <TouchableOpacity key={v} onPress={() => setView(v)} style={[top.toggleBtn, view === v && top.toggleBtnOn]}>
                <Text style={[top.toggleTxt, view === v && top.toggleTxtOn]}>
                  {v === 'map' ? 'Map' : 'Grid'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ── BOTTOM CAROUSEL (Map only) ── */}
      {view === 'map' && filtered.length > 0 && (
        <View style={[btm.wrap, { bottom: CAROUSEL_BTM }]} pointerEvents="box-none">
          <FlatList ref={listRef} data={filtered} keyExtractor={g => g.id}
            renderItem={({ item, index }) => (
              <View style={{ width: SW, paddingHorizontal: 16 }} pointerEvents="auto">
                <CarouselCard game={item} active={index === activeIdx} />
              </View>
            )}
            horizontal showsHorizontalScrollIndicator={false}
            snapToInterval={SW} decelerationRate="fast"
            onMomentumScrollEnd={onCardScroll}
            getItemLayout={(_, index) => ({ length: SW, offset: SW * index, index })}
          />
        </View>
      )}

      {/* ── FILTER SHEET ── */}
      <FilterSheet visible={showFilter} onClose={() => setShowFilter(false)}
        filters={filters} onChange={(f) => { setFilters(f); setActiveIdx(0); }} />
    </View>
  );
}

const top = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, paddingBottom: 8, paddingHorizontal: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 14, height: 44, paddingHorizontal: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  input: { flex: 1, fontSize: 14, color: Colors.ink },
  filterBtn: { width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  filterBtnOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  badge: { position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center' },
  // Centered toggle row
  toggleRow: { alignItems: 'center', justifyContent: 'center' },
  toggle: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.10)', borderRadius: 12, padding: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  toggleBtn: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: 10 },
  toggleBtnOn: { backgroundColor: Colors.ink, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  toggleTxt: { fontSize: 13, fontWeight: '600', color: 'rgba(0,0,0,0.45)' },
  toggleTxtOn: { color: Colors.white },
});

const btm = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0 },
});
