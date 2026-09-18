import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors, FontSize, Spacing, Shadow } from '../../constants/theme';

interface NewRecordModalProps {
  visible: boolean;
  clicks: number;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function NewRecordModal({ visible, clicks, onClose }: NewRecordModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
          ]),
          { iterations: 3 }
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      shakeAnim.setValue(0);
    }
  }, [visible, scaleAnim, shakeAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { scale: scaleAnim },
                { translateX: shakeAnim },
              ],
            },
          ]}
        >
          {/* Estrelinhas exageradas */}
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.stars}>🎉🎉🎉🎉🎉</Text>

          <Text style={styles.titleBig}>NOVO RECORDE!!!</Text>
          <Text style={styles.subtitle}>VOCE E UM MONSTRO!!!</Text>
          <Text style={styles.subtitle2}>PARABENS CARA QUE ABSURDO</Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>SUA PONTUACAO:</Text>
            <Text style={styles.score}>{clicks.toLocaleString('pt-BR')}</Text>
            <Text style={styles.scoreLabel}>CLICKS!!!</Text>
          </View>

          <Text style={styles.emoji}>🏆🔥💀🎊🤯</Text>

          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>
              {'>>> TA BOM OBRIGADO <<<'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    backgroundColor: Colors.bgModal,
    borderWidth: 6,
    borderColor: '#FFFF00',
    borderRadius: 8,
    padding: Spacing.xl,
    alignItems: 'center',
    width: width - Spacing.xxl * 2,
    ...Shadow.ugly,
  },
  stars: {
    fontSize: FontSize.xl,
    marginVertical: Spacing.xs,
    textAlign: 'center',
  },
  titleBig: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: '#FFFF00',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    fontFamily: 'ComicSans',
    marginVertical: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'ComicSans',
  },
  subtitle2: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#FFFF00',
    textAlign: 'center',
    fontFamily: 'ComicSans',
    marginTop: Spacing.xs,
  },
  scoreBox: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#FFFF00',
    padding: Spacing.md,
    marginVertical: Spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  scoreLabel: {
    fontSize: FontSize.md,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'ComicSans',
  },
  score: {
    fontSize: FontSize.insane,
    fontWeight: '900',
    color: '#FF0000',
    fontFamily: 'ComicSans',
    textShadowColor: '#FFFF00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  emoji: {
    fontSize: FontSize.xxl,
    marginVertical: Spacing.sm,
  },
  closeButton: {
    backgroundColor: '#FF0000',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    ...Shadow.ugly,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
});
