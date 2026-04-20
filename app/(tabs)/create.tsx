import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  Animated, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronLeft, Minus, Plus, Check } from 'lucide-react-native';
import { Colors, Font, Radius, MicroStyle, SportEmoji, SportColors } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { format, addDays } from 'date-fns';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL_STEPS = 6;

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

const SPORTS = [
  { name: 'Basketball', emoji: '🏀' },
  { name: 'Soccer', emoji: '⚽' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'Volleyball', emoji: '🏐' },
  { name: 'Running', emoji: '🏃' },
  { name: 'Cycling', emoji: '🚴' },
  { name: 'Padel', emoji: '🏓' },
  { name: 'Pickleball', emoji: '🏓' },
];

const FORMATS: Record<string, string[]> = {
  Basketball: ['1v1', '3v3', '5v5', 'Shootaround', 'Custom'],
  Soccer: ['5v5', '7v7', '11v11', 'Rondo', 'Custom'],
  Tennis: ['Singles', 'Doubles', 'Round Robin', 'Custom'],
  Volleyball: ['2v2', '4v4', '6v6', 'Custom'],
  default: ['Solo', 'Pairs', 'Group', 'Custom'],
};

const LEVELS = ['Any', 'Beginner', 'Intermediate', 'Advanced'];
const VENUES = [
  { name: 'Riverside Park Courts', sub: '0.8 mi · Outdoor · Courts 1-4' },
  { name: 'Oak Street Recreation', sub: '1.2 mi · Indoor · Full court' },
  { name: 'Downtown Athletic Center', sub: '2.1 mi · Indoor · Court 2' },
];

const TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];
const DATES = Array.from({ length: 14 }, (_, i) => ({
  label: i === 0 ? 'Today' : format(addDays(new Date(), i), 'EEE d'),
  day: format(addDays(new Date(), i), 'd'),
  month: format(addDays(new Date(), i), 'MMM').toUpperCase(),
  full: format(addDays(new Date(), i), 'EEE, MMM d'),
}));

// ─── Steps ─────────────────────────────────────────────────────────────────────

function StepHeading({ step, question, accent, helper }: { step: number; question: string; accent: string; helper?: string }) {
  const parts = question.split(accent);
  return (
    <View style={{ marginBottom: 24 }}>
      <Micro style={{ marginBottom: 6 }}>STEP {step}</Micro>
      <Text style={sh.heading}>
        {parts[0]}
        <Text style={[sh.heading, { fontFamily: Font.displayItalic, color: Colors.coral }]}>{accent}</Text>
        {parts[1] ?? ''}
      </Text>
      {helper && <Text style={sh.helper}>{helper}</Text>}
    </View>
  );
}

const sh = StyleSheet.create({
  heading: { fontFamily: Font.display, fontSize: 32, color: Colors.ink, lineHeight: 38, letterSpacing: -0.5 },
  helper: { fontSize: 13, color: Colors.gray600, marginTop: 4 },
});

