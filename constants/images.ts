// Imagens do Buiu - URLs das imagens fornecidas
// Cada imagem aparece a cada 1000 cliques

export const BUIU_IMAGES: string[] = [
  'https://cdn-ai.onspace.ai/onspace/files/QDdtzt7tyYi5jq9FT2hPS4/buiu_01.jpeg',  // 0 - 999
  'https://cdn-ai.onspace.ai/onspace/files/TqRa8DnKKgbQxiTrnEH3kT/buiu_02.jpeg',  // 1000 - 1999
  'https://cdn-ai.onspace.ai/onspace/files/nsc4MUcR3WQidmGWDr2s2H/buiu_03.jpeg',  // 2000 - 2999
  'https://cdn-ai.onspace.ai/onspace/files/DNioEo26GtSAQgWkiVfS68/buiu_04.jpeg',  // 3000 - 3999
  'https://cdn-ai.onspace.ai/onspace/files/EtK6DLU6qkH7JTXrwEATvB/buiu_05.jpeg',  // 4000 - 4999
  'https://cdn-ai.onspace.ai/onspace/files/6vxyVmP3Z6hKKt9xtiaGbc/buiu_06.jpeg',  // 5000 - 5999
  'https://cdn-ai.onspace.ai/onspace/files/ep2pUo5qiLxmSTC6aPrpfm/buiu_07.jpeg',  // 6000 - 6999
  'https://cdn-ai.onspace.ai/onspace/files/Jw5jBpAuuacXCyhgEGRmf9/buiu_08.jpeg',  // 7000 - 7999
  'https://cdn-ai.onspace.ai/onspace/files/TJW7ykAXBaoua5TSiCwxge/buiu_09.jpeg',  // 8000 - 8999
  'https://cdn-ai.onspace.ai/onspace/files/CLwwuE7EjLKrAeCaMcp7pa/buiu_10.jpeg',  // 9000 - 9999
  'https://cdn-ai.onspace.ai/onspace/files/LWjdLRAo8kYPfQqDbDdCRe/buiu_11.jpeg',  // 10000 - 10999
  'https://cdn-ai.onspace.ai/onspace/files/jQLjgcjrAQRqNLFY5Ahsgm/buiu_12.jpeg',  // 11000 - 11999
  'https://cdn-ai.onspace.ai/onspace/files/jukHPa9gyzKT4Zst89n5Zj/buiu_13.jpeg',  // 12000 - 12999
  'https://cdn-ai.onspace.ai/onspace/files/ACouWW2nPPzgGhSN4igR3B/buiu_14.jpeg',  // 13000 - 13999
  'https://cdn-ai.onspace.ai/onspace/files/N58k6Ewz7EDkoFUC4DmfsG/buiu_15.jpeg',  // 14000 - 14999
  'https://cdn-ai.onspace.ai/onspace/files/Qx7QsCLD9cZ6MKFNLJc2Yi/buiu_16.jpeg',  // 15000+
];

export const APP_ICON_URL = 'https://cdn-ai.onspace.ai/onspace/files/DQaUeVbP8NGk7UpSgMzC25/app_icon.jpeg';

/**
 * Retorna a URL da imagem correta com base no número de cliques.
 * Muda a cada 1000 cliques.
 * Usa a última imagem se ultrapassar o total disponível.
 */
export function getBuiuImageForClicks(clicks: number): string {
  const index = Math.min(
    Math.floor(clicks / 1000),
    BUIU_IMAGES.length - 1
  );
  return BUIU_IMAGES[index];
}

/**
 * Retorna o índice atual da imagem (0-based)
 */
export function getBuiuImageIndex(clicks: number): number {
  return Math.min(
    Math.floor(clicks / 1000),
    BUIU_IMAGES.length - 1
  );
}
