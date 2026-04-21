import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, Calendar, MapPin, Users, Clock, Wind, Droplets, MessageSquare, Shield } from 'lucide-react-native';
import { Colors, Font, Radius, MicroStyle, SportEmoji } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { allGames, allPlayers, joinGame, leaveGame } = useStore();

  const game = allGames.find((g) => g.id === id) ?? allGames[0];
  const host = allPlayers.find((p) => p.id === game.hostId);

  const infoGrid = [
    { Icon: Calendar, label: 'WHEN', value: `${game.dateDay} ${game.dateMonth}, ${game.time}`, sub: `${game.duration}` },
    { Icon: MapPin, label: 'WHERE', value: game.location, sub: game.locationDetail },
    { Icon: Users, label: 'PLAYERS', value: `${game.playersJoined} / ${game.playersMax}`, sub: `${game.playersMax - game.playersJoined} spots open` },
    { Icon: Clock, label: 'SKILL', value: game.skill, sub: '2.5 – 4.0 ★' },
  ];

  const allSlots = [
    ...game.players,
    ...Array(Math.max(0, game.playersMax - game.players.length)).fill(null),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Dark header */}
        <View style={[s.darkHeader, { paddingTop: insets.top + 16 }]}>
          <View style={s.blobDecor} />

          {/* Top row */}
          <View style={s.topRow}>
            <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
              <ChevronLeft size={18} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn}>
              <Share2 size={16} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Sport tag */}
          <View style={s.sportTag}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.coralDim }} />
            <Micro style={{ color: Colors.coralDim }}>{game.sport} · {game.format}</Micro>
          </View>

          {/* Title */}
          <Text style={s.heroTitle}>
            {game.title.split(' ').slice(0, -1).join(' ') + ' '}
            <Text style={[s.heroTitle, { fontStyle: 'italic', color: Colors.coralDim }]}>
              {game.title.split(' ').pop()}
            </Text>
          </Text>

          {/* Host */}
          {host && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Image source={{ uri: host.avatar }} style={{ width: 20, height: 20, borderRadius: 10 }} contentFit="cover" />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                Hosted by {host.name} · {host.rating} ★
              </Text>
            </View>
          )}
        </View>

        {/* Info grid — pulled up */}
        <View style={s.infoGrid}>
          {infoGrid.map(({ Icon, label, value, sub }) => (
            <View key={label} style={s.infoCell}>
              <View style={s.infoIcon}>
                <Icon size={16} color={Colors.gray600} strokeWidth={1.8} />
              </View>
              <View>
                <Micro>{label}</Micro>
                <Text style={s.infoVal}>{value}</Text>
                <Text style={s.infoSub}>{sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Micro style={{ marginBottom: 8 }}>DESCRIPTION</Micro>
          <Text style={s.desc}>{game.description}</Text>
        </View>

        {/* Safety reminder */}
        <View style={s.safetyCard}>
          <View style={s.safetyIcon}>
            <Shield size={14} color={Colors.gray500} strokeWidth={1.8} />
          </View>
          <Text style={s.safetyTxt}>
            Meet in public, share your location with a friend, and trust your instincts. Stay safe out there.
          </Text>
        </View>

        {/* Weather */}
        <View style={s.weatherCard}>
          <View style={s.weatherIcon}>
            <Text style={{ fontSize: 24 }}>☀️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
              <Text style={s.weatherTemp}>{game.weather.temp}</Text>
              <Text style={{ fontSize: 11, color: Colors.gray500, marginBottom: 4 }}>{game.weather.condition}</Text>
            </View>
            <Text style={{ fontSize: 10, color: Colors.gray500, marginTop: 2 }}>→ 68° at 8:00 PM</Text>
          </View>
          <View style={s.weatherStats}>
            {[
              { Icon: Wind, val: game.weather.wind, label: 'WIND' },
              { Icon: Droplets, val: `${game.weather.rainPct}%`, label: 'RAIN' },
            ].map(({ Icon, val, label }) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon size={11} color={Colors.gray400} strokeWidth={1.8} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.ink }}>{val}</Text>
                <Micro>{label}</Micro>
              </View>
            ))}
          </View>
        </View>

        {/* Players */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
          <Micro>PLAYERS · {game.playersJoined} OF {game.playersMax}</Micro>
        </View>
        <View style={s.playersGrid}>
          {allSlots.slice(0, game.playersMax).map((player, i) => {
            if (!player) {
              return (
                <View key={`empty-${i}`} style={s.playerSlot}>
                  <View style={s.emptyAvatar}>
                    <Text style={{ color: Colors.gray400, fontSize: 18 }}>+</Text>
                  </View>
                  <Text style={s.playerName}>Open</Text>
                </View>
              );
            }
            const isHost = player.id === game.hostId;
            return (
              <View key={player.id} style={s.playerSlot}>
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: player.avatar }}
                    style={s.playerAvatar}
                    contentFit="cover"
                  />
                  {isHost && (
                    <View style={s.hostBadge}>
                      <Text style={{ fontSize: 9, color: Colors.white, fontWeight: '700' }}>H</Text>
                    </View>
                  )}
                </View>
                <Text style={s.playerName}>{player.name.split(' ')[0]}</Text>
                <Text style={s.playerRating}>{player.rating} ★</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={[s.actionBar, { bottom: 88 + insets.bottom / 2 }]}>
        <TouchableOpacity style={s.chatBtn} onPress={() => router.push(`/chat/${game.id}` as any)}>
          <MessageSquare size={16} color={Colors.ink} strokeWidth={2} />
          <Text style={s.chatBtnTxt}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.mainBtn, game.joined && { backgroundColor: Colors.gray700 }]}
          onPress={() => game.joined ? leaveGame(game.id) : joinGame(game.id)}
        >
          <Text style={s.mainBtnTxt}>{game.joined ? 'Leave game' : 'Join game'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  darkHeader: { backgroundColor: Colors.ink, paddingHorizontal: 20, paddingBottom: 40, overflow: 'hidden' },
  blobDecor: { position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,90,78,0.4)' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  sportTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,90,78,0.2)', borderWidth: 1, borderColor: 'rgba(255,90,78,0.3)', alignSelf: 'flex-start', marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: Colors.white, lineHeight: 38, letterSpacing: -0.5, marginBottom: 12 },

  infoGrid: { marginHorizontal: 16, marginTop: -20, backgroundColor: Colors.white, borderRadius: Radius.card, borderWidth: 1, borderColor: Colors.border, padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16, zIndex: 10 },
  infoCell: { width: '45%', flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  infoVal: { fontSize: 13, fontWeight: '700', color: Colors.ink, marginTop: 2 },
  infoSub: { fontSize: 11, color: Colors.gray500 },

  safetyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 16, backgroundColor: Colors.gray100, borderRadius: 14, padding: 12 },
  safetyIcon: { width: 26, height: 26, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  safetyTxt: { flex: 1, fontSize: 12, color: Colors.gray600, lineHeight: 17 },

  desc: { fontSize: 13, color: Colors.gray700, lineHeight: 20 },

  weatherCard: { marginHorizontal: 20, marginTop: 16, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  weatherIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FFE4A0', alignItems: 'center', justifyContent: 'center' },
  weatherTemp: { fontSize: 22, fontWeight: '700', color: Colors.ink },
  weatherStats: { borderLeftWidth: 1, borderLeftColor: Colors.border, paddingLeft: 14, gap: 6 },

  playersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 },
  playerSlot: { width: '22%', alignItems: 'center', gap: 4 },
  emptyAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: Colors.gray300, borderStyle: 'dashed', backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  playerAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: Colors.white, backgroundColor: Colors.gray200 },
  hostBadge: { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.bg },
  playerName: { fontSize: 10, fontWeight: '600', color: Colors.ink, textAlign: 'center' },
  playerRating: { fontSize: 9, color: Colors.gray500, textAlign: 'center' },

  actionBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', gap: 8 },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingVertical: 14 },
  chatBtnTxt: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  mainBtn: { flex: 1.4, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ink, borderRadius: 16, paddingVertical: 14 },
  mainBtnTxt: { fontSize: 14, fontWeight: '600', color: Colors.white },
});
