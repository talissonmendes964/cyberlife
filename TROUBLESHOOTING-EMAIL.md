# 🔍 Troubleshooting - Email não está sendo enviado

## ✅ Melhorias Implementadas

1. **Retry Logic**: Sistema tenta buscar o perfil 3 vezes (com delay de 1.5s entre tentativas)
2. **Delay Inicial**: Aguarda 2 segundos antes de buscar perfil (tempo para trigger criar)
3. **Fallback para user_metadata**: Se perfil não existir, usa dados do `user_metadata`
4. **Logs Detalhados**: Console mostra cada etapa do processo

---

## 🧪 Como Testar e Diagnosticar

### 1. Abra o Console do Navegador (F12)

Antes de criar uma nova conta, abra o **DevTools** (F12) e vá na aba **Console**.

### 2. Crie uma Nova Conta

Preencha o formulário e crie uma conta de teste.

### 3. Verifique os Logs no Console

Você deve ver uma sequência de logs como esta:

```
🔔 Auth event: SIGNED_UP Mode: register
🔔 Auth event: SIGNED_IN Mode: awaiting-confirmation
✅ Email confirmado! Buscando perfil...
⏳ Tentativa 1/3: Perfil ainda não criado, aguardando...
⏳ Tentativa 2/3: Perfil ainda não criado, aguardando...
📋 Perfil encontrado: {full_name: "João Silva", ...}
📧 Iniciando envio de notificação...
👤 User: {id: "abc-123", email: "joao@email.com", ...}
📋 Profile: {full_name: "João Silva", city: "Guaíra", ...}
📨 Parâmetros do email: {to_email: "cyberlife964@gmail.com", ...}
🚀 Enviando email via EmailJS...
📬 Resposta EmailJS: {status: 200, text: "OK"}
✅ Email enviado com sucesso ao admin!
```

---

## ❌ Possíveis Erros e Soluções

### Erro: "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"

**Problema**: Extensão de bloqueador de anúncios (AdBlock, uBlock) está bloqueando EmailJS

**Solução**: 
```
1. Desative o bloqueador de anúncios no site
2. OU adicione api.emailjs.com à lista de permissões
3. Teste novamente
```

### Erro: "403 Forbidden"

**Problema**: Public Key inválida ou serviço não autorizado

**Solução**:
```
1. Acesse: https://dashboard.emailjs.com/admin/account
2. Copie a Public Key novamente
3. Verifique se corresponde a: SxPIIDojWJxViW_q_
4. Se diferente, atualize no código
```

### Erro: "400 Bad Request - Template parameters are invalid"

**Problema**: Template não está configurado corretamente

**Solução**:
```
1. Acesse: https://dashboard.emailjs.com/admin/templates/template_suhs0ik
2. Verifique se o template existe
3. Confirme que tem TODOS os parâmetros:
   - {{user_name}}
   - {{user_email}}
   - {{user_age}}
   - {{user_location}}
   - {{user_whatsapp}}
   - {{user_id}}
   - {{registration_date}}
```

### Erro: "404 Not Found - Template not found"

**Problema**: Template ID incorreto

**Solução**:
```
1. Acesse: https://dashboard.emailjs.com/admin/templates
2. Verifique o ID do template
3. Se diferente de template_suhs0ik, copie o correto
4. Atualize no código: StartScreen.jsx linha ~132
```

### Erro: "Service ID is invalid"

**Problema**: Service ID incorreto ou serviço não conectado

**Solução**:
```
1. Acesse: https://dashboard.emailjs.com/admin
2. Vá em "Email Services"
3. Verifique se service_vvcar35 existe e está ATIVO
4. Confirme que está conectado ao Gmail (cyberlife964@gmail.com)
5. Se não estiver, clique em "Connect Gmail"
```

### Nenhum Erro, Mas Email Não Chega

**Possíveis Causas**:

1. **Email foi para SPAM**
   ```
   - Verifique a pasta de spam de cyberlife964@gmail.com
   - Marque o email como "Não é spam"
   ```

2. **Limite de Emails Atingido**
   ```
   - Acesse: https://dashboard.emailjs.com/admin
   - Veja "Email Usage" no dashboard
   - Plano gratuito: 200 emails/mês
   - Se atingiu o limite, faça upgrade ou aguarde próximo mês
   ```

