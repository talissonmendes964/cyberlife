# 📧 Configuração de Notificação de Novos Usuários

## ✅ Solução Implementada (EmailJS - Recomendado)

### 📋 Passo a Passo:

#### 1. Criar Conta no EmailJS (Grátis)
- Acesse: https://www.emailjs.com/
- Clique em "Sign Up" e crie uma conta
- Confirme seu email

#### 2. Adicionar Serviço de Email
1. No dashboard, vá em **"Email Services"**
2. Clique em **"Add New Service"**
3. Selecione **"Gmail"**
4. Conecte sua conta: `cyberlife964@gmail.com`
5. Autorize o acesso
6. Anote o **Service ID** (ex: `service_abc123`)

#### 3. Criar Template de Email
1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure:

**Template Name:** `Admin New User Notification`

**Template ID:** `admin_new_user` (anote isso!)

**From Name:** `CyberLife System`

**Subject:** `🎮 Novo Usuário Cadastrado na CyberLife!`

**Content (HTML):**
```html
<div style="font-family: Arial, sans-serif; padding: 20px; background: #0a0a0a; color: #fff;">
  <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 2px solid #00d9ff; border-radius: 10px; padding: 30px;">
    <h1 style="color: #00d9ff; margin: 0 0 20px 0;">🎮 Novo Usuário Cadastrado</h1>
    <p>Um novo usuário confirmou o email e foi registrado na CyberLife!</p>
    
    <div style="background: rgba(0,217,255,0.1); border-left: 4px solid #00d9ff; padding: 15px; margin: 20px 0;">
      <p><strong style="color: #00d9ff;">Nome:</strong> {{user_name}}</p>
      <p><strong style="color: #00d9ff;">Email:</strong> {{user_email}}</p>
      <p><strong style="color: #00d9ff;">Idade:</strong> {{user_age}} anos</p>
      <p><strong style="color: #00d9ff;">Cidade/Estado:</strong> {{user_city}} - {{user_state}}</p>
      <p><strong style="color: #00d9ff;">WhatsApp:</strong> {{user_whatsapp}}</p>
      <p><strong style="color: #00d9ff;">Data de Cadastro:</strong> {{signup_date}}</p>
    </div>
    
    <p style="color: #666; font-size: 12px; margin-top: 30px;">
      ID do Usuário: {{user_id}}<br>
      Esta é uma notificação automática do sistema.
    </p>
  </div>
</div>
```

**To Email:** `cyberlife964@gmail.com`

4. Clique em **"Save"**

#### 4. Obter Public Key
1. Vá em **"Account"** → **"General"**
2. Copie o **Public Key** (ex: `abc123XYZ`)

#### 5. Instalar Pacote EmailJS
No terminal do projeto, execute:
```bash
npm install @emailjs/browser
```

#### 6. Configurar no Código
Edite o arquivo `src/screens/StartScreen.jsx`:

1. Adicione o import no topo:
```javascript
import emailjs from '@emailjs/browser'
```

2. Atualize a função `notifyAdminNewUser` (já está no código) com suas credenciais:
```javascript
await emailjs.send(
  'service_abc123',      // SEU Service ID
  'admin_new_user',      // SEU Template ID
  templateParams,
  'abc123XYZ'            // SUA Public Key
)
```

#### 7. Testar
1. Crie uma nova conta no site
2. Confirme o email
3. Verifique a caixa de entrada de `cyberlife964@gmail.com`
4. Você deve receber um email com os dados do novo usuário!

---

## 🎯 Status Atual

✅ Código já implementado no `StartScreen.jsx`  
✅ Função `notifyAdminNewUser` criada  
✅ Integrado com listener de confirmação de email  
⏳ **Falta apenas:** Configurar EmailJS e substituir as credenciais

---

## 🔍 Como Funciona

```
1. Usuário cria conta → Email enviado
   ↓
2. Usuário clica no link de confirmação
   ↓
3. Listener detecta confirmação (onAuthStateChange)
   ↓
4. Busca dados do perfil no Supabase
   ↓
5. Chama notifyAdminNewUser(user, profile)
   ↓
6. EmailJS envia email para cyberlife964@gmail.com
   ↓
7. Admin recebe notificação com dados do usuário ✓
```

---

## 💰 Limites Gratuitos

- **EmailJS Free:** 200 emails/mês
- **Supabase Free:** 50.000 emails/mês (confirmação)
- **Total combinado:** Suficiente para maioria dos casos

---

## 🐛 Troubleshooting

**Erro: "Service not found"**
- Verifique se o Service ID está correto
- Certifique-se de que o serviço está ativo no EmailJS

**Erro: "Template not found"**
- Confirme que o Template ID é exatamente `admin_new_user`
- Verifique se o template está salvo

**Email não chega:**
- Verifique spam/lixeira
- Confirme que o email do template está correto
- Veja logs no console do navegador (F12)

**Erro de CORS:**
- EmailJS já tem CORS habilitado por padrão
- Não precisa configurar nada

---

## 📌 Notas Importantes

- A notificação é **assíncrona** e não bloqueia o login
- Se o email falhar, o usuário **não é afetado**
- Logs aparecem no console: `console.log('📧 Notificação Admin:', ...)`
- Para produção, remova os console.logs

---

## 🚀 Pronto!

Depois de seguir os passos acima, toda vez que um novo usuário confirmar o email, você receberá uma notificação automática em `cyberlife964@gmail.com`! 🎉
