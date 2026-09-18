// BUIU CLICKER - TEMA DELIBERADAMENTE TOSCO E BREGA
// NÃO TENTE MELHORAR ISSO. É PROPOSITAL.

export const Colors = {
  // Cores BERRANTES dos anos 2000
  bgPrimary: '#FFFF00',      // Amarelo berrante
  bgSecondary: '#00FF00',    // Verde limão escandaloso
  bgHeader: '#FF6600',       // Laranja anos 2000
  bgButton: '#FF0000',       // Vermelho gritante
  bgButtonSecondary: '#0000FF', // Azul primário
  bgCard: '#FFFACD',         // Amarelo claro "cartão"
  bgInput: '#FFFFFF',
  bgModal: '#FF00FF',        // Magenta insano

  textPrimary: '#000000',    // Preto
  textOnButton: '#FFFFFF',   // Branco
  textHeader: '#FFFFFF',
  textAccent: '#FF0000',
  textGold: '#FFD700',
  textSilver: '#C0C0C0',
  textBronze: '#CD7F32',

  borderColor: '#000000',    // Borda preta grossa
  borderColorAccent: '#FF0000',

  rankingBg: '#FF69B4',      // Rosa choque
  rankingMyPlayer: '#00FFFF', // Ciano berrante para o jogador atual

  success: '#00CC00',
  error: '#FF0000',
  warning: '#FF8800',
};

export const Fonts = {
  // Comic Sans é a ÚNICA fonte aceitável neste aplicativo
  comic: 'Comic Sans MS, Comic Sans, cursive',
  comicBold: 'Comic Sans MS, Comic Sans, cursive',
  // No React Native, usamos assim:
  comicRN: undefined, // Loaded via expo-font or system fallback
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  round: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 42,
  insane: 56,
};

export const Shadow = {
  // Sombras EXAGERADAS como nos anos 2000
  ugly: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 8,
  },
  uglyRed: {
    shadowColor: '#FF0000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
};
