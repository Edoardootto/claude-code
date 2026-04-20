import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Toast';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  useEffect(() => { SplashScreen.hideAsync(); }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="game/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="player/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="rate/[gameId]" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
