# 🗺️ ROADMAP DALVA — Caminho até Produção

**Objetivo:** Transformar seu app em uma plataforma funcional de automação jurídica.  
**Tempo estimado:** 4-6 semanas (Fase 1 + 2 + 3)  
**Esforço:** Médio (muito código está pronto, faltam integrações)

---

## 📅 Timeline

```
SEMANA 1     → Ações Imediatas + Setup Básico (AGORA)
SEMANA 2-3   → Módulo 1: Chatbot WhatsApp
SEMANA 4     → Módulo 3: Google Calendar
SEMANA 5     → Módulo 4: Assinatura Digital
SEMANA 6     → Testes, Ajustes, Deploy
```

---

## ⚡ SEMANA 1 — Setup Básico (AGORA)

### Estado Atual:
- ❌ Credenciais hardcoded
- ❌ Banco de dados não migrado
- ❌ Variáveis de env incompletas
- ✅ Código estruturado
- ✅ Autenticação implementada

### O que fazer:
1. **Completar ACOES_IMEDIATAS.md** (45-60 min)
   - Remover credenciais
   - Completar .env.local
   - Fazer commits
   - Rodar migrations

2. **Testar Fluxo de Login** (15 min)
   ```bash
   npm run dev
   # → http://localhost:3000
   # → Login → /dashboard
   ```

3. **Explorar Dashboard** (15 min)
   - Verificar `/dashboard`
   - Clicar em cada página (leads, kanban, conversas, admin)
   - Notar o que funciona / o que não funciona

### Resultado:
✅ App rodando localmente com autenticação funcional

---

## 🤖 SEMANA 2-3 — Módulo 1: Chatbot WhatsApp

### O que é:
- IA responde clientes via WhatsApp
- Qualifica leads automaticamente
- Armazena conversa no banco de dados
- Atualiza status do lead no Kanban

### Arquitetura:
```
Cliente WhatsApp
    ↓
[Gateway WhatsApp] ← escolha uma opção
    ↓
API /api/chatbot
    ↓
[Claude API] ← IA qualifica e responde
    ↓
[Banco de dados] ← salva conversas
    ↓
[Webhook Kanban] ← atualiza status
```

### Passo 1: Escolher Gateway WhatsApp (2 horas)

| Gateway | Dificuldade | Custo | Começar Com |
|---------|-----------|-------|-----------|
| **Evolution API** | Média | Grátis | Sim, fácil setup |
| **Twilio** | Fácil | Pago (~$20/mês) | Sim, muito confiável |
| **Z-API** | Fácil | Pago (~R$100/mês) | Sim, Brasil-friendly |
| **WPPConnect** | Média | Grátis | Não, complexo |

**Recomendação:** Evolution API para começar (grátis + local)

### Passo 2: Criar `/api/chatbot` (4 horas)

**Arquivo novo:** `app/api/chatbot/route.ts`

Estrutura básica:
```typescript
export async function POST(req: Request) {
  // 1. Receber mensagem do WhatsApp via webhook
  const { phone, message } = await req.json();
  
  // 2. Buscar conversa anterior no banco
  const lead = await prisma.lead.findFirst({
    where: { phone }
  });
  
  // 3. Enviar para Claude (IA)
  const response = await claude.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    system: PROMPT_DALVA, // ver abaixo
    messages: [
      { role: 'user', content: message }
    ]
  });
  
  // 4. Extrair ação (LEAD_QUALIFICADO, AGENDAMENTO, etc)
  const action = extractAction(response.content[0].text);
  
  // 5. Atualizar banco de dados
  if (action.type === 'LEAD_QUALIFICADO') {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'QUALIFICADO', score: action.score }
    });
  }
  
  // 6. Enviar resposta de volta para WhatsApp
  await sendWhatsAppMessage(phone, response.content[0].text);
  
  return Response.json({ ok: true });
}
```

### Passo 3: Criar `PROMPT_DALVA` (3 horas)

