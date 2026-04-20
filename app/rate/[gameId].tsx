import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronLeft, Check } from 'lucide-react-native';
import { Colors, Font, Radius, MicroStyle } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

const ATTRIBUTES = ['Well organized', 'Good vibe', 'On time', 'Fair teams', 'Clean venue', 'Would return'];

function StarPicker({ value, onChange, size = 36 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange(n)} activeOpacity={0.7}>
          <Text style={{ fontSize: size, color: n <= (hovered || value) ? Colors.amber : Colors.gray300 }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MiniStarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange(n)} activeOpacity={0.7}>
          <Text style={{ fontSize: 18, color: n <= value ? Colors.amber : Colors.gray300 }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RateGameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const insets = useSafeAreaInsets();
  const { pendingRatings, submitRating } = useStore();

  const pending = pendingRatings.find((p) => p.gameId === gameId) ?? pendingRatings[0];

  const [overall, setOverall] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [attended, setAttended] = useState(true);
  const [playerRatings, setPlayerRatings] = useState<Record<string, number>>({});

  const toggleAttr = (a: string) =>
    setSelectedAttrs((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleSubmit = () => {
    submitRating(gameId, { overall, attributes: selectedAttrs, attended, playerRatings });
    router.replace('/' as any);
  };

  if (!pending) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <Text style={{ color: Colors.gray500, fontFamily: Font.display, fontSize: 20 }}>No pending ratings</Text>
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
            <Micro style={{ marginBottom: 2 }}>REVIEW REQUIRED · APR 20</Micro>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
            <X size={18} color={Colors.gray700} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, marginBottom: 8 }}>
          <Text style={s.title}>
            How was{' '}
            <Text style={[s.title, { fontFamily: Font.displayItalic, color: Colors.coral }]}>
              {pending.gameTitle}
            </Text>
            {'?'}
          </Text>
          <Text style={s.subtitle}>{pending.sport} · {pending.playerCount} players</Text>
        </View>

        {/* Main stars */}
        <View style={s.starsBlock}>
          <Micro style={{ marginBottom: 12 }}>YOUR RATING</Micro>
          <StarPicker value={overall} onChange={setOverall} size={42} />
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
            <Text style={s.bigNum}>{overall > 0 ? overall : '–'}</Text>
            {overall > 0 && <Text style={s.bigDec}>.0</Text>}
          </View>
          <Text style={{ fontSize: 11, color: Colors.gray500, marginTop: 4 }}>Tap a star to rate</Text>
        </View>

        {/* Attribute tags */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Micro style={{ marginBottom: 10 }}>WHAT WENT WELL</Micro>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ATTRIBUTES.map((a) => {
              const sel = selectedAttrs.includes(a);
              return (
                <TouchableOpacity
                  key={a}
                  onPress={() => toggleAttr(a)}
                  style={[s.attrTag, sel && s.attrTagSel]}
                  activeOpacity={0.8}
                >
                  <Text style={[s.attrTagTxt, sel && s.attrTagTxtSel]}>{a}</Text>
                  <View style={[s.attrCircle, sel && s.attrCircleSel]}>
                    {sel && <Check size={10} color={Colors.white} strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Attendance */}
        <View style={s.attendanceCard}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.ink }}>Attendance confirmed</Text>
            <Text style={{ fontSize: 11, color: Colors.gray500, marginTop: 2 }}>Counts toward your 96% streak</Text>
          </View>
          <Switch
            value={attended}
            onValueChange={setAttended}
            trackColor={{ false: Colors.gray200, true: Colors.coral }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Player ratings */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text style={s.playerRateTitle}>Rate the players</Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          {pending.players.map((player, i) => {
            const isHost = i === 0;
            return (
              <View key={player.id} style={[s.playerRow, i < pending.players.length - 1 && s.playerRowBorder]}>
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: player.avatar }} style={s.playerAv} contentFit="cover" />
                  {isHost && (
                    <View style={s.hostBadge}><Text style={{ fontSize: 8, color: Colors.white, fontWeight: '700' }}>H</Text></View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.playerName}>{player.name}</Text>
                  <Text style={s.playerRole}>{isHost ? 'Host' : 'Player'}</Text>
                </View>
                <MiniStarPicker
                  value={playerRatings[player.id] ?? 0}
                  onChange={(v) => setPlayerRatings((prev) => ({ ...prev, [player.id]: v }))}
                />
              </View>
            );
          })}
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },

  title: { fontFamily: Font.display, fontSize: 26, color: Colors.ink, textAlign: 'center', lineHeight: 32, marginBottom: 4 },
  subtitle: { fontSize: 12, color: Colors.gray500, textAlign: 'center' },

  starsBlock: { alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: Colors.gray150, marginHorizontal: 20, marginBottom: 24 },
  bigNum: { fontFamily: Font.displayItalic, fontSize: 48, color: Colors.coral, lineHeight: 52 },
  bigDec: { fontSize: 24, color: Colors.gray300, marginLeft: 2 },

  attrTag: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, width: '47%' },
  attrTagSel: { backgroundColor: Colors.coralSoft, borderColor: Colors.coralDim },
  attrTagTxt: { fontSize: 13, fontWeight: '500', color: Colors.ink },
  attrTagTxtSel: { color: Colors.coral },
  attrCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: Colors.gray300, alignItems: 'center', justifyContent: 'center' },
  attrCircleSel: { backgroundColor: Colors.coral, borderColor: Colors.coral },

  attendanceCard: { marginHorizontal: 20, marginBottom: 24, backgroundColor: Colors.gray100, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },

  playerRateTitle: { fontSize: 17, fontWeight: '600', color: Colors.ink, marginBottom: 4, marginTop: 8 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  playerRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray150 },
  playerAv: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gray200, borderWidth: 2, borderColor: Colors.white },
  hostBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.white },
  playerName: { fontSize: 13, fontWeight: '600', color: Colors.ink },
  playerRole: { fontSize: 11, color: Colors.gray500 },

  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray150, paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', gap: 12 },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  skipTxt: { fontSize: 14, fontWeight: '500', color: Colors.gray500 },
  submitBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.ink, borderRadius: 16, paddingVertical: 14 },
  submitTxt: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
