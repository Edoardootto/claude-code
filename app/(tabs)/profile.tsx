import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ChevronRight, Edit3, Check, X, Star, Trophy, Bell, Shield, LogOut,
  MapPin, CheckCircle, Settings, ChevronLeft,
} from 'lucide-react-native';
import { Colors, MicroStyle, SportEmoji, SportColors, Radius } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

const BADGES = [
  { id: 'regular', emoji: '🏅', label: 'Regular', desc: '10+ games', earned: true },
  { id: 'hotstreak', emoji: '🔥', label: 'Hot Streak', desc: '5 in a row', earned: true },
  { id: 'tophost', emoji: '⭐', label: 'Top Host', desc: '4.8+ rating', earned: true },
  { id: 'punctual', emoji: '⏰', label: 'Punctual', desc: '100% on-time', earned: true },
  { id: 'socialite', emoji: '🤝', label: 'Socialite', desc: '20+ friends', earned: false },
  { id: 'mvp', emoji: '👑', label: 'MVP', desc: '50+ games', earned: false },
];

const SETTINGS_SECTIONS = [
  {
    title: 'Notifications',
    items: [
      { label: 'Game reminders', toggle: true, defaultOn: true },
      { label: 'New friend requests', toggle: true, defaultOn: true },
      { label: 'Chat messages', toggle: true, defaultOn: false },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { label: 'Show location', toggle: true, defaultOn: true },
      { label: 'Public profile', toggle: true, defaultOn: true },
    ],
  },
];

