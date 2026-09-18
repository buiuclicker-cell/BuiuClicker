import { useState, useCallback, useRef } from 'react';
import { playerService } from '../services/playerService';
import { usePlayer } from './usePlayer';
import { getBuiuImageForClicks, getBuiuImageIndex } from '../constants/images';
import { UpdateRecordResult } from '../types';
import { isSupabaseConfigured } from '../services/supabase';

export interface GameHookState {
  clicks: number;
  currentImageUrl: string;
  currentImageIndex: number;
  isFinishing: boolean;
  finishError: string | null;
}

export function useGame() {
  const { player, updateLocalBestClicks } = usePlayer();
  const [clicks, setClicks] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const clicksRef = useRef(0); // Ref para evitar closure stale em animações

  const handleClick = useCallback(() => {
    clicksRef.current += 1;
    setClicks(c => c + 1);
  }, []);

  const resetGame = useCallback(() => {
    clicksRef.current = 0;
    setClicks(0);
    setFinishError(null);
  }, []);

  const finishGame = useCallback(async (): Promise<{ newRecord: boolean; finalClicks: number; error?: string }> => {
    const finalClicks = clicksRef.current;
    setIsFinishing(true);
    setFinishError(null);

    if (!player) {
      setIsFinishing(false);
      return { newRecord: false, finalClicks, error: 'JOGADOR NAO ENCONTRADO!' };
    }

    if (!isSupabaseConfigured()) {
      // Sem backend: salva localmente e informa
      const isNewRecord = finalClicks > player.best_clicks;
      if (isNewRecord) {
        updateLocalBestClicks(finalClicks);
      }
      setIsFinishing(false);
      return {
        newRecord: isNewRecord,
        finalClicks,
        error: 'SUPABASE NAO CONFIGURADO! RECORDE SALVO SO LOCALMENTE!',
      };
    }

    try {
      const result: UpdateRecordResult = await playerService.updateBestClicks(player.id, finalClicks);

      if (result.newRecord) {
        updateLocalBestClicks(finalClicks);
      }

      setIsFinishing(false);
      return { newRecord: result.newRecord, finalClicks };
    } catch (err: any) {
      const errorMsg = 'DEU RUIM NA INTERNET! RESULTADO NAO SALVO.';
      setFinishError(errorMsg);
      setIsFinishing(false);
      return { newRecord: false, finalClicks, error: errorMsg };
    }
  }, [player, updateLocalBestClicks]);

  const currentImageUrl = getBuiuImageForClicks(clicks);
  const currentImageIndex = getBuiuImageIndex(clicks);

  return {
    clicks,
    currentImageUrl,
    currentImageIndex,
    isFinishing,
    finishError,
    handleClick,
    finishGame,
    resetGame,
  };
}