3. **Service Desconectado**
   ```
   - EmailJS pode desconectar do Gmail após períodos de inatividade
   - Acesse Email Services e reconecte
   ```

4. **Template Não Salvo**
   ```
   - Certifique-se de clicar em "SAVE" após editar o template
   - Teste o template usando "Test It" no dashboard
   ```

---

## 🔬 Teste Manual do EmailJS

Para verificar se o problema é no código ou no EmailJS:

### 1. Teste no Dashboard do EmailJS

```
1. Acesse: https://dashboard.emailjs.com/admin/templates/template_suhs0ik
2. Clique em "Test It"
3. Preencha os campos com dados de teste
4. Clique em "Send Test Email"
5. Verifique se o email chega em cyberlife964@gmail.com
```

Se o teste funcionar, o problema está no código. Se não funcionar, o problema está na configuração do EmailJS.

---

## 🧩 Verificação Passo a Passo

Execute este checklist:

### ✅ Checklist EmailJS

- [ ] Service ID está correto: `service_vvcar35`
- [ ] Template ID está correto: `template_suhs0ik`
- [ ] Public Key está correta: `SxPIIDojWJxViW_q_`
- [ ] Service está ATIVO no dashboard
- [ ] Service está conectado ao Gmail (cyberlife964@gmail.com)
- [ ] Template existe e está salvo
- [ ] Template tem todos os 7 parâmetros ({{user_name}}, etc)
- [ ] Não atingiu o limite de 200 emails/mês
- [ ] Bloqueador de anúncios está desativado
- [ ] Gmail não está bloqueando emails do EmailJS

### ✅ Checklist Código

- [ ] `@emailjs/browser` instalado (`npm install @emailjs/browser`)
- [ ] Import do emailjs no topo do arquivo
- [ ] Função `notifyAdminNewUser` está correta
- [ ] Função é chamada no `onAuthStateChange`
- [ ] Console mostra logs detalhados
- [ ] Não há erros no console do navegador

---

## 🆘 Se Nada Funcionar

### Teste com Código Isolado

Crie um arquivo `test-email.html` e teste diretamente:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script>
    (function(){
      emailjs.init('SxPIIDojWJxViW_q_');
    })();
  </script>
</head>
<body>
  <button onclick="sendEmail()">Testar Email</button>

  <script>
    function sendEmail() {
      console.log('Enviando email...');
      
      emailjs.send('service_vvcar35', 'template_suhs0ik', {
        to_email: 'cyberlife964@gmail.com',
        user_name: 'TESTE',
        user_email: 'teste@email.com',
        user_age: '25',
        user_location: 'Guaíra - SP',
        user_whatsapp: '(17) 99999-9999',
        user_id: 'test-123',
        registration_date: new Date().toLocaleString('pt-BR')
      })
      .then(function(response) {
        console.log('✅ SUCESSO!', response);
        alert('Email enviado com sucesso!');
      }, function(error) {
        console.error('❌ ERRO:', error);
        alert('Erro: ' + error.text);
      });
    }
  </script>
</body>
</html>
```

Abra este arquivo no navegador, clique no botão e veja se o email é enviado.

---

## 📞 Suporte EmailJS

Se o problema persistir, contate o suporte:

- **Dashboard**: https://dashboard.emailjs.com/admin
- **Documentação**: https://www.emailjs.com/docs/
- **Suporte**: support@emailjs.com

---

## 📊 Monitoramento

Para monitorar emails enviados:

```
1. Acesse: https://dashboard.emailjs.com/admin
2. Veja "Email History" para ver todos os emails enviados
3. Clique em cada email para ver detalhes (status, erro, etc)
```

---

## 🎯 Próximos Passos

1. **Teste novamente** criando uma nova conta
2. **Verifique o console** - deve aparecer os logs detalhados
3. **Verifique o spam** do email cyberlife964@gmail.com
4. **Verifique o dashboard** do EmailJS para ver histórico de envios
5. **Se houver erro**, copie a mensagem e me envie para análise

---

## 💡 Dica

Use uma **conta de teste** para não esgotar o limite de emails:

```
Email de teste: teste@example.com
Senha: test123456
```

Crie várias vezes com esse mesmo email (deletando antes) para testar sem desperdiçar emails.
