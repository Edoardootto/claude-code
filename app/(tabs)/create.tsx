import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  Animated, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronLeft, Minus, Plus, Check, MapPin, Search } from 'lucide-react-native';
import { Colors, Radius, SportEmoji, SportColors } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { format, addDays } from 'date-fns';

const { width: SW } = Dimensions.get('window');
const TOTAL_STEPS = 6;

const SPORTS = [
  { name: 'Basketball', emoji: '🏀' }, { name: 'Soccer', emoji: '⚽' },
  { name: 'Tennis', emoji: '🎾' }, { name: 'Volleyball', emoji: '🏐' },
  { name: 'Running', emoji: '🏃' }, { name: 'Cycling', emoji: '🚴' },
  { name: 'Padel', emoji: '🏓' }, { name: 'Pickleball', emoji: '🏓' },
];

const FORMATS: Record<string, string[]> = {
  Basketball: ['1v1', '3v3', '5v5', 'Shootaround', 'Custom'],
  Soccer: ['5v5', '7v7', '11v11', 'Rondo', 'Custom'],
  Tennis: ['Singles', 'Doubles', 'Round Robin', 'Custom'],
  Volleyball: ['2v2', '4v4', '6v6', 'Custom'],
  default: ['Solo', 'Pairs', 'Group', 'Custom'],
};

const LEVELS = ['Any', 'Beginner', 'Intermediate', 'Advanced'];

const TIMES: string[] = [];
for (let h = 6; h <= 22; h++) {
  for (const m of ['00', '30']) {
    if (h === 22 && m === '30') continue;
    const ampm = h < 12 ? 'AM' : 'PM';
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
    TIMES.push(`${hr}:${m} ${ampm}`);
  }
}

const DATES = Array.from({ length: 14 }, (_, i) => ({
  label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(addDays(new Date(), i), 'EEE'),
  day: format(addDays(new Date(), i), 'd'),
  dayNum: parseInt(format(addDays(new Date(), i), 'd')),
  month: format(addDays(new Date(), i), 'MMM').toUpperCase(),
  full: format(addDays(new Date(), i), 'EEE, MMM d'),
  weekday: format(addDays(new Date(), i), 'EEE'),
}));

const PLACES = [
  { id: 'p1', name: 'Riverside Park Courts', address: 'W 84th St & Riverside Dr, Manhattan', type: 'Courts' },
  { id: 'p2', name: 'Central Park North Meadow', address: 'Central Park, Manhattan', type: 'Fields' },
  { id: 'p3', name: 'Prospect Park Tennis Center', address: 'Prospect Park, Brooklyn', type: 'Courts' },
  { id: 'p4', name: 'East River Park Sports Complex', address: 'FDR Drive, Lower East Side', type: 'Complex' },
  { id: 'p5', name: 'Flushing Meadows Park', address: 'Corona, Queens', type: 'Park' },
  { id: 'p6', name: 'Brooklyn Bridge Park', address: 'Furman St, Brooklyn Heights', type: 'Park' },
  { id: 'p7', name: 'Randall\'s Island Sports Complex', address: 'Randall\'s Island, Manhattan', type: 'Complex' },
  { id: 'p8', name: 'McCarren Park', address: 'N 12th St, Williamsburg', type: 'Park' },
  { id: 'p9', name: 'Tompkins Square Park Courts', address: 'E 10th St, East Village', type: 'Courts' },
  { id: 'p10', name: 'Fort Greene Park Fields', address: 'Fort Greene, Brooklyn', type: 'Fields' },
  { id: 'p11', name: 'Battery Park City Courts', address: 'Battery Park City, Manhattan', type: 'Courts' },
  { id: 'p12', name: 'Astoria Park Track', address: 'Shore Blvd, Astoria, Queens', type: 'Track' },
  { id: 'p13', name: 'Van Cortlandt Park Track', address: 'Broadway, Bronx', type: 'Track' },
  { id: 'p14', name: 'Domino Park', address: 'Kent Ave, Williamsburg', type: 'Park' },
  { id: 'p15', name: 'Gowanus Sports Complex', address: '45 3rd Ave, Gowanus, Brooklyn', type: 'Gym' },
  { id: 'p16', name: 'Downtown Athletic Club', address: '19 West St, Financial District', type: 'Gym' },
  { id: 'p17', name: 'YMCA Vanderbilt', address: '224 E 47th St, Midtown', type: 'Gym' },
  { id: 'p18', name: 'Inwood Hill Park Fields', address: 'Inwood Hill Park, Manhattan', type: 'Fields' },
  { id: 'p19', name: 'Piers Park Volleyball', address: 'East Boston Piers, Brooklyn', type: 'Courts' },
  { id: 'p20', name: 'Chelsea Recreation Center', address: '430 W 25th St, Chelsea', type: 'Gym' },
];

