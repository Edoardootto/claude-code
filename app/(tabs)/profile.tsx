import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Font, Radius, MicroStyle } from '@/constants/theme';
import { useStore } from '@/store/useStore';

function Micro({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ ...MicroStyle } as any, style as any]}>{children}</Text>;
}

export default function MeScreen() {
  const { currentUser, userPoints } = useStore();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', paddingTop: 32, paddingHorizontal: 20, paddingBottom: 24 }}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: Colors.white, backgroundColor: Colors.gray200, marginBottom: 12 }}
            contentFit="cover"
          />
          <Text style={{ fontFamily: Font.display, fontSize: 26, color: Colors.ink, letterSpacing: -0.5, marginBottom: 2 }}>
            {currentUser.name}
          </Text>
          <Text style={{ fontSize: 11, color: Colors.gray500, marginBottom: 16, letterSpacing: 0.5 }}>{currentUser.handle}</Text>

          <TouchableOpacity
            style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.ink, borderRadius: 16, marginBottom: 20 }}
            onPress={() => router.push(`/player/${currentUser.id}` as any)}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.white }}>View full profile</Text>
          </TouchableOpacity>

          <View style={{ width: '100%', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 16, flexDirection: 'row', marginBottom: 20 }}>
            {[
              { val: currentUser.gamesPlayed.toString(), label: 'GAMES' },
              { val: currentUser.rating.toString(), label: 'RATING' },
              { val: `${currentUser.showUpRate}%`, label: 'SHOW-UP' },
            ].map((s, i) => (
              <View key={s.label} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: Colors.border }}>
                <Text style={{ fontFamily: Font.display, fontSize: 24, color: Colors.ink, lineHeight: 28, marginBottom: 2 }}>{s.val}</Text>
                <Micro>{s.label}</Micro>
              </View>
            ))}
          </View>

          <View style={{ width: '100%', backgroundColor: Colors.coralSoft, borderRadius: 16, padding: 16, alignItems: 'center' }}>
            <Micro style={{ color: Colors.coral, marginBottom: 4 } as any}>YOUR POINTS</Micro>
            <Text style={{ fontFamily: Font.display, fontSize: 36, color: Colors.coral }}>{userPoints.toLocaleString()}</Text>
            <Text style={{ fontSize: 11, color: Colors.gray500, marginTop: 2 }}>Rank #5 this month</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 13, color: Colors.gray500, textAlign: 'center' }}>Full settings & achievements coming soon.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
