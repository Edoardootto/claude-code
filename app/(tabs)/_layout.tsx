import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Platform, ViewStyle } from 'react-native';
import { Home, MapPin, MessageSquare, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

function TabIcon({ Icon, focused }: { Icon: React.ElementType; focused: boolean }) {
  return (
    <View style={{
      width: 44, height: 44, borderRadius: 22,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: focused ? Colors.ink : 'transparent',
    }}>
      <Icon
        size={20}
        color={focused ? Colors.white : Colors.gray400}
        strokeWidth={focused ? 2.5 : 1.8}
      />
    </View>
  );
}

const fabStyle: ViewStyle = {
  width: 46, height: 46, borderRadius: 23,
  backgroundColor: Colors.ink,
  alignItems: 'center', justifyContent: 'center',
  shadowColor: Colors.coral,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 8,
};

const floatingTabStyle: ViewStyle = {
  position: 'absolute',
  bottom: Platform.OS === 'ios' ? 24 : 16,
  left: 20,
  right: 20,
  height: 64,
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderWidth: 1,
  borderColor: 'rgba(220,220,220,0.5)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.14,
  shadowRadius: 24,
  elevation: 14,
  paddingBottom: 0,
  paddingTop: 0,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: floatingTabStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} /> }}
      />
      <Tabs.Screen
        name="games"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={MapPin} focused={focused} /> }}
      />
      <Tabs.Screen
        name="create"
        options={{
          // Hide bottom nav during create flow so buttons aren't covered
          tabBarStyle: { display: 'none' },
          tabBarIcon: () => (
            <View style={fabStyle}>
              <Text style={{ fontSize: 26, color: Colors.white, lineHeight: 30, marginTop: -2 }}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={MessageSquare} focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} /> }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
