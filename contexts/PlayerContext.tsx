import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { LocalPlayer } from '../types';
import { storageService } from '../services/storageService';
import { playerService } from '../services/playerService';

export interface PlayerContextType {
  player: LocalPlayer | null;
  isLoading: boolean;
  isCheckingPlayer: boolean;
  setPlayer: (player: LocalPlayer | null) => void;
  refreshPlayer: () => Promise<void>;
  logout: () => Promise<void>;
  updateLocalBestClicks: (clicks: number) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayerState] = useState<LocalPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPlayer, setIsCheckingPlayer] = useState(true);

  useEffect(() => {
    loadPlayerFromStorage();
  }, []);

  const loadPlayerFromStorage = async () => {
    setIsCheckingPlayer(true);
    try {
      const local = await storageService.getPlayer();
      if (local) {
        // Tenta atualizar dados do servidor
        try {
          const remote = await playerService.getPlayerById(local.id);
          if (remote) {
            const updated: LocalPlayer = {
              id: remote.id,
              nickname: remote.nickname,
              photo_url: remote.photo_url,
              best_clicks: remote.best_clicks,
            };
            await storageService.savePlayer(updated);
            setPlayerState(updated);
          } else {
            setPlayerState(local);
          }
        } catch {
          // Sem internet, usa local
          setPlayerState(local);
        }
      } else {
        setPlayerState(null);
      }
    } catch (error) {
      console.error('[PlayerContext] Erro ao carregar jogador:', error);
      setPlayerState(null);
    } finally {
      setIsCheckingPlayer(false);
    }
  };

  const setPlayer = (p: LocalPlayer | null) => {
    setPlayerState(p);
  };

  const refreshPlayer = async () => {
    if (!player) return;
    try {
      const remote = await playerService.getPlayerById(player.id);
      if (remote) {
        const updated: LocalPlayer = {
          id: remote.id,
          nickname: remote.nickname,
          photo_url: remote.photo_url,
          best_clicks: remote.best_clicks,
        };
        await storageService.savePlayer(updated);
        setPlayerState(updated);
      }
    } catch (error) {
      console.error('[PlayerContext] Erro ao atualizar jogador:', error);
    }
  };

  const logout = async () => {
    await storageService.clearPlayer();
    setPlayerState(null);
  };

  const updateLocalBestClicks = (clicks: number) => {
    if (!player) return;
    if (clicks > player.best_clicks) {
      const updated = { ...player, best_clicks: clicks };
      setPlayerState(updated);
      storageService.savePlayer(updated);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        isLoading,
        isCheckingPlayer,
        setPlayer,
        refreshPlayer,
        logout,
        updateLocalBestClicks,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
