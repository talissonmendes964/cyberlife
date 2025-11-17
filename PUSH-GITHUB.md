# 📤 Como Fazer Push para GitHub

## ⚠️ Problema de Autenticação

O Git está tentando usar credenciais de outro usuário. Siga os passos abaixo para resolver:

## ✅ Solução 1: Usar Personal Access Token (RECOMENDADO)

### Passo 1: Gerar Token no GitHub

```
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Configure:
   - Name: cyberlife-token
   - Expiration: 90 days (ou mais)
   - Scopes: 
     ✓ repo (acesso completo ao repositório)
     ✓ admin:repo_hook
     ✓ user:email
4. Clique em "Generate token"
5. COPIE o token (você não verá novamente!)
```

### Passo 2: Configurar Git com Token

```bash
# No PowerShell/CMD (em C:\Users\Crmv\Desktop\cyberlife):

# Remover credenciais antigas
git credential reject
host=github.com

# Adicionar repositório com token
git remote remove origin
git remote add origin https://SEU_USUARIO:SEU_TOKEN@github.com/talissonmendes964/cyberlife.git

# Fazer push
git push -u origin main
```

**Exemplo:**
```bash
git remote add origin https://talissonmendes964:ghp_xxxxxxxxxxxx@github.com/talissonmendes964/cyberlife.git
```

---

## ✅ Solução 2: Usar Git Credential Manager

```bash
# PowerShell como Admin:

# Limpar credenciais antigas
git credential reject
# Digite:
host=github.com
# Pressione Enter duas vezes

# Tentar push (Git pedirá credenciais)
cd C:\Users\Crmv\Desktop\cyberlife
git remote remove origin
git remote add origin https://github.com/talissonmendes964/cyberlife.git
git push -u origin main

# Uma janela aparecerá pedindo login do GitHub
# Faça login e autorize
```

---

## ✅ Solução 3: Usar SSH (Mais Seguro)

### Passo 1: Gerar Chave SSH

```bash
# PowerShell:

ssh-keygen -t ed25519 -C "cyberlife964@gmail.com"

# Quando pedir caminho, deixe padrão (Enter)
# Quando pedir passphrase, deixe vazio (Enter)
```

### Passo 2: Adicionar Chave ao GitHub

```bash
# Copiar chave pública
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard

# Acessar GitHub:
# 1. https://github.com/settings/keys
# 2. Clique "New SSH key"
# 3. Cole a chave (Ctrl+V)
# 4. Clique "Add SSH key"
```

### Passo 3: Fazer Push

```bash
cd C:\Users\Crmv\Desktop\cyberlife
git remote remove origin
git remote add origin git@github.com:talissonmendes964/cyberlife.git
git push -u origin main
```

---

## 🔧 Verificar Status do Git

```bash
cd C:\Users\Crmv\Desktop\cyberlife

# Ver status
git status

# Ver remotes
git remote -v

# Ver commits
git log --oneline
```

---

## 📊 Depois do Push Bem-Sucedido

Você verá:
```
Enumerating objects: 135, done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🚀 Comandos Rápidos

Depois que configurar uma vez, você pode fazer push assim:

```bash
cd C:\Users\Crmv\Desktop\cyberlife
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## 💡 Recomendação

**Use SSH** - é mais seguro que token e não expira como PAT.

Escolha a Solução 3 (SSH) para melhor experiência a longo prazo.

---

## ❓ Dúvidas?

Se receber algum erro, execute este comando para debug:

```bash
GIT_TRACE=1 git push -u origin main
```

Isso mostrará exatamente onde está falhando.
