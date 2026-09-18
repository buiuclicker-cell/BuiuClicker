import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRanking } from '../../hooks/useRanking';
import { usePlayer } from '../../hooks/usePlayer';
import { PlayerCard } from '../../components/feature/PlayerCard';
import { RankingEntry } from '../../types';
import { Colors, FontSize, Spacing, Shadow } from '../../constants/theme';

export default function RankingScreen() {
  const router = useRouter();
  const { ranking, isLoading, error, refetch } = useRanking();
  const { player } = usePlayer();

  const renderItem = useCallback(({ item }: { item: RankingEntry }) => {
    const isCurrentPlayer = player?.id === item.id;
    return <PlayerCard entry={item} isCurrentPlayer={isCurrentPlayer} />;
  }, [player]);

  const keyExtractor = useCallback((item: RankingEntry) => item.id, []);

  const handleStartGame = () => {
    router.push('/game');
  };

  const renderHeader = () => (
    <View>
      {/* Header tosco */}
      <View style={styles.header}>
        <Text style={styles.titleBig}>🎮 BUIU CLICKER 🎮</Text>
        <Text style={styles.titleSmall}>{'~~ o jogo da zuera ~~'}</Text>
        {player && (
          <View style={styles.playerInfo}>
            <Text style={styles.playerInfoText}>
              Jogando como: <Text style={styles.playerName}>{player.nickname.toUpperCase()}</Text>
            </Text>
            <Text style={styles.playerRecord}>
              SEU RECORDE: {player.best_clicks.toLocaleString('pt-BR')} clicks
            </Text>
          </View>
        )}
      </View>

      {/* Título do ranking */}
      <View style={styles.rankingHeader}>
        <Text style={styles.rankingTitle}>🏆 RANKING DOS MONSTROS 🏆</Text>
        <Text style={styles.rankingSubtitle}>{'(quem clicou mais e o maior otario)'}</Text>
      </View>

      {/* Loading state tosco */}
      {isLoading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.bgButton} />
          <Text style={styles.loadingText}>
            CALCULANDO QUEM E O MAIOR VICIADO...
          </Text>
        </View>
      )}

      {/* Erro */}
      {error && !isLoading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>💀 {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>TENTAR DE NOVO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ranking vazio */}
      {!isLoading && !error && ranking.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            NINGUEM JOGOU AINDA!{'\n'}SE VC JOGAR VA SER O NUMERO 1!{'\n'}(nao tem muito merito nao)
          </Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {'fim do ranking. e isso ai mano.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={ranking}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[Colors.bgButton]}
            tintColor={Colors.bgButton}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Botão INICIAR gigante */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>
            ▶▶▶ INICIAR ◀◀◀
          </Text>
          <Text style={styles.startButtonSub}>
            {'clica aqui pra jogar mano'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: Colors.bgHeader,
    padding: Spacing.lg,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  titleBig: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: '#FFFF00',
    textAlign: 'center',
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  titleSmall: {
    fontSize: FontSize.sm,
    color: '#FFFFFF',
    fontFamily: 'ComicSans',
    fontWeight: '700',
    marginTop: 2,
  },
  playerInfo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 2,
    borderColor: '#FFFF00',
    alignItems: 'center',
    width: '100%',
  },
  playerInfoText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontFamily: 'ComicSans',
    fontWeight: '700',
  },
  playerName: {
    color: '#FFFF00',
    fontSize: FontSize.md,
    fontWeight: '900',
  },
  playerRecord: {
    color: '#FFFF00',
    fontSize: FontSize.sm,
    fontFamily: 'ComicSans',
    fontWeight: '700',
    marginTop: 2,
  },
  rankingHeader: {
    backgroundColor: Colors.bgSecondary,
    padding: Spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  rankingTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: '#000',
    fontFamily: 'ComicSans',
    textAlign: 'center',
  },
  rankingSubtitle: {
    fontSize: FontSize.xs,
    color: '#333',
    fontFamily: 'ComicSans',
    fontStyle: 'italic',
  },
  loadingBox: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
    fontFamily: 'ComicSans',
  },
  errorBox: {
    margin: Spacing.lg,
    backgroundColor: '#FFE0E0',
    borderWidth: 4,
    borderColor: Colors.bgButton,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: Colors.bgButton,
    textAlign: 'center',
    fontFamily: 'ComicSans',
    marginBottom: Spacing.sm,
  },
  retryButton: {
    backgroundColor: Colors.bgButton,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
  emptyBox: {
    margin: Spacing.xl,
    backgroundColor: '#FFFACD',
    borderWidth: 3,
    borderColor: '#000',
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    fontFamily: 'ComicSans',
    lineHeight: 26,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.sm,
    color: '#888',
    fontFamily: 'ComicSans',
    fontStyle: 'italic',
  },
  startButtonContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.bgPrimary,
    borderTopWidth: 4,
    borderTopColor: '#000',
  },
  startButton: {
    backgroundColor: Colors.bgButton,
    borderWidth: 5,
    borderColor: '#000',
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    ...Shadow.ugly,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.xxl,
    fontWeight: '900',
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  startButtonSub: {
    color: '#FFFF00',
    fontSize: FontSize.xs,
    fontFamily: 'ComicSans',
    fontWeight: '700',
    marginTop: 4,
  },
});
