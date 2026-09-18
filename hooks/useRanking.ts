import { useState, useEffect, useCallback, useRef } from 'react';
import { playerService } from '../services/playerService';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { RankingEntry } from '../types';

export function useRanking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchRanking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        setRanking([]);
        setError('SUPABASE NAO CONFIGURADO! CONECTA LA NO APP PRIMEIRO!');
        return;
      }
      const players = await playerService.getRanking(50);
      const ranked: RankingEntry[] = players.map((p, index) => ({
        id: p.id,
        nickname: p.nickname,
        photo_url: p.photo_url,
        best_clicks: p.best_clicks,
        position: index + 1,
      }));
      setRanking(ranked);
    } catch (err: any) {
      setError(err.message || 'DEU RUIM NA INTERNET. TENTE NOVAMENTE.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subscribeToRealtime = useCallback(() => {
    if (!isSupabaseConfigured()) return;

    // Desinscreve canal anterior
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel('ranking-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        () => {
          // Atualiza ranking quando qualquer jogador mudar
          fetchRanking();
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [fetchRanking]);

  useEffect(() => {
    fetchRanking();
    subscribeToRealtime();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchRanking, subscribeToRealtime]);

  return {
    ranking,
    isLoading,
    error,
    refetch: fetchRanking,
  };
}
