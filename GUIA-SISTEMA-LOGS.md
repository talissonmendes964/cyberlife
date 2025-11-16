# 📊 Sistema de Logs de Acesso - CyberLife

## ✅ Implementação Completa

### 🎯 O que foi implementado:

1. **Tabela SQL** (`access_logs`) com todos os campos solicitados
2. **Hook React** (`useAccessLog`) para registrar acessos automaticamente
3. **Visualização de Logs** no painel admin com estatísticas
4. **Integração Automática** em todas as páginas do site

---

## 📋 Passo 1: Criar Tabela no Supabase

Execute o arquivo `create-access-logs-table.sql` no **Supabase SQL Editor**:

```sql
CREATE TABLE public.access_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_name TEXT,
  access_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_hour TIME DEFAULT LOCALTIME,
  city TEXT,
  state TEXT,
  ip_address TEXT,
  user_agent TEXT,
  page_visited TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 Funcionalidades

### 📈 Dados Registrados Automaticamente:

- ✅ **Usuário**: ID, email e nome (se logado) ou "Anônimo"
- ✅ **Data/Hora**: Data completa e hora separada
- ✅ **Localização**: Cidade e Estado (do perfil do usuário)
- ✅ **IP**: Endereço IP do acesso (capturado pelo navegador)
- ✅ **Dispositivo**: User Agent (navegador/sistema)
- ✅ **Página**: URL acessada (`/`, `/menu`, `/loja-geek`, etc)
- ✅ **Sessão**: ID único da sessão do usuário

### 📊 Painel Admin - Visualização:

1. **Estatísticas Gerais**:
   - Total de acessos
   - Usuários únicos
   - Estado mais ativo

2. **Top Estados**:
   - Gráfico de barras com os 5 estados mais ativos
   - Porcentagem e contagem de acessos

3. **Filtros**:
   - **Todos**: Mostra todos os acessos
   - **Logados**: Apenas usuários autenticados
   - **Anônimos**: Apenas visitantes não logados

4. **Tabela Detalhada**:
   - Nome/Email do usuário
   - Data e hora formatada
   - Cidade - Estado
   - Página visitada
   - Últimos 100 acessos

---

## 🔧 Como Funciona:

### 1. Registro Automático:

```javascript
// O hook useAccessLog registra automaticamente em cada navegação
useAccessLog(currentUser, location.pathname)
```

**Fluxo**:
```
Usuário acessa qualquer página
  ↓
AccessLogger detecta mudança de rota
  ↓
Busca dados do perfil (cidade/estado)
  ↓
Cria/recupera session_id
  ↓
Insere registro em access_logs
  ↓
Log: "✅ Acesso registrado: {page, user}"
```

### 2. Visualização no Admin:

```
Admin Panel → Aba "LOGS DE ACESSO"
  ↓
Carrega últimos 100 logs
  ↓
Calcula estatísticas
  ↓
Exibe tabela e gráficos
```

---

## 📊 Queries Úteis:

### Ver últimos 10 acessos:
```sql
SELECT 
  user_name, 
  user_email, 
  city, 
  state, 
  access_date,
  page_visited
FROM public.access_logs 
ORDER BY access_date DESC 
LIMIT 10;
```

### Contar acessos por estado:
```sql
SELECT state, COUNT(*) as total_acessos
FROM public.access_logs
WHERE state IS NOT NULL
GROUP BY state
ORDER BY total_acessos DESC;
```

### Acessos por usuário:
```sql
SELECT 
  user_email,
  user_name,
  COUNT(*) as total_acessos,
  MAX(access_date) as ultimo_acesso
FROM public.access_logs
WHERE user_id IS NOT NULL
GROUP BY user_email, user_name
ORDER BY total_acessos DESC;
```

### Acessos por página:
```sql
SELECT 
  page_visited,
  COUNT(*) as total_acessos
FROM public.access_logs
GROUP BY page_visited
ORDER BY total_acessos DESC;
```

### Acessos por hora do dia:
```sql
SELECT 
  EXTRACT(HOUR FROM access_date) as hora,
  COUNT(*) as total_acessos
FROM public.access_logs
GROUP BY hora
ORDER BY hora;
```

---

## 🎯 Casos de Uso:

1. **Análise de Tráfego**: Ver quais páginas são mais visitadas
2. **Origem dos Usuários**: Estados com mais visitantes
3. **Horários de Pico**: Quando o site tem mais acessos
4. **Usuários Ativos**: Quem acessa mais frequentemente
5. **Visitantes vs Logados**: Proporção de usuários anônimos

---

## 🔍 Exemplo de Registro:

```json
{
  "id": 1,
  "user_id": "abc-123-def",
  "user_email": "usuario@email.com",
  "user_name": "João Silva",
  "access_date": "2025-01-16 14:30:00",
  "access_hour": "14:30:00",
  "city": "Guaíra",
  "state": "SP",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "page_visited": "/loja-geek",
  "session_id": "session_1705421400_abc123"
}
```

---

## 🚀 Testando:

1. Execute o SQL no Supabase
2. Navegue pelo site (qualquer página)
3. Vá em `/admin` → Login → Aba "LOGS DE ACESSO"
4. Veja seus acessos registrados!

---

## 📌 Notas Importantes:

- **Performance**: Hook usa debounce de 1 segundo para evitar logs duplicados
- **Session ID**: Único por sessão, persiste no sessionStorage
- **Anônimos**: Visitantes não logados também são registrados (user_id = NULL)
- **RLS**: Políticas de segurança permitem que usuários vejam apenas seus logs
- **Admin**: Admin pode ver todos os logs (política "Admin can view all logs")

---

## 🎉 Pronto!

O sistema de logs está completamente funcional e integrado! Todos os acessos são registrados automaticamente e você pode visualizar as estatísticas no painel admin.
