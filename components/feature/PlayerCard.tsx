import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircularImage } from '../ui/CircularImage';
import { RankingEntry } from '../../types';
import { Colors, FontSize, Spacing, Shadow } from '../../constants/theme';

interface PlayerCardProps {
  entry: RankingEntry;
  isCurrentPlayer: boolean;
}

function getMedalEmoji(position: number): string {
  if (position === 1) return '🥇';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  return `${position}º`;
}

function getPositionColor(position: number): string {
  if (position === 1) return Colors.textGold;
  if (position === 2) return Colors.textSilver;
  if (position === 3) return Colors.textBronze;
  return Colors.textPrimary;
}

export function PlayerCard({ entry, isCurrentPlayer }: PlayerCardProps) {
  return (
    <View
      style={[
        styles.card,
        isCurrentPlayer && styles.cardCurrentPlayer,
        entry.position <= 3 && styles.cardTop3,
        entry.position === 1 && styles.card1st,
      ]}
    >
      {/* Posição */}
      <Text
        style={[
          styles.position,
          { color: getPositionColor(entry.position) },
          entry.position <= 3 && styles.positionTop3,
        ]}
      >
        {getMedalEmoji(entry.position)}
      </Text>

      {/* Foto */}
      <CircularImage
        uri={entry.photo_url}
        size={isCurrentPlayer ? 56 : 50}
        borderColor={isCurrentPlayer ? Colors.rankingMyPlayer : getPositionColor(entry.position)}
        borderWidth={isCurrentPlayer ? 4 : 3}
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.nickname, isCurrentPlayer && styles.nicknameCurrentPlayer]} numberOfLines={1}>
          {entry.nickname.toUpperCase()}
          {isCurrentPlayer ? ' 👈 VC' : ''}
        </Text>
        <Text style={styles.clicks}>
          {entry.best_clicks.toLocaleString('pt-BR')} CLICKS
        </Text>
      </View>

      {/* Destaque top 1 */}
      {entry.position === 1 && (
        <Text style={styles.crownLabel}>👑 MONSTRO!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 3,
    borderColor: Colors.borderColor,
    borderRadius: 4,
    padding: Spacing.sm,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.ugly,
  },
  cardCurrentPlayer: {
    backgroundColor: Colors.rankingMyPlayer,
    borderColor: '#000000',
    borderWidth: 4,
  },
  cardTop3: {
    borderWidth: 4,
    borderColor: Colors.textGold,
  },
  card1st: {
    backgroundColor: '#FFFACD',
    borderColor: Colors.textGold,
    borderWidth: 5,
  },
  position: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    minWidth: 40,
    textAlign: 'center',
    fontFamily: 'ComicSans',
  },
  positionTop3: {
    fontSize: FontSize.xxl,
  },
  info: {
    flex: 1,
  },
  nickname: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: Colors.textPrimary,
    fontFamily: 'ComicSans',
  },
  nicknameCurrentPlayer: {
    color: '#000066',
    fontSize: FontSize.lg,
  },
  clicks: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textAccent,
    fontFamily: 'ComicSans',
  },
  crownLabel: {
    fontSize: FontSize.lg,
    fontWeight: '900',
  },
});
