-- Script de migração para adicionar sistema de indicações
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar novos campos na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "Categoria" VARCHAR(20) DEFAULT 'cliente',
ADD COLUMN IF NOT EXISTS indicacao VARCHAR(255),
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS initial_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS consultant_earnings DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS last_earnings_reset TIMESTAMP WITH TIME ZONE;

-- 2. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_categoria ON profiles("Categoria");
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_code ON profiles(referred_by_code);

-- 3. Criar função para gerar código de referência único
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Verificar se o código já existe
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = result) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar trigger para gerar código de referência automaticamente para consultores
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a categoria for 'consultor' e não tiver código de referência, gerar um
  IF NEW."Categoria" = 'consultor' AND (NEW.referral_code IS NULL OR NEW.referral_code = '') THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON profiles;
CREATE TRIGGER trigger_set_referral_code
BEFORE INSERT OR UPDATE OF "Categoria" ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_referral_code();

-- 5. Atualizar consultores existentes (se houver) para gerar códigos de referência
UPDATE profiles 
SET referral_code = generate_referral_code()
WHERE "Categoria" = 'consultor' AND (referral_code IS NULL OR referral_code = '');

-- 6. Criar política RLS (Row Level Security) para a tabela profiles
-- Permitir que usuários vejam apenas seus próprios dados e consultores vejam seus indicados
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para leitura: usuários podem ver seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Política para leitura: consultores podem ver perfis de seus indicados
DROP POLICY IF EXISTS "Consultants can view referred profiles" ON profiles;
CREATE POLICY "Consultants can view referred profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles AS consultant
    WHERE consultant.id = auth.uid()
    AND consultant."Categoria" = 'consultor'
    AND profiles.referred_by_code = consultant.referral_code
  )
);

-- Política para leitura: admin pode ver todos os perfis
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Admin can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.email = 'douglasnoticias@gmail.com'
  )
);

-- Política para atualização: usuários podem atualizar seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Política para atualização: admin pode atualizar todos os perfis
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
CREATE POLICY "Admin can update all profiles" ON profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.email = 'douglasnoticias@gmail.com'
  )
);

-- 7. Criar view para facilitar consultas de indicações
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
  c.id as consultant_id,
  c.name as consultant_name,
  c.email as consultant_email,
  c.referral_code,
  COUNT(r.id) as total_referrals,
  COALESCE(SUM(r.balance - r.initial_balance), 0) as total_profit,
  COALESCE(SUM((r.balance - r.initial_balance) * 0.10), 0) as total_earnings,
  c.consultant_earnings,
  c.last_earnings_reset
FROM profiles c
LEFT JOIN profiles r ON r.referred_by_code = c.referral_code
WHERE c."Categoria" = 'consultor'
GROUP BY c.id, c.name, c.email, c.referral_code, c.consultant_earnings, c.last_earnings_reset;

-- 8. Comentários para documentação
COMMENT ON COLUMN profiles."Categoria" IS 'Categoria do usuário: cliente ou consultor';
COMMENT ON COLUMN profiles.indicacao IS 'Nome do consultor que indicou o cliente';
COMMENT ON COLUMN profiles.referral_code IS 'Código único de referência do consultor';
COMMENT ON COLUMN profiles.referred_by_code IS 'Código do consultor que indicou este cliente';
COMMENT ON COLUMN profiles.initial_balance IS 'Saldo inicial investido pelo cliente';
COMMENT ON COLUMN profiles.consultant_earnings IS 'Ganhos acumulados do consultor com indicações';
COMMENT ON COLUMN profiles.last_earnings_reset IS 'Data do último reset de ganhos do consultor';

-- Fim do script de migração
