import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Font } from '@/constants/theme';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={18} color={Colors.gray700} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={{ fontFamily: Font.display, fontSize: 22, color: Colors.ink, letterSpacing: -0.5 }}>Notifications</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Text style={{ fontSize: 40 }}>🔔</Text>
        <Text style={{ fontFamily: Font.display, fontSize: 22, color: Colors.ink }}>All caught up</Text>
        <Text style={{ fontSize: 13, color: Colors.gray500 }}>No new notifications</Text>
      </View>
    </View>
  );
}