// ─── Step heading ─────────────────────────────────────────────────────────────

function StepHeading({ step, title, sub }: { step: number; title: string; sub?: string }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={sh.step}>STEP {step} OF {TOTAL_STEPS}</Text>
      <Text style={sh.title}>{title}</Text>
      {sub && <Text style={sh.sub}>{sub}</Text>}
    </View>
  );
}
const sh = StyleSheet.create({
  step: { fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase', color: Colors.coral, marginBottom: 6, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: Colors.ink, letterSpacing: -0.6, lineHeight: 36 },
  sub: { fontSize: 14, color: Colors.gray500, marginTop: 4 },
});

// ─── Step 1: Sport ────────────────────────────────────────────────────────────

function Step1({ sport, setSport }: { sport: string; setSport: (s: string) => void }) {
  return (
    <>
      <StepHeading step={1} title="What sport?" sub="Pick what you'll be playing." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {SPORTS.map((sp) => {
          const sel = sport === sp.name;
          const color = SportColors[sp.name] ?? Colors.coral;
          return (
            <TouchableOpacity key={sp.name} onPress={() => setSport(sp.name)}
              style={[s1.tile, sel && { backgroundColor: color, borderColor: color }]} activeOpacity={0.85}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{sp.emoji}</Text>
              <Text style={[s1.name, sel && { color: Colors.white }]}>{sp.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}
const s1 = StyleSheet.create({
  tile: { width: '46%', aspectRatio: 1.05, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 20, padding: 14, justifyContent: 'flex-end' },
  name: { fontSize: 14, fontWeight: '700', color: Colors.ink },
});

// ─── Step 2: Format ───────────────────────────────────────────────────────────

function Step2({ sport, format: fmt, setFormat, playerCount, setPlayerCount }: any) {
  const formats = FORMATS[sport] ?? FORMATS.default;
  return (
    <>
      <StepHeading step={2} title="How are you playing?" sub="Choose a format and size." />
      <Text style={label}>Format</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {formats.map((f) => {
          const sel = fmt === f;
          return (
            <TouchableOpacity key={f} onPress={() => setFormat(f)} style={[s2.chip, sel && s2.chipOn]}>
              <Text style={[s2.txt, sel && s2.txtOn]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={label}>Player count</Text>
      <View style={s2.countRow}>
        <TouchableOpacity style={s2.countBtn} onPress={() => setPlayerCount(Math.max(2, playerCount - 1))}>
          <Minus size={18} color={Colors.ink} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={s2.num}>{playerCount}</Text>
          <Text style={{ fontSize: 11, color: Colors.gray500 }}>players max</Text>
        </View>
        <TouchableOpacity style={s2.countBtn} onPress={() => setPlayerCount(Math.min(50, playerCount + 1))}>
          <Plus size={18} color={Colors.ink} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </>
  );
}
const s2 = StyleSheet.create({
  chip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  txt: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  txtOn: { color: Colors.white },
  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 8 },
  countBtn: { width: 50, height: 50, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 52, fontWeight: '800', color: Colors.ink, letterSpacing: -2, lineHeight: 58 },
});

// ─── Step 3: Date & Time ──────────────────────────────────────────────────────

function Step3({ dateIdx, setDateIdx, timeIdx, setTimeIdx }: any) {
  return (
    <>
      <StepHeading step={3} title="When?" sub="Pick a date and start time." />
      <Text style={label}>Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }} contentContainerStyle={{ gap: 8 }}>
        {DATES.map((d, i) => {
          const sel = dateIdx === i;
          return (
            <TouchableOpacity key={i} onPress={() => setDateIdx(i)} style={[s3.dayChip, sel && s3.dayChipOn]}>
              <Text style={[s3.dayLabel, sel && s3.dayLabelOn]}>{d.weekday}</Text>
              <Text style={[s3.dayNum, sel && s3.dayNumOn]}>{d.day}</Text>
              <Text style={[s3.dayMonth, sel && s3.dayMonthOn]}>{d.month}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={label}>Time</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TIMES.map((t, i) => {
          const sel = timeIdx === i;
          return (
            <TouchableOpacity key={t} onPress={() => setTimeIdx(i)}
              style={[s3.timeChip, sel && s3.timeChipOn]}>
              <Text style={[s3.timeTxt, sel && s3.timeTxtOn]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
const s3 = StyleSheet.create({
  dayChip: { width: 64, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.border, paddingVertical: 12, alignItems: 'center', backgroundColor: Colors.white, gap: 2 },
  dayChipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  dayLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600', color: Colors.gray500 },
  dayLabelOn: { color: 'rgba(255,255,255,0.55)' },
  dayNum: { fontSize: 22, fontWeight: '800', color: Colors.ink, letterSpacing: -0.5 },
  dayNumOn: { color: Colors.white },
  dayMonth: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.gray400 },
  dayMonthOn: { color: 'rgba(255,255,255,0.5)' },
  timeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  timeChipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  timeTxt: { fontSize: 13, fontWeight: '500', color: Colors.ink },
  timeTxtOn: { color: Colors.white },
});

// ─── Step 4: Location ─────────────────────────────────────────────────────────

interface PlaceItem { id: string; name: string; address: string; type: string }

function Step4({ venue, setVenue }: { venue: string; setVenue: (v: string) => void }) {
  const [query, setQuery] = useState(venue);
  const [suggestions, setSuggestions] = useState<PlaceItem[]>([]);
  const [selected, setSelected] = useState<PlaceItem | null>(null);

  useEffect(() => {
    if (query.trim().length < 2 || selected?.name === query) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = PLACES.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    ).slice(0, 6);
    setSuggestions(matches);
  }, [query]);

  const pick = (place: PlaceItem) => {
    setSelected(place);
    setQuery(place.name);
    setVenue(place.name);
    setSuggestions([]);
  };

  const clear = () => {
    setSelected(null);
    setQuery('');
    setVenue('');
    setSuggestions([]);
  };

  return (
    <>
      <StepHeading step={4} title="Where?" sub="Search a venue, park, or sports facility." />
      <View style={s4.inputRow}>
        <Search size={16} color={Colors.gray400} strokeWidth={2} />
        <TextInput
          style={s4.input}
          placeholder="e.g. Riverside Park, Central Park…"
          placeholderTextColor={Colors.gray400}
          value={query}
          onChangeText={(t) => { setQuery(t); if (selected) { setSelected(null); setVenue(''); } }}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clear}>
            <X size={15} color={Colors.gray400} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={s4.suggestBox}>
          {suggestions.map((s, i) => (
            <TouchableOpacity key={s.id} onPress={() => pick(s)}
              style={[s4.suggestRow, i < suggestions.length - 1 && s4.suggestBorder]}>
              <View style={s4.suggestIcon}>
                <MapPin size={14} color={Colors.coral} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s4.suggestName}>{s.name}</Text>
                <Text style={s4.suggestAddr} numberOfLines={1}>{s.address} · {s.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Selected venue card */}
      {selected && (
        <View style={s4.selectedCard}>
          <View style={s4.selectedIcon}>
            <MapPin size={18} color={Colors.coral} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s4.selectedName}>{selected.name}</Text>
            <Text style={s4.selectedAddr}>{selected.address}</Text>
            <View style={s4.typePill}>
              <Text style={s4.typeTxt}>{selected.type}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={clear} style={s4.clearBtn}>
            <X size={14} color={Colors.gray600} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}

      {/* Quick suggestions if no query */}
      {!query && !selected && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.gray500, marginBottom: 10, letterSpacing: 0.4 }}>POPULAR VENUES</Text>
          {PLACES.slice(0, 4).map((p, i) => (
            <TouchableOpacity key={p.id} onPress={() => pick(p)}
              style={[s4.suggestRow, i < 3 && s4.suggestBorder, { backgroundColor: Colors.white, borderWidth: 0 }]}>
              <View style={s4.suggestIcon}><MapPin size={14} color={Colors.gray400} strokeWidth={2} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s4.suggestName}>{p.name}</Text>
                <Text style={s4.suggestAddr}>{p.type} · {p.address.split(',').slice(-1)[0].trim()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}
const s4 = StyleSheet.create({
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 16, height: 52, paddingHorizontal: 14, marginBottom: 4 },
  input: { flex: 1, fontSize: 15, color: Colors.ink },
  suggestBox: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden', marginTop: 6, marginBottom: 16 },
  suggestRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  suggestBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  suggestIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.coralSoft, alignItems: 'center', justifyContent: 'center' },
  suggestName: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  suggestAddr: { fontSize: 11, color: Colors.gray500, marginTop: 1 },
  selectedCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.coral + '50', borderRadius: 16, padding: 14, marginTop: 12 },
  selectedIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.coralSoft, alignItems: 'center', justifyContent: 'center' },
  selectedName: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  selectedAddr: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
  typePill: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: Colors.gray100, alignSelf: 'flex-start' },
  typeTxt: { fontSize: 10, fontWeight: '700', color: Colors.gray600, textTransform: 'uppercase', letterSpacing: 0.4 },
  clearBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
});

// ─── Step 5: Details ──────────────────────────────────────────────────────────

function Step5({ title, setTitle, description, setDescription, level, setLevel, privacy, setPrivacy }: any) {
  return (
    <>
      <StepHeading step={5} title="Last details." sub="Name your game and set the rules." />
      <Text style={label}>Game title</Text>
      <TextInput style={s5.input} placeholder="e.g. Sunset Court Pickup" placeholderTextColor={Colors.gray400} value={title} onChangeText={setTitle} />
      <Text style={label}>Description</Text>
      <TextInput style={[s5.input, s5.textarea]} placeholder="What should players know?" placeholderTextColor={Colors.gray400} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
      <Text style={label}>Skill level</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
        {LEVELS.map((l) => {
          const sel = level === l;
          return (
            <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[s5.levelChip, sel && s5.levelChipOn]}>
              <Text style={[s5.levelTxt, sel && s5.levelTxtOn]}>{l}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={label}>Privacy</Text>
      {[
        { key: 'public', label: 'Public', sub: 'Anyone nearby can join', icon: '🌐' },
        { key: 'invite', label: 'Invite only', sub: 'Only people with your link', icon: '🔒' },
      ].map((p) => {
        const sel = privacy === p.key;
        return (
          <TouchableOpacity key={p.key} onPress={() => setPrivacy(p.key)} style={[s5.privCard, sel && s5.privCardOn]}>
            <Text style={{ fontSize: 20 }}>{p.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s5.privLabel, sel && { color: Colors.white }]}>{p.label}</Text>
              <Text style={[s5.privSub, sel && { color: 'rgba(255,255,255,0.6)' }]}>{p.sub}</Text>
            </View>
            {sel && <Check size={16} color={Colors.white} strokeWidth={2.5} />}
          </TouchableOpacity>
        );
      })}
    </>
  );
}
const s5 = StyleSheet.create({
  input: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.ink, marginBottom: 16 },
  textarea: { height: 96 },
  levelChip: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center' },
  levelChipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  levelTxt: { fontSize: 12, fontWeight: '600', color: Colors.ink },
  levelTxtOn: { color: Colors.white },
  privCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 16, padding: 14, marginBottom: 10 },
  privCardOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  privLabel: { fontSize: 14, fontWeight: '700', color: Colors.ink },
  privSub: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
});

// ─── Step 6: Preview ──────────────────────────────────────────────────────────

import { Calendar, MapPin as MapPinI, Users, Clock as ClockI } from 'lucide-react-native';

function Step6({ sport, format: fmt, title, venue, dateIdx, timeIdx, playerCount, level }: any) {
  const date = DATES[dateIdx] ?? DATES[0];
  const time = TIMES[timeIdx] ?? TIMES[0];

  const infoGrid = [
    { Icon: Calendar, label: 'WHEN', value: `${date.day} ${date.month}, ${time}`, sub: '' },
    { Icon: MapPinI, label: 'WHERE', value: venue || 'TBD', sub: '' },
    { Icon: Users, label: 'PLAYERS', value: `1 / ${playerCount}`, sub: `${playerCount - 1} spots open` },
    { Icon: ClockI, label: 'SKILL', value: level, sub: '' },
  ];

  return (
    <>
      <StepHeading step={6} title="Looks good?" sub="Review your game before publishing." />
      <View style={s6.shell}>
        {/* Dark header */}
        <View style={s6.darkHead}>
          <View style={s6.blob} />
          <View style={s6.sportTag}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <Text style={s6.sportTagTxt}>{sport || 'Sport'} · {fmt || 'Format'}</Text>
          </View>
          <Text style={s6.gameTitle}>{title || 'Your Game'}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Hosted by You · 4.8 ★</Text>
        </View>

        {/* Info grid pulled up over header */}
        <View style={s6.infoGrid}>
          {infoGrid.map(({ Icon, label, value, sub }) => (
            <View key={label} style={s6.infoCell}>
              <View style={s6.infoIcon}>
                <Icon size={15} color={Colors.gray600} strokeWidth={1.8} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s6.infoLabel}>{label}</Text>
                <Text style={s6.infoVal}>{value}</Text>
                {!!sub && <Text style={s6.infoSub}>{sub}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
const s6 = StyleSheet.create({
  shell: { backgroundColor: Colors.bg, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  darkHead: { backgroundColor: Colors.ink, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, overflow: 'hidden' },
  blob: { position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,90,78,0.4)' },
  sportTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,90,78,0.25)', borderWidth: 1, borderColor: 'rgba(255,90,78,0.35)', alignSelf: 'flex-start', marginBottom: 10 },
  sportTagTxt: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3 },
  gameTitle: { fontSize: 26, fontWeight: '800', color: Colors.white, letterSpacing: -0.4, marginBottom: 8, lineHeight: 32 },
  infoGrid: { marginHorizontal: 14, marginTop: -18, backgroundColor: Colors.white, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, padding: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  infoCell: { width: '45%', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 9, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 2 },
  infoVal: { fontSize: 13, fontWeight: '600', color: Colors.ink },
  infoSub: { fontSize: 10, color: Colors.gray500, marginTop: 1 },
});

const label = { fontSize: 13, fontWeight: '700' as const, color: Colors.ink, marginBottom: 10 };

// ─── Wizard ───────────────────────────────────────────────────────────────────

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const { createGame } = useStore();
  const [step, setStep] = useState(1);

  const [sport, setSport] = useState('');
  const [gameFormat, setGameFormat] = useState('');
  const [playerCount, setPlayerCount] = useState(10);
  const [dateIdx, setDateIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(14); // 5:00 PM
  const [venue, setVenue] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Any');
  const [privacy, setPrivacy] = useState('public');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateStep = (dir: 1 | -1, cb: () => void) => {
    Animated.timing(slideAnim, { toValue: -dir * SW, duration: 200, useNativeDriver: true }).start(() => {
      cb();
      slideAnim.setValue(dir * SW);
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    });
  };

  const next = () => { if (step < TOTAL_STEPS) animateStep(1, () => setStep(s => s + 1)); else publish(); };
  const back = () => { if (step > 1) animateStep(-1, () => setStep(s => s - 1)); else router.back(); };

  const canContinue = (): boolean => {
    if (step === 1) return !!sport;
    if (step === 2) return !!gameFormat;
    return true;
  };

  const publish = () => {
    const date = DATES[dateIdx] ?? DATES[0];
    const time = TIMES[timeIdx] ?? TIMES[0];
    const id = createGame({
      sport, format: gameFormat, title: title || `${sport} pickup`,
      location: venue || 'TBD', dateDay: date.day, dateMonth: date.month,
      time, playersMax: playerCount, skill: level, description,
    });
    router.replace(`/game/${id}` as any);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Top bar */}
      <View style={[wiz.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={back} style={wiz.backBtn}>
          <ChevronLeft size={18} color={Colors.gray700} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          <View style={wiz.progTrack}>
            <Animated.View style={[wiz.progFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={wiz.closeBtn}>
          <X size={16} color={Colors.gray600} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.ScrollView style={{ transform: [{ translateX: slideAnim }] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled">
        {step === 1 && <Step1 sport={sport} setSport={setSport} />}
        {step === 2 && <Step2 sport={sport} format={gameFormat} setFormat={setGameFormat} playerCount={playerCount} setPlayerCount={setPlayerCount} />}
        {step === 3 && <Step3 dateIdx={dateIdx} setDateIdx={setDateIdx} timeIdx={timeIdx} setTimeIdx={setTimeIdx} />}
        {step === 4 && <Step4 venue={venue} setVenue={setVenue} />}
        {step === 5 && <Step5 title={title} setTitle={setTitle} description={description} setDescription={setDescription} level={level} setLevel={setLevel} privacy={privacy} setPrivacy={setPrivacy} />}
        {step === 6 && <Step6 sport={sport || 'Basketball'} format={gameFormat || '5v5'} title={title} venue={venue} dateIdx={dateIdx} timeIdx={timeIdx} playerCount={playerCount} level={level} />}
      </Animated.ScrollView>

      {/* Bottom bar */}
      <View style={[wiz.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        {step > 1 && (
          <TouchableOpacity style={wiz.secondaryBtn} onPress={back}>
            <Text style={wiz.secondaryTxt}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[wiz.primaryBtn, step === 1 && { flex: 1 }, !canContinue() && { opacity: 0.45 }]}
          onPress={next} activeOpacity={0.85}>
          <Text style={wiz.primaryTxt}>{step === TOTAL_STEPS ? '🎉 Publish game' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const wiz = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, backgroundColor: Colors.bg },
  backBtn: { width: 38, height: 38, borderRadius: 11, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  closeBtn: { width: 38, height: 38, borderRadius: 11, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  progTrack: { height: 4, backgroundColor: Colors.gray200, borderRadius: 2, overflow: 'hidden' },
  progFill: { height: 4, backgroundColor: Colors.ink, borderRadius: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', gap: 10 },
  secondaryBtn: { flex: 1, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  secondaryTxt: { fontSize: 15, fontWeight: '600', color: Colors.ink },
  primaryBtn: { flex: 1.5, backgroundColor: Colors.ink, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  primaryTxt: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
