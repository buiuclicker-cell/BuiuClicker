import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerProvider } from '../contexts/PlayerContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <StatusBar style="dark" backgroundColor="#FF6600" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="game" />
          <Stack.Screen name="profile" />
        </Stack>
      </PlayerProvider>
    </SafeAreaProvider>
  );
}
