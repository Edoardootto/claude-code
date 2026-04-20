import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { useStore } from '@/store/useStore';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chatThreads, sendMessage } = useStore();
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const thread = chatThreads.find((t) => t.id === id);

  if (!thread) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <Text style={s.centerText}>Chat not found</Text>
          <TouchableOpacity onPress={() => router.back()}><Text style={s.backLink}>← Go back</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(thread.id, text.trim());
    setText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={[s.headerAvatar, thread.isGroup && s.headerAvatarGroup]}>
          <Text style={[s.headerAvatarText, thread.isGroup && s.headerAvatarTextGroup]}>
            {thread.isGroup ? thread.name[0] : thread.name.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName} numberOfLines={1}>{thread.name}</Text>
          <Text style={s.headerSub}>{thread.isGroup ? `${thread.participants.length} players` : 'Direct message'}</Text>
        </View>
        {thread.gameId && (
          <TouchableOpacity style={s.gameBtn} onPress={() => router.push(`/game/${thread.gameId}`)}>
            <Text style={s.gameBtnText}>Game →</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={s.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
          {thread.messages.map((msg) => {
            const isMe = msg.senderId === 'alex';
            const isSystem = msg.senderId === 'system';
            if (isSystem) {
              return (
                <View key={msg.id} style={s.systemMsg}>
                  <Text style={s.systemMsgText}>{msg.text}</Text>
                </View>
              );
            }
            return (
              <View key={msg.id} style={[s.msgRow, isMe && s.msgRowMe]}>
                {!isMe && (
                  <View style={s.msgAvatar}>
                    <Text style={s.msgAvatarText}>{msg.senderId.slice(0, 2).toUpperCase()}</Text>
                  </View>
                )}
                <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
                  {!isMe && <Text style={s.bubbleSender}>{msg.senderId}</Text>}
                  <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{msg.text}</Text>
                  <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{msg.timestamp}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            placeholder="Message..."
            placeholderTextColor={Colors.gray300}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={[s.sendBtn, !text.trim() && s.sendBtnOff]} onPress={handleSend} disabled={!text.trim()}>
            <Text style={s.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  centerText: { fontSize: 16, color: Colors.ink },
  backLink: { fontSize: 14, color: Colors.coral },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 20, color: Colors.ink, fontWeight: '600' },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  headerAvatarGroup: { backgroundColor: Colors.ink },
  headerAvatarText: { fontSize: 13, fontWeight: '700', color: Colors.ink },
  headerAvatarTextGroup: { color: Colors.white },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  headerSub: { fontSize: 11, color: Colors.gray500, marginTop: 1 },
  gameBtn: { backgroundColor: Colors.bg, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  gameBtnText: { fontSize: 12, fontWeight: '600', color: Colors.gray500 },
  scroll: { flex: 1 },
  messages: { padding: 16, gap: 10, paddingBottom: 8 },
  systemMsg: { alignItems: 'center', paddingVertical: 4 },
  systemMsgText: { fontSize: 12, color: Colors.gray500, fontStyle: 'italic' },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowMe: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  msgAvatarText: { fontSize: 9, fontWeight: '700', color: Colors.ink },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  bubbleMe: { backgroundColor: Colors.ink, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  bubbleSender: { fontSize: 10, fontWeight: '700', color: Colors.gray500, marginBottom: 4 },
  bubbleText: { fontSize: 14, color: Colors.ink, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },
  bubbleTime: { fontSize: 9, color: Colors.gray500, marginTop: 4, textAlign: 'right' },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.4)' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  input: { flex: 1, backgroundColor: Colors.bg, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: Colors.ink, maxHeight: 100 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { opacity: 0.3 },
  sendBtnText: { fontSize: 16, color: Colors.white, fontWeight: '700' },
});
