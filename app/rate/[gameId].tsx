import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X, Check, Shield } from 'lucide-react-native';
import { Colors, MicroStyle } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

const HOST_CRITERIA = ['Reliable', 'Organized', 'Fair', 'Communicative'];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange(n)} activeOpacity={0.7}>
          <Text style={{ fontSize: 44, color: n <= value ? Colors.amber : Colors.gray300 }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RateGameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const insets = useSafeAreaInsets();
  const { pendingRatings, allPlayers, submitRating } = useStore();

  const pending = pendingRatings.find((p) => p.gameId === gameId) ?? pendingRatings[0];
  const host = pending
    ? (allPlayers.find((p) => p.id === pending.hostId) ?? pending.players[0])
    : null;

  const [hostRating, setHostRating] = useState(0);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [attended, setAttended] = useState(true);

  const toggleCriteria = (c: string) =>
    setSelectedCriteria((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const handleSubmit = () => {
    if (!pending) return;
    submitRating(pending.gameId, {
      hostRating: hostRating || 5,
      criteria: selectedCriteria,
      attended,
    });
    router.replace('/' as any);
  };

  if (!pending || !host) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <Text style={{ color: Colors.gray500, fontSize: 20, fontWeight: '600' }}>No pending ratings</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.coral, fontWeight: '600' }}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={Colors.gray700} strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Micro>REVIEW REQUIRED</Micro>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
            <X size={18} color={Colors.gray700} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={s.title}>
            How was{' '}
            <Text style={[s.title, { fontStyle: 'italic', color: Colors.coral }]}>
              {pending.gameTitle}
            </Text>
            {'?'}
          </Text>
          <Text style={s.subtitle}>{pending.sport} · {pending.playerCount} players</Text>
        </View>

        {/* Host card */}
        <View style={s.hostCard}>
          <View style={{ position: 'relative' }}>
            <Image source={{ uri: host.avatar }} style={s.hostAv} contentFit="cover" />
            <View style={s.hostBadge}>
              <Text style={{ fontSize: 8, color: Colors.white, fontWeight: '700' }}>H</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Micro style={{ marginBottom: 2 }}>RATE THE HOST</Micro>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.ink }}>{host.name}</Text>
            <Text style={{ fontSize: 11, color: Colors.gray500 }}>
              {host.gamesPlayed} games · {host.rating} ★
            </Text>
          </View>
        </View>

        {/* Stars */}
        <View style={s.starsBlock}>
          <StarPicker value={hostRating} onChange={setHostRating} />
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
            <Text style={s.bigNum}>{hostRating > 0 ? hostRating : '–'}</Text>
            {hostRating > 0 && <Text style={s.bigDec}>.0</Text>}
          </View>
          <Text style={{ fontSize: 11, color: Colors.gray500, marginTop: 4 }}>Tap a star to rate</Text>
        </View>

        {/* Host criteria */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Micro style={{ marginBottom: 12 }}>HOW WAS THE HOST?</Micro>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {HOST_CRITERIA.map((c) => {
              const sel = selectedCriteria.includes(c);
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => toggleCriteria(c)}
                  style={[s.criteriaTag, sel && s.criteriaTagSel]}
                  activeOpacity={0.8}
                >
                  <View style={[s.criteriaCircle, sel && s.criteriaCircleSel]}>
                    {sel && <Check size={10} color={Colors.white} strokeWidth={3} />}
                  </View>
                  <Text style={[s.criteriaTxt, sel && s.criteriaTxtSel]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Attendance */}
        <View style={s.attendanceCard}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.ink }}>
              I attended this game
            </Text>
            <Text style={{ fontSize: 11, color: Colors.gray500, marginTop: 2 }}>
              Marks you as present for reliability stats
            </Text>
          </View>
          <Switch
            value={attended}
            onValueChange={setAttended}
            trackColor={{ false: Colors.gray200, true: Colors.coral }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Safety note */}
        <View style={s.safetyNote}>
          <Shield size={13} color={Colors.gray400} strokeWidth={1.8} />
          <Text style={s.safetyTxt}>
            Ratings are anonymous and help keep the community safe.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[s.actionBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.skipBtn}>
          <Text style={s.skipTxt}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={s.submitTxt}>Submit · +80 pts</Text>
          <Check size={16} color={Colors.white} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },

  title: {
    fontSize: 26, fontWeight: '800', color: Colors.ink, textAlign: 'center',
    lineHeight: 32, marginBottom: 4,
  },
  subtitle: { fontSize: 12, color: Colors.gray500, textAlign: 'center' },

  hostCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginBottom: 24,
    backgroundColor: Colors.gray100, borderRadius: 20, padding: 14,
  },
  hostAv: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 2, borderColor: Colors.white, backgroundColor: Colors.gray200,
  },
  hostBadge: {
    position: 'absolute', top: -2, right: -2,
    width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.coral,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },

  starsBlock: {
    alignItems: 'center', paddingVertical: 24,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.gray150,
    marginHorizontal: 20, marginBottom: 24,
  },
  bigNum: {
    fontSize: 48, fontWeight: '800', fontStyle: 'italic',
    color: Colors.coral, lineHeight: 52,
  },
  bigDec: { fontSize: 24, color: Colors.gray300, marginLeft: 2 },

  criteriaTag: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 13,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.white, width: '47%',
  },
  criteriaTagSel: { backgroundColor: Colors.coralSoft, borderColor: Colors.coralDim },
  criteriaCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5, borderColor: Colors.gray300,
    alignItems: 'center', justifyContent: 'center',
  },
  criteriaCircleSel: { backgroundColor: Colors.coral, borderColor: Colors.coral },
  criteriaTxt: { fontSize: 13, fontWeight: '500', color: Colors.ink },
  criteriaTxtSel: { color: Colors.coral },

  attendanceCard: {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: Colors.gray100, borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },

  safetyNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 20, marginBottom: 8,
  },
  safetyTxt: { fontSize: 11, color: Colors.gray400, flex: 1, lineHeight: 16 },

  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray150,
    paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', gap: 12,
  },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  skipTxt: { fontSize: 14, fontWeight: '500', color: Colors.gray500 },
  submitBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.ink, borderRadius: 16, paddingVertical: 14,
  },
  submitTxt: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
