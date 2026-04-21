import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { Colors, Radius, SportEmoji, SportColors } from '@/constants/theme';
import { useStore } from '@/store/useStore';

type FilterPill = 'all' | 'unread' | 'friends' | 'groups';

const PILLS: { key: FilterPill; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'friends', label: 'Friends' },
  { key: 'groups', label: 'Groups' },
];

export default function MessagesScreen() {
  const { chatThreads, allGames, markChatRead } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterPill>('all');
  const [showSearch, setShowSearch] = useState(false);

  const filtered = chatThreads.filter(t => {
    if (filter === 'unread') return t.unread > 0;
    if (filter === 'groups') return t.isGroup;
    if (filter === 'friends') return !t.isGroup;
    if (search) return t.name.toLowerCase().includes(search.toLowerCase()) || t.lastMessage.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const totalUnread = chatThreads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Header */}
      <View style={s.header}>
        {showSearch ? (
          <View style={s.searchBar}>
            <Search size={15} color={Colors.gray400} strokeWidth={2} />
            <TextInput
              style={s.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearch(''); }}>
              <X size={16} color={Colors.gray500} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View>
              <Text style={s.micro}>MESSAGES</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={s.title}>Chats</Text>
                {totalUnread > 0 && (
                  <View style={s.totalBadge}>
                    <Text style={s.totalBadgeTxt}>{totalUnread}</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={s.searchBtn} onPress={() => setShowSearch(true)}>
              <Search size={18} color={Colors.gray700} strokeWidth={1.8} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={s.pillScroll} contentContainerStyle={s.pillContent}>
        {PILLS.map(p => {
          const count = p.key === 'unread' ? chatThreads.filter(t => t.unread > 0).length
            : p.key === 'groups' ? chatThreads.filter(t => t.isGroup).length
            : p.key === 'friends' ? chatThreads.filter(t => !t.isGroup).length
            : chatThreads.length;
          return (
            <TouchableOpacity key={p.key} onPress={() => setFilter(p.key)}
              style={[s.pill, filter === p.key && s.pillOn]}>
              <Text style={[s.pillTxt, filter === p.key && s.pillTxtOn]}>{p.label}</Text>
              {count > 0 && p.key !== 'all' && (
                <View style={[s.pillCount, filter === p.key && s.pillCountOn]}>
                  <Text style={[s.pillCountTxt, filter === p.key && { color: Colors.ink }]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Thread List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>💬</Text>
            <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.ink, marginBottom: 4 }}>No chats</Text>
            <Text style={{ fontSize: 13, color: Colors.gray500 }}>
              {filter !== 'all' ? 'Try switching the filter above' : 'Join a game to start chatting'}
            </Text>
          </View>
        ) : (
          filtered.map((thread, idx) => {
            const game = thread.gameId ? allGames.find((g) => g.id === thread.gameId) : null;
            const isLast = idx === filtered.length - 1;
            return (
              <TouchableOpacity key={thread.id} style={[s.row, !isLast && s.rowBorder]}
                onPress={() => { markChatRead(thread.id); router.push(`/chat/${thread.id}` as any); }} activeOpacity={0.75}>
                {/* Icon / Avatar */}
                <View style={[s.avatarWrap, thread.isGroup && { backgroundColor: (SportColors[thread.sport ?? ''] ?? Colors.inkSoft) + '22' }]}>
                  <Text style={{ fontSize: 20 }}>{thread.sport ? (SportEmoji[thread.sport] ?? '🏅') : '💬'}</Text>
                  {thread.isGroup && (
                    <View style={s.groupBadge}>
                      <Text style={{ fontSize: 7, fontWeight: '800', color: Colors.white }}>G</Text>
                    </View>
                  )}
                </View>

                {/* Content */}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={s.name} numberOfLines={1}>{thread.name}</Text>
                    {thread.isGroup && (
                      <View style={s.groupTag}><Text style={s.groupTagTxt}>Group</Text></View>
                    )}
                  </View>
                  <Text style={[s.last, thread.unread > 0 && s.lastUnread]} numberOfLines={1}>
                    {thread.lastMessage}
                  </Text>
                </View>

                {/* Right */}
                <View style={{ alignItems: 'flex-end', gap: 5 }}>
                  <Text style={s.time}>{thread.lastMessageTime}</Text>
                  {thread.unread > 0 && (
                    <View style={s.badge}>
                      <Text style={s.badgeTxt}>{thread.unread}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, minHeight: 64 },
  micro: { fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase', color: Colors.gray500, marginBottom: 2 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.ink, letterSpacing: -0.5 },
  totalBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: Colors.coral, marginBottom: 2 },
  totalBadgeTxt: { fontSize: 11, fontWeight: '700', color: Colors.white },
  searchBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, height: 44, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.ink },

  pillScroll: { maxHeight: 46 },
  pillContent: { paddingHorizontal: 20, gap: 8, paddingBottom: 6 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  pillOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  pillTxt: { fontSize: 13, fontWeight: '500', color: Colors.gray600 },
  pillTxtOn: { color: Colors.white },
  pillCount: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  pillCountOn: { backgroundColor: 'rgba(255,255,255,0.2)' },
  pillCountTxt: { fontSize: 10, fontWeight: '700', color: Colors.gray600 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14, marginTop: 4 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  avatarWrap: { width: 50, height: 50, borderRadius: 16, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  avatarGroup: { backgroundColor: Colors.inkSoft },
  groupBadge: { position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg },
  name: { fontSize: 15, fontWeight: '600', color: Colors.ink, flex: 1 },
  last: { fontSize: 13, color: Colors.gray500, marginTop: 2 },
  lastUnread: { color: Colors.ink, fontWeight: '500' },
  time: { fontSize: 11, color: Colors.gray400 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeTxt: { fontSize: 10, fontWeight: '700', color: Colors.white },
  groupTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: Colors.gray100 },
  groupTagTxt: { fontSize: 10, fontWeight: '600', color: Colors.gray600 },
});
