// Configuração do Supabase
// IMPORTANTE: Configure suas variáveis de ambiente no .env

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const APP_CONFIG = {
  name: 'Buiu Clicker',
  version: '1.0.0',
  bundleId: 'com.buiu.clicker',
};

export const STORAGE_BUCKETS = {
  playerPhotos: 'player-photos',
  buiuImages: 'buiu-images',
};

export const GAME_CONFIG = {
  clicksPerImageChange: 1000,
  totalBuiuImages: 16,
};

export const PLAYER_STORAGE_KEY = '@buiu_clicker_player';
