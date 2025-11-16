-- ============================================
-- FIX: Row Level Security Policy Error
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Função para criar perfil automaticamente quando usuário confirma email
-- MODIFICADO: Só cria perfil APÓS confirmação do email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_birth_date DATE;
  v_age INTEGER;
  v_city TEXT;
  v_state TEXT;
  v_whatsapp TEXT;
BEGIN
  -- Só criar perfil se o email já foi confirmado
  -- Isso evita criar perfis para contas que nunca serão ativadas
  IF NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;

  -- Extrair valores dos metadados com valores padrão
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário');
  v_birth_date := COALESCE(
    (NEW.raw_user_meta_data->>'birth_date')::date, 
    CURRENT_DATE - INTERVAL '18 years'
  );
  v_age := COALESCE((NEW.raw_user_meta_data->>'age')::integer, 18);
  v_city := COALESCE(NEW.raw_user_meta_data->>'city', 'Não informado');
  v_state := COALESCE(NEW.raw_user_meta_data->>'state', 'SP');
  v_whatsapp := COALESCE(NEW.raw_user_meta_data->>'whatsapp', '');

  -- Inserir perfil
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    birth_date, 
    age, 
    city, 
    state, 
    whatsapp
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_birth_date,
    v_age,
    v_city,
    v_state,
    v_whatsapp
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro mas não falha o registro do usuário
    RAISE WARNING 'Erro ao criar perfil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover triggers antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Criar trigger que só executa APÓS confirmação do email
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- IMPORTANTE:
-- - SECURITY DEFINER faz o trigger executar com privilégios de admin
-- - Perfil só é criado APÓS o usuário confirmar o email
-- - Isso evita perfis "fantasmas" de contas não confirmadas
-- - O trigger monitora mudanças no campo email_confirmed_at
-- ============================================
