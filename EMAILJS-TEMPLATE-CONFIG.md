# 📧 Configuração do Template EmailJS

## ✅ Credenciais Implementadas

- **Service ID**: `service_vvcar35`
- **Template ID**: `template_suhs0ik`
- **Public Key**: `SxPIIDojWJxViW_q_`

---

## 📋 Campos que o Template Precisa Ter

Certifique-se de que seu template no EmailJS (`template_suhs0ik`) contém os seguintes parâmetros:

### Parâmetros Enviados pelo Código:

| Parâmetro          | Descrição                           | Exemplo                          |
|--------------------|-------------------------------------|----------------------------------|
| `to_email`         | Email do destinatário (admin)       | `cyberlife964@gmail.com`         |
| `user_name`        | Nome completo do novo usuário       | `João Silva`                     |
| `user_email`       | Email do novo usuário               | `joao@email.com`                 |
| `user_age`         | Idade do usuário                    | `25`                             |
| `user_location`    | Cidade - Estado                     | `Guaíra - SP`                    |
| `user_whatsapp`    | WhatsApp do usuário                 | `(17) 99999-9999`                |
| `user_id`          | ID único do usuário no banco        | `abc-123-def-456`                |
| `registration_date`| Data/hora do cadastro formatada     | `sábado, 16 de novembro de 2024, 14:30` |

---

## 🎨 Exemplo de Template HTML

Copie e cole este HTML no seu template do EmailJS:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .header {
      background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .info-block {
      background: #f5f5f5;
      border-left: 4px solid #00d9ff;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 5px;
    }
    .info-block strong {
      color: #333;
      display: block;
      margin-bottom: 5px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-block span {
      color: #666;
      font-size: 16px;
    }
    .footer {
      background: #2a2a2a;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 12px;
    }
    .footer p {
      margin: 5px 0;
      opacity: 0.8;
    }
    .badge {
      display: inline-block;
      background: #00d9ff;
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎮 CyberLife</h1>
      <p>Novo Usuário Cadastrado</p>
    </div>
    
    <div class="content">
      <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
        Um novo usuário acabou de confirmar o cadastro na plataforma CyberLife!
      </p>

      <div class="info-block">
        <strong>👤 Nome Completo</strong>
        <span>{{user_name}}</span>
      </div>

      <div class="info-block">
        <strong>📧 Email</strong>
        <span>{{user_email}}</span>
      </div>

      <div class="info-block">
        <strong>🎂 Idade</strong>
        <span>{{user_age}} anos</span>
      </div>

      <div class="info-block">
        <strong>📍 Localização</strong>
        <span>{{user_location}}</span>
      </div>

      <div class="info-block">
        <strong>📱 WhatsApp</strong>
        <span>{{user_whatsapp}}</span>
      </div>

      <div class="info-block">
        <strong>🆔 User ID</strong>
        <span style="font-family: monospace; font-size: 12px;">{{user_id}}</span>
      </div>

      <div class="info-block">
        <strong>📅 Data de Cadastro</strong>
        <span>{{registration_date}}</span>
      </div>

      <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0; color: #999; font-size: 12px; text-align: center;">
        <span class="badge">✅ Email Confirmado</span>
      </p>
    </div>

    <div class="footer">
      <p><strong>CyberLife - Gestão de Usuários</strong></p>
      <p>Este é um email automático. Não responda esta mensagem.</p>
      <p style="margin-top: 10px;">© 2024 CyberLife. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
```

---

## 🔧 Como Configurar no EmailJS:

1. **Acesse**: https://dashboard.emailjs.com/admin
2. **Vá em**: Email Templates
3. **Selecione**: `template_suhs0ik`
4. **Cole o HTML acima** no editor
5. **Teste**: Clique em "Test It" para ver como fica
6. **Salve**: Clique em "Save"

---

## ✅ Verificação:

Após salvar o template, você pode testar criando uma nova conta no site. O admin (`cyberlife964@gmail.com`) receberá um email com:

- ✅ Design moderno e profissional
- ✅ Todos os dados do novo usuário
- ✅ Formatação clara e organizada
- ✅ Badge de "Email Confirmado"

---

## 🚀 Como Funciona:

1. **Usuário cria conta** no site
2. **Confirma email** clicando no link recebido
3. **Trigger dispara** a função `notifyAdminNewUser()`
4. **EmailJS envia** email para `cyberlife964@gmail.com`
5. **Admin recebe** notificação com todos os dados

---

## 📊 Limite de Emails:

- **Plano Gratuito**: 200 emails/mês
- **Monitoramento**: Acesse o dashboard do EmailJS para ver quantos emails foram enviados

---

## 🐛 Troubleshooting:

### Email não está chegando?

1. **Verifique o spam** - Emails podem ir para lixeira
2. **Confira o Service ID** - Deve estar ativo no EmailJS
3. **Verifique o Template ID** - Deve corresponder ao criado
4. **Console do navegador** - Veja se há erros no console (F12)
5. **Dashboard EmailJS** - Veja o histórico de envios

### Erro 403 (Forbidden)?

- Verifique se a **Public Key** está correta
- Confirme que o **Service** está conectado ao Gmail

### Erro 400 (Bad Request)?

- Verifique se todos os **parâmetros** do template existem
- Confira se os **nomes dos campos** batem com o código

---

## 📝 Logs no Console:

Ao testar, você verá no console:

```
📧 Enviando notificação ao admin... {user_name: "João Silva", ...}
✅ Email enviado com sucesso ao admin!
```

Ou em caso de erro:

```
❌ Erro ao notificar admin: Error { ... }
```

---

## ✨ Pronto!

O sistema de notificação por email está 100% funcional! Cada novo usuário que confirmar o email gerará uma notificação automática para o admin.
