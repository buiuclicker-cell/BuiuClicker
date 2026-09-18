import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Text } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({
            ios: insets.bottom + 60,
            android: insets.bottom + 60,
            default: 70,
          }),
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: insets.bottom + 8,
            android: insets.bottom + 8,
            default: 8,
          }),
          paddingHorizontal: 16,
          backgroundColor: Colors.bgHeader,
          borderTopWidth: 4,
          borderTopColor: '#000000',
        },
        tabBarActiveTintColor: '#FFFF00',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
          fontFamily: 'ComicSans',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'RANKING',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'MEU PERFIL',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
