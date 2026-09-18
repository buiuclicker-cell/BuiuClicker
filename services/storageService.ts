import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalPlayer } from '../types';
import { PLAYER_STORAGE_KEY } from '../constants/config';

export const storageService = {
  async savePlayer(player: LocalPlayer): Promise<void> {
    try {
      await AsyncStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
    } catch (error) {
      console.error('[Storage] Erro ao salvar jogador:', error);
      throw error;
    }
  },

  async getPlayer(): Promise<LocalPlayer | null> {
    try {
      const data = await AsyncStorage.getItem(PLAYER_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as LocalPlayer;
    } catch (error) {
      console.error('[Storage] Erro ao ler jogador:', error);
      return null;
    }
  },

  async clearPlayer(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PLAYER_STORAGE_KEY);
    } catch (error) {
      console.error('[Storage] Erro ao limpar jogador:', error);
      throw error;
    }
  },

  async updatePlayerBestClicks(bestClicks: number): Promise<void> {
    try {
      const player = await storageService.getPlayer();
      if (player) {
        player.best_clicks = bestClicks;
        await storageService.savePlayer(player);
      }
    } catch (error) {
      console.error('[Storage] Erro ao atualizar recorde:', error);
    }
  },
};
