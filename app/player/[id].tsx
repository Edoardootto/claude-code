import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, MoreHorizontal, MapPin, Sparkles, CheckCircle } from 'lucide-react-native';
import { Colors, Font, Radius, MicroStyle } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

const REVIEWS = [
  { id: 'r1', fromId: 'jordan', text: 'Fantastic player — always on time, super competitive but fair. Would definitely play again.', rating: 5, game: 'Sunday Soccer', time: '2d ago' },
  { id: 'r2', fromId: 'priya', text: 'Great host, organizes games really well. The court was perfect and the vibe was excellent.', rating: 5, game: 'Saturday Tennis Social', time: '5d ago' },
];

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { allPlayers } = useStore();
  const user = allPlayers.find((p) => p.id === id) ?? allPlayers[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      {/* Header row */}
      <View style={[s.headerRow, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={18} color={Colors.gray700} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={s.iconBtn}><Share2 size={18} color={Colors.gray700} strokeWidth={1.8} /></TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}><MoreHorizontal size={18} color={Colors.gray700} strokeWidth={1.8} /></TouchableOpacity>
        </View>
      </View>

      {/* Hero */}
      <View style={s.hero}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <Image source={{ uri: user.avatar }} style={s.avatar} contentFit="cover" />
          {user.verified && (
            <View style={s.verifiedBadge}>
              <CheckCircle size={14} color={Colors.white} fill={Colors.white} strokeWidth={2.5} />
            </View>
          )}
        </View>
        <Text style={s.name}>{user.name}</Text>
        <Text style={s.handle}>{user.handle}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          <MapPin size={12} color={Colors.gray500} strokeWidth={1.8} />
          <Text style={s.location}>{user.location} · 2.1 mi away</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
          <TouchableOpacity style={[s.ctaBtn, { backgroundColor: Colors.ink, flex: 1 }]}>
            <Text style={[s.ctaBtnTxt, { color: Colors.white }]}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.ctaBtn, { backgroundColor: Colors.white, flex: 1 }]}>
            <Text style={[s.ctaBtnTxt, { color: Colors.ink }]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.ctaBtn, { backgroundColor: Colors.white, flex: 1 }]}>
            <Text style={[s.ctaBtnTxt, { color: Colors.ink }]}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Compatibility card */}
      {user.compatibility && (
        <View style={s.aiCard}>
          <View style={s.aiCircle1} />
          <View style={s.aiCircle2} />

          <View style={s.aiTag}>
            <Sparkles size={10} color={Colors.white} />
            <Micro style={{ color: Colors.white, letterSpacing: 1.2 }}>AI MATCH INSIGHT</Micro>
          </View>
          <Micro style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8, marginTop: 4 }}>COMPATIBILITY WITH YOU</Micro>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text style={s.aiInsight}>
              You both play tennis at similar skill, share 3 mutual friends, and prefer mornings. {user.name.split(' ')[0]} has hosted games you'd likely join — she rates well on punctuality and fair play.
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.aiScore}>{user.compatibility}</Text>
              <Text style={s.aiPct}>%</Text>
            </View>
          </View>
        </View>
      )}

      {/* Stats strip */}
      <View style={s.statsCard}>
        {[
          { val: user.gamesPlayed.toString(), label: 'GAMES', italic: false },
          { val: user.rating.toString(), label: 'RATING', italic: true },
          { val: `${user.showUpRate}%`, label: 'SHOW-UP', italic: false },
        ].map((st, i) => (
          <View key={st.label} style={[s.statCell, i > 0 && s.statCellBorder]}>
            <Text style={[s.statVal, st.italic && { color: Colors.coral, fontFamily: Font.displayItalic }]}>{st.val}</Text>
            <Micro>{st.label}</Micro>
          </View>
        ))}
      </View>

      {/* Sports */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Micro style={{ marginBottom: 10 }}>FAVORITE SPORTS</Micro>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {user.sports.map((sp) => (
            <View key={sp.name} style={s.sportChip}>
              <Text style={{ fontSize: 16 }}>
                {sp.name === 'Tennis' ? '🎾' : sp.name === 'Basketball' ? '🏀' : sp.name === 'Running' ? '🏃' : sp.name === 'Soccer' ? '⚽' : '🏐'}
              </Text>
              <Text style={s.sportChipName}>{sp.name}</Text>
              <View style={s.levelBadge}><Text style={s.levelTxt}>{sp.level.toFixed(1)}</Text></View>
            </View>
          ))}
        </View>
      </View>

      {/* Reviews */}
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Micro>RECENT REVIEWS</Micro>
          <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.coral }}>All · 23</Text>
        </View>
        {REVIEWS.map((rev) => {
          const reviewer = allPlayers.find((p) => p.id === rev.fromId);
          return (
            <View key={rev.id} style={s.reviewCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Image source={{ uri: reviewer?.avatar }} style={{ width: 28, height: 28, borderRadius: 14 }} contentFit="cover" />
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.ink }}>{reviewer?.name}</Text>
                    <Text style={{ fontSize: 10, color: Colors.gray500 }}>{rev.game} · {rev.time}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Text key={n} style={{ fontSize: 10, color: n <= rev.rating ? Colors.amber : Colors.gray300 }}>★</Text>
                  ))}
                </View>
              </View>
              <Text style={{ fontSize: 12, color: Colors.gray700, lineHeight: 18 }}>{rev.text}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },

  hero: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: Colors.white, backgroundColor: Colors.gray200 },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.bg },
  name: { fontFamily: Font.display, fontSize: 28, color: Colors.ink, letterSpacing: -0.5, marginBottom: 2 },
  handle: { fontSize: 11, color: Colors.gray500, marginBottom: 6, letterSpacing: 0.5 },
  location: { fontSize: 12, color: Colors.gray600 },
  ctaBtn: { paddingVertical: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  ctaBtnTxt: { fontSize: 13, fontWeight: '600' },

  aiCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: Radius.card, padding: 18, overflow: 'hidden', backgroundColor: Colors.coral },
  aiCircle1: { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  aiCircle2: { position: 'absolute', top: -25, right: -25, width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  aiTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start' },
  aiInsight: { fontSize: 12, color: 'rgba(255,255,255,0.95)', lineHeight: 18, flex: 1, marginRight: 12 },
  aiScore: { fontFamily: Font.display, fontSize: 42, color: Colors.white, lineHeight: 44 },
  aiPct: { fontSize: 20, color: 'rgba(255,255,255,0.7)', marginTop: -4 },

  statsCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 16, flexDirection: 'row' },
  statCell: { flex: 1, alignItems: 'center' },
  statCellBorder: { borderLeftWidth: 1, borderLeftColor: Colors.border },
  statVal: { fontFamily: Font.display, fontSize: 24, color: Colors.ink, lineHeight: 28, marginBottom: 2 },

  sportChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 12 },
  sportChipName: { fontSize: 12, fontWeight: '500', color: Colors.ink },
  levelBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: Colors.ink },
  levelTxt: { fontSize: 9, color: Colors.white, fontWeight: '700' },

  reviewCard: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 18, padding: 14, marginBottom: 8 },
});
