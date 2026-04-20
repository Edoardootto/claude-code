import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Platform, ViewStyle } from 'react-native';
import { Home, MapPin, MessageSquare, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

function TabIcon({ Icon, label, focused }: { Icon: React.ElementType; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}>
      <View style={[
        { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, alignItems: 'center', gap: 2 },
        focused && { backgroundColor: Colors.ink },
      ]}>
        <Icon size={18} color={focused ? Colors.white : Colors.gray400} strokeWidth={focused ? 2.5 : 1.8} />
        <Text style={{
          fontSize: 9,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: focused ? Colors.white : Colors.gray400,
          fontWeight: focused ? '700' : '400',
        }}>{label}</Text>
      </View>
    </View>
  );
}

const fabStyle: ViewStyle = {
  width: 46, height: 46, borderRadius: 14,
  backgroundColor: Colors.ink,
  alignItems: 'center', justifyContent: 'center',
  marginBottom: 6,
  shadowColor: Colors.coral,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.35,
  shadowRadius: 10,
  elevation: 8,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.6)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 12,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Home} label="HOME" focused={focused} /> }}
      />
      <Tabs.Screen
        name="games"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={MapPin} label="MAP" focused={focused} /> }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => (
            <View style={fabStyle}>
              <Text style={{ fontSize: 26, color: Colors.white, lineHeight: 30, marginTop: -2 }}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={MessageSquare} label="CHATS" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={User} label="ME" focused={focused} /> }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
