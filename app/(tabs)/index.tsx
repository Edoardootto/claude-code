import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Search, Bell, Clock, ChevronRight, X } from 'lucide-react-native';
import { Colors, Font, Radius, SportEmoji, MicroStyle, SportColors } from '@/constants/theme';
import { useStore } from '@/store/useStore';

// ─── Primitives ───────────────────────────────────────────────────────────────

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[s.micro, style as any]}>{children}</Text>;
}

function Avatar({ uri, size = 36, style }: { uri: string; size?: number; style?: object }) {
  return (
    <Image
      source={{ uri }}
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: Colors.gray200 }, style as any]}
      contentFit="cover"
    />
  );
}

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Text key={n} style={{ fontSize: size, color: n <= rating ? Colors.amber : Colors.gray300 }}>★</Text>
      ))}
    </View>
  );
}

// ─── My Games Tab ─────────────────────────────────────────────────────────────

function StreakCard() {
  return (
    <View style={[s.streakCard, { marginHorizontal: 20, marginBottom: 20 }]}>
      <View style={s.streakBlob} />
      <Micro style={{ color: Colors.coralDim, letterSpacing: 1.4, marginBottom: 6 }}>WEEKLY STREAK</Micro>
      <Text style={s.streakHeading}>
        {"You're on a "}
        <Text style={[s.streakHeading, { fontStyle: 'italic', color: '#FFE8E5' }]}>7-game</Text>
        {" roll"}
      </Text>
      <View style={s.statRow}>
        {[{ val: '4.8', label: 'AVG RATING' }, { val: '2,840', label: 'POINTS' }, { val: '#12', label: 'RANK' }].map((stat, i) => (
          <View key={stat.label} style={[s.statCell, i > 0 && s.statCellBorder]}>
            <Text style={s.statVal}>{stat.val}</Text>
            <Micro style={{ opacity: 0.6 }}>{stat.label}</Micro>
          </View>
        ))}
      </View>
    </View>
  );
}