export default function ProfileScreen() {
  const { currentUser, userPoints, allGames } = useStore();
  const hostedGames = allGames.filter(g => g.hostId === currentUser.id).length;

  const [tab, setTab] = useState<'profile' | 'badges' | 'settings'>('profile');
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(currentUser.bio ?? 'Love playing sports and meeting new people. Always up for a good game!');
  const [bioDraft, setBioDraft] = useState(bio);
  const [sports, setSports] = useState(currentUser.sports);
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    'Game reminders': true, 'New friend requests': true, 'Chat messages': false,
    'Show location': true, 'Public profile': true,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* ── Hero Header ── */}
        <View style={p.hero}>
          <View style={p.heroBlob} />
          <View style={p.heroBlob2} />

          {/* Top row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => router.push(`/player/${currentUser.id}` as any)} style={p.iconBtn}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.coralDim }}>VIEW</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('settings')} style={p.iconBtn}>
              <Settings size={16} color={Colors.coralDim} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={{ position: 'relative', marginBottom: 14 }}>
            <Image source={{ uri: currentUser.avatar }} style={p.avatar} contentFit="cover" />
            {currentUser.verified && (
              <View style={p.verifiedBadge}>
                <CheckCircle size={13} color={Colors.white} fill={Colors.white} strokeWidth={2} />
              </View>
            )}
            <TouchableOpacity style={p.editAvatarBtn}>
              <Edit3 size={11} color={Colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <Text style={p.name}>{currentUser.name}</Text>
          <Text style={p.handle}>{currentUser.handle}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <MapPin size={11} color={Colors.coralDim} strokeWidth={1.8} />
            <Text style={{ fontSize: 12, color: Colors.coralDim }}>{currentUser.location}</Text>
          </View>

          {/* Points pill */}
          <View style={p.pointsPill}>
            <Trophy size={12} color={Colors.amber} strokeWidth={2} />
            <Text style={{ fontSize: 13, fontWeight: '800', color: Colors.white }}>{userPoints.toLocaleString()} pts</Text>
            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>· Rank #5</Text>
          </View>
        </View>

        {/* ── Stats Bar ── */}
        <View style={p.statsCard}>
          {[
            { val: currentUser.gamesPlayed.toString(), label: 'GAMES' },
            { val: hostedGames.toString(), label: 'HOSTED' },
            { val: currentUser.rating.toFixed(1), label: 'RATING', coral: true },
            { val: `${currentUser.showUpRate}%`, label: 'SHOW-UP' },
          ].map((st, i) => (
            <View key={st.label} style={[p.statCell, i > 0 && { borderLeftWidth: 1, borderLeftColor: Colors.border }]}>
              <Text style={[p.statVal, (st as any).coral && { color: Colors.coral, fontStyle: 'italic' }]}>{st.val}</Text>
              <Micro>{st.label}</Micro>
            </View>
          ))}
        </View>

        {/* ── Sub tabs ── */}
        <View style={p.tabBar}>
          {(['profile', 'badges', 'settings'] as const).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={p.tabItem}>
              <Text style={[p.tabTxt, tab === t && p.tabTxtOn]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
              {tab === t && <View style={p.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <>
            {/* Bio */}
            <View style={p.section}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Micro>BIO</Micro>
                {!editingBio ? (
                  <TouchableOpacity onPress={() => { setBioDraft(bio); setEditingBio(true); }} style={p.editBtn}>
                    <Edit3 size={12} color={Colors.gray600} strokeWidth={2} />
                    <Text style={p.editBtnTxt}>Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={() => setEditingBio(false)} style={[p.editBtn, { borderColor: Colors.gray300 }]}>
                      <X size={12} color={Colors.gray500} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setBio(bioDraft); setEditingBio(false); }} style={[p.editBtn, { backgroundColor: Colors.ink, borderColor: Colors.ink }]}>
                      <Check size={12} color={Colors.white} strokeWidth={2.5} />
                      <Text style={[p.editBtnTxt, { color: Colors.white }]}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {editingBio ? (
                <TextInput
                  style={p.bioInput}
                  value={bioDraft}
                  onChangeText={setBioDraft}
                  multiline
                  autoFocus
                  maxLength={180}
                  placeholder="Tell people about yourself..."
                  placeholderTextColor={Colors.gray400}
                />
              ) : (
                <Text style={p.bioTxt}>{bio}</Text>
              )}
            </View>

            {/* Sports */}
            <View style={p.section}>
              <Micro style={{ marginBottom: 12 }}>FAVORITE SPORTS</Micro>
              {sports.map((sp) => {
                const color = SportColors[sp.name] ?? Colors.coral;
                return (
                  <View key={sp.name} style={p.sportRow}>
                    <View style={[p.sportIcon, { backgroundColor: color + '18' }]}>
                      <Text style={{ fontSize: 18 }}>{SportEmoji[sp.name] ?? '🏅'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={p.sportName}>{sp.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <View style={{ flex: 1, height: 4, backgroundColor: Colors.gray150, borderRadius: 2 }}>
                          <View style={{ height: 4, width: `${(sp.level / 5) * 100}%`, backgroundColor: color, borderRadius: 2 }} />
                        </View>
                        <Text style={{ fontSize: 11, fontWeight: '700', color }}>{sp.level.toFixed(1)}</Text>
                      </View>
                    </View>
                    <View style={[p.levelBadge, { backgroundColor: color }]}>
                      <Text style={{ fontSize: 9, color: Colors.white, fontWeight: '800' }}>
                        {sp.level >= 4.5 ? 'ADV' : sp.level >= 3.5 ? 'INT' : 'BEG'}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <TouchableOpacity style={p.addSportBtn}>
                <Text style={p.addSportBtnTxt}>+ Add sport</Text>
              </TouchableOpacity>
            </View>

            {/* Recent activity */}
            <View style={p.section}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Micro>RECENT GAMES</Micro>
                <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.coral }}>All · {currentUser.gamesPlayed}</Text>
              </View>
              {allGames.filter(g => g.joined).slice(0, 3).map(g => (
                <TouchableOpacity key={g.id} style={p.actRow} onPress={() => router.push(`/game/${g.id}` as any)}>
                  <View style={[p.actIcon, { backgroundColor: (SportColors[g.sport] ?? Colors.coral) + '18' }]}>
                    <Text style={{ fontSize: 16 }}>{SportEmoji[g.sport] ?? '🏅'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={p.actTitle} numberOfLines={1}>{g.title}</Text>
                    <Text style={p.actMeta}>{g.dateDay} {g.dateMonth} · {g.location}</Text>
                  </View>
                  <View style={p.starsRow}>
                    {[1,2,3,4,5].map(n => <Text key={n} style={{ fontSize: 9, color: n <= 5 ? Colors.amber : Colors.gray200 }}>★</Text>)}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── Badges Tab ── */}
        {tab === 'badges' && (
          <View style={p.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Micro>YOUR BADGES</Micro>
              <Text style={{ fontSize: 12, color: Colors.gray500 }}>{BADGES.filter(b => b.earned).length}/{BADGES.length} earned</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {BADGES.map(b => (
                <View key={b.id} style={[p.badgeCard, !b.earned && p.badgeCardLocked]}>
                  <Text style={[{ fontSize: 28, marginBottom: 6 }, !b.earned && { opacity: 0.25 }]}>{b.emoji}</Text>
                  <Text style={[p.badgeLabel, !b.earned && { color: Colors.gray400 }]}>{b.label}</Text>
                  <Text style={p.badgeDesc}>{b.desc}</Text>
                  {!b.earned && (
                    <View style={p.lockedBadge}>
                      <Text style={{ fontSize: 8, color: Colors.gray500, fontWeight: '700' }}>LOCKED</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Settings Tab ── */}
        {tab === 'settings' && (
          <>
            {SETTINGS_SECTIONS.map(sec => (
              <View key={sec.title} style={p.section}>
                <Micro style={{ marginBottom: 12 }}>{sec.title.toUpperCase()}</Micro>
                <View style={p.settingsCard}>
                  {sec.items.map((item, i) => (
                    <View key={item.label} style={[p.settingsRow, i < sec.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.gray150 }]}>
                      <Text style={p.settingsLabel}>{item.label}</Text>
                      {item.toggle && (
                        <Switch
                          value={notifs[item.label] ?? item.defaultOn}
                          onValueChange={v => setNotifs(prev => ({ ...prev, [item.label]: v }))}
                          trackColor={{ false: Colors.gray200, true: Colors.coral }}
                          thumbColor={Colors.white}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Account section */}
            <View style={p.section}>
              <Micro style={{ marginBottom: 12 }}>ACCOUNT</Micro>
              <View style={p.settingsCard}>
                {[
                  { label: 'Edit profile', icon: Edit3 },
                  { label: 'Blocked users', icon: Shield },
                  { label: 'Help & feedback', icon: Bell },
                ].map((item, i) => (
                  <TouchableOpacity key={item.label}
                    style={[p.settingsRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: Colors.gray150 }]}>
                    <Text style={p.settingsLabel}>{item.label}</Text>
                    <ChevronRight size={16} color={Colors.gray400} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={p.logoutBtn}>
              <LogOut size={16} color={Colors.coral} strokeWidth={2} />
              <Text style={p.logoutTxt}>Sign out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const p = StyleSheet.create({
  hero: { backgroundColor: Colors.ink, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, alignItems: 'center', overflow: 'hidden' },
  heroBlob: { position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,90,78,0.35)' },
  heroBlob2: { position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,90,78,0.15)' },
  iconBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)' },

  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: Colors.white, backgroundColor: Colors.gray200 },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: Colors.ink },
  editAvatarBtn: { position: 'absolute', top: 0, right: -4, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.gray700, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.ink },

  name: { fontSize: 26, fontWeight: '800', color: Colors.white, letterSpacing: -0.5, marginBottom: 2 },
  handle: { fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 },

  pointsPill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },

  statsCard: { marginHorizontal: 20, marginTop: -16, backgroundColor: Colors.white, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16, flexDirection: 'row', zIndex: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  statCell: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', color: Colors.ink, lineHeight: 26, marginBottom: 2 },

  tabBar: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, marginTop: 20, marginBottom: 4 },
  tabItem: { marginRight: 24, paddingVertical: 10, position: 'relative' },
  tabTxt: { fontSize: 14, color: Colors.gray500 },
  tabTxtOn: { color: Colors.ink, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.ink, borderRadius: 1 },

  section: { paddingHorizontal: 20, marginTop: 20 },

  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  editBtnTxt: { fontSize: 11, fontWeight: '600', color: Colors.gray700 },
  bioTxt: { fontSize: 14, color: Colors.gray700, lineHeight: 20 },
  bioInput: { fontSize: 14, color: Colors.ink, lineHeight: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.coral + '50', borderRadius: 14, padding: 12, minHeight: 80 },

  sportRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.gray150 },
  sportIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sportName: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  levelBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  addSportBtn: { marginTop: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, borderStyle: 'dashed', alignItems: 'center' },
  addSportBtnTxt: { fontSize: 13, fontWeight: '600', color: Colors.gray500 },

  actRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.gray150 },
  actIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actTitle: { fontSize: 13, fontWeight: '600', color: Colors.ink },
  actMeta: { fontSize: 11, color: Colors.gray500, marginTop: 1 },
  starsRow: { flexDirection: 'row', gap: 1 },

  badgeCard: { width: '30%', flex: 1, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 18, padding: 14, alignItems: 'center', position: 'relative' },
  badgeCardLocked: { backgroundColor: Colors.gray100 },
  badgeLabel: { fontSize: 12, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  badgeDesc: { fontSize: 10, color: Colors.gray500, textAlign: 'center', marginTop: 2 },
  lockedBadge: { marginTop: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: Colors.gray200 },

  settingsCard: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 18, overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  settingsLabel: { fontSize: 14, color: Colors.ink },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.coral + '40' },
  logoutTxt: { fontSize: 14, fontWeight: '600', color: Colors.coral },
});
