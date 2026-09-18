import { useContext } from 'react';
import { PlayerContext, PlayerContextType } from '../contexts/PlayerContext';

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer deve ser usado dentro de PlayerProvider');
  }
  return context;
}