function Step1({ sport, setSport }: { sport: string; setSport: (s: string) => void }) {
  return (
    <>
      <StepHeading step={1} question="What sport?" accent="sport" helper="Pick what you'll be playing." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {SPORTS.map((sp) => {
          const sel = sport === sp.name;
          return (
            <TouchableOpacity
              key={sp.name}
              onPress={() => setSport(sp.name)}
              style={[s1.sportTile, sel && s1.sportTileSel]}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 28, marginBottom: 6 }}>{sp.emoji}</Text>
              <Text style={[s1.sportName, sel && s1.sportNameSel]}>{sp.name}</Text>
              <Text style={s1.sportCount}>32 games nearby</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const s1 = StyleSheet.create({
  sportTile: { width: '46%', aspectRatio: 1.3, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.card, padding: 16, justifyContent: 'flex-end' },
  sportTileSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  sportName: { fontSize: 16, fontWeight: '600', color: Colors.ink },
  sportNameSel: { color: Colors.white },
  sportCount: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
});

function Step2({ sport, format: fmt, setFormat, playerCount, setPlayerCount }: any) {
  const formats = FORMATS[sport] ?? FORMATS.default;
  return (
    <>
      <StepHeading step={2} question="How are you playing?" accent="playing" helper="Choose a format." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {formats.map((f) => {
          const sel = fmt === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFormat(f)}
              style={[s2.chip, sel && s2.chipSel]}
              activeOpacity={0.8}
            >
              <Text style={[s2.chipTxt, sel && s2.chipTxtSel]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s2.countRow}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.ink }}>Or set custom players</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity style={s2.countBtn} onPress={() => setPlayerCount(Math.max(2, playerCount - 1))}>
            <Minus size={16} color={Colors.ink} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={s2.countNum}>{playerCount}</Text>
          <TouchableOpacity style={s2.countBtn} onPress={() => setPlayerCount(Math.min(30, playerCount + 1))}>
            <Plus size={16} color={Colors.ink} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const s2 = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  chipSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipTxt: { fontSize: 14, fontWeight: '500', color: Colors.ink },
  chipTxtSel: { color: Colors.white },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  countBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  countNum: { fontFamily: Font.display, fontSize: 44, color: Colors.ink, width: 60, textAlign: 'center' },
});

function Step3({ dateIdx, setDateIdx, timeIdx, setTimeIdx }: any) {
  return (
    <>
      <StepHeading step={3} question="When?" accent="When" />
      <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.ink, marginBottom: 10 }}>Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }} contentContainerStyle={{ gap: 8 }}>
        {DATES.map((d, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setDateIdx(i)}
            style={[s3.dayChip, dateIdx === i && s3.dayChipSel]}
          >
            <Text style={[s3.dayLabel, dateIdx === i && s3.dayLabelSel]}>{d.label.split(' ')[0]}</Text>
            <Text style={[s3.dayNum, dateIdx === i && s3.dayNumSel]}>{d.day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.ink, marginBottom: 10 }}>Time</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {TIMES.map((t, i) => (
          <TouchableOpacity key={t} onPress={() => setTimeIdx(i)} style={[s3.timeChip, timeIdx === i && s3.timeChipSel]}>
            <Text style={[s3.timeTxt, timeIdx === i && s3.timeTxtSel]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const s3 = StyleSheet.create({
  dayChip: { width: 56, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, paddingVertical: 10, alignItems: 'center', backgroundColor: Colors.white },
  dayChipSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  dayLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: Colors.gray500, marginBottom: 4 },
  dayLabelSel: { color: 'rgba(255,255,255,0.6)' },
  dayNum: { fontFamily: Font.display, fontSize: 20, color: Colors.ink },
  dayNumSel: { color: Colors.white },
  timeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  timeChipSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  timeTxt: { fontSize: 12, fontWeight: '500', color: Colors.ink },
  timeTxtSel: { color: Colors.white },
});

function Step4({ venue, setVenue }: any) {
  const [search, setSearch] = useState('');
  return (
    <>
      <StepHeading step={4} question="Where?" accent="Where" helper="Search a venue or drop a pin." />
      <View style={s4.searchRow}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          style={s4.input}
          placeholder="Search venues…"
          placeholderTextColor={Colors.gray400}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={{ gap: 10, marginBottom: 16 }}>
        {VENUES.map((v) => (
          <TouchableOpacity key={v.name} onPress={() => setVenue(v.name)} style={[s4.venueCard, venue === v.name && s4.venueCardSel]}>
            <View style={s4.venueDot}>
              <Text style={{ fontSize: 16 }}>📍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s4.venueName, venue === v.name && { color: Colors.white }]}>{v.name}</Text>
              <Text style={[s4.venueSub, venue === v.name && { color: 'rgba(255,255,255,0.6)' }]}>{v.sub}</Text>
            </View>
            {venue === v.name && <Check size={16} color={Colors.white} strokeWidth={2.5} />}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const s4 = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, height: 48, paddingHorizontal: 14, marginBottom: 16 },
  input: { flex: 1, fontSize: 13, color: Colors.ink },
  venueCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14 },
  venueCardSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  venueDot: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  venueName: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  venueSub: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
});

function Step5({ title, setTitle, description, setDescription, level, setLevel, privacy, setPrivacy }: any) {
  return (
    <>
      <StepHeading step={5} question="Last details." accent="details" />
      <Text style={s5.label}>Title</Text>
      <TextInput style={s5.input} placeholder="e.g. Sunset Court Pickup" placeholderTextColor={Colors.gray400} value={title} onChangeText={setTitle} />
      <Text style={s5.label}>Description</Text>
      <TextInput style={[s5.input, { height: 96, textAlignVertical: 'top' }]} placeholder="What should players know?" placeholderTextColor={Colors.gray400} value={description} onChangeText={setDescription} multiline numberOfLines={4} />
      <Text style={s5.label}>Skill level</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
        {LEVELS.map((l) => (
          <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[s5.levelChip, level === l && s5.levelChipSel]}>
            <Text style={[s5.levelTxt, level === l && s5.levelTxtSel]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s5.label}>Privacy</Text>
      {[{ key: 'public', label: 'Public', sub: 'Anyone nearby can join', icon: '🌐' }, { key: 'invite', label: 'Invite only', sub: 'Only people you share the link with', icon: '🔒' }].map((p) => (
        <TouchableOpacity key={p.key} onPress={() => setPrivacy(p.key)} style={[s5.privCard, privacy === p.key && s5.privCardSel]}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>{p.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s5.privLabel, privacy === p.key && { color: Colors.white }]}>{p.label}</Text>
            <Text style={[s5.privSub, privacy === p.key && { color: 'rgba(255,255,255,0.6)' }]}>{p.sub}</Text>
          </View>
          {privacy === p.key && <Check size={16} color={Colors.white} strokeWidth={2.5} />}
        </TouchableOpacity>
      ))}
    </>
  );
}

const s5 = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: Colors.ink, marginBottom: 8 },
  input: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink, marginBottom: 16 },
  levelChip: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center' },
  levelChipSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  levelTxt: { fontSize: 12, fontWeight: '500', color: Colors.ink },
  levelTxtSel: { color: Colors.white },
  privCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14, marginBottom: 10 },
  privCardSel: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  privLabel: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  privSub: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
});

function Step6({ sport, format: fmt, title, venue, dateIdx, timeIdx, playerCount, level }: any) {
  const date = DATES[dateIdx] ?? DATES[0];
  const time = TIMES[timeIdx] ?? TIMES[0];
  return (
    <>
      <StepHeading step={6} question="Look good?" accent="good" helper="Double-check and publish." />
      <View style={s6.previewCard}>
        <View style={[s6.previewHeader, { backgroundColor: Colors.ink }]}>
          <View style={s6.sportTag}>
            <Micro style={{ color: Colors.coralDim }}>{sport} · {fmt}</Micro>
          </View>
          <Text style={s6.previewTitle}>{title || 'Your Game'}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Hosted by You · 4.8 ★</Text>
        </View>
        <View style={s6.previewBody}>
          {[
            { icon: '📅', label: 'WHEN', val: `${date.full}`, sub: time },
            { icon: '📍', label: 'WHERE', val: venue || 'TBD', sub: '0.8 mi' },
            { icon: '👥', label: 'PLAYERS', val: `1 / ${playerCount}`, sub: `${playerCount - 1} spots open` },
            { icon: '⭐', label: 'SKILL', val: level, sub: '' },
          ].map((row) => (
            <View key={row.label} style={s6.infoRow}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>{row.icon}</Text>
              <View style={{ flex: 1 }}>
                <Micro>{row.label}</Micro>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.ink }}>{row.val}</Text>
                {row.sub ? <Text style={{ fontSize: 11, color: Colors.gray500 }}>{row.sub}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const s6 = StyleSheet.create({
  previewCard: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.card, overflow: 'hidden' },
  previewHeader: { padding: 20 },
  sportTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,90,78,0.2)', borderWidth: 1, borderColor: 'rgba(255,90,78,0.3)', alignSelf: 'flex-start', marginBottom: 10 },
  previewTitle: { fontFamily: Font.display, fontSize: 24, color: Colors.white, marginBottom: 6 },
  previewBody: { padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
});

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const { createGame } = useStore();
  const [step, setStep] = useState(1);

  // Form state
  const [sport, setSport] = useState('');
  const [gameFormat, setGameFormat] = useState('');
  const [playerCount, setPlayerCount] = useState(10);
  const [dateIdx, setDateIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(11);
  const [venue, setVenue] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Any');
  const [privacy, setPrivacy] = useState('public');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateStep = (dir: 1 | -1, cb: () => void) => {
    Animated.timing(slideAnim, { toValue: -dir * SCREEN_W, duration: 180, useNativeDriver: true }).start(() => {
      cb();
      slideAnim.setValue(dir * SCREEN_W);
      Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    });
  };

  const next = () => {
    if (step < TOTAL_STEPS) animateStep(1, () => setStep((s) => s + 1));
    else publish();
  };

  const back = () => {
    if (step > 1) animateStep(-1, () => setStep((s) => s - 1));
    else router.back();
  };

  const publish = () => {
    const date = DATES[dateIdx] ?? DATES[0];
    const time = TIMES[timeIdx] ?? TIMES[0];
    const id = createGame({
      sport, format: gameFormat, title: title || `${sport} pickup`, location: venue || 'TBD',
      dateDay: date.day, dateMonth: date.month, time, playersMax: playerCount,
      skill: level, description,
    });
    router.replace(`/game/${id}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Top bar */}
      <View style={[wiz.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={back} style={wiz.backBtn}>
          {step > 1 ? <ChevronLeft size={18} color={Colors.gray700} strokeWidth={2} /> : <ChevronLeft size={18} color={Colors.gray700} strokeWidth={2} />}
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Micro style={{ textAlign: 'center', marginBottom: 6 }}>STEP {step} OF {TOTAL_STEPS}</Micro>
          <View style={wiz.progTrack}>
            <View style={[wiz.progFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={20} color={Colors.gray500} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.ScrollView
        style={{ transform: [{ translateX: slideAnim }] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
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
          <TouchableOpacity style={wiz.backBtnBottom} onPress={back}>
            <Text style={wiz.backBtnTxt}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[wiz.nextBtn, step === 1 && { flex: 1 }]} onPress={next} activeOpacity={0.85}>
          <Text style={wiz.nextBtnTxt}>{step === TOTAL_STEPS ? 'Publish game' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const wiz = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg },
  backBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  progTrack: { height: 4, backgroundColor: Colors.gray200, borderRadius: 2, overflow: 'hidden' },
  progFill: { height: 4, backgroundColor: Colors.ink, borderRadius: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', gap: 10 },
  backBtnBottom: { flex: 1, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  backBtnTxt: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  nextBtn: { flex: 1.5, backgroundColor: Colors.ink, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  nextBtnTxt: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
