import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { usePlayer } from '../hooks/usePlayer';
import { NewRecordModal } from '../components/feature/NewRecordModal';
import { Colors, FontSize, Spacing, Shadow } from '../constants/theme';
import { getBuiuImageIndex } from '../constants/images';
import { GAME_CONFIG } from '../constants/config';

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(width * 0.75, 300);

interface PlusOneLabel {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
}

export default function GameScreen() {
  const router = useRouter();
  const { player } = usePlayer();
  const {
    clicks,
    currentImageUrl,
    currentImageIndex,
    isFinishing,
    handleClick,
    finishGame,
    resetGame,
  } = useGame();

  const [plusOnes, setPlusOnes] = useState<PlusOneLabel[]>([]);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [finalClicks, setFinalClicks] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertOnOk, setAlertOnOk] = useState<(() => void) | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevImageIndex = useRef(currentImageIndex);
  const imageTransitionAnim = useRef(new Animated.Value(1)).current;
  const plusOneCounter = useRef(0);

  // Animação de troca de imagem
  useEffect(() => {
    const newIdx = getBuiuImageIndex(clicks);
    if (newIdx !== prevImageIndex.current) {
      prevImageIndex.current = newIdx;
      Animated.sequence([
        Animated.timing(imageTransitionAnim, { toValue: 0.7, duration: 100, useNativeDriver: true }),
        Animated.spring(imageTransitionAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  }, [clicks, imageTransitionAnim]);

  const showCustomAlert = (msg: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertMsg(msg);
      setAlertOnOk(() => onOk || null);
      setAlertVisible(true);
    } else {
      Alert.alert('BUIU CLICKER:', msg, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  const handleBuiuPress = useCallback((event: any) => {
    handleClick();

    // Animação de escala
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 60, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();

    // Label +1 flutuante
    const touchX = event.nativeEvent.locationX || IMAGE_SIZE / 2;
    const touchY = event.nativeEvent.locationY || IMAGE_SIZE / 2;
    const id = plusOneCounter.current++;
    const opacity = new Animated.Value(1);
    const translateY = new Animated.Value(0);

    setPlusOnes(prev => [...prev.slice(-8), { id, x: touchX, y: touchY, opacity, translateY }]);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -60, duration: 700, useNativeDriver: true }),
    ]).start(() => {
      setPlusOnes(prev => prev.filter(p => p.id !== id));
    });
  }, [handleClick, scaleAnim]);

  const handleFinish = async () => {
    if (isFinishing) return;
    const result = await finishGame();

    if (result.error && result.error.includes('NAO CONFIGURADO')) {
      showCustomAlert(
        result.error + '\n\nO resultado NAO foi salvo no servidor!',
        () => router.back()
      );
      return;
    }

    if (result.error && !result.newRecord) {
      showCustomAlert(
        result.error + '\n\nSua pontuacao: ' + result.finalClicks.toLocaleString('pt-BR') + ' clicks',
        () => router.back()
      );
      return;
    }

    setFinalClicks(result.finalClicks);

    if (result.newRecord) {
      setShowNewRecord(true);
    } else {
      const msg =
        result.finalClicks === 0
          ? 'VC NAO CLICOU NADA!! QUE PREGUICOSO!!'
          : `VOCE FEZ ${result.finalClicks.toLocaleString('pt-BR')} CLICKS!\nMas nao bateu seu recorde. Tenta mais!`;
      showCustomAlert(msg, () => router.back());
    }
  };

  const nextImageThreshold = (currentImageIndex + 1) * GAME_CONFIG.clicksPerImageChange;
  const clicksToNextImage = nextImageThreshold - clicks;
  const hasMoreImages = currentImageIndex < GAME_CONFIG.totalBuiuImages - 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header contador */}
      <View style={styles.header}>
        <Text style={styles.clicksLabel}>CLICKS:</Text>
        <Text style={styles.clicksCount}>{clicks.toLocaleString('pt-BR')}</Text>
        {player && player.best_clicks > 0 && (
          <Text style={styles.recordHint}>
            RECORDE: {player.best_clicks.toLocaleString('pt-BR')}
            {clicks > player.best_clicks ? ' 🔥 NOVO RECORDE!!!' : ''}
          </Text>
        )}
      </View>

      {/* Progresso de imagem */}
      {hasMoreImages && (
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            proxima foto em: {clicksToNextImage} clicks
          </Text>
        </View>
      )}

      {/* Área central - Buiu clicável */}
      <View style={styles.gameArea}>
        <View style={styles.imageWrapper}>
          <Animated.View
            style={[
              styles.imageContainer,
              { transform: [{ scale: Animated.multiply(scaleAnim, imageTransitionAnim) }] },
            ]}
          >
            <TouchableOpacity
              onPress={handleBuiuPress}
              activeOpacity={1}
              style={styles.imageTouchable}
            >
              <Image
                source={{ uri: currentImageUrl }}
                style={styles.buiuImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Labels +1 flutuantes */}
          {plusOnes.map(p => (
            <Animated.Text
              key={p.id}
              style={[
                styles.plusOneLabel,
                {
                  left: p.x - 20,
                  top: p.y - 30,
                  opacity: p.opacity,
                  transform: [{ translateY: p.translateY }],
                },
              ]}
              pointerEvents="none"
            >
              +1
            </Animated.Text>
          ))}
        </View>

        <Text style={styles.tapHint}>
          {'TOCA NO BUIU PRA CLICAR!!'}
        </Text>
        <Text style={styles.imageIndexLabel}>
          FASE {currentImageIndex + 1}/{GAME_CONFIG.totalBuiuImages} 📸
        </Text>
      </View>

      {/* Botão Finalizar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.finishButton, isFinishing && { opacity: 0.7 }]}
          onPress={handleFinish}
          disabled={isFinishing}
          activeOpacity={0.7}
        >
          {isFinishing ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <>
              <Text style={styles.finishButtonText}>⏹️ FINALIZAR</Text>
              <Text style={styles.finishButtonSub}>{'(vai salvar o recorde se bateu)'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal novo recorde */}
      <NewRecordModal
        visible={showNewRecord}
        clicks={finalClicks}
        onClose={() => {
          setShowNewRecord(false);
          router.back();
        }}
      />

      {/* Alert customizado web */}
      {Platform.OS === 'web' && (
        <Modal visible={alertVisible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertMsg}>{alertMsg}</Text>
              <TouchableOpacity
                style={styles.alertOkBtn}
                onPress={() => {
                  setAlertVisible(false);
                  if (alertOnOk) alertOnOk();
                }}
              >
                <Text style={styles.alertOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgSecondary },
  header: {
    backgroundColor: '#000',
    padding: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.bgButton,
  },
  clicksLabel: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'ComicSans',
  },
  clicksCount: {
    fontSize: FontSize.insane,
    fontWeight: '900',
    color: '#FFFF00',
    fontFamily: 'ComicSans',
    textShadowColor: Colors.bgButton,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    lineHeight: FontSize.insane * 1.2,
  },
  recordHint: {
    fontSize: FontSize.xs,
    color: '#AAFFAA',
    fontFamily: 'ComicSans',
    fontWeight: '700',
  },
  progressBar: {
    backgroundColor: '#FFA500',
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  progressText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'ComicSans',
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'relative',
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  imageTouchable: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#000',
    ...Shadow.ugly,
  },
  buiuImage: {
    width: IMAGE_SIZE - 12,
    height: IMAGE_SIZE - 12,
    borderRadius: (IMAGE_SIZE - 12) / 2,
  },
  plusOneLabel: {
    position: 'absolute',
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.bgButton,
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    zIndex: 100,
  },
  tapHint: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    color: '#000',
    fontFamily: 'ComicSans',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  imageIndexLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'ComicSans',
    marginTop: 4,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 4,
    borderTopColor: '#000',
  },
  finishButton: {
    backgroundColor: '#333333',
    borderWidth: 5,
    borderColor: '#000',
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Shadow.ugly,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.xl,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
  finishButtonSub: {
    color: '#AAAAAA',
    fontSize: FontSize.xs,
    fontFamily: 'ComicSans',
    marginTop: 2,
  },
  alertOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#FFF', borderWidth: 4, borderColor: '#000',
    padding: Spacing.xl, minWidth: 280, alignItems: 'center',
  },
  alertMsg: {
    fontSize: FontSize.md, textAlign: 'center',
    fontFamily: 'ComicSans', marginBottom: Spacing.lg,
  },
  alertOkBtn: {
    backgroundColor: Colors.bgButton, borderWidth: 3,
    borderColor: '#000', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl,
  },
  alertOkText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '900', fontFamily: 'ComicSans' },
});