Use a skill Dalva para personalizar o prompt:
```typescript
const PROMPT_DALVA = `
Você é Dalva, assistente de atendimento da Amorim Rodrigues Advogados.
Suas áreas: Trabalhista, Previdenciária, Consumidor.

Objetivo:
1. Recepcionar cliente
2. Entender caso brevemente
3. Qualificar viabilidade
4. Propor agendamento

[... regras, gatilhos, etc ...]
`;
```

### Passo 4: Testar Integração (2 horas)

1. Setup Evolution API (local ou cloud)
2. Criar webhook que aponta para seu servidor
3. Enviar mensagem WhatsApp de teste
4. Verificar:
   - Mensagem chegou em `/api/chatbot`?
   - Claude respondeu?
   - Lead foi criado no banco?
   - Resposta voltou para WhatsApp?

### Resultado Esperado:
✅ Chatbot respondendo em tempo real  
✅ Leads sendo criados automaticamente  
✅ Status sendo atualizado no Kanban

---

## 📅 SEMANA 4 — Módulo 3: Google Calendar

### O que é:
- IA verifica disponibilidade da agenda
- Marca consulta automaticamente
- Envia link do Meet ao cliente

### Arquitetura:
```
Cliente: "Quero marcar consulta"
    ↓
Claude: "Qual dia você prefere?"
    ↓
Cliente: "Amanhã às 14h"
    ↓
API /api/calendar/check
    ↓
Google Calendar API
    ↓
Claude: "OK, agendado para amanhã 14h"
    ↓
Cria evento + envia link Meet
```

### Implementação:

1. **Integrar Google OAuth** (1 hora)
   ```typescript
   // lib/google-calendar.ts
   import { google } from 'googleapis';
   
   const calendar = google.calendar({
     version: 'v3',
     auth: new google.auth.OAuth2(...)
   });
   ```

2. **Criar `/api/calendar` routes** (2 horas)
   - `GET /api/calendar/available` — slots livres
   - `POST /api/calendar/book` — marcar consulta
   - `GET /api/calendar/meet-link` — gerar link Meet

3. **Integrar com Chatbot** (1 hora)
   - Quando cliente pedir agendamento
   - Chatbot chama `/api/calendar/available`
   - Apresenta opções
   - Confirma booking

### Teste:
```bash
# 1. Configurar Google OAuth no .env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_ID=seu_email@gmail.com

# 2. Acessar /dashboard/configuracoes
# 3. Conectar Google Calendar
# 4. Testar agendamento via chatbot
```

### Resultado Esperado:
✅ Consultas sendo agendadas automaticamente  
✅ Links Meet sendo enviados  
✅ Calendário do advogado sincronizado

---

## 📝 SEMANA 5 — Módulo 4: Assinatura Digital

### O que é:
- Gera contrato automaticamente
- Envia para cliente assinar
- Salva contrato assinado

### Arquitetura:
```
Lead: "Topei em fazer a consulta"
    ↓
Claude: "Ótimo! Vou enviar contrato"
    ↓
API /api/contracts/generate
    ↓
Gera PDF com dados do cliente
    ↓
Plataforma de assinatura
    ↓
Cliente assina via WhatsApp
    ↓
Webhook recebe assinatura
    ↓
Atualiza status: FECHADO
```

### Implementação:

1. **Escolher Plataforma de Assinatura** (30 min)
   | Opção | Custo | API Boa |
   |-------|-------|--------|
   | ZapSign | R$99/mês | ✅ Excelente |
   | D4Sign | R$75/mês | ✅ Boa |
   | DocuSign | USD 10/mês | ✅ Muito boa |
   | ClickSign | R$199/mês | ✅ Boa |

   **Recomendação:** ZapSign (Brasil + API boa)

2. **Criar `/api/contracts`** (3 horas)
   ```typescript
   // POST /api/contracts/generate
   // - Recebe leadId
   // - Gera PDF com dados do cliente
   // - Envia para ZapSign
   // - Retorna link de assinatura
   
   // POST /api/contracts/webhook
   // - Recebe notificação de assinatura completa
   // - Atualiza lead.status = "FECHADO"
   // - Envia confirmação para cliente
   ```

