import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePlayer } from '../../hooks/usePlayer';
import { playerService } from '../../services/playerService';
import { storageService } from '../../services/storageService';
import { CircularImage } from '../../components/ui/CircularImage';
import { Colors, FontSize, Spacing, Shadow } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { player, setPlayer, logout, refreshPlayer } = usePlayer();
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const showMsg = (msg: string) => {
    if (Platform.OS === 'web') {
      setAlertMsg(msg);
      setAlertVisible(true);
    } else {
      Alert.alert('BUIU CLICKER:', msg);
    }
  };

  const handleChangePhoto = async () => {
    if (!player) return;
    setIsLoading(true);
    try {
      const uri = await playerService.pickImage();
      if (!uri) { setIsLoading(false); return; }
      const photoUrl = await playerService.uploadPlayerPhoto(uri, player.id);
      const updated = await playerService.updatePlayerProfile(player.id, { photo_url: photoUrl });
      const localUpdated = { ...player, photo_url: updated.photo_url };
      await storageService.savePlayer(localUpdated);
      setPlayer(localUpdated);
      showMsg('FOTO ATUALIZADA COM SUCESSO!!! FICOU BONITO!');
    } catch (err: any) {
      showMsg(err.message || 'DEU RUIM NA FOTO!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNickname = async () => {
    if (!player || !newNickname.trim()) {
      showMsg('COLOCA O NOVO NICKNAME AI!');
      return;
    }
    if (newNickname.trim().length > 20) {
      showMsg('MUITO LONGO! MAX 20 LETRAS!');
      return;
    }
    setIsLoading(true);
    try {
      const updated = await playerService.updatePlayerProfile(player.id, { nickname: newNickname.trim() });
      const localUpdated = { ...player, nickname: updated.nickname };
      await storageService.savePlayer(localUpdated);
      setPlayer(localUpdated);
      setEditingNickname(false);
      setNewNickname('');
      showMsg('NICKNAME TROCADO! TO VENDO QUE VC NAO GOSTAVA DO ANTERIOR!');
    } catch (err: any) {
      showMsg(err.message || 'DEU RUIM AO TROCAR NICKNAME!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const doLogout = async () => {
      await logout();
      router.replace('/register');
    };
    if (Platform.OS === 'web') {
      doLogout();
    } else {
      Alert.alert(
        'TROCAR DE JOGADOR?',
        'Tem certeza? Vai ter que criar ou logar de novo!',
        [
          { text: 'NAO, FICA AI', style: 'cancel' },
          { text: 'SIM, TROCA', onPress: doLogout, style: 'destructive' },
        ]
      );
    }
  };

  if (!player) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👤 MEU PERFIL</Text>
          <Text style={styles.headerSub}>{'(sim, e voce mesmo)'}</Text>
        </View>

        {/* Card do perfil */}
        <View style={styles.profileCard}>
          {/* Foto grande */}
          <View style={styles.photoContainer}>
            <CircularImage
              uri={player.photo_url}
              size={150}
              borderColor="#FF0000"
              borderWidth={6}
            />
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={handleChangePhoto}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.changePhotoBtnText}>📷 TROCAR FOTO</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Nickname */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>NICKNAME:</Text>
            {!editingNickname ? (
              <View style={styles.nicknameRow}>
                <Text style={styles.nicknameText}>{player.nickname.toUpperCase()}</Text>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => { setEditingNickname(true); setNewNickname(player.nickname); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editBtnText}>✏️ EDITAR</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editNicknameBox}>
                <TextInput
                  style={styles.nicknameInput}
                  value={newNickname}
                  onChangeText={setNewNickname}
                  maxLength={20}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNickname} disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.saveBtnText}>✅ SALVAR</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => { setEditingNickname(false); setNewNickname(''); }}
                  >
                    <Text style={styles.cancelBtnText}>❌ CANCELAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Recorde */}
          <View style={styles.recordBox}>
            <Text style={styles.recordLabel}>SEU MELHOR RECORDE:</Text>
            <Text style={styles.recordValue}>
              {player.best_clicks.toLocaleString('pt-BR')}
            </Text>
            <Text style={styles.recordUnit}>CLICKS 🔥</Text>
            {player.best_clicks === 0 && (
              <Text style={styles.recordZeroMsg}>
                {'(vai la jogar pra ter um recorde mano)'}
              </Text>
            )}
          </View>
        </View>

        {/* Trocar jogador */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>⚠️ ZONA PERIGOSA ⚠️</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutBtnText}>🚪 TROCAR DE JOGADOR</Text>
          </TouchableOpacity>
          <Text style={styles.dangerHint}>{'(isso vai deslogar vc desse dispositivo)'}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {Platform.OS === 'web' && (
        <Modal visible={alertVisible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertMsg}>{alertMsg}</Text>
              <TouchableOpacity style={styles.alertOkBtn} onPress={() => setAlertVisible(false)}>
                <Text style={styles.alertOkText}>OK ENTENDI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    backgroundColor: Colors.bgHeader,
    padding: Spacing.lg,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: '#FFFF00',
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: '#FFF',
    fontFamily: 'ComicSans',
    fontStyle: 'italic',
  },
  profileCard: {
    margin: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#000',
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.ugly,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  changePhotoBtn: {
    backgroundColor: Colors.bgButtonSecondary,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minWidth: 140,
    alignItems: 'center',
    ...Shadow.ugly,
  },
  changePhotoBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
  infoSection: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  infoLabel: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: '#000',
    fontFamily: 'ComicSans',
    marginBottom: 4,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nicknameText: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.bgButton,
    fontFamily: 'ComicSans',
    flex: 1,
  },
  editBtn: {
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
  },
  editBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    fontFamily: 'ComicSans',
  },
  editNicknameBox: { width: '100%', gap: Spacing.sm },
  nicknameInput: {
    borderWidth: 3,
    borderColor: '#000',
    padding: Spacing.sm,
    fontSize: FontSize.lg,
    fontWeight: '900',
    fontFamily: 'ComicSans',
    color: '#000',
    backgroundColor: Colors.bgInput,
    textAlign: 'center',
  },
  editButtons: { flexDirection: 'row', gap: Spacing.sm },
  saveBtn: {
    flex: 1, backgroundColor: Colors.success, borderWidth: 2,
    borderColor: '#000', paddingVertical: Spacing.sm, alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '900', fontFamily: 'ComicSans' },
  cancelBtn: {
    flex: 1, backgroundColor: '#888', borderWidth: 2,
    borderColor: '#000', paddingVertical: Spacing.sm, alignItems: 'center',
  },
  cancelBtnText: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '900', fontFamily: 'ComicSans' },
  recordBox: {
    backgroundColor: Colors.bgPrimary,
    borderWidth: 4,
    borderColor: '#000',
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.sm,
  },
  recordLabel: { fontSize: FontSize.sm, fontWeight: '700', color: '#333', fontFamily: 'ComicSans' },
  recordValue: {
    fontSize: FontSize.insane,
    fontWeight: '900',
    color: Colors.bgButton,
    fontFamily: 'ComicSans',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  recordUnit: { fontSize: FontSize.lg, fontWeight: '900', color: '#000', fontFamily: 'ComicSans' },
  recordZeroMsg: { fontSize: FontSize.xs, color: '#888', fontFamily: 'ComicSans', fontStyle: 'italic', marginTop: 4 },
  dangerZone: {
    margin: Spacing.lg,
    backgroundColor: '#FFE0E0',
    borderWidth: 4,
    borderColor: '#FF0000',
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.ugly,
  },
  dangerTitle: { fontSize: FontSize.lg, fontWeight: '900', color: '#FF0000', fontFamily: 'ComicSans', marginBottom: Spacing.md },
  logoutBtn: {
    backgroundColor: '#CC0000',
    borderWidth: 4,
    borderColor: '#000',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    ...Shadow.ugly,
  },
  logoutBtnText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '900', fontFamily: 'ComicSans' },
  dangerHint: { fontSize: FontSize.xs, color: '#888', fontFamily: 'ComicSans', marginTop: Spacing.sm, fontStyle: 'italic' },
  alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { backgroundColor: '#FFF', borderWidth: 4, borderColor: '#000', padding: Spacing.xl, minWidth: 280, alignItems: 'center' },
  alertMsg: { fontSize: FontSize.md, textAlign: 'center', fontFamily: 'ComicSans', marginBottom: Spacing.lg },
  alertOkBtn: { backgroundColor: Colors.bgButton, borderWidth: 3, borderColor: '#000', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl },
  alertOkText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '900', fontFamily: 'ComicSans' },
});
