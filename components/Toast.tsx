import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerToast } from '@/store/useStore';
import { Colors, Radius } from '@/constants/theme';

interface ToastMsg {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const insets = useSafeAreaInsets();

  const show = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  useEffect(() => { registerToast(show); }, [show]);

  return (
    <>
      {children}
      <View style={[styles.container, { top: insets.top + 12 }]} pointerEvents="none">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
      </View>
    </>
  );
}

function ToastItem({ toast }: { toast: ToastMsg }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 9 }),
      Animated.delay(2200),
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const bg = toast.type === 'success' ? Colors.ink : toast.type === 'warning' ? Colors.coral : Colors.gray500;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: bg },
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] },
      ]}>
      <Text style={styles.icon}>
        {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '!' : 'ℹ'}
      </Text>
      <Text style={styles.text} numberOfLines={2}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, zIndex: 9999, gap: 8 },
  toast: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md,
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  icon: { fontSize: 14, color: Colors.white, fontWeight: '700' },
  text: { flex: 1, fontSize: 14, color: Colors.white, fontWeight: '500', lineHeight: 18 },
});
