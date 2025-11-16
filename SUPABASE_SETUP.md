# Configuração do Supabase para CyberLife

## Passos para Configurar:

### 1. Criar Projeto no Supabase
1. Acesse: https://supabase.com/dashboard
2. Clique em "New Project"
3. Preencha:
   - Nome: CyberLife
   - Database Password: (crie uma senha forte)
   - Region: escolha a mais próxima (South America)

### 2. Obter Credenciais
1. No dashboard do projeto, vá em "Settings" → "API"
2. Copie:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon/public key** (chave pública)

### 3. Configurar Variáveis de Ambiente
Edite o arquivo `.env` e substitua:
```
VITE_SUPABASE_URL=sua-url-aqui
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 4. Criar Tabela no Banco de Dados
1. No Supabase, vá em "SQL Editor"
2. Execute o seguinte SQL:

```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Usuários podem ler seu próprio perfil
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Usuários podem criar seu próprio perfil (importante: usar auth.uid() no WITH CHECK)
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Criar índices para performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_state ON profiles(state);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário se registra
-- MODIFICADO: Só cria perfil se o email já estiver confirmado
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

-- Trigger que executa quando o email é confirmado (UPDATE)
-- Esse é o momento em que o perfil será criado
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();
```

### 5. Configurar Autenticação por Email (IMPORTANTE)
1. Vá em "Authentication" → "Settings"
2. Em "Email Auth":
   - ✅ **Ative "Enable Email Confirmations"** (requer confirmação de email)
   - ✅ **Ative "Enable email change confirmations"**
   - ❌ **DESATIVE "Enable Signups"** temporariamente durante desenvolvimento (opcional)
   - Configure "Minimum Password Length" para 6 ou mais
3. Em "Auth Providers":
   - Certifique-se de que "Email" está habilitado
4. **CRÍTICO - Configurar Site URL**:
   - Em "Site URL" coloque: `http://localhost:5173` (desenvolvimento)
   - Para produção, altere para sua URL real (ex: `https://cyberlife.com`)
   - Em "Redirect URLs" adicione:
     - `http://localhost:5173/**`
     - `http://localhost:5173/menu`
5. **IMPORTANTE - Auto Confirm**:
   - **DESATIVE** "Confirm email" se quiser que usuários precisem confirmar
   - Se ativado, usuários são criados automaticamente (não recomendado para produção)

#### Como funciona a confirmação de email:

O Supabase possui duas formas de lidar com confirmação:

**Opção A - Usuário criado apenas após confirmação (RECOMENDADO):**
- Em "Authentication" → "Settings" → "Email Auth"
- **Ative**: "Enable Email Confirmations"
- **Desative**: "Disable email confirmations" (double-opt-in)
- Usuário recebe email e só é ativado após clicar no link

**Opção B - Usuário criado imediatamente mas não pode fazer login:**
- É o padrão do Supabase
- Usuário aparece na tabela `auth.users` mas com `email_confirmed_at = NULL`
- Só consegue fazer login após confirmar

**Nossa implementação usa a Opção B** porque:
- O trigger `handle_new_user()` cria o perfil automaticamente
- O perfil fica "inativo" até a confirmação
- Login é bloqueado até confirmar o email

#### Template de Email de Confirmação Personalizado:

Vá em **Authentication → Email Templates → Confirm Signup** e substitua pelo template abaixo:

**Subject:**
```
🎮 Bem-vindo à CyberLife - Confirme seu Email
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 50%, #0a0a1a 100%);
      color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 48px;
      font-weight: bold;
      color: #00d9ff;
      text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
      letter-spacing: 3px;
      margin-bottom: 10px;
    }
    .tagline {
      color: #aaa;
      font-size: 16px;
      margin-top: 10px;
    }
    .content {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(0, 217, 255, 0.3);
      border-radius: 15px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 0 40px rgba(0, 217, 255, 0.2);
    }
    h1 {
      color: #00d9ff;
      font-size: 28px;
      margin-top: 0;
      margin-bottom: 20px;
      text-align: center;
    }
    p {
      color: #cccccc;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 25px;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .confirm-button {
      display: inline-block;
      background: linear-gradient(135deg, #00d9ff, #0099ff);
      color: #000000;
      text-decoration: none;
      padding: 16px 50px;
      border-radius: 10px;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 0 5px 25px rgba(0, 217, 255, 0.5);
      transition: all 0.3s ease;
    }
    .confirm-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 35px rgba(0, 217, 255, 0.7);
    }
    .info-box {
      background: rgba(255, 230, 0, 0.1);
      border: 1px solid rgba(255, 230, 0, 0.3);
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 0;
      color: #ffe600;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 13px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin: 25px 0;
    }
    .feature {
      flex: 1;
      min-width: 150px;
      background: rgba(0, 217, 255, 0.05);
      border: 1px solid rgba(0, 217, 255, 0.2);
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .feature-icon {
      font-size: 30px;
      margin-bottom: 8px;
    }
    .feature-text {
      color: #00d9ff;
      font-size: 13px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CYBERLIFE</div>
      <div class="tagline">Sua loja geek de tecnologia e games</div>
    </div>
    
    <div class="content">
      <h1>🎮 Bem-vindo à CyberLife!</h1>
      
      <p>Olá, <strong>futuro Cybernaut</strong>!</p>
      
      <p>Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso e está quase pronta para uso.</p>
      
      <p>Para garantir a segurança da sua conta e começar a explorar nosso universo geek, precisamos apenas que você confirme seu endereço de email.</p>
      
      <div class="button-container">
        <a href="{{ .ConfirmationURL }}" class="confirm-button">
          ✅ Confirmar Meu Email
        </a>
      </div>
      
      <div class="info-box">
        <p>⏰ <strong>Importante:</strong> Este link expira em 24 horas. Se não confirmar, será necessário criar uma nova conta.</p>
      </div>
      
      <div class="features">
        <div class="feature">
          <div class="feature-icon">🛒</div>
          <div class="feature-text">Loja Geek</div>
        </div>
        <div class="feature">
          <div class="feature-icon">🎮</div>
          <div class="feature-text">Game House</div>
        </div>
        <div class="feature">
          <div class="feature-icon">🚀</div>
          <div class="feature-text">Ofertas Exclusivas</div>
        </div>
      </div>
      
      <p style="margin-top: 30px; text-align: center; color: #999; font-size: 14px;">
        Após confirmar seu email, você terá acesso a:<br>
        • Produtos exclusivos de tecnologia e games<br>
        • Ofertas e promoções especiais<br>
        • Carrinho de compras personalizado<br>
        • Histórico de pedidos<br>
      </p>
    </div>
    
    <div class="footer">
      <p>Este é um email automático, por favor não responda.</p>
      <p>Se você não criou uma conta na CyberLife, ignore este email.</p>
      <p style="margin-top: 15px;">
        © 2025 CyberLife - Todos os direitos reservados<br>
        Guaíra - SP, Brasil
      </p>
    </div>
  </div>
</body>
</html>
```

