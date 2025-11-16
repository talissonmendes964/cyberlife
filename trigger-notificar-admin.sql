-- ============================================
-- NOTIFICAÇÃO: Email para admin quando novo usuário confirma
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Função para enviar notificação ao admin quando novo usuário é criado
CREATE OR REPLACE FUNCTION public.notify_admin_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_email TEXT;
  v_city TEXT;
  v_state TEXT;
  v_age INTEGER;
  v_whatsapp TEXT;
  v_subject TEXT;
  v_body TEXT;
BEGIN
  -- Só notificar se o email foi confirmado (usuário real)
  IF NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;

  -- Extrair dados do usuário
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Não informado');
  v_email := NEW.email;
  v_city := COALESCE(NEW.raw_user_meta_data->>'city', 'Não informado');
  v_state := COALESCE(NEW.raw_user_meta_data->>'state', 'Não informado');
  v_age := COALESCE((NEW.raw_user_meta_data->>'age')::integer, 0);
  v_whatsapp := COALESCE(NEW.raw_user_meta_data->>'whatsapp', 'Não informado');

  -- Preparar email
  v_subject := '🎮 Novo Usuário Cadastrado na CyberLife!';
  v_body := format(
    E'<!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 2px solid #00d9ff; border-radius: 10px; padding: 30px; }
        h1 { color: #00d9ff; margin: 0 0 20px 0; font-size: 24px; }
        .info { background: rgba(0, 217, 255, 0.1); border-left: 4px solid #00d9ff; padding: 15px; margin: 10px 0; }
        .label { color: #00d9ff; font-weight: bold; }
        .value { color: #fff; margin-left: 10px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎮 Novo Usuário Cadastrado</h1>
        <p>Um novo usuário confirmou o email e foi registrado na CyberLife!</p>
        
        <div class="info">
          <p><span class="label">Nome Completo:</span><span class="value">%s</span></p>
          <p><span class="label">Email:</span><span class="value">%s</span></p>
          <p><span class="label">Idade:</span><span class="value">%s anos</span></p>
          <p><span class="label">Cidade/Estado:</span><span class="value">%s - %s</span></p>
          <p><span class="label">WhatsApp:</span><span class="value">%s</span></p>
          <p><span class="label">Data de Cadastro:</span><span class="value">%s</span></p>
        </div>
        
        <div class="footer">
          <p>Esta é uma notificação automática do sistema CyberLife.</p>
          <p>ID do Usuário: %s</p>
        </div>
      </div>
    </body>
    </html>',
    v_full_name,
    v_email,
    v_age,
    v_city,
    v_state,
    v_whatsapp,
    TO_CHAR(NEW.created_at, 'DD/MM/YYYY HH24:MI:SS'),
    NEW.id
  );

  -- Enviar email usando Supabase Auth (mesma infra de emails)
  -- Nota: Isso usa o mesmo provedor de email configurado no Supabase
  PERFORM extensions.http_post(
    'https://api.sendgrid.com/v3/mail/send',
    json_build_object(
      'personalizations', json_build_array(
        json_build_object(
          'to', json_build_array(
            json_build_object('email', 'cyberlife964@gmail.com')
          ),
          'subject', v_subject
        )
      ),
      'from', json_build_object(
        'email', 'noreply@cyberlife.com',
        'name', 'CyberLife System'
      ),
      'content', json_build_array(
        json_build_object(
          'type', 'text/html',
          'value', v_body
        )
      )
    )::text,
    json_build_object(
      'Authorization', 'Bearer YOUR_SENDGRID_API_KEY',
      'Content-Type', 'application/json'
    )::jsonb
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log mas não falha o cadastro se email não enviar
    RAISE WARNING 'Erro ao notificar admin: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_new_user_notify_admin ON auth.users;

-- Criar trigger que executa APÓS confirmação do email
CREATE TRIGGER on_new_user_notify_admin
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.notify_admin_new_user();

-- ============================================
-- NOTA IMPORTANTE:
-- A função acima usa SendGrid como exemplo.
-- Para usar o email nativo do Supabase (mais simples),
-- use a abordagem abaixo com Edge Function.
-- ============================================
