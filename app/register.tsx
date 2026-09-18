import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayer } from '../hooks/usePlayer';
import { playerService } from '../services/playerService';
import { storageService } from '../services/storageService';
import { CircularImage } from '../components/ui/CircularImage';
import { Colors, FontSize, Spacing, Shadow } from '../constants/theme';
import { isSupabaseConfigured } from '../services/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const { setPlayer } = usePlayer();
  const [nickname, setNickname] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const showAlert = (msg: string) => {
    if (Platform.OS === 'web') {
      setAlertMsg(msg);
      setAlertVisible(true);
    } else {
      Alert.alert('BUIU CLICKER DIZ:', msg);
    }
  };

  const handlePickPhoto = async () => {
    try {
      const uri = await playerService.pickImage();
      if (uri) setPhotoUri(uri);
    } catch (err: any) {
      showAlert(err.message || 'DEU RUIM AO ABRIR AS FOTOS!');
    }
  };

  const handleRegister = async () => {
    if (!nickname.trim()) {
      showAlert('COLOCA UM NICKNAME AI MANO!!');
      return;
    }
    if (nickname.trim().length > 20) {
      showAlert('NICKNAME MUITO LONGO! MAX 20 LETRAS!');
      return;
    }
    if (!isSupabaseConfigured()) {
      showAlert(
        'SUPABASE NAO CONFIGURADO!\n\n' +
        'Va em: Configuracoes do projeto > Conectar Supabase\n\n' +
        'Sem isso o jogo nao funciona com outros jogadores!'
      );
      return;
    }

    setIsLoading(true);
    try {
      let photoUrl: string | null = null;
      if (photoUri) {
        try {
          const tempId = 'temp_' + Date.now();
          photoUrl = await playerService.uploadPlayerPhoto(photoUri, tempId);
        } catch {
          showAlert('DEU RUIM AO ENVIAR A FOTO, MAS VAI SEM ELA MESMO!');
        }
      }

      const newPlayer = await playerService.createPlayer({
        nickname: nickname.trim(),
        photo_url: photoUrl,
      });

      const localPlayer = {
        id: newPlayer.id,
        nickname: newPlayer.nickname,
        photo_url: newPlayer.photo_url,
        best_clicks: newPlayer.best_clicks,
      };

      await storageService.savePlayer(localPlayer);
      setPlayer(localPlayer);
      router.replace('/(tabs)');
    } catch (err: any) {
      showAlert(err.message || 'DEU MUITO RUIM! TENTA DE NOVO!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header Brega */}
          <View style={styles.header}>
            <Text style={styles.titleMain}>🎮 BUIU CLICKER 🎮</Text>
            <Text style={styles.titleSub}>~~~~ o jogo da galera ~~~~</Text>
          </View>

          {/* Caixa de registro */}
          <View style={styles.formBox}>
            <Text style={styles.formTitle}>CRIE SEU JOGADOR</Text>
            <Text style={styles.formSubtitle}>{'(se vc nao criar, nao joga!)'}</Text>

            {/* Foto */}
            <View style={styles.photoSection}>
              <CircularImage
                uri={photoUri}
                size={120}
                borderColor="#FF0000"
                borderWidth={5}
              />
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handlePickPhoto}
                activeOpacity={0.7}
              >
                <Text style={styles.photoButtonText}>
                  📷 ESCOLHER FOTO
                </Text>
              </TouchableOpacity>
              <Text style={styles.photoHint}>{'(opcional mas fica mais legal)'}</Text>
            </View>

            {/* Nickname */}
            <Text style={styles.label}>NICKNAME:</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="SEU APELIDO AQUI"
              placeholderTextColor="#999"
              maxLength={20}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.charCount}>{nickname.length}/20 letras</Text>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[styles.enterButton, isLoading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="large" />
              ) : (
                <Text style={styles.enterButtonText}>
                  ➡️ ENTRAR ⬅️
                </Text>
              )}
            </TouchableOpacity>

            {!isSupabaseConfigured() && (
              <View style={styles.warnBox}>
                <Text style={styles.warnText}>
                  ⚠️ SUPABASE NAO CONFIGURADO!{'\n'}
                  Conecta o Supabase nas configs do projeto!
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.footer}>
            {'feito com muito amor\ne pouco talento 💀'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alert customizado para web */}
      {Platform.OS === 'web' && (
        <Modal visible={alertVisible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>BUIU CLICKER DIZ:</Text>
              <Text style={styles.alertMsg}>{alertMsg}</Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setAlertVisible(false)}
              >
                <Text style={styles.alertButtonText}>OK ENTENDI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.bgHeader,
    borderWidth: 4,
    borderColor: '#000',
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    ...Shadow.ugly,
  },
  titleMain: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: '#FFFF00',
    textAlign: 'center',
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  titleSub: {
    fontSize: FontSize.md,
    color: '#FFFFFF',
    fontFamily: 'ComicSans',
    fontWeight: '700',
    marginTop: 4,
  },
  formBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#000',
    padding: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    ...Shadow.ugly,
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.bgButton,
    textAlign: 'center',
    fontFamily: 'ComicSans',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: FontSize.sm,
    color: '#666',
    fontFamily: 'ComicSans',
    marginBottom: Spacing.xl,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  photoButton: {
    backgroundColor: Colors.bgButtonSecondary,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    ...Shadow.ugly,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
  photoHint: {
    fontSize: FontSize.xs,
    color: '#888',
    fontFamily: 'ComicSans',
    fontStyle: 'italic',
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    color: '#000',
    alignSelf: 'flex-start',
    fontFamily: 'ComicSans',
    marginBottom: 4,
  },
  input: {
    borderWidth: 4,
    borderColor: '#000',
    padding: Spacing.md,
    fontSize: FontSize.lg,
    fontWeight: '900',
    width: '100%',
    backgroundColor: Colors.bgInput,
    fontFamily: 'ComicSans',
    color: '#000',
    textAlign: 'center',
  },
  charCount: {
    fontSize: FontSize.xs,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
    fontFamily: 'ComicSans',
  },
  enterButton: {
    backgroundColor: Colors.bgButton,
    borderWidth: 5,
    borderColor: '#000',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    ...Shadow.ugly,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.xxl,
    fontWeight: '900',
    fontFamily: 'ComicSans',
    textAlign: 'center',
  },
  warnBox: {
    backgroundColor: '#FFFF00',
    borderWidth: 3,
    borderColor: '#FF8800',
    padding: Spacing.md,
    marginTop: Spacing.lg,
    width: '100%',
  },
  warnText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'ComicSans',
  },
  footer: {
    fontSize: FontSize.sm,
    color: '#666',
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontFamily: 'ComicSans',
    fontStyle: 'italic',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000',
    padding: Spacing.xl,
    minWidth: 280,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    marginBottom: Spacing.sm,
    fontFamily: 'ComicSans',
  },
  alertMsg: {
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontFamily: 'ComicSans',
  },
  alertButton: {
    backgroundColor: Colors.bgButton,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
});