**Body (Plain Text - fallback):**
```
🎮 BEM-VINDO À CYBERLIFE!

Olá, futuro Cybernaut!

Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso e está quase pronta para uso.

Para garantir a segurança da sua conta e começar a explorar nosso universo geek, precisamos apenas que você confirme seu endereço de email.

👉 CONFIRME SEU EMAIL:
{{ .ConfirmationURL }}

⏰ IMPORTANTE: Este link expira em 24 horas. Se não confirmar, será necessário criar uma nova conta.

Após confirmar seu email, você terá acesso a:
• Produtos exclusivos de tecnologia e games
• Ofertas e promoções especiais  
• Carrinho de compras personalizado
• Histórico de pedidos

---

Este é um email automático, por favor não responda.
Se você não criou uma conta na CyberLife, ignore este email.

© 2025 CyberLife - Todos os direitos reservados
Guaíra - SP, Brasil
```


### 6. Testar
1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse a aplicação
3. Clique em "Start" e depois "Criar conta"
4. Preencha os dados e crie uma conta
5. Verifique o email de confirmação (pode estar no spam)
6. Faça login!

## Recursos Adicionais

### Ver Usuários Cadastrados
- Vá em "Authentication" → "Users" no dashboard do Supabase

### Ver Dados da Tabela
- Vá em "Table Editor" → "profiles"

### Logs de Erros
- Vá em "Logs" → "API" para ver erros de requisição

## Funcionalidades Implementadas

✅ Registro de usuário com validação de email
✅ Login com email e senha
✅ Recuperação de senha por email
✅ Perfil completo (nome, idade, cidade, estado, whatsapp)
✅ Visualização de senha (toggle)
✅ Mensagens de erro e sucesso
✅ Design cyberpunk responsivo
✅ Segurança com RLS (Row Level Security)

## Problemas Comuns

**Erro "Invalid API key"**
- Verifique se copiou a chave correta do Supabase
- Certifique-se de que o arquivo .env está na raiz do projeto

**Email não chega**
- Verifique a pasta de spam
- Em desenvolvimento, o Supabase tem limites de envio
- Configure um provedor SMTP customizado em Production

**Erro ao criar tabela**
- Certifique-se de estar logado no projeto correto
- Execute o SQL completo de uma vez no SQL Editor

**Erro "new row violates row-level security policy"** ou **"Cannot coerce the result to a single JSON object"**

Estes erros indicam problemas com RLS ou parsing de dados. **SOLUÇÃO DEFINITIVA**:

Execute este SQL no **SQL Editor** do Supabase (versão corrigida com tratamento de erros):

```sql
-- Função ROBUSTA para criar perfil automaticamente
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
  -- Extrair valores dos metadados com valores padrão seguros
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
    id, email, full_name, birth_date, age, city, state, whatsapp
  )
  VALUES (
    NEW.id, NEW.email, v_full_name, v_birth_date, 
    v_age, v_city, v_state, v_whatsapp
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar perfil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger que executa após criar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Por que isso funciona?**
- O trigger usa `SECURITY DEFINER`, que executa com privilégios do criador (admin)
- Bypassa as políticas RLS de forma segura
- Cria o perfil automaticamente a partir dos metadados do usuário
- É a solução recomendada pela documentação do Supabase

Após executar esse SQL, teste criar uma nova conta!

**Erro 406 ao buscar perfil no login**
Este erro ocorre quando o `.single()` não encontra o registro. Já foi corrigido no código usando `.maybeSingle()` que permite resultado vazio, e um fallback que cria o perfil se não existir. Se ainda ocorrer:

1. Verifique se o trigger foi criado: No SQL Editor execute:
   ```sql
   SELECT trigger_name FROM information_schema.triggers 
   WHERE event_object_table = 'users' AND trigger_schema = 'auth';
   ```
   Deve retornar `on_auth_user_created`

2. Teste o trigger manualmente: Crie um usuário de teste e verifique se o perfil foi criado automaticamente na tabela `profiles`

3. Verifique logs do Postgres: Vá em **Logs** → **Postgres** e procure por warnings do trigger