3. **Integrar com Chatbot** (1 hora)
   - Quando lead diz "sim", iniciar fluxo de contrato
   - Enviar link via WhatsApp
   - Monitorar assinatura

### Teste:
```bash
# 1. Registrar em ZapSign (teste)
# 2. Configurar .env
ZAPSIGN_API_KEY=...

# 3. Testar geração de contrato
POST /api/contracts/generate
  Body: { leadId: "abc123" }

# 4. Assinar contrato no link recebido
# 5. Verificar webhook em /api/contracts/webhook
```

### Resultado Esperado:
✅ Contratos sendo gerados automaticamente  
✅ Clientes assinando via WhatsApp  
✅ Leads sendo fechados automaticamente

---

## 🎯 SEMANA 6 — Testes & Deploy

### Checklist:
- [ ] Chatbot respondendo em tempo real
- [ ] Leads sendo criados e qualificados
- [ ] Google Calendar funcionando
- [ ] Assinatura digital processada
- [ ] Fluxo completo: mensagem → contrato → assinatura
- [ ] Segurança: Nenhuma credencial hardcoded
- [ ] Performance: Respostas em < 3 segundos

### Deploy Opções:

**Option 1: Vercel (Recomendado — Fácil)**
```bash
# 1. Conectar seu GitHub
vercel --prod

# 2. Configurar variáveis de env em Vercel dashboard
# 3. Deploy automático a cada push
```

**Option 2: Heroku**
```bash
heroku login
heroku create seu-app-dalva
git push heroku main
```

**Option 3: VPS (DigitalOcean, AWS)**
```bash
# Mais controle, mas mais complexo
# Usar Docker, PM2, nginx, etc
```

---

## 💰 Estimativa de Custos (Mensal)

| Serviço | Custo | Obrigatório |
|---------|-------|-----------|
| Evolution API (WhatsApp) | Grátis | Não (testar primeiro) |
| Twilio (WhatsApp) | ~$20 | Opcional |
| Claude API | ~$50 (variável) | ✅ Sim |
| Google Calendar | Grátis | ✅ Sim |
| ZapSign (Assinatura) | ~R$99 | ✅ Sim (fase 3) |
| Vercel (Deploy) | Grátis-$20 | ✅ Sim |
| **TOTAL** | ~R$350-450 | |

---

## ✅ Antes de Cada Fase

1. **Ler referência da skill Dalva**
   - Ex: antes de Módulo 1 → ler `modulo-1-chatbot.md`

2. **Consultar advogado**
   - Alertas éticos OAB são importantes
   - Revisar prompt de atendimento

3. **Fazer backup do git**
   ```bash
   git commit -m "checkpoint: antes de implementar módulo X"
   git push
   ```

---

## 📞 Suporte & Recursos

### Documentação:
- Skill Dalva: Referências de cada módulo
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Claude API: https://docs.anthropic.com

### Comunidades:
- Discord Dalva (criar se não existir)
- GitHub Discussions
- Stack Overflow (tag: `dalva` ou `nextauth`)

---

## 🎬 Próximo Passo

Você está aqui:
```
[ AGORA ] → Semana 1: ACOES_IMEDIATAS.md
    ↓
    → Semana 2-3: Implementar Módulo 1 (Chatbot)
    ↓
    → Semana 4: Implementar Módulo 3 (Calendar)
    ↓
    → Semana 5: Implementar Módulo 4 (Contratos)
    ↓
    → Semana 6: Testes e Deploy
    ↓
    ✅ Dalva em Produção!
```

**COMECE AGORA COM:** `ACOES_IMEDIATAS.md`

Tempo estimado: 45-60 minutos. Pode começar?

---

**Última atualização:** 2 de maio de 2026  
**Status:** ✅ Roadmap Pronto
