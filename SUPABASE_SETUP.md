# 🎮 BUIU CLICKER - Configuração do Supabase

## 1. Criar as tabelas no Supabase

Execute o seguinte SQL no Supabase SQL Editor:

```sql
-- Tabela de jogadores
CREATE TABLE public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  best_clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para ranking
CREATE INDEX idx_players_best_clicks ON public.players(best_clicks DESC);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## 2. Função RPC para atualização atômica do recorde

```sql
-- Função atômica: só atualiza se a nova pontuação for maior
CREATE OR REPLACE FUNCTION update_best_clicks_if_greater(
  p_player_id UUID,
  p_new_score INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  updated BOOLEAN;
BEGIN
  UPDATE public.players
  SET best_clicks = p_new_score,
      updated_at = NOW()
  WHERE id = p_player_id
    AND p_new_score > best_clicks;
  
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 3. Políticas RLS

```sql
-- Habilitar RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ver o ranking
CREATE POLICY "players_select_all"
ON public.players FOR SELECT
USING (true);

-- Qualquer um pode criar jogador (sem auth)
CREATE POLICY "players_insert_all"
ON public.players FOR INSERT
WITH CHECK (true);

-- Qualquer um pode atualizar (controlado pelo app)
CREATE POLICY "players_update_all"
ON public.players FOR UPDATE
USING (true);
```

## 4. Buckets de Storage

Crie dois buckets no Supabase Storage:

- `player-photos` - Para fotos de perfil (público)
- `buiu-images` - Para imagens do jogo (público)

Para cada bucket, nas políticas de Storage:
```sql
-- Permitir upload público
CREATE POLICY "allow_public_upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'player-photos');

CREATE POLICY "allow_public_select" ON storage.objects
FOR SELECT USING (bucket_id = 'player-photos');

-- Repetir para buiu-images
CREATE POLICY "allow_public_upload_buiu" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'buiu-images');

CREATE POLICY "allow_public_select_buiu" ON storage.objects
FOR SELECT USING (bucket_id = 'buiu-images');
```

## 5. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

Para o EAS Build, configure as variáveis em:
- Supabase Dashboard > Settings > API
- Copie a URL e a anon/public key

## 6. Build APK

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na Expo
eas login

# Build APK Android
eas build -p android --profile preview
```

O APK estará disponível para download após o build.
