# 🔧 Corrigir Deploy no Vercel

## ❌ Problemas Identificados:

1. **Variáveis de ambiente não configuradas** - Supabase URL aparecendo como `your-project.supabase.co`
2. **Favicon não encontrado** - Erro 404 em `/favicon.ico`
3. **Imagens não carregam** - Paths das imagens incorretos

---

## ✅ Solução 1: Configurar Variáveis de Ambiente no Vercel

### Passo 1: Adicionar Variáveis no Vercel

```
1. Acesse o dashboard do Vercel: https://vercel.com/dashboard
2. Selecione o projeto "cyberlife"
3. Vá em "Settings" → "Environment Variables"
4. Adicione duas variáveis:

   Nome: VITE_SUPABASE_URL
   Valor: https://tvukdcbvqweechmawdac.supabase.co
   
   Nome: VITE_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua chave)
   
5. Clique em "Save"
6. Redeploy o projeto (Settings → Deployments → click "Redeploy")
```

### Passo 2: Redeploy

```
1. Acesse: https://vercel.com/dashboard/project/cyberlife
2. Clique em "Deployments"
3. Encontre o último deployment
4. Clique nos 3 pontinhos → "Redeploy"
```

---

## ✅ Solução 2: Corrigir Paths das Imagens

O arquivo `.env` precisa estar na raiz do projeto para Vercel usar as variáveis.

### Criar arquivo `.env` na raiz:

```bash
# Copie este arquivo para C:\Users\Crmv\Desktop\cyberlife\.env

VITE_SUPABASE_URL=https://tvukdcbvqweechmawdac.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
```

Depois faça commit e push:

```bash
cd C:\Users\Crmv\Desktop\cyberlife
git add .env
git commit -m "Add environment variables"
git push
```

---

## ✅ Solução 3: Adicionar Favicon

O Vercel procura por `favicon.ico` mas não encontra.

### Adicionar favicon em `public/favicon.ico`:

```bash
# Copiar seu ícone para public/
cp src/imagens/cyberlife-icone2.png public/favicon.ico
```

Ou faça upload manualmente:
1. Coloque `cyberlife-icone2.png` em `public/favicon.ico`
2. Commit e push

---

## 📝 Checklist Completo:

- [ ] Supabase URL configurada no Vercel: `https://tvukdcbvqweechmawdac.supabase.co`
- [ ] Supabase ANON KEY configurada no Vercel
- [ ] `.env` file criado com as variáveis
- [ ] `public/favicon.ico` existe
- [ ] Redeploy feito no Vercel
- [ ] Aguardar 2-3 minutos para aplicar

---

## 🧪 Como Testar Depois:

1. Abra: https://seu-projeto.vercel.app
2. F12 → Console
3. Não deve aparecer erros de Supabase
4. Tente fazer login

---

## 🔐 Sua Configuração:

```
VITE_SUPABASE_URL: https://tvukdcbvqweechmawdac.supabase.co
VITE_SUPABASE_ANON_KEY: (encontre em Supabase → Settings → API)
```

---

## 🆘 Se Ainda Não Funcionar:

1. **Verificar no Vercel**: 
   - Vá em "Logs" → "Build" para ver erros
   - Vá em "Logs" → "Runtime" para ver erros ao executar

2. **Verificar variáveis**:
   ```bash
   # Executar localmente com Vercel
   vercel env pull
   npm run dev
   ```

3. **Testar no localhost**:
   ```bash
   npm run dev
   # Se funciona local mas não no Vercel, problema é nas variáveis
   ```

---

## 📚 Documentação Vercel:

- Environment Variables: https://vercel.com/docs/environment-variables
- Deployment: https://vercel.com/docs/deployments

---

**Execute estes passos e o site funciona 100%!** ✅
