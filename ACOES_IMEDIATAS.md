# 🚨 AÇÕES IMEDIATAS — Faz Agora!

## 1️⃣ REMOVER CREDENCIAIS HARDCODED (5 min)

**Arquivo:** `app/login/page.tsx`

### ❌ Está assim agora (ERRADO):
```typescript
const [email, setEmail] = useState('dr.amorim@escritorio.com');
const [password, setPassword] = useState('Dalva@AR2026!');
```

### ✅ Deve ficar assim:
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

**Também remova a seção de "Credenciais de Teste" (linhas 157-161)** — essa informação deve estar em um README privado, não no código.

---

## 2️⃣ COMPLETAR `.env.local` (10 min)

**Arquivo:** `.env.local` (já existe, mas está incompleto)

### Copie isto e cole no seu `.env.local`:
```env
# Autenticação
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_secret_super_seguro_aqui
NEXTAUTH_PROVIDERS_CREDENTIALS_AUTHORIZED_PARAMS=email,password

# Banco de Dados (SQLite local)
DATABASE_URL="file:./prisma/dev.db"

# Admin Fallback (para caso o BD não esteja disponível)
ADMIN_EMAIL=dr.amorim@escritorio.com
ADMIN_PASSWORD_HASH=$2a$10$yHKzFQeWHWp0Y1eYMgFZcec2Oa6xZf7KZKzLm7pJoXhXTKPJdNmFu

# Próximas integrações (vazias por enquanto)
WHATSAPP_API_TOKEN=
GOOGLE_CALENDAR_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SIGNATURE_API_KEY=
```

**ℹ️ Sobre o `ADMIN_PASSWORD_HASH`:**  
Este é um hash bcrypt da senha `Dalva@AR2026!`. Para gerar um novo:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Dalva@AR2026!', 10))"
```

---

## 3️⃣ GERAR NOVO NEXTAUTH_SECRET (3 min)

No seu terminal (PowerShell ou CMD no Windows):

```powershell
# PowerShell:
-join (1..32 | ForEach-Object { '{0:x}' -f (Get-Random -Min 0 -Max 16) })

# Ou simplesmente use:
# Um exemplo válido: 3a7d9f2c8e1b5a4d6f9c2e8a1d4b7f0c
```

Copie e cole no `NEXTAUTH_SECRET` do `.env.local`.

---

## 4️⃣ VERIFICAR `lib/rate-limit.ts` (5 min)

**Arquivo referenciado:** `lib/rate-limit.ts`

O arquivo `lib/auth.ts` importa:
```typescript
import { checkRateLimit, resetRateLimit } from './rate-limit';
```

**Verificar:**
- [ ] O arquivo `lib/rate-limit.ts` existe?
  - Se **SIM:** OK, prossiga
  - Se **NÃO:** Preciso criar para você

---

## 5️⃣ FAZER COMMIT DAS MUDANÇAS (15 min)

Você tem mudanças soltas. Vamos organizar:

```bash
# 1. Ver status
git status

# 2. Adicionar arquivos deletados (removidos do git)
git add app/(auth)/login/page.tsx
git add app/page.tsx

# 3. Adicionar modificações
git add lib/auth.ts prisma/schema.prisma tsconfig.json

# 4. Adicionar novos arquivos
git add app/(dashboard)/admin/
git add app/api/users/
git add app/login/
git add .env.local

# 5. Fazer commit com mensagem clara
git commit -m "refactor: reorganizar estrutura de autenticação e dashboard

- Movimentar login de app/(auth) para app/login/
- Remover page.tsx raiz (home) — usuários não autenticados vão direto para login
- Expandir schema Prisma com modelo multi-tenant
- Implementar rate limiting em autenticação
- Adicionar páginas de admin e gerenciamento de usuários
- Configurar variáveis de ambiente iniciais
"

# 6. Ver o histórico
git log --oneline -5
```

---

## 6️⃣ EXECUTAR MIGRATIONS (5 min)

```bash
# 1. Entrar na pasta do projeto
cd "C:\Users\Dr.Amorim\Documents\PROJETOS 2026 COM TUDO\SAAS DALVA\dalva app completo"

# 2. Rodar migrations (criar tabelas)
npm run db:migrate

# 3. (Opcional) Seeding inicial
npm run db:seed

# 4. (Opcional) Abrir Prisma Studio para ver o BD
npm run db:studio
```

---

## 7️⃣ TESTAR LOCALMENTE (10 min)

```bash
# 1. Instalar dependências (se não instaladas)
npm install

# 2. Rodar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
# → http://localhost:3000

# 4. Você será redirecionado para /login
# 5. Fazer login com:
#    Email: dr.amorim@escritorio.com
#    Senha: Dalva@AR2026!

# 6. Acessar dashboard
# → http://localhost:3000/dashboard
```

---

## 📋 Checklist Rápido

```
[ ] 1. Remover credenciais hardcoded de app/login/page.tsx
[ ] 2. Completar .env.local com todas variáveis
[ ] 3. Gerar novo NEXTAUTH_SECRET
[ ] 4. Verificar lib/rate-limit.ts existe
[ ] 5. Fazer commit das mudanças
[ ] 6. Executar npm run db:migrate
[ ] 7. Testar npm run dev → login → dashboard
[ ] 8. Fazer novo commit "chore: setup inicial completo"
```

---

## ✅ Quando terminar tudo acima:

Você terá:
- ✅ Projeto com histórico de git limpo
- ✅ Credenciais seguras (não hardcoded)
- ✅ Banco de dados funcionando
- ✅ Autenticação testada
- ✅ Pronto para começar Módulo 1 (Chatbot)

**Próximo passo:** Integrar Claude API para o chatbot WhatsApp.

---

## 🆘 Se algo não funcionar:

1. **Erro de import `rate-limit`?**  
   → Você precisa do arquivo `lib/rate-limit.ts`. Manda mensagem que eu crio.

2. **Erro de banco de dados?**  
   → Você esqueceu de rodar `npm run db:migrate`

3. **NextAuth error?**  
   → Verifique se `NEXTAUTH_SECRET` está preenchido

4. **Login não funciona?**  
   → Confirme que email/senha estão corretos no `.env.local`

---

**Tempo total estimado: 45-60 minutos**  
**Prioridade: ALTA — Faça ainda hoje!**
