import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Colors, Font, Radius, MicroStyle } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

export default function MessagesScreen() {
  const { chatThreads, allGames } = useStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
        <Micro style={{ marginBottom: 4 } as any}>MESSAGES</Micro>
        <Text style={{ fontFamily: Font.display, fontSize: 26, color: Colors.ink, letterSpacing: -0.5 }}>Chats</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {chatThreads.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>💬</Text>
            <Text style={{ fontFamily: Font.display, fontSize: 20, color: Colors.ink, marginBottom: 4 }}>No chats yet</Text>
            <Text style={{ fontSize: 13, color: Colors.gray500 }}>Join a game to start chatting</Text>
          </View>
        )}
        {chatThreads.map((thread) => {
          const game = thread.gameId ? allGames.find((g) => g.id === thread.gameId) : null;
          return (
            <TouchableOpacity
              key={thread.id}
              style={s.threadRow}
              onPress={() => router.push(`/chat/${thread.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={s.threadIcon}>
                <Text style={{ fontSize: 22 }}>{game ? '🏀' : '💬'}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.threadName} numberOfLines={1}>{thread.name}</Text>
                <Text style={s.threadLast} numberOfLines={1}>{thread.lastMessage}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={s.threadTime}>{thread.lastMessageTime}</Text>
                {thread.unread > 0 && (
                  <View style={s.unreadBadge}><Text style={s.unreadTxt}>{thread.unread}</Text></View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  threadRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.gray150 },
  threadIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  threadName: { fontSize: 15, fontWeight: '600', color: Colors.ink },
  threadLast: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
  threadTime: { fontSize: 11, color: Colors.gray500 },
  unreadBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center' },
  unreadTxt: { fontSize: 10, fontWeight: '700', color: Colors.white },
});