function MyGamesTab() {
  const { allGames, allPlayers, activities } = useStore();
  const joined = allGames.filter((g) => g.joined);

  return (
    <>
      <StreakCard />

      <View style={s.sectionRow}>
        <Micro>UPCOMING · {joined.length} GAMES</Micro>
        <Text style={s.link}>See all</Text>
      </View>

      {joined.map((game, i) => {
        const spots = game.playersMax - game.playersJoined;
        const urgent = spots <= 2;
        return (
          <TouchableOpacity key={game.id} style={s.gameCard} onPress={() => router.push(`/game/${game.id}` as any)} activeOpacity={0.8}>
            <View style={[s.dateChip, { backgroundColor: i === 0 ? Colors.coralSoft : Colors.gray100 }]}>
              <Text style={s.dateDay}>{game.dateDay}</Text>
              <Micro>{game.dateMonth}</Micro>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Micro style={{ marginBottom: 2 }}>{game.sport} · {game.format}</Micro>
              <Text style={s.gameTitle} numberOfLines={1}>{game.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Text style={s.gameMeta}>{game.location}</Text>
                <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: Colors.gray400 }} />
                <Clock size={10} color={Colors.gray400} strokeWidth={1.8} />
                <Text style={s.gameMeta}>{game.time}</Text>
              </View>
            </View>
            {urgent ? (
              <View style={[s.spotPill, { backgroundColor: Colors.coralSoft }]}>
                <View style={s.pulseDot} />
                <Text style={[s.spotText, { color: Colors.coral }]}>{spots} spots</Text>
              </View>
            ) : (
              <View style={[s.spotPill, { backgroundColor: Colors.gray100 }]}>
                <Text style={[s.spotText, { color: Colors.gray600 }]}>{game.playersJoined}/{game.playersMax}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={[s.sectionRow, { marginTop: 24 }]}>
        <Micro>FRIEND ACTIVITY</Micro>
        <Text style={s.link}>All</Text>
      </View>

      {activities.map((act) => {
        const user = allPlayers.find((u) => u.id === act.userId);
        const name = user?.name ?? '';
        const rest = act.text.startsWith(name) ? act.text.slice(name.length).trim() : act.text;
        return (
          <View key={act.id} style={s.actRow}>
            <View style={{ position: 'relative' }}>
              <Avatar uri={user?.avatar ?? ''} size={36} />
              {act.hasBadge && (
                <View style={s.actBadge}><Text style={{ fontSize: 8, color: Colors.white }}>★</Text></View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.actText}><Text style={{ fontWeight: '700' }}>{name}</Text> {rest}</Text>
              <Text style={s.actTime}>{act.time}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
}

// ─── Ratings Tab ─────────────────────────────────────────────────────────────

function RatingsTab() {
  const { pendingRatings, pastRatings } = useStore();
  return (
    <>
      {/* Light rep card */}
      <View style={[s.repCard, { marginHorizontal: 20, marginBottom: 20 }]}>
        <View>
          <Micro style={{ marginBottom: 4 }}>YOUR REPUTATION</Micro>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
            <Text style={s.repNum}>4.8</Text>
            <Text style={{ fontSize: 18, color: Colors.coral, marginBottom: 6 }}>★</Text>
          </View>
          <Text style={s.repSub}>From 23 players</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={s.repStat}>17 rated</Text>
          <Text style={s.repStat}>92% show-up</Text>
          <Text style={[s.repStat, { color: Colors.coral }]}>4 pending</Text>
        </View>
      </View>

      <View style={s.sectionRow}>
        <Micro>PENDING · RATE THESE GAMES</Micro>
        <Text style={s.link}>Skip</Text>
      </View>

      {pendingRatings.map((pr) => (
        <TouchableOpacity key={pr.gameId} style={s.pendCard} onPress={() => router.push(`/rate/${pr.gameId}` as any)} activeOpacity={0.8}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <View style={[s.sportTile, {
              backgroundColor: pr.iconColor === 'coral' ? Colors.coralSoft : pr.iconColor === 'blue' ? '#EFF6FF' : '#ECFDF5',
            }]}>
              <Text style={{ fontSize: 22 }}>{SportEmoji[pr.sport] ?? '🏅'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pendTitle}>{pr.gameTitle}</Text>
              <Text style={s.pendMeta}>{pr.location} · {pr.daysAgo}d ago</Text>
            </View>
            {pr.isNew && (
              <View style={s.newBadge}><Text style={{ fontSize: 10, color: Colors.coral, fontWeight: '700' }}>NEW</Text></View>
            )}
          </View>
          <View style={s.pendBottom}>
            <View style={{ flexDirection: 'row' }}>
              {pr.players.slice(0, 4).map((p, i) => (
                <Image key={p.id} source={{ uri: p.avatar }} style={[s.stackAv, { marginLeft: i > 0 ? -8 : 0 }]} contentFit="cover" />
              ))}
            </View>
            <Text style={s.pendRateText}>Rate <Text style={{ color: Colors.ink, fontWeight: '700' }}>{pr.playerCount} players</Text> & host</Text>
            <ChevronRight size={16} color={Colors.gray400} strokeWidth={2} />
          </View>
        </TouchableOpacity>
      ))}

      <View style={[s.sectionRow, { marginTop: 24 }]}>
        <Micro>PAST RATINGS</Micro>
        <Text style={s.link}>All</Text>
      </View>

      {pastRatings.map((pr) => (
        <View key={pr.id} style={s.pastCard}>
          <View style={[s.pastTile, { backgroundColor: Colors.gray100 }]}>
            <Text style={{ fontSize: 18 }}>{SportEmoji[pr.sport] ?? '🏅'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.pastTitle}>{pr.gameTitle}</Text>
            <Text style={s.pastMeta}>Rated {pr.playerCount} players · {pr.daysAgo}d ago</Text>
          </View>
          <StarRow rating={pr.stars} size={12} />
        </View>
      ))}
    </>
  );
}

// ─── Friends Tab ──────────────────────────────────────────────────────────────

const LEADERBOARD = [
  { userId: 'maya', rank: 1, games: 32, rating: 4.9, score: 2840 },
  { userId: 'jordan', rank: 2, games: 28, rating: 4.9, score: 2610 },
  { userId: 'sam', rank: 3, games: 25, rating: 4.6, score: 2380 },
  { userId: 'priya', rank: 4, games: 22, rating: 4.7, score: 2110 },
  { userId: 'alex', rank: 5, games: 19, rating: 4.8, score: 1920, isYou: true },
  { userId: 'leo', rank: 6, games: 17, rating: 4.5, score: 1680 },
  { userId: 'eva', rank: 7, games: 15, rating: 4.8, score: 1510 },
  { userId: 'tom', rank: 8, games: 13, rating: 4.4, score: 1290 },
];
const RANK_COLORS: Record<number, string> = { 1: '#D4A017', 2: '#8E8E93', 3: '#CD7F32' };

const SPORT_FILTERS_FRIENDS = ['All', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Running'];

function FriendsSubTab({ searchQuery }: { searchQuery: string }) {
  const { allPlayers } = useStore();
  const [sportFilter, setSportFilter] = useState('All');

  const filtered = allPlayers.filter(p => {
    const matchSport = sportFilter === 'All' || p.sports.some(sp => sp.name === sportFilter);
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSport && matchSearch;
  });

  return (
    <>
      {/* Sport filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {SPORT_FILTERS_FRIENDS.map(sp => {
          const on = sportFilter === sp;
          const color = SportColors[sp];
          return (
            <TouchableOpacity key={sp} onPress={() => setSportFilter(sp)}
              style={[s.sportFilterChip, on && { backgroundColor: color ?? Colors.ink, borderColor: color ?? Colors.ink }]}>
              <Text style={[s.sportFilterTxt, on && { color: Colors.white }]}>{sp}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Nearby section */}
      <View style={s.sectionRow}>
        <Micro>PEOPLE NEAR YOU</Micro>
        <Text style={s.link}>See all</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {allPlayers.slice(0, 5).map((u) => (
          <TouchableOpacity key={u.id} style={s.discCard} onPress={() => router.push(`/player/${u.id}` as any)}>
            <View style={{ position: 'relative', marginBottom: 6 }}>
              <Avatar uri={u.avatar} size={56} />
              {u.online && <View style={s.onlineDot} />}
            </View>
            <Text style={s.discName}>{u.name}</Text>
            <Text style={s.discSub}>{u.compatibility ?? 85}%</Text>
            <Text style={s.discSport}>{u.sports[0].name}</Text>
            <View style={s.followBtn}><Text style={s.followBtnTxt}>+ Follow</Text></View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Friends grid */}
      <View style={s.sectionRow}>
        <Micro>YOUR FRIENDS · {filtered.length}</Micro>
      </View>
      {filtered.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Text style={{ fontSize: 13, color: Colors.gray500 }}>No friends match this filter</Text>
        </View>
      ) : (
        <View style={s.grid}>
          {filtered.map((f) => (
            <TouchableOpacity key={f.id} style={s.friendCard} onPress={() => router.push(`/player/${f.id}` as any)}>
              <View style={{ position: 'relative', marginBottom: 6 }}>
                <Avatar uri={f.avatar} size={52} />
                {f.online && <View style={s.onlineDot} />}
              </View>
              <Text style={s.friendName} numberOfLines={1}>{f.name}</Text>
              <Text style={s.friendSports} numberOfLines={1}>{f.sports.map(sp => sp.name).join(' · ')}</Text>
              <View style={s.compatPill}>
                <Text style={s.compatTxt}>{f.compatibility ?? 80}% match</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

function LeaderboardSubTab() {
  const { allPlayers } = useStore();
  return (
    <View style={[s.leaderCard, { marginHorizontal: 20 }]}>
      <View style={s.leaderHead}>
        <Text style={s.leaderTitle}>Top players</Text>
        <View style={s.leaderBadge}><Text style={s.leaderBadgeTxt}>APRIL</Text></View>
      </View>
      {LEADERBOARD.map((row, i) => {
        const user = allPlayers.find((u) => u.id === row.userId);
        const isYou = (row as any).isYou as boolean;
        return (
          <TouchableOpacity
            key={row.userId}
            style={[s.leaderRow, { backgroundColor: isYou ? Colors.coralSoft : Colors.white }, i < LEADERBOARD.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.gray150 }]}
            onPress={() => !isYou && router.push(`/player/${row.userId}` as any)}
          >
            <Text style={[s.leaderRank, { color: RANK_COLORS[row.rank] ?? Colors.gray500 }]}>{row.rank}</Text>
            <Avatar uri={user?.avatar ?? 'https://i.pravatar.cc/200?img=8'} size={36} />
            <View style={{ flex: 1 }}>
              <Text style={s.leaderName}>{isYou ? 'You' : user?.name}</Text>
              <Text style={s.leaderSub}>{row.games} games · {row.rating} ★</Text>
            </View>
            <Text style={[s.leaderScore, { color: isYou ? Colors.coral : Colors.ink }]}>{row.score.toLocaleString()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function FriendsTab() {
  const [sub, setSub] = useState<'friends' | 'discover' | 'leaderboard'>('friends');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { allPlayers } = useStore();

  return (
    <>
      {/* Search bar */}
      <View style={s.friendSearchRow}>
        {showSearch ? (
          <View style={s.friendSearchBar}>
            <Search size={14} color={Colors.gray400} strokeWidth={2} />
            <TextInput style={s.friendSearchInput} placeholder="Search people..." placeholderTextColor={Colors.gray400} value={search} onChangeText={setSearch} autoFocus />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearch(''); }}>
              <X size={14} color={Colors.gray400} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={s.friendSearchBtn} onPress={() => setShowSearch(true)}>
            <Search size={15} color={Colors.gray600} strokeWidth={1.8} />
            <Text style={s.friendSearchPlaceholder}>Search friends, players...</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sub tabs */}
      <View style={s.innerBar}>
        {(['friends', 'discover', 'leaderboard'] as const).map((t) => (
          <TouchableOpacity key={t} onPress={() => setSub(t)} style={s.innerTabItem}>
            <Text style={[s.innerTabTxt, sub === t && s.innerTabActive]}>
              {t === 'friends' ? 'Friends' : t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
            {sub === t && <View style={s.innerUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {sub === 'friends' && <FriendsSubTab searchQuery={search} />}
      {sub === 'discover' && (
        <View style={[s.grid, { paddingHorizontal: 20, paddingTop: 16 }]}>
          {allPlayers
            .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()))
            .map((u) => (
              <TouchableOpacity key={u.id} style={s.friendCard} onPress={() => router.push(`/player/${u.id}` as any)}>
                <View style={{ position: 'relative', marginBottom: 6 }}>
                  <Avatar uri={u.avatar} size={52} />
                  {u.online && <View style={s.onlineDot} />}
                </View>
                <Text style={s.friendName} numberOfLines={1}>{u.name}</Text>
                <Text style={s.friendSports} numberOfLines={1}>{u.sports[0].name}</Text>
                <View style={{ marginTop: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: Colors.coralSoft }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: Colors.coral }}>{u.compatibility ?? 80}% match</Text>
                </View>
                <View style={[s.followBtn, { marginTop: 6 }]}><Text style={s.followBtnTxt}>+ Follow</Text></View>
              </TouchableOpacity>
            ))}
        </View>
      )}
      {sub === 'leaderboard' && <LeaderboardSubTab />}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FeedScreen() {
  const [tab, setTab] = useState<'games' | 'ratings' | 'friends'>('games');
  const hour = new Date().getHours();
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const part = hour < 12 ? 'MORNING' : hour < 18 ? 'AFTERNOON' : 'EVENING';

  return (
    <SafeAreaView style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Micro style={{ marginBottom: 2 }}>{day} {part}</Micro>
            <Text style={s.greeting}>Hey, Alex</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[Search, Bell].map((Icon, i) => (
              <View key={i} style={s.iconBtn}>
                <Icon size={18} color={Colors.gray700} strokeWidth={1.8} />
                {i === 1 && <View style={s.notifDot} />}
              </View>
            ))}
          </View>
        </View>

        {/* Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {[{ key: 'games', label: 'My Games' }, { key: 'ratings', label: 'Ratings' }, { key: 'friends', label: 'Friends' }].map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setTab(p.key as any)}
              style={[s.navPill, tab === p.key ? s.navPillActive : s.navPillInactive]}
            >
              <Text style={[s.navPillTxt, tab === p.key ? s.navPillTxtActive : s.navPillTxtInactive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {tab === 'games' && <MyGamesTab />}
        {tab === 'ratings' && <RatingsTab />}
        {tab === 'friends' && <FriendsTab />}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  micro: { ...MicroStyle } as any,

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  greeting: { fontSize: 28, fontWeight: '800', color: Colors.ink, letterSpacing: -0.6 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.coral },

  navPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  navPillActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  navPillInactive: { backgroundColor: Colors.white, borderColor: Colors.border },
  navPillTxt: { fontSize: 14, fontWeight: '500' },
  navPillTxtActive: { color: Colors.white },
  navPillTxtInactive: { color: Colors.gray600 },

  streakCard: { backgroundColor: Colors.ink, borderRadius: 28, padding: 24, overflow: 'hidden' },
  streakBlob: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,90,78,0.35)' },
  streakHeading: { fontSize: 26, fontWeight: '700', color: Colors.white, marginBottom: 20, lineHeight: 32 },
  statRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 16 },
  statCell: { flex: 1 },
  statCellBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.15)', paddingLeft: 16 },
  statVal: { fontSize: 26, fontWeight: '700', color: Colors.white, lineHeight: 30, marginBottom: 2 },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  link: { fontSize: 12, fontWeight: '600', color: Colors.coral },

  gameCard: { marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  dateChip: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontSize: 22, fontWeight: '800', color: Colors.ink, lineHeight: 24 },
  gameTitle: { fontSize: 15, fontWeight: '600', color: Colors.ink, letterSpacing: -0.15 },
  gameMeta: { fontSize: 11, color: Colors.gray500 },
  spotPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.coral },
  spotText: { fontSize: 11, fontWeight: '600' },

  actRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 20, paddingVertical: 10 },
  actBadge: { position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg },
  actText: { fontSize: 13, color: Colors.ink, lineHeight: 18 },
  actTime: { fontSize: 11, color: Colors.gray500, marginTop: 2 },

  repCard: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.card, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  repNum: { fontSize: 44, fontWeight: '800', color: Colors.ink, lineHeight: 48 },
  repSub: { fontSize: 11, color: Colors.gray500, marginTop: 2 },
  repStat: { fontSize: 13, fontWeight: '500', color: Colors.ink },

  pendCard: { marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 14 },
  sportTile: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pendTitle: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  pendMeta: { fontSize: 11, color: Colors.gray500 },
  newBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: Colors.coralSoft },
  pendBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: Colors.gray150, paddingTop: 12 },
  stackAv: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: Colors.white },
  pendRateText: { flex: 1, fontSize: 12, color: Colors.gray500 },

  pastCard: { marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pastTile: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pastTitle: { fontSize: 13, fontWeight: '600', color: Colors.ink },
  pastMeta: { fontSize: 11, color: Colors.gray500 },

  innerBar: { flexDirection: 'row', gap: 24, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 16 },
  innerTabItem: { paddingVertical: 10, position: 'relative' },
  innerTabTxt: { fontSize: 14, color: Colors.gray500 },
  innerTabActive: { color: Colors.ink, fontWeight: '600' },
  innerUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.ink },

  discCard: { width: 120, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 12, alignItems: 'center' },
  discName: { fontSize: 12, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  discSub: { fontSize: 10, fontWeight: '700', color: Colors.coral, textAlign: 'center' },
  discSport: { fontSize: 10, color: Colors.gray500, textAlign: 'center', marginBottom: 6 },

  friendSearchRow: { paddingHorizontal: 20, marginBottom: 12 },
  friendSearchBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, height: 42, paddingHorizontal: 12 },
  friendSearchPlaceholder: { fontSize: 13, color: Colors.gray400 },
  friendSearchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.coral + '60', borderRadius: 14, height: 42, paddingHorizontal: 12 },
  friendSearchInput: { flex: 1, fontSize: 13, color: Colors.ink },

  sportFilterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  sportFilterTxt: { fontSize: 12, fontWeight: '600', color: Colors.gray600 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 },
  friendCard: { flex: 1, minWidth: '44%', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 14, alignItems: 'center' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.green, borderWidth: 2, borderColor: Colors.white },
  friendName: { fontSize: 13, fontWeight: '600', color: Colors.ink, textAlign: 'center' },
  friendSports: { fontSize: 10, color: Colors.gray500, textAlign: 'center', marginTop: 2 },
  compatPill: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: Colors.coralSoft },
  compatTxt: { fontSize: 10, fontWeight: '700', color: Colors.coral },
  followBtn: { width: '100%', backgroundColor: Colors.ink, borderRadius: 10, paddingVertical: 6, alignItems: 'center' },
  followBtnTxt: { fontSize: 11, fontWeight: '700', color: Colors.white },

  leaderCard: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.card, overflow: 'hidden' },
  leaderHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.ink, paddingHorizontal: 16, paddingVertical: 14 },
  leaderTitle: { fontSize: 20, fontWeight: '700', color: Colors.white },
  leaderBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)' },
  leaderBadgeTxt: { fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.white },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  leaderRank: { fontWeight: '700', fontSize: 12, width: 22 },
  leaderName: { fontSize: 13, fontWeight: '500', color: Colors.ink },
  leaderSub: { fontSize: 10, color: Colors.gray500 },
  leaderScore: { fontWeight: '700', fontSize: 13 },
});
