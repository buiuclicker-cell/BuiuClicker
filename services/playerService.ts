import { supabase, isSupabaseConfigured } from './supabase';
import { Player, CreatePlayerInput, UpdateRecordResult } from '../types';
import { STORAGE_BUCKETS } from '../constants/config';
import * as ImagePicker from 'expo-image-picker';

export const playerService = {
  async checkNicknameAvailable(nickname: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    const { data, error } = await supabase
      .from('players')
      .select('id')
      .ilike('nickname', nickname)
      .maybeSingle();
    if (error) throw new Error('DEU RUIM AO VERIFICAR O NICKNAME!');
    return data === null;
  },

  async createPlayer(input: CreatePlayerInput): Promise<Player> {
    if (!isSupabaseConfigured()) {
      throw new Error('SUPABASE NAO CONFIGURADO! CONECTA LA NO APP PRIMEIRO!');
    }
    const trimmed = input.nickname.trim();
    if (!trimmed) throw new Error('NICKNAME NAO PODE SER VAZIO MANO!');
    if (trimmed.length > 20) throw new Error('NICKNAME MUITO LONGO! MAX 20 LETRAS!');

    const available = await playerService.checkNicknameAvailable(trimmed);
    if (!available) throw new Error('ESSE NICKNAME JA EXISTE! CRIA OUTRO!');

    const { data, error } = await supabase
      .from('players')
      .insert({
        nickname: trimmed,
        photo_url: input.photo_url || null,
        best_clicks: 0,
      })
      .select()
      .single();

    if (error) throw new Error('DEU RUIM AO CRIAR JOGADOR: ' + error.message);
    return data as Player;
  },

  async getPlayerById(id: string): Promise<Player | null> {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return null;
    return data as Player | null;
  },

  async getRanking(limit = 50): Promise<Player[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('best_clicks', { ascending: false })
      .limit(limit);
    if (error) throw new Error('DEU RUIM AO CARREGAR RANKING: ' + error.message);
    return (data || []) as Player[];
  },

  async updateBestClicks(playerId: string, newScore: number): Promise<UpdateRecordResult> {
    if (!isSupabaseConfigured()) {
      return { success: false, newRecord: false, error: 'SUPABASE NAO CONFIGURADO!' };
    }
    // Usa RPC para atualização atômica segura (evita condição de corrida)
    const { data, error } = await supabase.rpc('update_best_clicks_if_greater', {
      p_player_id: playerId,
      p_new_score: newScore,
    });

    if (error) {
      // Fallback: atualização manual com verificação
      const player = await playerService.getPlayerById(playerId);
      if (!player) return { success: false, newRecord: false, error: 'JOGADOR NAO ENCONTRADO!' };

      if (newScore > player.best_clicks) {
        const { error: updateError } = await supabase
          .from('players')
          .update({ best_clicks: newScore, updated_at: new Date().toISOString() })
          .eq('id', playerId)
          .lt('best_clicks', newScore); // Só atualiza se ainda for menor (segurança)

        if (updateError) return { success: false, newRecord: false, error: updateError.message };
        return { success: true, newRecord: true };
      }
      return { success: true, newRecord: false };
    }

    return { success: true, newRecord: Boolean(data) };
  },

  async uploadPlayerPhoto(imageUri: string, playerId: string): Promise<string> {
    if (!isSupabaseConfigured()) {
      throw new Error('SUPABASE NAO CONFIGURADO!');
    }

    const response = await fetch(imageUri);
    const blob = await response.blob();
    const ext = imageUri.split('.').pop() || 'jpg';
    const fileName = `${playerId}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.playerPhotos)
      .upload(fileName, blob, { contentType: `image/${ext}`, upsert: true });

    if (uploadError) throw new Error('DEU RUIM AO ENVIAR FOTO: ' + uploadError.message);

    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.playerPhotos)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async updatePlayerProfile(
    playerId: string,
    updates: { nickname?: string; photo_url?: string }
  ): Promise<Player> {
    if (!isSupabaseConfigured()) {
      throw new Error('SUPABASE NAO CONFIGURADO!');
    }

    if (updates.nickname) {
      const available = await playerService.checkNicknameAvailable(updates.nickname);
      if (!available) throw new Error('ESSE NICKNAME JA EXISTE!');
    }

    const { data, error } = await supabase
      .from('players')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', playerId)
      .select()
      .single();

    if (error) throw new Error('DEU RUIM AO ATUALIZAR PERFIL: ' + error.message);
    return data as Player;
  },

  async pickImage(): Promise<string | null> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error('PRECISA DAR PERMISSAO PARA ACESSAR AS FOTOS!');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return null;
    return result.assets[0].uri;
  },
};
