import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { usePlayer } from '../hooks/usePlayer';
import { Colors, FontSize } from '../constants/theme';

export default function Index() {
  const { player, isCheckingPlayer } = usePlayer();

  if (isCheckingPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>BUIU CLICKER</Text>
        <Text style={styles.loading}>CARREGANDO...</Text>
        <Text style={styles.loadingDesc}>CALCULANDO QUEM E O MAIOR VICIADO...</Text>
        <ActivityIndicator size="large" color={Colors.bgButton} style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (!player) {
    return <Redirect href="/register" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: FontSize.insane,
    fontWeight: '900',
    color: Colors.bgButton,
    textAlign: 'center',
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  loading: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 32,
    fontFamily: 'ComicSans',
  },
  loadingDesc: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'ComicSans',
  },
});
