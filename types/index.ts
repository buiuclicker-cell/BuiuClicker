// Tipos TypeScript do Buiu Clicker

export interface Player {
  id: string;
  nickname: string;
  photo_url: string | null;
  best_clicks: number;
  created_at: string;
  updated_at: string;
}

export interface LocalPlayer {
  id: string;
  nickname: string;
  photo_url: string | null;
  best_clicks: number;
}

export interface RankingEntry {
  id: string;
  nickname: string;
  photo_url: string | null;
  best_clicks: number;
  position: number;
}

export interface CreatePlayerInput {
  nickname: string;
  photo_url?: string | null;
}

export interface GameState {
  clicks: number;
  isPlaying: boolean;
  startTime: number | null;
}

export interface UpdateRecordResult {
  success: boolean;
  newRecord: boolean;
  error?: string;
}
