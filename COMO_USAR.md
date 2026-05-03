# 🎯 COMO USAR SUA DALVA — Guia Rápido

## 🔓 Fazer Login

```
URL: http://localhost:3000
Email: dr.amorim@escritorio.com
Senha: Dalva@AR2026!
```

---

## 📍 Dashboard — O Que Cada Aba Faz

### 1️⃣ Admin
**Para:** Gerenciar quem acessa o sistema
- Criar novos advogados/staff
- Editar e deletar usuários
- Ver quem está usando

### 2️⃣ Conversas
**Para:** Histórico de atendimentos futuros (vai preencher quando chatbot estiver rodando)
- Cada conversa WhatsApp/Chat salva aqui
- Rever o que foi dito

### 3️⃣ Kanban
**Para:** VER E MOVIMENTAR LEADS
- **Novo:** Acabou de chegar
- **Qualificado:** IA disse que é bom cliente
- **Contrato Enviado:** Mandou o contrato
- **Fechado:** Contrato assinado = $ 💰

*Arraste cards para mudar de coluna*

### 4️⃣ Leads
**Para:** Ver lista de todos os clientes
- Nome, telefone, status, score (0-100)
- Score = qualidade do lead (IA calcula)
- Adicionar leads manualmente

### 5️⃣ Configurações
**Para:** Ajustar sua conta
- Trocar senha
- Integrar Google Calendar (depois)
- Integrar WhatsApp (depois)

---

## 🆕 Criar Seu Primeiro Lead

### Opção A: Manualmente (AGORA)
1. Clique em **Leads**
2. Clique em **"+ Novo Lead"**
3. Preencha:
   - Nome: `João Silva`
   - Telefone: `(11) 98765-4321`
   - Nicho: `Trabalhista` / `Previdenciário` / `Consumidor`
   - Status: deixa como NOVO
4. Clique **"Salvar"**
5. O lead aparece na lista E no **Kanban**

### Opção B: Automático (DEPOIS)
- Quando chatbot ficar pronto, leads virão automaticamente do WhatsApp

---

## 📊 Usar o Kanban

1. Vá para **Kanban**
2. Veja as 4 colunas (NOVO → QUALIFICADO → CONTRATO → FECHADO)
3. **Arraste um card** para mover (ex: NOVO → QUALIFICADO)
4. Status muda automaticamente no banco de dados
5. Pronto! Seu advogado vê a movimentação em tempo real

---

## 👥 Adicionar Mais Advogados

1. Vá para **Admin**
2. Clique em **"+ Novo Usuário"**
3. Preencha:
   - Nome: `Dr. Carlos`
   - Email: `carlos@escritorio.com`
   - Senha: `Senha@123`
   - Role: `LAWYER` (advogado) ou `TENANT_ADMIN` (gerenciador)
4. Clique **"Criar"**
5. Novo advogado consegue fazer login com essas credenciais

---

## 🚀 Próximo: Conectar WhatsApp (Semana 2)

Quando terminar de explorar, você vai:

1. Escolher Gateway WhatsApp (Evolution ou Twilio)
2. Configurar credenciais
3. Clientes mandam mensagem no WhatsApp
4. IA responde e cria leads automaticamente
5. Leads aparecem aqui no Kanban

---

## ⚠️ Cuidados

❌ **NÃO delete:**
- Banco de dados (`prisma/dev.db`)
- Pasta `.git` ou `.env.local`

✅ **SEMPRE:**
- Faça backup com `git push`
- Teste localmente antes de produção

---

## 💡 Dicas de Uso

**Dica 1:** Use o Kanban como seu "funil de vendas visual"
- Esquerda = clientes novos
- Direita = clientes fechados

**Dica 2:** Score do lead
- 0-30: Ruim (provavelmente vai recusar)
- 30-70: Médio (pode conversar)
- 70-100: Excelente (fechar logo!)

**Dica 3:** Nicho importa
- Cada nicho precisa de perguntas diferentes
- Trabalhista = CTPS, horas extras
- Previdenciário = tempo de contribuição
- Consumidor = produto/cobrança

---

## 🎯 Seus Próximos 7 Dias

| Dia | O que fazer |
|-----|-----------|
| Hoje | Explorar dashboard, criar 5 leads de teste |
| Amanhã | Convide 1 advogado, teste fluxo |
| Dia 3 | Leia `ROADMAP.md` |
| Dia 4-5 | Escolha WhatsApp gateway + credenciais |
| Dia 6-7 | Comece integração chatbot |

---

## 📞 Problemas Comuns

**"Esqueci a senha"**
- Nenhuma forma de resetar agora
- Passe ao admin para deletar e recriar usuário

**"Um lead desapareceu"**
- Não desaparece, só muda de coluna
- Procure em **Leads** (lista completa)

**"Servidor desligou"**
- Rode novamente: `npm run dev`

---

**Pronto! Você tem tudo para começar. Explore e divirta-se! 🎉**
